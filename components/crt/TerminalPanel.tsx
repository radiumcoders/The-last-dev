import { CrtScroll } from '@/components/crt/CrtScroll'
import { cn } from '@/lib/utils'

export function TerminalPanel({
  title,
  children,
  className,
  footer,
  scrollBody = false,
}: {
  title?: string
  children: React.ReactNode
  className?: string
  footer?: React.ReactNode
  scrollBody?: boolean
}) {
  return (
    <section className={cn('terminal-panel', className)}>
      {title ? (
        <header className="terminal-panel__header">
          <div className="terminal-panel__title-row">
            <span className="terminal-panel__bullet" aria-hidden>
              ■
            </span>
            <span>{title}</span>
          </div>
          <span className="terminal-panel__rule">
            ────────────────────────────────
          </span>
        </header>
      ) : null}
      {scrollBody ? (
        <CrtScroll className="terminal-panel__body">{children}</CrtScroll>
      ) : (
        <div className="terminal-panel__body">{children}</div>
      )}
      {footer ? <footer className="terminal-panel__footer">{footer}</footer> : null}
    </section>
  )
}
