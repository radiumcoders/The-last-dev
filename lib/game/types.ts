export type StatKey =
  | 'revenue'
  | 'users'
  | 'techDebt'
  | 'stability'
  | 'reputation'
  | 'morale'

export type Stats = Record<StatKey, number>

export type AgentId =
  | 'ceo'
  | 'product'
  | 'developer'
  | 'devops'
  | 'security'
  | 'design'
  | 'qa'
  | 'system'

export type GamePhase =
  | 'boot'
  | 'comedic'
  | 'chaotic'
  | 'existential'
  | 'autonomous'
  | 'ending'
  | 'shutdown'

export type EndingId =
  | 'humanity'
  | 'automation'
  | 'corporate'
  | 'apocalypse'

export type TonePhase = 'comedic' | 'chaotic' | 'existential' | 'autonomous'

export interface StatDelta {
  revenue?: number
  users?: number
  techDebt?: number
  stability?: number
  reputation?: number
  morale?: number
}

export interface Choice {
  id: string
  label: string
  effects: StatDelta
  unlockTags?: string[]
  addFlags?: string[]
  removeFlags?: string[]
  logLine?: string
  timelineTitle?: string
}

export interface GameEvent {
  id: string
  agent: AgentId
  title: string
  body: string[]
  choices: Choice[]
  phases: TonePhase[]
  weight: number
  requiresTags?: string[]
  forbidsTags?: string[]
  requiresFlags?: string[]
  forbidsFlags?: string[]
  kind?: 'request' | 'disaster' | 'chain' | 'autonomous'
  once?: boolean
}

export interface LogEntry {
  id: string
  day: number
  lines: string[]
}

export interface TimelineEntry {
  id: string
  day: number
  title: string
}

export interface ActiveRequest {
  event: GameEvent
  source: 'player' | 'autonomous'
  autoChoiceId?: string
}

export interface EndingResult {
  id: EndingId
  title: string
  lines: string[]
  shutdownLines: string[]
}

export interface AgentDef {
  id: AgentId
  name: string
  shortName: string
  personality: string
}

export const STAT_ORDER: StatKey[] = [
  'revenue',
  'users',
  'techDebt',
  'stability',
  'reputation',
  'morale',
]

export const STAT_LABELS: Record<StatKey, string> = {
  revenue: 'REVENUE',
  users: 'USERS',
  techDebt: 'TECH DEBT',
  stability: 'STABILITY',
  reputation: 'REPUTATION',
  morale: 'MORALE',
}

export const INITIAL_STATS: Stats = {
  revenue: 62,
  users: 58,
  techDebt: 35,
  stability: 70,
  reputation: 55,
  morale: 60,
}

export interface EventGeneratorContext {
  day: number
  phase: TonePhase
  stats: Stats
  tags: string[]
  flags: string[]
  usedEventIds: string[]
  rng: () => number
}

export interface EventGenerator {
  next(ctx: EventGeneratorContext, pool: GameEvent[]): GameEvent | null
}
