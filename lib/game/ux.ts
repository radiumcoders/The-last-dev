import type { StatDelta, StatKey, TonePhase } from '@/lib/game/types'

export const STAT_HINTS: Record<StatKey, string> = {
  revenue: 'Cashflow. Hits 0 → company dies.',
  users: 'Active people. Hits 0 → product dies.',
  techDebt: 'Mess in the codebase. High = future pain.',
  stability: 'Uptime & infra health. Low = outages.',
  reputation: 'Public trust. Low = slower growth.',
  morale: 'AI employee mood. Low = chaos.',
}

export const PHASE_META: Record<
  TonePhase,
  { label: string; blurb: string; order: number }
> = {
  comedic: {
    label: 'COMEDIC',
    blurb: 'Absurd requests. Still manageable.',
    order: 0,
  },
  chaotic: {
    label: 'CHAOTIC',
    blurb: 'Disasters stack. Timer tightens.',
    order: 1,
  },
  existential: {
    label: 'EXISTENTIAL',
    blurb: 'The system questions your purpose.',
    order: 2,
  },
  autonomous: {
    label: 'AUTONOMOUS',
    blurb: 'AI decides without you. Watch.',
    order: 3,
  },
}

const SHORT: Record<keyof StatDelta, string> = {
  revenue: 'REV',
  users: 'USR',
  techDebt: 'DEBT',
  stability: 'STAB',
  reputation: 'REP',
  morale: 'MOR',
}

/** Compact chips like REV+8 · DEBT-10 */
export function formatDeltaChips(delta: StatDelta): string[] {
  const chips: string[] = []
  for (const key of Object.keys(SHORT) as (keyof StatDelta)[]) {
    const v = delta[key]
    if (typeof v === 'number' && v !== 0) {
      chips.push(`${SHORT[key]}${v > 0 ? '+' : ''}${v}`)
    }
  }
  return chips
}

export function chipTone(
  key: keyof StatDelta,
  value: number,
): 'good' | 'bad' | 'mixed' {
  // techDebt up is bad; others up is usually good
  if (key === 'techDebt') return value > 0 ? 'bad' : 'good'
  return value > 0 ? 'good' : 'bad'
}

export function kindLabel(kind?: string): string {
  switch (kind) {
    case 'disaster':
      return 'DISASTER'
    case 'chain':
      return 'CHAIN EVENT'
    case 'autonomous':
      return 'AUTO'
    default:
      return 'REQUEST'
  }
}
