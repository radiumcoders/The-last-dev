'use client'

import { useGameStore } from '@/lib/game/store'
import { PHASE_META } from '@/lib/game/ux'

export function SystemBar() {
  const day = useGameStore((s) => s.day)
  const tonePhase = useGameStore((s) => s.tonePhase)
  const streak = useGameStore((s) => s.streak)
  const stats = useGameStore((s) => s.stats)
  const timerLeft = useGameStore((s) => s.timerLeft)
  const timerMax = useGameStore((s) => s.timerMax)
  const active = useGameStore((s) => s.active)

  const health = Math.round(
    (stats.revenue + stats.users + stats.stability + stats.reputation) / 4,
  )
  const timerPct =
    active?.source === 'player' && timerMax > 0
      ? Math.round((timerLeft / timerMax) * 100)
      : 100

  return (
    <div className="system-bar">
      <div className="system-bar__row">
        <span>
          <span className="system-bar__led" aria-hidden />
          SYS.OK
        </span>
        <span>DAY/{day}</span>
        <span>{PHASE_META[tonePhase].label}</span>
        <span>HP {health}%</span>
        {streak > 0 ? <span className="warn-tag">SHARP×{streak}</span> : null}
      </div>
      <div
        className="system-bar__meter"
        title="Decision window remaining"
        aria-hidden
      >
        <div
          className="system-bar__meter-fill"
          style={{ width: `${timerPct}%` }}
        />
      </div>
    </div>
  )
}
