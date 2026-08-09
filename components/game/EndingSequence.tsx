'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CrtScreen } from '@/components/crt/CrtScreen'
import { Typewriter } from '@/components/crt/Typewriter'
import { useGameStore } from '@/lib/game/store'

export function EndingSequence() {
  const ending = useGameStore((s) => s.ending)
  const beginShutdown = useGameStore((s) => s.beginShutdown)
  const day = useGameStore((s) => s.day)

  if (!ending) return null

  return (
    <CrtScreen>
      <div className="ending-sequence">
        <motion.div
          className="ending-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.7, 1] }}
          transition={{ duration: 1.2 }}
        >
          {ending.title}
        </motion.div>
        <p className="dim">DAY {day} — TERMINAL SESSION CLOSING</p>
        <div className="ascii-divider">════════════════════════════════</div>
        <Typewriter lines={ending.lines} charDelay={22} lineDelay={350} />
        <Button className="mt-6" onClick={beginShutdown}>
          [ ENTER ] INITIATE SHUTDOWN
        </Button>
      </div>
    </CrtScreen>
  )
}
