import type { Stats, TonePhase } from '@/lib/game/types'
import { clampStat } from '@/lib/game/rng'

/** Seconds allowed per decision by phase. */
export function decisionSeconds(phase: TonePhase, day: number): number {
  const base =
    phase === 'comedic'
      ? 28
      : phase === 'chaotic'
        ? 20
        : phase === 'existential'
          ? 14
          : 10
  // Slowly tighten as days advance
  return Math.max(8, base - Math.floor(day / 10))
}

/** Harsh timeout punishment — hesitation collapses the company. */
export function timeoutPenalty(stats: Stats, phase: TonePhase): Stats {
  const hit =
    phase === 'comedic'
      ? 18
      : phase === 'chaotic'
        ? 24
        : phase === 'existential'
          ? 30
          : 34

  return {
    revenue: clampStat(stats.revenue - hit),
    users: clampStat(stats.users - hit + 4),
    techDebt: clampStat(stats.techDebt + Math.floor(hit * 0.6)),
    stability: clampStat(stats.stability - hit),
    reputation: clampStat(stats.reputation - hit + 2),
    morale: clampStat(stats.morale - Math.floor(hit * 0.7)),
  }
}
