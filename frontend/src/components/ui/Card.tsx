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
        'rounded-md border border-border bg-background overflow-hidden transition-all',
        interactive && 'hover:border-primary hover:shadow-lg cursor-pointer',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
