'use client'

import { useEffect, useState } from 'react'
import { AudioDirector } from '@/components/game/AudioDirector'
import { BootSequence } from '@/components/game/BootSequence'
import { EndingSequence } from '@/components/game/EndingSequence'
import { GameShell } from '@/components/game/GameShell'
import { ShutdownSequence } from '@/components/game/ShutdownSequence'
import { gameAudio } from '@/lib/game/audio'
import { toggleFullscreen } from '@/lib/game/fullscreen'
import { useGameStore } from '@/lib/game/store'

export function GameApp() {
  const uiPhase = useGameStore((s) => s.uiPhase)
  const restart = useGameStore((s) => s.restart)
  const beginShutdown = useGameStore((s) => s.beginShutdown)
  const [audioUnlocked, setAudioUnlocked] = useState(false)

  useEffect(() => {
    const unlock = () => {
      if (!audioUnlocked) {
        setAudioUnlocked(true)
        void gameAudio.start()
      }
    }
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [audioUnlocked])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      // Single global F handler — GameShell must not also bind F (double-toggle flicker).
      if (key === 'f') {
        e.preventDefault()
        void toggleFullscreen()
        return
      }
      if (uiPhase === 'ending' && key === 'enter') {
        beginShutdown()
      }
      if (uiPhase === 'shutdown' && key === 'r') {
        restart()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [beginShutdown, restart, uiPhase])

  return (
    <>
      <AudioDirector unlocked={audioUnlocked} />
      {uiPhase === 'boot' ? (
        <BootSequence
          onPower={() => {
            setAudioUnlocked(true)
            void gameAudio.start().then(() => gameAudio.bootPower())
          }}
        />
      ) : null}
      {uiPhase === 'ending' ? <EndingSequence /> : null}
      {uiPhase === 'shutdown' ? <ShutdownSequence /> : null}
      {uiPhase !== 'boot' &&
      uiPhase !== 'ending' &&
      uiPhase !== 'shutdown' ? (
        <GameShell />
      ) : null}
    </>
  )
}
