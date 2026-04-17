import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Truck, Scale, TrendingDown } from 'lucide-react'
import type { Product } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { cn } from '@/utils/cn'
import { computeDiscountPercent } from '@/utils/formatPrice'
import { useCompareStore } from '@/stores/compareStore'

const FREE_SHIPPING_THRESHOLD = 500
const LOWEST_PRICE_DISCOUNT_THRESHOLD = 15

export interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  isInWishlist?: boolean
  className?: string
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  isInWishlist = false,
  className,
}: ProductCardProps) {
  const discount = product.oldPrice
    ? computeDiscountPercent(product.price, product.oldPrice)
    : 0
  const isOutOfStock = product.stock <= 0
  const hasFreeShipping = product.price >= FREE_SHIPPING_THRESHOLD
  const isLowest30Days = discount >= LOWEST_PRICE_DISCOUNT_THRESHOLD
  const savings = product.oldPrice ? product.oldPrice - product.price : 0
  const isInCompare = useCompareStore((s) => s.has(product.id))
  const toggleCompare = useCompareStore((s) => s.toggle)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!isOutOfStock) onAddToCart?.(product)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onToggleWishlist?.(product)
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleCompare(product)
  }

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-md border border-border bg-background transition-all',
        'hover:border-primary hover:shadow-lg',
        className,
      )}
    >
      {/* Badges en overlay */}
      <div className="absolute left-2.5 top-2.5 z-10 flex flex-col gap-1">
        {discount > 0 && <Badge variant="danger" size="sm">-{discount}%</Badge>}
        {product.stock > 0 && product.stock <= 3 && (
          <Badge variant="warning" size="sm">Stock limite</Badge>
        )}
        {isOutOfStock && <Badge variant="outline" size="sm">Rupture</Badge>}
      </div>

      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className={cn(
          'absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white shadow-sm transition-colors',
          'hover:border-primary hover:text-primary',
          isInWishlist ? 'border-primary text-primary' : 'text-text-muted',
        )}
      >
        <Heart className="h-4 w-4" fill={isInWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-background">
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />

        {/* CTA au hover */}
        {onAddToCart && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={cn(
              'absolute inset-x-3 bottom-3 flex h-10 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-white',
              'opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0',
              'hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? 'Rupture' : 'Ajouter au panier'}
          </button>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.brandName && (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            {product.brandName}
          </span>
        )}

        <h3 className="line-clamp-2 text-sm font-medium text-text transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        <Rating
          value={product.rating}
          size="sm"
          showValue
          reviewCount={product.reviewCount}
        />

        <div className="mt-auto flex flex-col gap-1.5 pt-2">
          <PriceDisplay price={product.price} oldPrice={product.oldPrice} size="md" />

          {savings > 0 && (
            <span className="text-[11px] font-bold text-success-cta">
              Économisez : {savings.toLocaleString('fr-FR')} DH
            </span>
          )}

          {isLowest30Days && (
            <span className="inline-flex w-fit items-center gap-1 rounded-sm bg-success-cta/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success-cta">
              <TrendingDown className="h-2.5 w-2.5" />
              Prix le + bas 30 jours
            </span>
          )}

          {hasFreeShipping && (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-success">
              <Truck className="h-3 w-3" />
              Livraison gratuite
            </span>
          )}

          <button
            type="button"
            onClick={handleCompare}
            aria-pressed={isInCompare}
            className={cn(
              'inline-flex items-center gap-1.5 self-start rounded-sm border px-1.5 py-0.5 text-[10.5px] font-semibold transition-colors',
              isInCompare
                ? 'border-primary bg-primary-soft text-primary'
                : 'border-border text-text-muted hover:border-primary hover:text-primary',
            )}
          >
            <Scale className="h-3 w-3" />
            {isInCompare ? 'Comparer ✓' : 'Comparer'}
          </button>
        </div>
      </div>
    </Link>
  )
}
