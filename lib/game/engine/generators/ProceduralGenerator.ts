import { pickWeighted } from '@/lib/game/rng'
import type {
  EventGenerator,
  EventGeneratorContext,
  GameEvent,
  TonePhase,
} from '@/lib/game/types'

function matchesRequirements(event: GameEvent, ctx: EventGeneratorContext): boolean {
  if (event.once && ctx.usedEventIds.includes(event.id)) return false
  if (!event.phases.includes(ctx.phase)) return false

  if (event.requiresTags?.length) {
    const ok = event.requiresTags.some((t) => ctx.tags.includes(t))
    if (!ok) return false
  }
  if (event.forbidsTags?.some((t) => ctx.tags.includes(t))) return false
  if (event.requiresFlags?.some((f) => !ctx.flags.includes(f))) return false
  if (event.forbidsFlags?.some((f) => ctx.flags.includes(f))) return false
  return true
}

function phaseBias(event: GameEvent, phase: TonePhase): number {
  let w = event.weight
  if (event.kind === 'disaster') {
    if (phase === 'comedic') w *= 0.55
    if (phase === 'chaotic') w *= 1.1
    if (phase === 'existential') w *= 1.25
    if (phase === 'autonomous') w *= 1.4
  }
  if (event.kind === 'chain') w *= 1.6
  if (event.agent === 'system' && (phase === 'existential' || phase === 'autonomous')) {
    w *= 1.4
  }
  return w
}

export class ProceduralGenerator implements EventGenerator {
  next(ctx: EventGeneratorContext, pool: GameEvent[]): GameEvent | null {
    const eligible = pool.filter((e) => matchesRequirements(e, ctx))
    if (eligible.length === 0) {
      const fallback = pool.filter(
        (e) =>
          e.kind !== 'disaster' &&
          e.kind !== 'chain' &&
          e.phases.includes(ctx.phase) &&
          !ctx.usedEventIds.includes(e.id),
      )
      return pickWeighted(fallback, (e) => e.weight, ctx.rng)
    }
    return pickWeighted(eligible, (e) => phaseBias(e, ctx.phase), ctx.rng)
  }
}
