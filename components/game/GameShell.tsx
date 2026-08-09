'use client'

import { useEffect } from 'react'
import { CrtScreen } from '@/components/crt/CrtScreen'
import { CoachStrip } from '@/components/game/CoachStrip'
import { DayMeter } from '@/components/game/DayMeter'
import { EventLog } from '@/components/game/EventLog'
import { HelpOverlay } from '@/components/game/HelpOverlay'
import { ImpactToast } from '@/components/game/ImpactToast'
import { IntensityFx } from '@/components/game/IntensityFx'
import { MobileDock } from '@/components/game/MobileDock'
import { RequestPanel } from '@/components/game/RequestPanel'
import { StatsPanel } from '@/components/game/StatsPanel'
import { SystemBar } from '@/components/game/SystemBar'
import { Timeline } from '@/components/game/Timeline'
import { gameAudio } from '@/lib/game/audio'
import { haptic } from '@/lib/game/haptics'
import { useGameStore } from '@/lib/game/store'
import { PHASE_META } from '@/lib/game/ux'

export function GameShell() {
  const toggleLog = useGameStore((s) => s.toggleLog)
  const toggleTimeline = useGameStore((s) => s.toggleTimeline)
  const toggleHelp = useGameStore((s) => s.toggleHelp)
  const choose = useGameStore((s) => s.choose)
  const advanceAutonomous = useGameStore((s) => s.advanceAutonomous)
  const tickTimer = useGameStore((s) => s.tickTimer)
  const setAudioMuted = useGameStore((s) => s.setAudioMuted)
  const audioMuted = useGameStore((s) => s.audioMuted)
  const active = useGameStore((s) => s.active)
  const day = useGameStore((s) => s.day)
  const tonePhase = useGameStore((s) => s.tonePhase)
  const timerCritical = useGameStore((s) => s.timerCritical)
  const timerLeft = useGameStore((s) => s.timerLeft)
  const streak = useGameStore((s) => s.streak)
  const showHelp = useGameStore((s) => s.showHelp)

  useEffect(() => {
    const id = window.setInterval(() => tickTimer(), 1000)
    return () => window.clearInterval(id)
  }, [tickTimer])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      const key = e.key.toLowerCase()
      if (key === 'escape' && showHelp) {
        e.preventDefault()
        toggleHelp()
        return
      }
      if (key === 'h') {
        e.preventDefault()
        gameAudio.click()
        toggleHelp()
        return
      }
      if (key === 'l') {
        e.preventDefault()
        gameAudio.click()
        toggleLog()
        return
      }
      if (key === 't') {
        e.preventDefault()
        gameAudio.click()
        toggleTimeline()
        return
      }
      if (key === 'm') {
        e.preventDefault()
        const next = !audioMuted
        setAudioMuted(next)
        gameAudio.setMuted(next)
        if (!next) gameAudio.click()
        return
      }
      if (key === 'enter') {
        if (active?.source === 'autonomous') {
          e.preventDefault()
          gameAudio.click()
          advanceAutonomous()
        }
        return
      }

      if (active?.source === 'player' && !showHelp) {
        const map: Record<string, number> = {
          '1': 0,
          '2': 1,
          '3': 2,
          '4': 3,
          a: 0,
          b: 1,
          c: 2,
          d: 3,
        }
        if (key in map) {
          const choice = active.event.choices[map[key]!]
          if (choice) {
            e.preventDefault()
            haptic('confirm')
            gameAudio.click()
            choose(choice.id)
          }
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    active,
    advanceAutonomous,
    audioMuted,
    choose,
    setAudioMuted,
    showHelp,
    toggleHelp,
    toggleLog,
    toggleTimeline,
  ])

  return (
    <CrtScreen intense={timerCritical || timerLeft <= 5}>
      <IntensityFx />
      <div className="game-shell">
        <SystemBar />

        <header className="game-header">
          <div>
            THE LAST DEVELOPER
            <span className="dim"> // {PHASE_META[tonePhase].label}</span>
            {timerCritical ? (
              <span className="warn-tag"> · TIME CRITICAL</span>
            ) : null}
            {streak >= 2 ? (
              <span className="streak-pill"> · SHARP x{streak}</span>
            ) : null}
          </div>
          <div className="dim">
            DAY {day} · 2035
            {audioMuted ? ' · MUTED' : ' · AUDIO'}
          </div>
        </header>

        <DayMeter />
        <CoachStrip />
        <ImpactToast />

        <div className="game-grid">
          <StatsPanel />
          <RequestPanel />
        </div>

        <footer className="game-footer dim desktop-only">
          <span>[1-4] DECIDE</span>
          <span>[H] HELP</span>
          <span>[L] LOG</span>
          <span>[T] TIMELINE</span>
          <span>[M] MUTE</span>
          <span>[F] FULLSCREEN</span>
        </footer>

        <MobileDock />

        <EventLog />
        <Timeline />
        <HelpOverlay />
      </div>
    </CrtScreen>
  )
}
