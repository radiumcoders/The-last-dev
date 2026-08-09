import { clampStat } from '@/lib/game/rng'
import type { Choice, StatDelta, Stats } from '@/lib/game/types'

export function applyDelta(stats: Stats, delta: StatDelta): Stats {
  const next = { ...stats }
  for (const key of Object.keys(delta) as (keyof StatDelta)[]) {
    const change = delta[key]
    if (typeof change === 'number') {
      next[key] = clampStat(next[key] + change)
    }
  }
  return next
}

export function formatEffects(delta: StatDelta): string[] {
  const lines: string[] = []
  const entries: [keyof StatDelta, string][] = [
    ['revenue', 'Revenue'],
    ['users', 'Users'],
    ['techDebt', 'Technical Debt'],
    ['stability', 'Stability'],
    ['reputation', 'Reputation'],
    ['morale', 'Employee Morale'],
  ]
  for (const [key, label] of entries) {
    const v = delta[key]
    if (typeof v === 'number' && v !== 0) {
      lines.push(`${label} ${v > 0 ? '+' : ''}${v}`)
    }
  }
  return lines
}

export function mergeTags(existing: string[], added?: string[]): string[] {
  if (!added?.length) return existing
  return Array.from(new Set([...existing, ...added]))
}

export function mergeFlags(
  existing: string[],
  add?: string[],
  remove?: string[],
): string[] {
  let next = existing
  if (add?.length) next = Array.from(new Set([...next, ...add]))
  if (remove?.length) next = next.filter((f) => !remove.includes(f))
  return next
}

export function choiceLabel(choice: Choice, index: number): string {
  const letter = String.fromCharCode(65 + index)
  return `OPTION ${letter}`
}
