'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CrtScreen } from '@/components/crt/CrtScreen'
import { Typewriter } from '@/components/crt/Typewriter'
import { useGameStore } from '@/lib/game/store'

export function ShutdownSequence() {
  const ending = useGameStore((s) => s.ending)
  const restart = useGameStore((s) => s.restart)
  const [stage, setStage] = useState<'text' | 'distort' | 'off'>('text')

  if (!ending) return null

  return (
    <CrtScreen poweredOff={stage === 'off'}>
      <div className="shutdown-sequence">
        {stage === 'text' ? (
          <Typewriter
            lines={ending.shutdownLines}
            charDelay={35}
            lineDelay={500}
            onComplete={() => {
              window.setTimeout(() => setStage('distort'), 600)
            }}
          />
        ) : null}

        {stage === 'distort' ? (
          <motion.div
            className="signal-distort"
            initial={{ opacity: 1, skewX: 0 }}
            animate={{
              opacity: [1, 0.4, 1, 0.2, 0],
              skewX: [0, 8, -12, 4, 0],
              filter: [
                'blur(0px)',
                'blur(1px)',
                'blur(0px)',
                'blur(2px)',
                'blur(4px)',
              ],
            }}
            transition={{ duration: 2.2 }}
            onAnimationComplete={() => setStage('off')}
          >
            <p>SIGNAL LOST</p>
            <p className="dim">STATIC</p>
          </motion.div>
        ) : null}

        {stage === 'off' ? (
          <div className="power-off">
            <motion.div
              className="static-fill"
              animate={{ opacity: [0.15, 0.35, 0.1, 0.4] }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
            <p className="dim">MONITOR OFFLINE</p>
            <Button variant="ghost" className="mt-6" onClick={restart}>
              [ R ] REBOOT HUMAN SESSION
            </Button>
          </div>
        ) : null}
      </div>
    </CrtScreen>
  )
}
