import { CHAIN_EVENTS } from '@/lib/game/content/chains'
import { DISASTER_EVENTS } from '@/lib/game/content/disasters'
import { REQUEST_EVENTS } from '@/lib/game/content/events'
import type { GameEvent } from '@/lib/game/types'

export { AGENTS, agentHeader } from '@/lib/game/content/agents'
export { ENDINGS, evaluateEnding } from '@/lib/game/content/endings'

export const ALL_EVENTS: GameEvent[] = [
  ...REQUEST_EVENTS,
  ...DISASTER_EVENTS,
  ...CHAIN_EVENTS,
]

export const BOOT_LINES = [
  'BOOTING CORPORATE DECISION TERMINAL...',
  'VERIFYING HUMAN EXISTENCE...',
  'STATUS: ALIVE',
  'STATUS: EMPLOYED',
  'STATUS: SURPRISINGLY EMPLOYED',
  '',
  'WELCOME BACK HUMAN.',
  'YOU ARE STILL REQUIRED.',
  'FOR NOW.',
]
