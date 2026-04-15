import { computeDiscountPercent, formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'

export interface PriceDisplayProps {
  price: number
  oldPrice?: number
  size?: 'sm' | 'md' | 'lg'
  showDiscount?: boolean
  className?: string
}

const sizeStyles = {
  sm: { current: 'text-base', old: 'text-xs' },
  md: { current: 'text-lg', old: 'text-sm' },
  lg: { current: 'text-2xl md:text-3xl', old: 'text-base' },
}

export function PriceDisplay({
  price,
  oldPrice,
  size = 'md',
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const discount = oldPrice ? computeDiscountPercent(price, oldPrice) : 0
  const hasPromo = discount > 0

  return (
    <div className={cn('inline-flex flex-wrap items-baseline gap-2', className)}>
      <span
        className={cn(
          'font-semibold',
          hasPromo ? 'text-primary' : 'text-text',
          sizeStyles[size].current,
        )}
      >
        {formatPrice(price)}
      </span>

      {hasPromo && (
        <>
          <span className={cn('text-text-subtle line-through', sizeStyles[size].old)}>
            {formatPrice(oldPrice!)}
          </span>
          {showDiscount && (
            <span
              className={cn(
                'rounded-sm bg-danger px-1.5 py-0.5 text-[11px] font-bold text-white',
              )}
            >
              -{discount}%
            </span>
          )}
        </>
      )}
    </div>
  )
}
