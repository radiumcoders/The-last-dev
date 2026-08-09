'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/lib/game/store'

/** Applies urgency classes to document for global CRT intensity. */
export function IntensityFx() {
  const timerCritical = useGameStore((s) => s.timerCritical)
  const timerLeft = useGameStore((s) => s.timerLeft)
  const tonePhase = useGameStore((s) => s.tonePhase)
  const uiPhase = useGameStore((s) => s.uiPhase)
  const active = useGameStore((s) => s.active)

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove(
      'fx-tense',
      'fx-critical',
      'fx-chaotic',
      'fx-collapse',
    )

    if (uiPhase === 'ending' || uiPhase === 'shutdown') {
      root.classList.add('fx-collapse')
      return
    }
    if (timerCritical && active?.source === 'player') {
      root.classList.add('fx-critical')
      return
    }
    if (timerLeft <= 10 && active?.source === 'player') {
      root.classList.add('fx-tense')
    }
    if (tonePhase === 'chaotic' || tonePhase === 'existential') {
      root.classList.add('fx-chaotic')
    }

    return () => {
      root.classList.remove(
        'fx-tense',
        'fx-critical',
        'fx-chaotic',
        'fx-collapse',
      )
    }
  }, [timerCritical, timerLeft, tonePhase, uiPhase, active?.source])

  return null
}
