'use client'

import { useGameStore } from '@/lib/game/store'

/** Soft progress toward late-game pressure (~day 45 end). */
export function DayMeter() {
  const day = useGameStore((s) => s.day)
  const pct = Math.min(100, Math.round((day / 45) * 100))
  const blocks = 16
  const filled = Math.round((pct / 100) * blocks)
  const bar = '▓'.repeat(filled) + '░'.repeat(blocks - filled)

  return (
    <div className="day-meter" title="Shift progress toward automation">
      <span className="dim">SHIFT</span>
      <span className="day-meter__bar">{bar}</span>
      <span className="dim">{pct}%</span>
    </div>
  )
}
