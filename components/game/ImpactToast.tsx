'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '@/lib/game/store'

export function ImpactToast() {
  const impactFlash = useGameStore((s) => s.impactFlash)
  const clearImpact = useGameStore((s) => s.clearImpact)

  useEffect(() => {
    if (!impactFlash) return
    const t = window.setTimeout(() => clearImpact(), 2200)
    return () => window.clearTimeout(t)
  }, [impactFlash, clearImpact])

  return (
    <AnimatePresence>
      {impactFlash ? (
        <motion.div
          className="impact-toast"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
        >
          {impactFlash}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
