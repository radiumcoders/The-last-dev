'use client'

import { useEffect, useRef } from 'react'
import { gameAudio } from '@/lib/game/audio'
import { useGameStore } from '@/lib/game/store'

/** Drives procedural audio from game state. Starts after first unlock. */
export function AudioDirector({ unlocked }: { unlocked: boolean }) {
  const uiPhase = useGameStore((s) => s.uiPhase)
  const tonePhase = useGameStore((s) => s.tonePhase)
  const timerLeft = useGameStore((s) => s.timerLeft)
  const timerCritical = useGameStore((s) => s.timerCritical)
  const audioMuted = useGameStore((s) => s.audioMuted)
  const active = useGameStore((s) => s.active)
  const lastEffects = useGameStore((s) => s.lastEffects)
  const prevTimer = useRef<number | null>(null)
  const prevEffects = useRef<string>('')
  const prevActiveId = useRef<string | null>(null)

  useEffect(() => {
    if (!unlocked) return
    void gameAudio.start()
  }, [unlocked])

  useEffect(() => {
    gameAudio.setMuted(audioMuted)
  }, [audioMuted])

  useEffect(() => {
    if (!unlocked || audioMuted) return
    if (uiPhase === 'ending' || uiPhase === 'shutdown') {
      gameAudio.setIntensity('collapse')
      return
    }
    if (timerCritical) {
      gameAudio.setIntensity('critical')
      return
    }
    if (tonePhase === 'existential' || tonePhase === 'autonomous') {
      gameAudio.setIntensity('tense')
      return
    }
    if (tonePhase === 'chaotic' || timerLeft <= 10) {
      gameAudio.setIntensity('tense')
      return
    }
    gameAudio.setIntensity('calm')
  }, [unlocked, audioMuted, uiPhase, tonePhase, timerCritical, timerLeft])

  // Tick sounds as timer drops
  useEffect(() => {
    if (!unlocked || audioMuted) return
    if (active?.source !== 'player') return
    if (prevTimer.current === null) {
      prevTimer.current = timerLeft
      return
    }
    if (timerLeft < prevTimer.current) {
      if (timerLeft <= 5) gameAudio.criticalTick()
      else if (timerLeft <= 10) gameAudio.warningTick()
    }
    if (timerLeft === 0 && prevTimer.current > 0) {
      gameAudio.timeoutAlarm()
      gameAudio.collapse()
    }
    prevTimer.current = timerLeft
  }, [timerLeft, unlocked, audioMuted, active?.source])

  // Click confirm when a decision lands
  useEffect(() => {
    const key = lastEffects.join('|')
    if (!unlocked || audioMuted) return
    if (key && key !== prevEffects.current) {
      if (key.includes('TIMEOUT')) gameAudio.timeoutAlarm()
      else gameAudio.confirm()
    }
    prevEffects.current = key
  }, [lastEffects, unlocked, audioMuted])

  // Soft blip on new request
  useEffect(() => {
    const id = active?.event.id ?? null
    if (!unlocked || audioMuted) return
    if (id && id !== prevActiveId.current) {
      gameAudio.click()
    }
    prevActiveId.current = id
  }, [active?.event.id, unlocked, audioMuted])

  return null
}
