import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { useCartStore, cartSubtotal } from '@/stores/cartStore'
import { formatPrice } from '@/utils/formatPrice'

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 49

export function CartPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clear = useCartStore((s) => s.clear)
  const subtotal = cartSubtotal(items)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-surface">
          <ShoppingBag className="h-10 w-10 text-text-subtle" />
        </span>
        <h1 className="mt-6 text-2xl font-bold text-text">Votre panier est vide</h1>
        <p className="mt-2 text-text-muted">
          Parcourez notre catalogue pour trouver votre bonheur.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(242,104,38,0.45)] transition-colors hover:bg-primary-hover"
        >
          Voir le catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">
          Mon panier{' '}
          <span className="text-lg font-normal text-text-muted">({items.length} article{items.length > 1 ? 's' : ''})</span>
        </h1>
        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 text-sm text-danger hover:underline"
        >
          <Trash2 className="h-4 w-4" />
          Vider le panier
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Liste des articles */}
        <div className="space-y-3">
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex gap-4 rounded-lg border border-border bg-background p-4 shadow-card"
            >
              <Link to={`/products/${product.slug}`} className="shrink-0">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="h-20 w-20 rounded-md object-contain sm:h-24 sm:w-24"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-2">
                <Link
                  to={`/products/${product.slug}`}
                  className="text-sm font-semibold leading-tight text-text hover:text-primary"
                >
                  {product.name}
                </Link>
                {product.brandName && (
                  <p className="text-xs text-text-muted">{product.brandName}</p>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <QuantitySelector
                    value={quantity}
                    max={product.stock}
                    onChange={(q) => updateQuantity(product.id, q)}
                  />
                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold text-primary">
                      {formatPrice(product.price * quantity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label="Supprimer l'article"
                      className="text-text-subtle transition-colors hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Récapitulatif */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-background p-5 shadow-card">
            <h2 className="text-base font-bold text-text">Récapitulatif</h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Sous-total</span>
                <span className="font-medium text-text">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Livraison</span>
                {shipping === 0 ? (
                  <span className="font-medium text-success">Gratuite</span>
                ) : (
                  <span className="font-medium text-text">{formatPrice(shipping)}</span>
                )}
              </div>
              {shipping > 0 && (
                <p className="text-xs text-text-subtle">
                  Livraison gratuite à partir de {formatPrice(SHIPPING_THRESHOLD)}
                </p>
              )}
            </div>

            <hr className="my-4 border-border" />

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-text">Total</span>
              <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
            </div>

            <Button
              className="mt-4 w-full"
              onClick={() => navigate('/checkout')}
            >
              Commander
            </Button>

            <Link
              to="/products"
              className="mt-3 flex items-center justify-center text-sm text-text-muted hover:text-primary hover:underline"
            >
              Continuer mes achats
            </Link>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-xs text-text-muted">
            <p className="font-medium text-text">Paiement à la livraison</p>
            <p className="mt-1">Payez en espèces ou par carte à la réception de votre commande. Aucune carte requise en ligne.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
