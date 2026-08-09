'use client'

import { create } from 'zustand'
import { EventEngine } from '@/lib/game/engine/EventEngine'
import { resolveTonePhase } from '@/lib/game/engine/phaseProgression'
import { createRng, randomSeed } from '@/lib/game/rng'
import { decisionSeconds, timeoutPenalty } from '@/lib/game/timer'
import { ENDINGS } from '@/lib/game/content/endings'
import { formatEffects } from '@/lib/game/engine/consequences'
import { formatDeltaChips } from '@/lib/game/ux'
import {
  INITIAL_STATS,
  type EndingResult,
  type GamePhase,
  type LogEntry,
  type StatDelta,
  type Stats,
  type TimelineEntry,
  type TonePhase,
  type ActiveRequest,
} from '@/lib/game/types'

const engine = new EventEngine()

interface GameStore {
  uiPhase: GamePhase
  seed: number
  rng: () => number
  day: number
  stats: Stats
  tags: string[]
  flags: string[]
  tonePhase: TonePhase
  autonomousDays: number
  log: LogEntry[]
  timeline: TimelineEntry[]
  active: ActiveRequest | null
  lastEffects: string[]
  lastDelta: StatDelta
  ending: EndingResult | null
  showLog: boolean
  showTimeline: boolean
  showHelp: boolean
  usedEventIds: string[]
  timerMax: number
  timerLeft: number
  timerCritical: boolean
  audioMuted: boolean
  streak: number
  bestStreak: number
  impactFlash: string | null
  coachDismissed: boolean

  startBoot: () => void
  finishBoot: () => void
  choose: (choiceId: string) => void
  advanceAutonomous: () => void
  tickTimer: () => void
  onTimeout: () => void
  beginShutdown: () => void
  finishShutdown: () => void
  restart: () => void
  toggleLog: () => void
  toggleTimeline: () => void
  toggleHelp: () => void
  dismissCoach: () => void
  clearImpact: () => void
  setAudioMuted: (muted: boolean) => void
}

function blankRun(seed = randomSeed()) {
  const rng = createRng(seed)
  const started = engine.start(INITIAL_STATS, rng)
  const timerMax = decisionSeconds(started.phase, started.day)
  return {
    seed,
    rng,
    day: started.day,
    stats: started.stats,
    tags: started.tags,
    flags: started.flags,
    tonePhase: started.phase,
    autonomousDays: started.autonomousDays,
    log: started.log,
    timeline: started.timeline,
    active: started.active,
    usedEventIds: started.usedEventIds,
    lastEffects: [] as string[],
    lastDelta: {} as StatDelta,
    ending: null as EndingResult | null,
    timerMax,
    timerLeft: timerMax,
    timerCritical: false,
    streak: 0,
    bestStreak: 0,
    impactFlash: null as string | null,
  }
}

function applyEngineResult(
  result: ReturnType<EventEngine['applyChoice']>,
  patch: Partial<GameStore> = {},
) {
  const timerMax = result.ending
    ? 0
    : decisionSeconds(result.state.phase, result.state.day)

  if (result.ending) {
    return {
      day: result.state.day,
      stats: result.state.stats,
      tags: result.state.tags,
      flags: result.state.flags,
      usedEventIds: result.state.usedEventIds,
      tonePhase: result.state.phase,
      autonomousDays: result.state.autonomousDays,
      log: result.state.log,
      timeline: result.state.timeline,
      active: null,
      lastEffects: result.effectLines,
      ending: result.ending,
      uiPhase: 'ending' as GamePhase,
      timerMax: 0,
      timerLeft: 0,
      timerCritical: false,
      ...patch,
    }
  }

  return {
    day: result.state.day,
    stats: result.state.stats,
    tags: result.state.tags,
    flags: result.state.flags,
    usedEventIds: result.state.usedEventIds,
    tonePhase: result.state.phase,
    autonomousDays: result.state.autonomousDays,
    log: result.state.log,
    timeline: result.state.timeline,
    active: result.state.active,
    lastEffects: result.effectLines,
    uiPhase: result.state.phase as GamePhase,
    timerMax,
    timerLeft: timerMax,
    timerCritical: false,
    ...patch,
  }
}

function engineStateFrom(store: GameStore) {
  return {
    day: store.day,
    stats: store.stats,
    tags: store.tags,
    flags: store.flags,
    usedEventIds: store.usedEventIds,
    phase: store.tonePhase,
    autonomousDays: store.autonomousDays,
    log: store.log,
    timeline: store.timeline,
    active: store.active,
  }
}

export const useGameStore = create<GameStore>((set, get) => ({
  uiPhase: 'boot',
  showLog: false,
  showTimeline: false,
  showHelp: false,
  audioMuted: false,
  coachDismissed: false,
  ...blankRun(),

  startBoot: () => set({ uiPhase: 'boot' }),

  finishBoot: () => {
    const run = blankRun()
    set({
      ...run,
      uiPhase: run.tonePhase,
      showLog: false,
      showTimeline: false,
      showHelp: false,
      coachDismissed: false,
    })
  },

  choose: (choiceId: string) => {
    const state = get()
    if (!state.active || state.uiPhase === 'ending' || state.uiPhase === 'shutdown')
      return
    if (state.active.source === 'autonomous') return

    const choice = state.active.event.choices.find((c) => c.id === choiceId)
    if (!choice) return

    const fast = state.timerLeft / Math.max(1, state.timerMax) >= 0.45
    let streak = fast ? state.streak + 1 : 0
    let bestStreak = Math.max(state.bestStreak, streak)
    let effects = { ...choice.effects }
    let bonusNote: string | null = null

    // Every 3 sharp decisions: small morale/reputation boost
    if (streak > 0 && streak % 3 === 0) {
      effects = {
        ...effects,
        morale: (effects.morale ?? 0) + 3,
        reputation: (effects.reputation ?? 0) + 2,
      }
      bonusNote = `SHARP STREAK x${streak} · BONUS APPLIED`
    }

    const before = state.stats
    const result = engine.applyChoice(
      engineStateFrom(state),
      { ...choice, effects },
      state.rng,
    )

    // Reconstruct delta from before→after for flashes
    const after = result.state.stats
    const lastDelta: StatDelta = {
      revenue: after.revenue - before.revenue,
      users: after.users - before.users,
      techDebt: after.techDebt - before.techDebt,
      stability: after.stability - before.stability,
      reputation: after.reputation - before.reputation,
      morale: after.morale - before.morale,
    }

    const chips = formatDeltaChips(lastDelta)
    const impactFlash = bonusNote
      ? `${bonusNote} · ${chips.join(' ')}`
      : chips.length
        ? `IMPACT · ${chips.join(' ')}`
        : 'NO METRIC SHIFT'

    set(
      applyEngineResult(result, {
        streak,
        bestStreak,
        lastDelta,
        impactFlash,
        lastEffects: bonusNote
          ? [bonusNote, ...result.effectLines]
          : result.effectLines,
      }),
    )
  },

  advanceAutonomous: () => {
    const state = get()
    if (!state.active || state.active.source !== 'autonomous') return
    const choiceId =
      state.active.autoChoiceId ?? state.active.event.choices[0]?.id
    if (!choiceId) return

    const choice = state.active.event.choices.find((c) => c.id === choiceId)
    if (!choice) return

    const before = state.stats
    const result = engine.applyChoice(engineStateFrom(state), choice, state.rng)
    const after = result.state.stats
    const lastDelta: StatDelta = {
      revenue: after.revenue - before.revenue,
      users: after.users - before.users,
      techDebt: after.techDebt - before.techDebt,
      stability: after.stability - before.stability,
      reputation: after.reputation - before.reputation,
      morale: after.morale - before.morale,
    }
    set(
      applyEngineResult(result, {
        streak: 0,
        lastDelta,
        impactFlash: `AI EXECUTED · ${formatDeltaChips(lastDelta).join(' ') || 'SILENT'}`,
      }),
    )
  },

  tickTimer: () => {
    const state = get()
    if (
      state.uiPhase === 'boot' ||
      state.uiPhase === 'ending' ||
      state.uiPhase === 'shutdown'
    )
      return
    if (!state.active || state.active.source !== 'player') return
    if (state.showLog || state.showTimeline || state.showHelp) return

    const next = Math.max(0, state.timerLeft - 1)
    set({
      timerLeft: next,
      timerCritical: next <= 5,
    })
    if (next <= 0) get().onTimeout()
  },

  onTimeout: () => {
    const state = get()
    if (!state.active || state.active.source !== 'player') return

    const before = state.stats
    const punished = timeoutPenalty(before, state.tonePhase)
    const delta: StatDelta = {
      revenue: punished.revenue - before.revenue,
      users: punished.users - before.users,
      techDebt: punished.techDebt - before.techDebt,
      stability: punished.stability - before.stability,
      reputation: punished.reputation - before.reputation,
      morale: punished.morale - before.morale,
    }
    const flags = Array.from(
      new Set([...state.flags, 'hesitation_collapse', 'ignored_human']),
    )
    const collapsed = punished.revenue <= 0 || punished.users <= 0

    const logEntry: LogEntry = {
      id: `timeout-${state.day}-${Math.floor(state.rng() * 1e6)}`,
      day: state.day,
      lines: [
        'DECISION TIMEOUT',
        'HUMAN LATENCY EXCEEDED ACCEPTABLE THRESHOLD',
        'AUTOMATIC STABILIZATION FAILED',
        ...formatEffects(delta),
        'Company systems entering cascade failure...',
      ],
    }

    const timeline: TimelineEntry[] = [
      ...state.timeline,
      {
        id: `tl-timeout-${state.day}`,
        day: state.day,
        title: 'Decision Timeout — Cascade Failure',
      },
    ]

    if (collapsed || state.tonePhase === 'existential' || state.day >= 18) {
      set({
        stats: punished,
        flags: collapsed
          ? Array.from(new Set([...flags, 'production_deleted']))
          : flags,
        log: [logEntry, ...state.log].slice(0, 80),
        timeline,
        active: null,
        lastEffects: ['TIMEOUT CASCADE', 'ALL SYSTEMS DEGRADED'],
        lastDelta: delta,
        impactFlash: 'TIMEOUT · CASCADE FAILURE',
        streak: 0,
        ending: ENDINGS.apocalypse,
        uiPhase: 'ending',
        timerLeft: 0,
        timerCritical: true,
      })
      return
    }

    const day = state.day + 1
    const usedEventIds = state.active
      ? Array.from(new Set([...state.usedEventIds, state.active.event.id]))
      : state.usedEventIds
    const phase = resolveTonePhase(day, punished, flags)
    const nextState = {
      day,
      stats: punished,
      tags: state.tags,
      flags,
      usedEventIds,
      phase,
      autonomousDays: state.autonomousDays,
      log: [logEntry, ...state.log].slice(0, 80),
      timeline,
      active: null as ActiveRequest | null,
    }
    const active = engine.pickNext(nextState, state.rng)
    const timerMax = decisionSeconds(phase, day)

    set({
      day,
      stats: punished,
      flags,
      usedEventIds,
      tonePhase: phase,
      log: nextState.log,
      timeline,
      active,
      lastEffects: ['TIMEOUT', 'CASCADE DAMAGE APPLIED'],
      lastDelta: delta,
      impactFlash: `TIMEOUT · ${formatDeltaChips(delta).join(' ')}`,
      streak: 0,
      uiPhase: phase,
      timerMax,
      timerLeft: timerMax,
      timerCritical: false,
    })
  },

  beginShutdown: () => set({ uiPhase: 'shutdown', timerLeft: 0 }),
  finishShutdown: () => set({ uiPhase: 'shutdown' }),
  restart: () => {
    const run = blankRun()
    set({
      ...run,
      uiPhase: 'boot',
      showLog: false,
      showTimeline: false,
      showHelp: false,
      coachDismissed: false,
    })
  },
  toggleLog: () =>
    set((s) => ({ showLog: !s.showLog, showTimeline: false, showHelp: false })),
  toggleTimeline: () =>
    set((s) => ({ showTimeline: !s.showTimeline, showLog: false, showHelp: false })),
  toggleHelp: () =>
    set((s) => ({ showHelp: !s.showHelp, showLog: false, showTimeline: false })),
  dismissCoach: () => set({ coachDismissed: true }),
  clearImpact: () => set({ impactFlash: null }),
  setAudioMuted: (muted) => set({ audioMuted: muted }),
}))
