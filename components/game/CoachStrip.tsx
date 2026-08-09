'use client'

import { useGameStore } from '@/lib/game/store'

export function CoachStrip() {
  const day = useGameStore((s) => s.day)
  const coachDismissed = useGameStore((s) => s.coachDismissed)
  const dismissCoach = useGameStore((s) => s.dismissCoach)
  const active = useGameStore((s) => s.active)

  if (coachDismissed || day > 2 || !active || active.source !== 'player') {
    return null
  }

  return (
    <div className="coach-strip">
      <div>
        <strong>HOW TO PLAY</strong>
        <span className="dim">
          {' '}
          · Read the report · Tap/hover a choice to preview · Confirm before
          the timer dies · Fast calls build a SHARP STREAK
        </span>
      </div>
      <button type="button" className="linkish coach-strip__x" onClick={dismissCoach}>
        [ GOT IT ]
      </button>
    </div>
  )
}
