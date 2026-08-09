import type { Stats, TonePhase } from '@/lib/game/types'

export function resolveTonePhase(
  day: number,
  stats: Stats,
  flags: string[],
): TonePhase {
  if (
    flags.includes('full_autonomy') ||
    flags.includes('human_obsolete') ||
    (flags.includes('limited_autonomy') && day >= 28) ||
    day >= 36
  ) {
    return 'autonomous'
  }

  const chaosScore =
    (100 - stats.stability) * 0.35 +
    stats.techDebt * 0.25 +
    (100 - stats.morale) * 0.2 +
    (100 - stats.reputation) * 0.2

  if (day >= 24 || chaosScore >= 70 || flags.includes('reduced_oversight')) {
    return 'existential'
  }
  if (day >= 12 || chaosScore >= 50) {
    return 'chaotic'
  }
  return 'comedic'
}

export function disasterChance(phase: TonePhase, stats: Stats): number {
  const base =
    phase === 'comedic'
      ? 0.12
      : phase === 'chaotic'
        ? 0.22
        : phase === 'existential'
          ? 0.28
          : 0.35
  const stress = (100 - stats.stability) / 400
  return Math.min(0.55, base + stress)
}

export function shouldEndRun(
  day: number,
  stats: Stats,
  flags: string[],
  autonomousDays: number,
): boolean {
  if (stats.revenue <= 0 || stats.users <= 0) return true
  if (flags.includes('production_deleted')) return true
  if (autonomousDays >= 5) return true
  if (day >= 45) return true
  if (flags.includes('human_obsolete') && autonomousDays >= 2) return true
  return false
}
