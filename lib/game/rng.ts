/** Mulberry32 — deterministic PRNG from a 32-bit seed. */
export function createRng(seed: number): () => number {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r)
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

export function randomSeed(): number {
  return (Math.floor(Math.random() * 0xffffffff) || 1) >>> 0
}

export function pickWeighted<T>(
  items: T[],
  weightOf: (item: T) => number,
  rng: () => number,
): T | null {
  if (items.length === 0) return null
  const weights = items.map(weightOf)
  const total = weights.reduce((a, b) => a + Math.max(0, b), 0)
  if (total <= 0) return items[Math.floor(rng() * items.length)] ?? null
  let roll = rng() * total
  for (let i = 0; i < items.length; i++) {
    roll -= Math.max(0, weights[i]!)
    if (roll <= 0) return items[i]!
  }
  return items[items.length - 1]!
}

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}
