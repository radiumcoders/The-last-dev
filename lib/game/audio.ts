'use client'

/** Procedural CRT / corporate dread audio via Web Audio API (no asset files). */

type Intensity = 'calm' | 'tense' | 'critical' | 'collapse'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let humNodes: { stop: () => void } | null = null
let tickTimer: number | null = null
let muted = false
let started = false
let intensity: Intensity = 'calm'

function ensure(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0.55
    master.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function now(): number {
  return ctx?.currentTime ?? 0
}

function beep(
  freq: number,
  duration: number,
  type: OscillatorType = 'square',
  gain = 0.08,
  when = 0,
) {
  if (!ctx || !master || muted) return
  const t = now() + when
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(gain, t + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(g)
  g.connect(master)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

function noiseBurst(duration: number, gain = 0.05) {
  if (!ctx || !master || muted) return
  const length = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = 1200
  src.buffer = buffer
  g.gain.setValueAtTime(gain, now())
  g.gain.exponentialRampToValueAtTime(0.0001, now() + duration)
  src.connect(filter)
  filter.connect(g)
  g.connect(master)
  src.start()
}

function stopHum() {
  humNodes?.stop()
  humNodes = null
}

function startHum() {
  if (!ctx || !master || muted || humNodes) return

  const hum = ctx.createOscillator()
  const hum2 = ctx.createOscillator()
  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()

  hum.type = 'sine'
  hum2.type = 'triangle'
  hum.frequency.value = 58
  hum2.frequency.value = 116
  lfo.type = 'sine'
  lfo.frequency.value = 0.08
  lfoGain.gain.value = 0.012
  filter.type = 'lowpass'
  filter.frequency.value = 280
  g.gain.value = intensity === 'critical' ? 0.045 : 0.028

  lfo.connect(lfoGain)
  lfoGain.connect(g.gain)
  hum.connect(filter)
  hum2.connect(filter)
  filter.connect(g)
  g.connect(master)

  hum.start()
  hum2.start()
  lfo.start()

  // Sparse dissonant pulse for tension
  const pulse = ctx.createOscillator()
  const pulseG = ctx.createGain()
  pulse.type = 'sawtooth'
  pulse.frequency.value = intensity === 'critical' ? 42 : 36
  pulseG.gain.value = intensity === 'calm' ? 0.004 : intensity === 'tense' ? 0.01 : 0.018
  pulse.connect(pulseG)
  pulseG.connect(master)
  pulse.start()

  humNodes = {
    stop: () => {
      try {
        hum.stop()
        hum2.stop()
        lfo.stop()
        pulse.stop()
      } catch {
        /* already stopped */
      }
    },
  }
}

export const gameAudio = {
  isStarted: () => started,

  async start() {
    const audio = ensure()
    if (!audio) return
    started = true
    muted = false
    stopHum()
    startHum()
    noiseBurst(0.12, 0.07)
    beep(220, 0.08, 'square', 0.06)
    beep(330, 0.1, 'square', 0.05, 0.08)
    beep(440, 0.16, 'square', 0.04, 0.16)
  },

  setMuted(value: boolean) {
    muted = value
    if (muted) {
      stopHum()
      if (tickTimer) window.clearInterval(tickTimer)
      tickTimer = null
    } else if (started) {
      startHum()
    }
  },

  toggleMute() {
    this.setMuted(!muted)
    return muted
  },

  setIntensity(next: Intensity) {
    intensity = next
    if (!started || muted) return
    stopHum()
    startHum()
  },

  click() {
    beep(880, 0.04, 'square', 0.07)
    beep(660, 0.05, 'square', 0.04, 0.03)
  },

  confirm() {
    beep(523, 0.06, 'square', 0.08)
    beep(784, 0.1, 'square', 0.06, 0.06)
  },

  warningTick() {
    beep(980, 0.035, 'square', 0.09)
  },

  criticalTick() {
    beep(1400, 0.03, 'square', 0.11)
    noiseBurst(0.04, 0.03)
  },

  timeoutAlarm() {
    noiseBurst(0.25, 0.1)
    beep(180, 0.2, 'sawtooth', 0.12)
    beep(140, 0.25, 'sawtooth', 0.1, 0.15)
    beep(110, 0.35, 'sawtooth', 0.08, 0.3)
  },

  bootPower() {
    noiseBurst(0.35, 0.08)
    beep(80, 0.3, 'sine', 0.1)
    beep(160, 0.2, 'square', 0.05, 0.2)
  },

  collapse() {
    this.setIntensity('collapse')
    noiseBurst(0.5, 0.14)
    beep(90, 0.5, 'sawtooth', 0.14)
    beep(60, 0.7, 'sine', 0.12, 0.2)
  },

  stopAll() {
    stopHum()
    if (tickTimer) window.clearInterval(tickTimer)
    tickTimer = null
    started = false
  },
}
