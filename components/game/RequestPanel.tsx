'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { TerminalPanel } from '@/components/crt/TerminalPanel'
import { DecisionTimer } from '@/components/game/DecisionTimer'
import { AGENTS } from '@/lib/game/content/agents'
import { choiceLabel } from '@/lib/game/engine/consequences'
import { gameAudio } from '@/lib/game/audio'
import { haptic } from '@/lib/game/haptics'
import { useCoarsePointer } from '@/lib/game/touch'
import { useGameStore } from '@/lib/game/store'
import { chipTone, formatDeltaChips, kindLabel } from '@/lib/game/ux'
import type { StatDelta } from '@/lib/game/types'
import { cn } from '@/lib/utils'

function EffectChips({ delta }: { delta: StatDelta }) {
  if (!formatDeltaChips(delta).length) {
    return <span className="dim">no metric shift</span>
  }
  return (
    <span className="effect-chips">
      {(Object.keys(delta) as (keyof StatDelta)[]).map((key) => {
        const v = delta[key]
        if (typeof v !== 'number' || v === 0) return null
        const short = formatDeltaChips({ [key]: v })[0]
        return (
          <span
            key={key}
            className={cn(
              'effect-chip',
              chipTone(key, v) === 'good' ? 'is-good' : 'is-bad',
            )}
          >
            {short}
          </span>
        )
      })}
    </span>
  )
}

export function RequestPanel() {
  const active = useGameStore((s) => s.active)
  const choose = useGameStore((s) => s.choose)
  const advanceAutonomous = useGameStore((s) => s.advanceAutonomous)
  const lastEffects = useGameStore((s) => s.lastEffects)
  const tonePhase = useGameStore((s) => s.tonePhase)
  const timerCritical = useGameStore((s) => s.timerCritical)
  const streak = useGameStore((s) => s.streak)
  const coarse = useCoarsePointer()
  const [focused, setFocused] = useState<string | null>(null)

  useEffect(() => {
    setFocused(null)
  }, [active?.event.id])

  useEffect(() => {
    if (timerCritical) haptic('warn')
  }, [timerCritical])

  if (!active) {
    return (
      <TerminalPanel title="INBOX">
        <p>NO PENDING REQUESTS.</p>
        <p className="dim">The silence is suspicious.</p>
      </TerminalPanel>
    )
  }

  const agent = AGENTS[active.event.agent]
  const autonomous = active.source === 'autonomous'
  const focusedChoice = active.event.choices.find((c) => c.id === focused)

  const commit = (id: string) => {
    haptic('confirm')
    gameAudio.click()
    setFocused(null)
    choose(id)
  }

  const onChoiceActivate = (id: string) => {
    if (coarse) {
      // Touch: first tap selects/previews, second tap confirms
      if (focused === id) {
        commit(id)
        return
      }
      haptic('tap')
      gameAudio.click()
      setFocused(id)
      return
    }
    commit(id)
  }

  return (
    <TerminalPanel
      title={autonomous ? 'AUTONOMOUS EXECUTION' : 'INCOMING REQUEST'}
      footer={
        lastEffects.length ? (
          <div className="effect-flash">
            LAST: {lastEffects.slice(0, 3).join(' · ')}
          </div>
        ) : (
          <div className="dim">
            {coarse
              ? 'TAP TO SELECT · TAP AGAIN / CONFIRM'
              : '1-4 CHOOSE · HOVER PREVIEW · H HELP'}
            {streak > 0 ? ` · STREAK x${streak}` : ''}
            {autonomous ? ' · ENTER ADVANCE' : ''}
          </div>
        )
      }
    >
      {!autonomous ? <DecisionTimer /> : null}

      <div
        className={cn(
          'request-block',
          timerCritical && 'request-block--panic',
        )}
      >
        <div className="request-meta">
          <span
            className={cn(
              'kind-badge',
              active.event.kind === 'disaster' && 'kind-badge--danger',
              active.event.kind === 'chain' && 'kind-badge--chain',
            )}
          >
            {kindLabel(active.event.kind)}
          </span>
          {(tonePhase === 'existential' || tonePhase === 'autonomous') && (
            <span className="warn-tag">ANOMALY</span>
          )}
        </div>

        <div className="request-agent">{agent.name} REPORT</div>
        <p className="agent-blurb dim">{agent.personality}</p>
        <div className="request-title">{active.event.title}</div>
        <div className="ascii-divider">════════════════════════════════</div>
        {active.event.body.map((line) => (
          <p key={line} className="request-line">
            {line}
          </p>
        ))}
        <div className="ascii-divider">════════════════════════════════</div>

        {autonomous ? (
          <div className="autonomous-box">
            <p className="warn-tag">HUMAN APPROVAL BYPASSED</p>
            <p>
              SELECTED:{' '}
              {active.event.choices.find((c) => c.id === active.autoChoiceId)
                ?.label ?? 'UNKNOWN'}
            </p>
            <Button
              className="mt-3 w-full touch-target"
              onClick={() => {
                haptic('tap')
                gameAudio.click()
                advanceAutonomous()
              }}
            >
              [ TAP / ENTER ] OBSERVE OUTCOME
            </Button>
          </div>
        ) : (
          <>
            <div className="preview-pane">
              <span className="dim">FORECAST</span>{' '}
              {focusedChoice ? (
                <EffectChips delta={focusedChoice.effects} />
              ) : (
                <span className="dim">
                  {coarse ? 'tap a choice to preview' : 'hover / focus a choice'}
                </span>
              )}
            </div>

            <div className="choices">
              {active.event.choices.map((choice, index) => (
                <motion.div
                  key={choice.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onMouseEnter={() => {
                    if (!coarse) setFocused(choice.id)
                  }}
                  onMouseLeave={() => {
                    if (!coarse) {
                      setFocused((h) => (h === choice.id ? null : h))
                    }
                  }}
                >
                  <Button
                    className={cn(
                      'choice-btn w-full touch-target',
                      focused === choice.id && 'choice-btn--hot',
                      focused === choice.id && coarse && 'choice-btn--armed',
                    )}
                    onClick={() => onChoiceActivate(choice.id)}
                  >
                    <span className="choice-key">[{index + 1}]</span>
                    <span className="choice-body">
                      <span className="choice-opt">
                        {choiceLabel(choice, index)}
                        {focused === choice.id && coarse ? ' · SELECTED' : ''}
                      </span>
                      <span className="choice-label">{choice.label}</span>
                      <span className="choice-preview">
                        <EffectChips delta={choice.effects} />
                      </span>
                    </span>
                  </Button>
                </motion.div>
              ))}
            </div>

            {coarse && focusedChoice ? (
              <div className="confirm-bar">
                <Button
                  className="w-full touch-target confirm-bar__btn"
                  variant="danger"
                  onClick={() => commit(focusedChoice.id)}
                >
                  [ CONFIRM ] {focusedChoice.label.toUpperCase()}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </TerminalPanel>
  )
}
