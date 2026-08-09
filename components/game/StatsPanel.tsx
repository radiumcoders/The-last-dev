'use client'

import { StatBar } from '@/components/crt/StatBar'
import { TerminalPanel } from '@/components/crt/TerminalPanel'
import { PhaseRail } from '@/components/game/PhaseRail'
import { useGameStore } from '@/lib/game/store'
import { STAT_ORDER } from '@/lib/game/types'

export function StatsPanel() {
  const stats = useGameStore((s) => s.stats)
  const day = useGameStore((s) => s.day)
  const tonePhase = useGameStore((s) => s.tonePhase)
  const seed = useGameStore((s) => s.seed)
  const lastDelta = useGameStore((s) => s.lastDelta)
  const streak = useGameStore((s) => s.streak)
  const bestStreak = useGameStore((s) => s.bestStreak)

  return (
    <TerminalPanel
      title="COMPANY STATUS"
      footer={
        <div className="stats-meta">
          <span>DAY {day}</span>
          <span>
            STREAK {streak}
            {bestStreak > 0 ? ` (BEST ${bestStreak})` : ''}
          </span>
          <span>SEED {seed.toString(16).toUpperCase()}</span>
        </div>
      }
    >
      <PhaseRail phase={tonePhase} />
      <div className="stats-list">
        {STAT_ORDER.map((key) => (
          <StatBar
            key={key}
            stat={key}
            value={stats[key]}
            delta={lastDelta[key]}
            warnBelow={key === 'techDebt' ? undefined : 25}
            warnAbove={key === 'techDebt' ? 75 : undefined}
          />
        ))}
      </div>
      <p className="stats-tip dim">Long-press / hover a metric for details.</p>
    </TerminalPanel>
  )
}
