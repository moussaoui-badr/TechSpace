import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  children: ReactNode
}

export function Card({ interactive = false, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border border-border bg-surface overflow-hidden transition-all',
        interactive && 'hover:border-primary/60 hover:shadow-glow-primary cursor-pointer',
        className,
      )}
      style={interactive ? { boxShadow: 'var(--shadow-card)' } : undefined}
      {...rest}
    >
      {children}
    </div>
  )
}
