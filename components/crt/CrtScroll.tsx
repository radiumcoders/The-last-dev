import { cn } from '@/lib/utils'

/** Scroll region with CRT-styled scrollbar. */
export function CrtScroll({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={cn('crt-scroll', className)}>{children}</div>
}
