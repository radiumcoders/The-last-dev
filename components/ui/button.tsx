import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-start gap-2 whitespace-normal font-mono text-sm transition-colors touch-manipulation select-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--crt-green)] disabled:pointer-events-none disabled:opacity-40 active:brightness-125',
  {
    variants: {
      variant: {
        terminal:
          'border border-[var(--crt-green-dim)] bg-black/40 px-3 py-2 text-[var(--crt-green)] hover:bg-[var(--crt-green)]/10 hover:border-[var(--crt-green)]',
        ghost:
          'text-[var(--crt-green-dim)] hover:text-[var(--crt-green)] hover:bg-[var(--crt-green)]/5',
        danger:
          'border border-[var(--crt-amber)] bg-black/40 px-3 py-2 text-[var(--crt-amber)] hover:bg-[var(--crt-amber)]/10',
      },
      size: {
        default: 'min-h-11',
        sm: 'min-h-9 px-2 text-xs',
        lg: 'min-h-12 px-4',
      },
    },
    defaultVariants: {
      variant: 'terminal',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
