'use client'

/** Always target the document element so remounting `.crt-root` never drops FS. */
function fullscreenTarget(): HTMLElement {
  return document.documentElement
}

export async function enterFullscreen(_el?: Element | HTMLElement | null) {
  const target = fullscreenTarget()
  if (!document.fullscreenElement && target.requestFullscreen) {
    try {
      await target.requestFullscreen()
    } catch {
      /* user gesture / browser policy */
    }
  }
}

export async function exitFullscreen() {
  if (document.fullscreenElement && document.exitFullscreen) {
    try {
      await document.exitFullscreen()
    } catch {
      /* ignore */
    }
  }
}

export async function toggleFullscreen(_el?: Element | HTMLElement | null) {
  if (document.fullscreenElement) await exitFullscreen()
  else await enterFullscreen()
}

export function isFullscreen(): boolean {
  return Boolean(document.fullscreenElement)
}
