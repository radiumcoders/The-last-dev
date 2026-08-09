'use client'

import { PHASE_META } from '@/lib/game/ux'
import type { TonePhase } from '@/lib/game/types'
import { cn } from '@/lib/utils'

const ORDER: TonePhase[] = ['comedic', 'chaotic', 'existential', 'autonomous']

export function PhaseRail({ phase }: { phase: TonePhase }) {
  const current = PHASE_META[phase]
  return (
    <div className="phase-rail" title={current.blurb}>
      <div className="phase-rail__track">
        {ORDER.map((p, i) => {
          const active = PHASE_META[p].order <= current.order
          const here = p === phase
          return (
            <span
              key={p}
              className={cn(
                'phase-rail__node',
                active && 'is-active',
                here && 'is-here',
              )}
            >
              {i + 1}:{PHASE_META[p].label.slice(0, 3)}
            </span>
          )
        })}
      </div>
      <p className="phase-rail__blurb dim">{current.blurb}</p>
    </div>
  )
}
