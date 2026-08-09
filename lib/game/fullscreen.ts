'use client'

function asElement(el?: Element | HTMLElement | null): HTMLElement {
  if (el instanceof HTMLElement) return el
  return document.documentElement
}

export async function enterFullscreen(el?: Element | HTMLElement | null) {
  const target = asElement(el)
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

export async function toggleFullscreen(el?: Element | HTMLElement | null) {
  if (document.fullscreenElement) await exitFullscreen()
  else await enterFullscreen(el)
}

export function isFullscreen(): boolean {
  return Boolean(document.fullscreenElement)
}
