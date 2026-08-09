'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { isFullscreen, toggleFullscreen } from '@/lib/game/fullscreen'

export function CrtScreen({
  children,
  className,
  poweredOff = false,
  intense = false,
}: {
  children: React.ReactNode
  className?: string
  poweredOff?: boolean
  intense?: boolean
}) {
  const [fs, setFs] = useState(false)

  useEffect(() => {
    const sync = () => setFs(isFullscreen())
    sync()
    document.addEventListener('fullscreenchange', sync)
    return () => document.removeEventListener('fullscreenchange', sync)
  }, [])

  return (
    <div className={cn('crt-root', className)}>
      <div
        className={cn(
          'crt-bezel',
          poweredOff && 'crt-powered-off',
          intense && 'crt-bezel--intense',
        )}
      >
        <div className="crt-chrome">
          <span className="crt-chrome__brand">OMNI CORP · DECISION TERMINAL</span>
          <button
            type="button"
            className="crt-chrome__fs"
            onClick={() => void toggleFullscreen()}
            title="Toggle fullscreen (F)"
          >
            {fs ? '[ F ] EXIT FULLSCREEN' : '[ F ] FULLSCREEN'}
          </button>
        </div>

        <div className={cn('crt-screen', intense && 'crt-screen--shake')}>
          <div className="crt-glass" aria-hidden />
          <div className="crt-content">{children}</div>
          <div className="crt-scanlines" aria-hidden />
          <div className="crt-vignette" aria-hidden />
          <div className="crt-noise" aria-hidden />
          <div className="crt-flicker" aria-hidden />
          <div className="crt-flicker crt-flicker--hard" aria-hidden />
        </div>

        <div className="crt-under">
          <span className="crt-led" aria-hidden />
          <span className="crt-under__label">HUMAN INPUT ENABLED</span>
        </div>
      </div>
    </div>
  )
}
