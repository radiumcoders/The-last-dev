'use client'

import { CrtScroll } from '@/components/crt/CrtScroll'
import { TerminalPanel } from '@/components/crt/TerminalPanel'
import { haptic } from '@/lib/game/haptics'
import { useGameStore } from '@/lib/game/store'

export function Timeline() {
  const timeline = useGameStore((s) => s.timeline)
  const showTimeline = useGameStore((s) => s.showTimeline)
  const toggleTimeline = useGameStore((s) => s.toggleTimeline)

  if (!showTimeline) return null

  return (
    <div className="overlay-panel">
      <TerminalPanel
        title="CORPORATE TIMELINE"
        footer={
          <button
            type="button"
            className="linkish touch-target"
            onClick={() => {
              haptic('tap')
              toggleTimeline()
            }}
          >
            [ CLOSE ]
          </button>
        }
      >
        <CrtScroll className="scroll-pane">
          {timeline.map((entry) => (
            <div key={entry.id} className="timeline-row">
              <span className="timeline-day">Day {entry.day}:</span>{' '}
              <span>{entry.title}</span>
            </div>
          ))}
        </CrtScroll>
      </TerminalPanel>
    </div>
  )
}
