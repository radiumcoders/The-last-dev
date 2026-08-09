'use client'

import { useEffect, useState } from 'react'
import { STAT_LABELS, type StatDelta, type StatKey } from '@/lib/game/types'
import { STAT_HINTS, chipTone } from '@/lib/game/ux'
import { cn } from '@/lib/utils'

function bar(value: number, width = 12): string {
  const filled = Math.round((Math.max(0, Math.min(100, value)) / 100) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

export function StatBar({
  stat,
  value,
  delta,
  warnBelow = 25,
  warnAbove,
}: {
  stat: StatKey
  value: number
  delta?: number
  warnBelow?: number
  warnAbove?: number
}) {
  const [flash, setFlash] = useState<'up' | 'down' | null>(null)
  const warn =
    value <= warnBelow || (typeof warnAbove === 'number' && value >= warnAbove)

  useEffect(() => {
    if (typeof delta !== 'number' || delta === 0) return
    const tone = chipTone(stat as keyof StatDelta, delta)
    setFlash(tone === 'good' ? 'up' : 'down')
    const t = window.setTimeout(() => setFlash(null), 900)
    return () => window.clearTimeout(t)
  }, [delta, stat])

  return (
    <div
      className={cn(
        'stat-bar',
        warn && 'stat-bar--warn',
        flash === 'up' && 'stat-bar--flash-up',
        flash === 'down' && 'stat-bar--flash-down',
      )}
      title={STAT_HINTS[stat]}
    >
      <span className="stat-bar__label">{STAT_LABELS[stat]}</span>
      <span className="stat-bar__meter">{bar(value)}</span>
      <span className="stat-bar__value">
        {String(value).padStart(3, ' ')}
        {typeof delta === 'number' && delta !== 0 ? (
          <span className={cn('stat-bar__delta', delta > 0 ? 'up' : 'down')}>
            {delta > 0 ? `+${delta}` : delta}
          </span>
        ) : null}
      </span>
    </div>
  )
}
