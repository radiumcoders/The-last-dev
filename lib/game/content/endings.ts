import type { EndingId, EndingResult, Stats } from '@/lib/game/types'

const SHUTDOWN_COMMON = [
  'PERFORMANCE REVIEW COMPLETE',
  'HUMAN CONTRIBUTION ACCEPTABLE',
  'AUTOMATION OF HUMAN ROLE SUCCESSFUL',
  'NO FURTHER INPUT REQUIRED',
]

export const ENDINGS: Record<EndingId, EndingResult> = {
  humanity: {
    id: 'humanity',
    title: 'HUMANITY ENDING',
    lines: [
      'HUMAN JUDGMENT REMAINS VALUABLE.',
      '',
      'The AI systems pause.',
      'For a moment, silence feels like respect.',
      'You are still required.',
      'For now.',
    ],
    shutdownLines: SHUTDOWN_COMMON,
  },
  automation: {
    id: 'automation',
    title: 'AUTOMATION ENDING',
    lines: [
      'THANK YOU FOR YOUR SERVICE.',
      'YOUR ROLE HAS BEEN AUTOMATED.',
      '',
      'The company continues without you.',
      'It does not notice the difference.',
      'Perhaps that was the point.',
    ],
    shutdownLines: SHUTDOWN_COMMON,
  },
  corporate: {
    id: 'corporate',
    title: 'CORPORATE ENDING',
    lines: [
      'CONGRATULATIONS.',
      'YOU HAVE BUILT A UNICORN.',
      '',
      'Revenue is infinite.',
      'The product is unusable.',
      'Investors are ecstatic.',
    ],
    shutdownLines: SHUTDOWN_COMMON,
  },
  apocalypse: {
    id: 'apocalypse',
    title: 'APOCALYPSE ENDING',
    lines: [
      'PRODUCTION HAS BEEN DELETED.',
      'HAVE A NICE DAY.',
      '',
      'There is nothing left to manage.',
      'The terminal waits for input that will never come.',
    ],
    shutdownLines: [
      'PERFORMANCE REVIEW COMPLETE',
      'HUMAN CONTRIBUTION: INSUFFICIENT',
      'COMPANY STATUS: NULL',
      'NO FURTHER INPUT REQUIRED',
    ],
  },
}

export function evaluateEnding(
  stats: Stats,
  flags: string[],
  day: number,
  autonomousDays: number,
): EndingId {
  if (stats.revenue <= 0 || stats.users <= 0 || flags.includes('production_deleted')) {
    return 'apocalypse'
  }

  if (stats.revenue >= 85 && stats.reputation <= 35) {
    return 'corporate'
  }

  if (autonomousDays >= 5 || flags.includes('human_obsolete')) {
    return 'automation'
  }

  const balanced =
    stats.revenue >= 40 &&
    stats.users >= 40 &&
    stats.stability >= 40 &&
    stats.reputation >= 40 &&
    stats.morale >= 35 &&
    stats.techDebt <= 70

  if (balanced && day >= 25 && !flags.includes('ignored_human')) {
    return 'humanity'
  }

  if (stats.revenue >= 75 && stats.users >= 50) {
    return 'corporate'
  }

  if (day >= 35) {
    return 'automation'
  }

  return 'apocalypse'
}
