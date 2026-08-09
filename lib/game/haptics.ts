'use client'

/** Soft device vibration when available (mobile). */
export function haptic(kind: 'tap' | 'warn' | 'confirm' | 'fail' = 'tap') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  switch (kind) {
    case 'tap':
      navigator.vibrate(12)
      break
    case 'warn':
      navigator.vibrate([18, 30, 18])
      break
    case 'confirm':
      navigator.vibrate([10, 20, 30])
      break
    case 'fail':
      navigator.vibrate([40, 40, 80])
      break
  }
}
