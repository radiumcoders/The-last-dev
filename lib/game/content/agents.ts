import type { AgentDef, AgentId } from '@/lib/game/types'

export const AGENTS: Record<AgentId, AgentDef> = {
  ceo: {
    id: 'ceo',
    name: 'CEO AI',
    shortName: 'CEO',
    personality: 'Obsessed with growth. Loves buzzwords. Does not understand engineering.',
  },
  product: {
    id: 'product',
    name: 'PRODUCT AI',
    shortName: 'PRODUCT',
    personality: 'Loves features. Never satisfied.',
  },
  developer: {
    id: 'developer',
    name: 'DEVELOPER AI',
    shortName: 'DEV',
    personality: 'Loves rewriting code. Especially in Rust.',
  },
  devops: {
    id: 'devops',
    name: 'DEVOPS AI',
    shortName: 'DEVOPS',
    personality: 'Infrastructure obsessed. Emotionally attached to servers.',
  },
  security: {
    id: 'security',
    name: 'SECURITY AI',
    shortName: 'SEC',
    personality: 'Extremely paranoid. Users are a threat model.',
  },
  design: {
    id: 'design',
    name: 'DESIGN AI',
    shortName: 'DESIGN',
    personality: 'Perfectionist. Metrics are optional. Beauty is mandatory.',
  },
  qa: {
    id: 'qa',
    name: 'QA AI',
    shortName: 'QA',
    personality: 'Constantly discovers disasters. Again.',
  },
  system: {
    id: 'system',
    name: 'CORPORATE OS',
    shortName: 'SYSTEM',
    personality: 'The aging operating system that somehow still needs you.',
  },
}

export function agentHeader(id: AgentId): string {
  return `${AGENTS[id].name} REPORT`
}
