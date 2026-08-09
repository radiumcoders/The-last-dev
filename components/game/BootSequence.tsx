'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CrtScreen } from '@/components/crt/CrtScreen'
import { Typewriter } from '@/components/crt/Typewriter'
import { BOOT_LINES } from '@/lib/game/content'
import { gameAudio } from '@/lib/game/audio'
import { enterFullscreen } from '@/lib/game/fullscreen'
import { useGameStore } from '@/lib/game/store'

export function BootSequence({ onPower }: { onPower?: () => void }) {
  const finishBoot = useGameStore((s) => s.finishBoot)
  const [ready, setReady] = useState(false)
  const [powered, setPowered] = useState(false)

  const powerOn = () => {
    if (powered) return
    setPowered(true)
    onPower?.()
    void enterFullscreen(document.querySelector('.crt-root'))
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      if (!powered) {
        powerOn()
        return
      }
      if (ready) {
        gameAudio.click()
        finishBoot()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishBoot, powered, ready])

  return (
    <CrtScreen intense={powered && !ready}>
      <div className="boot-sequence">
        {!powered ? (
          <div className="boot-standby">
            <p className="boot-standby__label">MONITOR STANDBY</p>
            <p className="dim">CORPORATE DECISION TERMINAL · 2035</p>
            <motion.button
              type="button"
              className="boot-power"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              onClick={powerOn}
            >
              [ PRESS TO POWER ON ]
            </motion.button>
            <p className="dim boot-hint">OR PRESS ENTER / SPACE · AUDIO WILL START</p>
            <p className="boot-objective">
              OBJECTIVE: Keep the company alive by making decisions.
              <br />
              You do not write code. You do not deploy. You choose.
            </p>
          </div>
        ) : (
          <>
            <div className="boot-brand">CORPORATE OS v2035.4</div>
            <Typewriter
              lines={BOOT_LINES}
              onComplete={() => setReady(true)}
            />
            {ready ? (
              <>
                <p className="boot-objective dim">
                  Tip: hover choices to preview impact · press 1-3 before the timer dies
                </p>
                <motion.button
                  type="button"
                  className="boot-continue"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => {
                    gameAudio.click()
                    finishBoot()
                  }}
                >
                  [ ENTER ] BEGIN SHIFT
                </motion.button>
              </>
            ) : null}
          </>
        )}
      </div>
    </CrtScreen>
  )
}
