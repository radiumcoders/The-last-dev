'use client'

import { gameAudio } from '@/lib/game/audio'
import { haptic } from '@/lib/game/haptics'
import { useGameStore } from '@/lib/game/store'
import { cn } from '@/lib/utils'

export function MobileDock() {
  const toggleLog = useGameStore((s) => s.toggleLog)
  const toggleTimeline = useGameStore((s) => s.toggleTimeline)
  const toggleHelp = useGameStore((s) => s.toggleHelp)
  const setAudioMuted = useGameStore((s) => s.setAudioMuted)
  const audioMuted = useGameStore((s) => s.audioMuted)
  const showLog = useGameStore((s) => s.showLog)
  const showTimeline = useGameStore((s) => s.showTimeline)
  const showHelp = useGameStore((s) => s.showHelp)
  const timerLeft = useGameStore((s) => s.timerLeft)
  const timerCritical = useGameStore((s) => s.timerCritical)
  const active = useGameStore((s) => s.active)

  const tap = (fn: () => void) => {
    haptic('tap')
    gameAudio.click()
    fn()
  }

  return (
    <nav className="mobile-dock" aria-label="Touch controls">
      <div className="mobile-dock__timer">
        {active?.source === 'player' ? (
          <span className={cn(timerCritical && 'warn-tag')}>
            T-{String(timerLeft).padStart(2, '0')}s
          </span>
        ) : (
          <span className="dim">READY</span>
        )}
      </div>
      <button
        type="button"
        className={cn('dock-btn', showLog && 'is-on')}
        onClick={() => tap(toggleLog)}
      >
        LOG
      </button>
      <button
        type="button"
        className={cn('dock-btn', showTimeline && 'is-on')}
        onClick={() => tap(toggleTimeline)}
      >
        TIME
      </button>
      <button
        type="button"
        className={cn('dock-btn', showHelp && 'is-on')}
        onClick={() => tap(toggleHelp)}
      >
        HELP
      </button>
      <button
        type="button"
        className={cn('dock-btn', audioMuted && 'is-on')}
        onClick={() =>
          tap(() => {
            setAudioMuted(!audioMuted)
            gameAudio.setMuted(!audioMuted)
          })
        }
      >
        {audioMuted ? 'UNMUTE' : 'MUTE'}
      </button>
    </nav>
  )
}
