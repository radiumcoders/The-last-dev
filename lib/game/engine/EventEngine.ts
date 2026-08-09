import { ALL_EVENTS } from '@/lib/game/content'
import { evaluateEnding, ENDINGS } from '@/lib/game/content/endings'
import {
  applyDelta,
  formatEffects,
  mergeFlags,
  mergeTags,
} from '@/lib/game/engine/consequences'
import { ProceduralGenerator } from '@/lib/game/engine/generators/ProceduralGenerator'
import {
  disasterChance,
  resolveTonePhase,
  shouldEndRun,
} from '@/lib/game/engine/phaseProgression'
import type {
  ActiveRequest,
  Choice,
  EndingResult,
  EventGenerator,
  GameEvent,
  LogEntry,
  Stats,
  TimelineEntry,
  TonePhase,
} from '@/lib/game/types'

export interface EngineState {
  day: number
  stats: Stats
  tags: string[]
  flags: string[]
  usedEventIds: string[]
  phase: TonePhase
  autonomousDays: number
  log: LogEntry[]
  timeline: TimelineEntry[]
  active: ActiveRequest | null
}

export interface DecisionResult {
  state: EngineState
  effectLines: string[]
  unlocked: string[]
  ending?: EndingResult
}

function uid(prefix: string, rng: () => number): string {
  return `${prefix}-${Math.floor(rng() * 1e9)}`
}

export class EventEngine {
  private generator: EventGenerator
  private pool: GameEvent[]

  constructor(generator: EventGenerator = new ProceduralGenerator(), pool: GameEvent[] = ALL_EVENTS) {
    this.generator = generator
    this.pool = pool
  }

  private ctx(state: EngineState, rng: () => number) {
    return {
      day: state.day,
      phase: state.phase,
      stats: state.stats,
      tags: state.tags,
      flags: state.flags,
      usedEventIds: state.usedEventIds,
      rng,
    }
  }

  pickNext(state: EngineState, rng: () => number): ActiveRequest | null {
    const preferDisaster = rng() < disasterChance(state.phase, state.stats)
    let pool = this.pool

    if (preferDisaster) {
      const disasters = this.pool.filter((e) => e.kind === 'disaster' || e.kind === 'chain')
      const picked = this.generator.next(this.ctx(state, rng), disasters)
      if (picked) {
        return {
          event: picked,
          source: state.phase === 'autonomous' ? 'autonomous' : 'player',
        }
      }
    }

    // Prefer chains if tags unlock them
    const chains = this.pool.filter((e) => e.kind === 'chain')
    const chainPick = this.generator.next(this.ctx(state, rng), chains)
    if (chainPick && rng() < 0.45) {
      return {
        event: chainPick,
        source: state.phase === 'autonomous' ? 'autonomous' : 'player',
      }
    }

    const requests = this.pool.filter((e) => e.kind !== 'disaster')
    const event = this.generator.next(this.ctx(state, rng), requests) ??
      this.generator.next(this.ctx(state, rng), pool)

    if (!event) return null

    const source = state.phase === 'autonomous' ? 'autonomous' : 'player'
    let autoChoiceId: string | undefined
    if (source === 'autonomous') {
      const idx = Math.floor(rng() * event.choices.length)
      autoChoiceId = event.choices[idx]?.id
    }

    return { event, source, autoChoiceId }
  }

  applyChoice(
    state: EngineState,
    choice: Choice,
    rng: () => number,
  ): DecisionResult {
    const event = state.active?.event
    const stats = applyDelta(state.stats, choice.effects)
    const tags = mergeTags(state.tags, choice.unlockTags)
    const flags = mergeFlags(state.flags, choice.addFlags, choice.removeFlags)
    const usedEventIds = event
      ? Array.from(new Set([...state.usedEventIds, event.id]))
      : state.usedEventIds

    const effectLines = formatEffects(choice.effects)
    const unlocked = (choice.unlockTags ?? []).filter((t) => !state.tags.includes(t))

    const logLines = [
      event ? `${event.agent.toUpperCase()} AI proposed: ${event.title}` : 'SYSTEM EVENT',
      `Decision: ${choice.label.toUpperCase()}`,
      ...effectLines,
    ]
    if (choice.logLine) logLines.push(choice.logLine)
    if (unlocked.length) {
      logLines.push('New Event Unlocked:')
      unlocked.forEach((t) => logLines.push(`  ${t.replace(/_/g, ' ').toUpperCase()}`))
    }

    if (state.active?.source === 'autonomous') {
      logLines.unshift('NOTE: Decision executed without human approval.')
    }

    const logEntry: LogEntry = {
      id: uid('log', rng),
      day: state.day,
      lines: logLines,
    }

    const timeline = [...state.timeline]
    if (choice.timelineTitle) {
      timeline.push({
        id: uid('tl', rng),
        day: state.day,
        title: choice.timelineTitle,
      })
    } else if (event && (event.kind === 'disaster' || event.kind === 'chain')) {
      timeline.push({
        id: uid('tl', rng),
        day: state.day,
        title: event.title.replace(/^DISASTER:\s*|^CHAIN:\s*/i, ''),
      })
    }

    const day = state.day + 1
    const phase = resolveTonePhase(day, stats, flags)
    const autonomousDays =
      phase === 'autonomous' ? state.autonomousDays + 1 : state.autonomousDays

    let next: EngineState = {
      ...state,
      day,
      stats,
      tags,
      flags,
      usedEventIds,
      phase,
      autonomousDays,
      log: [logEntry, ...state.log].slice(0, 80),
      timeline,
      active: null,
    }

    // Hard collapse flags
    if (stats.revenue <= 0 || stats.users <= 0) {
      next = {
        ...next,
        flags: mergeFlags(next.flags, ['production_deleted']),
      }
    }

    if (shouldEndRun(day, next.stats, next.flags, next.autonomousDays)) {
      const endingId = evaluateEnding(
        next.stats,
        next.flags,
        next.day,
        next.autonomousDays,
      )
      return { state: next, effectLines, unlocked, ending: ENDINGS[endingId] }
    }

    const active = this.pickNext(next, rng)
    return {
      state: { ...next, active },
      effectLines,
      unlocked,
    }
  }

  start(stats: Stats, rng: () => number): EngineState {
    const phase = resolveTonePhase(1, stats, [])
    const base: EngineState = {
      day: 1,
      stats,
      tags: [],
      flags: [],
      usedEventIds: [],
      phase,
      autonomousDays: 0,
      log: [],
      timeline: [{ id: 'tl-start', day: 1, title: 'Human Logged In' }],
      active: null,
    }
    return { ...base, active: this.pickNext(base, rng) }
  }
}
