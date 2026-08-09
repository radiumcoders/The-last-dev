'use client'

import { CrtScroll } from '@/components/crt/CrtScroll'
import { TerminalPanel } from '@/components/crt/TerminalPanel'
import { haptic } from '@/lib/game/haptics'
import { useGameStore } from '@/lib/game/store'
import { STAT_HINTS } from '@/lib/game/ux'
import { STAT_ORDER, STAT_LABELS } from '@/lib/game/types'

export function HelpOverlay() {
  const showHelp = useGameStore((s) => s.showHelp)
  const toggleHelp = useGameStore((s) => s.toggleHelp)
  if (!showHelp) return null

  return (
    <div className="overlay-panel">
      <TerminalPanel
        title="OPERATOR BRIEFING"
        footer={
          <button
            type="button"
            className="linkish touch-target"
            onClick={() => {
              haptic('tap')
              toggleHelp()
            }}
          >
            [ CLOSE ]
          </button>
        }
      >
        <CrtScroll className="scroll-pane help-body">
          <p>You do not write code. You decide.</p>
          <p className="dim">
            AI employees send requests. Pick an option before the decision
            window expires — hesitation damages the company.
          </p>
          <div className="ascii-divider">----------------</div>
          <p>
            <span className="warn-tag">DESKTOP</span> 1-4 choose · L log · T
            timeline · M mute · F fullscreen · H help
          </p>
          <p>
            <span className="warn-tag">TOUCH</span> tap a choice to preview ·
            tap again or CONFIRM · use the bottom dock for LOG / TIME / HELP
          </p>
          <div className="ascii-divider">----------------</div>
          <p className="warn-tag">METRICS</p>
          {STAT_ORDER.map((key) => (
            <div key={key} className="help-stat">
              <span>{STAT_LABELS[key]}</span>
              <span className="dim"> — {STAT_HINTS[key]}</span>
            </div>
          ))}
          <div className="ascii-divider">----------------</div>
          <p>
            Decide with &gt;45% time left to grow a{' '}
            <span className="warn-tag">SHARP STREAK</span>. Every 3 sharp
            calls awards a small morale/reputation bonus.
          </p>
        </CrtScroll>
      </TerminalPanel>
    </div>
  )
}
