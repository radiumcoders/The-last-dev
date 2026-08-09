'use client'

import { cn } from '@/lib/utils'
import { useGameStore } from '@/lib/game/store'

export function DecisionTimer() {
  const timerLeft = useGameStore((s) => s.timerLeft)
  const timerMax = useGameStore((s) => s.timerMax)
  const timerCritical = useGameStore((s) => s.timerCritical)
  const active = useGameStore((s) => s.active)

  if (!active || active.source !== 'player' || timerMax <= 0) return null

  const pct = Math.max(0, Math.min(100, (timerLeft / timerMax) * 100))
  const blocks = 20
  const filled = Math.round((pct / 100) * blocks)
  const bar = '█'.repeat(filled) + '░'.repeat(blocks - filled)

  return (
    <div
      className={cn(
        'decision-timer',
        timerCritical && 'decision-timer--critical',
        timerLeft <= 8 && !timerCritical && 'decision-timer--warn',
      )}
    >
      <div className="decision-timer__row">
        <span>DECISION WINDOW</span>
        <span className="decision-timer__seconds">
          {String(timerLeft).padStart(2, '0')}s
        </span>
      </div>
      <div className="decision-timer__bar" aria-hidden>
        {bar}
      </div>
      <div className="decision-timer__warn">
        {timerCritical
          ? '⚠ CRITICAL — DECIDE OR COLLAPSE'
          : 'HESITATION TRIGGERS CASCADE FAILURE'}
      </div>
    </div>
  )
}
