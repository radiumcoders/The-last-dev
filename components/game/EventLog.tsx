'use client'

import { CrtScroll } from '@/components/crt/CrtScroll'
import { TerminalPanel } from '@/components/crt/TerminalPanel'
import { haptic } from '@/lib/game/haptics'
import { useGameStore } from '@/lib/game/store'

export function EventLog() {
  const log = useGameStore((s) => s.log)
  const showLog = useGameStore((s) => s.showLog)
  const toggleLog = useGameStore((s) => s.toggleLog)

  if (!showLog) return null

  return (
    <div className="overlay-panel">
      <TerminalPanel
        title="EVENT LOG"
        footer={
          <button
            type="button"
            className="linkish touch-target"
            onClick={() => {
              haptic('tap')
              toggleLog()
            }}
          >
            [ CLOSE ]
          </button>
        }
      >
        <CrtScroll className="scroll-pane">
          {log.length === 0 ? (
            <p className="dim">No decisions recorded.</p>
          ) : (
            log.map((entry) => (
              <div key={entry.id} className="log-entry">
                <div className="log-day">DAY {entry.day}</div>
                {entry.lines.map((line, i) => (
                  <div key={`${entry.id}-${i}`}>{line}</div>
                ))}
                <div className="ascii-divider">----------------</div>
              </div>
            ))
          )}
        </CrtScroll>
      </TerminalPanel>
    </div>
  )
}
