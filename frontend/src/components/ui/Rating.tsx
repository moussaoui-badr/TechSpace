import { Star } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface RatingProps {
  value: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  reviewCount?: number
  className?: string
}

const sizeStyles = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
}

export function Rating({
  value,
  max = 5,
  size = 'sm',
  showValue = false,
  reviewCount,
  className,
}: RatingProps) {
  const clamped = Math.max(0, Math.min(value, max))
  const percent = (clamped / max) * 100

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="relative inline-flex">
        <div className="flex gap-0.5 text-border">
          {Array.from({ length: max }, (_, i) => (
            <Star key={`bg-${i}`} className={sizeStyles[size]} fill="currentColor" />
          ))}
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex gap-0.5 overflow-hidden text-star"
          style={{ width: `${percent}%` }}
        >
          {Array.from({ length: max }, (_, i) => (
            <Star
              key={`fg-${i}`}
              className={cn(sizeStyles[size], 'flex-shrink-0')}
              fill="currentColor"
            />
          ))}
        </div>
      </div>

      {showValue && (
        <span className="text-xs font-medium text-text-muted">
          {clamped.toFixed(1)}
          {typeof reviewCount === 'number' && ` (${reviewCount})`}
        </span>
      )}
    </div>
  )
}
