'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CrtScreen } from '@/components/crt/CrtScreen'
import { CrtScroll } from '@/components/crt/CrtScroll'
import { Typewriter } from '@/components/crt/Typewriter'
import { BOOT_LINES } from '@/lib/game/content'
import { gameAudio } from '@/lib/game/audio'
import { enterFullscreen } from '@/lib/game/fullscreen'
import { useGameStore } from '@/lib/game/store'
import { STAT_LABELS, STAT_ORDER } from '@/lib/game/types'
import { PHASE_META, STAT_HINTS } from '@/lib/game/ux'

type BootStep = 'standby' | 'booting' | 'guide'

export function BootSequence({ onPower }: { onPower?: () => void }) {
  const finishBoot = useGameStore((s) => s.finishBoot)
  const [step, setStep] = useState<BootStep>('standby')
  const [bootDone, setBootDone] = useState(false)

  const powerOn = () => {
    if (step !== 'standby') return
    setStep('booting')
    onPower?.()
    void enterFullscreen()
  }

  const openGuide = () => {
    if (!bootDone || step !== 'booting') return
    gameAudio.click()
    setStep('guide')
  }

  const beginShift = () => {
    if (step !== 'guide') return
    gameAudio.click()
    finishBoot()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
      if (step === 'standby') {
        powerOn()
        return
      }
      if (step === 'booting' && bootDone) {
        openGuide()
        return
      }
      if (step === 'guide') {
        beginShift()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, bootDone, finishBoot])

  return (
    <CrtScreen intense={step === 'booting' && !bootDone}>
      <div className="boot-sequence">
        {step === 'standby' ? (
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
        ) : null}

        {step === 'booting' ? (
          <>
            <div className="boot-brand">CORPORATE OS v2035.4</div>
            <Typewriter
              lines={BOOT_LINES}
              onComplete={() => setBootDone(true)}
            />
            {bootDone ? (
              <motion.button
                type="button"
                className="boot-continue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={openGuide}
              >
                [ ENTER ] HOW TO PLAY
              </motion.button>
            ) : null}
          </>
        ) : null}

        {step === 'guide' ? (
          <div className="boot-guide">
            <div className="boot-brand">OPERATOR BRIEFING</div>
            <CrtScroll className="boot-guide__scroll">
              <p className="boot-guide__title">MISSION</p>
              <p>
                You are the last human decision-maker at Omni Corp. AI employees
                send requests. You pick a response before the timer dies.
                Hesitation damages the company.
              </p>

              <div className="ascii-divider">----------------</div>
              <p className="boot-guide__title">MOTIVES — KEEP THESE ALIVE</p>
              <p className="dim">
                Every choice shifts metrics. Hit 0 on a critical bar and the
                company ends.
              </p>
              {STAT_ORDER.map((key) => (
                <div key={key} className="help-stat">
                  <span className="warn-tag">{STAT_LABELS[key]}</span>
                  <span className="dim"> — {STAT_HINTS[key]}</span>
                </div>
              ))}

              <div className="ascii-divider">----------------</div>
              <p className="boot-guide__title">PHASES</p>
              {(
                Object.keys(PHASE_META) as Array<keyof typeof PHASE_META>
              ).map((key) => (
                <div key={key} className="help-stat">
                  <span className="warn-tag">{PHASE_META[key].label}</span>
                  <span className="dim"> — {PHASE_META[key].blurb}</span>
                </div>
              ))}

              <div className="ascii-divider">----------------</div>
              <p className="boot-guide__title">HOW TO PLAY</p>
              <p>1. Read the request from an AI employee.</p>
              <p>2. Hover / tap a choice to preview impact chips.</p>
              <p>3. Confirm before the decision window expires.</p>
              <p>
                4. Decide with &gt;45% time left to grow a{' '}
                <span className="warn-tag">SHARP STREAK</span> — every 3 sharp
                calls awards morale/reputation.
              </p>

              <div className="ascii-divider">----------------</div>
              <p className="boot-guide__title">CONTROLS</p>
              <p>
                <span className="warn-tag">DESKTOP</span> 1-4 choose · L log · T
                timeline · M mute · F fullscreen · H help
              </p>
              <p>
                <span className="warn-tag">TOUCH</span> tap to preview · tap
                again or CONFIRM · dock for LOG / TIME / HELP
              </p>
            </CrtScroll>
            <motion.button
              type="button"
              className="boot-continue"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={beginShift}
            >
              [ ENTER ] BEGIN SHIFT
            </motion.button>
          </div>
        ) : null}
      </div>
    </CrtScreen>
  )
}
