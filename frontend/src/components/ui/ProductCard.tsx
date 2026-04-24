import { Link } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Rating } from '@/components/ui/Rating'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { cn } from '@/utils/cn'
import { computeDiscountPercent } from '@/utils/formatPrice'

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

  return (
    <Link
      to={`/products/${product.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-md border border-border bg-background transition-all',
        'hover:border-primary hover:shadow-elevated',
        className,
      )}
    >
      {/* Badges en overlay */}
      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {discount > 0 && <Badge variant="danger" size="sm">-{discount}%</Badge>}
        {product.stock > 0 && product.stock <= 3 && (
          <Badge variant="warning" size="sm">Stock limité</Badge>
        )}
        {isOutOfStock && <Badge variant="outline" size="sm">Rupture</Badge>}
      </div>

      {/* Wishlist */}
      <button
        type="button"
        onClick={handleWishlist}
        aria-label={isInWishlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        className={cn(
          'absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-colors',
          'hover:text-primary',
          isInWishlist ? 'text-primary' : 'text-text-subtle',
        )}
      >
        <Heart className="h-3.5 w-3.5" fill={isInWishlist ? 'currentColor' : 'none'} />
      </button>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white">
        <img
          src={product.mainImage}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {onAddToCart && (
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={cn(
              'absolute inset-x-3 bottom-2.5 flex h-9 items-center justify-center gap-1.5 rounded bg-primary text-xs font-semibold text-white',
              'opacity-0 translate-y-1.5 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0',
              'hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50',
            )}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {isOutOfStock ? 'Rupture' : 'Ajouter au panier'}
          </button>
        )}
      </div>

      {/* Contenu */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brandName && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-subtle">
            {product.brandName}
          </span>
        )}

        <h3 className="line-clamp-2 text-[13px] leading-snug text-text transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        <Rating
          value={product.rating}
          size="sm"
          showValue
          reviewCount={product.reviewCount}
        />

        <div className="mt-auto pt-2">
          <PriceDisplay price={product.price} oldPrice={product.oldPrice} size="md" />
        </div>
      </div>
    </Link>
  )
}
