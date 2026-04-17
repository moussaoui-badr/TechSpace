import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Check,
  CheckCircle2,
  Headphones,
  Heart,
  HelpCircle,
  Package,
  Shield,
  ShoppingCart,
  Truck,
  Wallet,
} from 'lucide-react'
import type { Product, ProductSpecification, Review } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { ProductCard } from '@/components/ui/ProductCard'
import { QuantitySelector } from '@/components/ui/QuantitySelector'
import { Rating } from '@/components/ui/Rating'
import { Skeleton } from '@/components/ui/Skeleton'
import { getProductBySlug, getReviewsByProductId, getSimilarProducts } from '@/api'
import { flatCategories } from '@/data/categories'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useHistoryStore } from '@/stores/historyStore'
import { cn } from '@/utils/cn'

type TabKey = 'description' | 'specs' | 'reviews' | 'qa'

interface ProductQA {
  id: string
  question: string
  askedBy: string
  askedAt: string
  answer: string
  answeredBy: string
  answeredAt: string
  helpfulCount: number
  isVerified: boolean
}

const MOCK_QA: ProductQA[] = [
  {
    id: 'q1',
    question: 'Compatible avec une carte mère B650 ou il faut absolument une X670 ?',
    askedBy: 'Yassine R.',
    askedAt: '2026-03-12',
    answer:
      'Oui, totalement compatible avec une B650 — un BIOS récent (AGESA 1.2.0.1+) suffit. Vérifiez juste la liste QVL de votre carte mère pour la RAM.',
    answeredBy: 'Équipe TechSpace',
    answeredAt: '2026-03-13',
    helpfulCount: 24,
    isVerified: true,
  },
  {
    id: 'q2',
    question: 'La livraison sur Marrakech prend combien de jours en moyenne ?',
    askedBy: 'Soukaina M.',
    askedAt: '2026-03-08',
    answer:
      'Comptez 2 à 3 jours ouvrés sur Marrakech via notre transporteur partenaire, paiement à la livraison disponible.',
    answeredBy: 'Équipe TechSpace',
    answeredAt: '2026-03-09',
    helpfulCount: 18,
    isVerified: true,
  },
  {
    id: 'q3',
    question: "Garantie internationale ou uniquement valable au Maroc ?",
    askedBy: 'Karim B.',
    askedAt: '2026-02-28',
    answer:
      'Garantie constructeur officielle 2 ans valable mondialement. Le SAV TechSpace gère la prise en charge depuis le Maroc.',
    answeredBy: 'Équipe TechSpace',
    answeredAt: '2026-03-01',
    helpfulCount: 11,
    isVerified: true,
  },
]

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [similar, setSimilar] = useState<Product[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [activeTab, setActiveTab] = useState<TabKey>('description')

  const addToCart = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistIds = useWishlistStore((s) => s.productIds)
  const trackHistory = useHistoryStore((s) => s.track)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setActiveImage(0)
    setQuantity(1)
    setActiveTab('description')
    getProductBySlug(slug).then(async (p) => {
      if (!p) {
        setProduct(null)
        setLoading(false)
        return
      }
      const [sim, revs] = await Promise.all([
        getSimilarProducts(p, 4),
        getReviewsByProductId(p.id),
      ])
      setProduct(p)
      setSimilar(sim)
      setReviews(revs)
      setLoading(false)
      trackHistory(p)
    })
  }, [slug, trackHistory])

  const specsByGroup = useMemo(() => {
    const map = new Map<string, ProductSpecification[]>()
    if (!product) return map
    product.specifications.forEach((spec) => {
      const list = map.get(spec.group) ?? []
      list.push(spec)
      map.set(spec.group, list)
    })
    return map
  }, [product])

  if (loading) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold text-text">Produit introuvable</h1>
        <p className="mt-2 text-sm text-text-muted">
          Le produit recherche n existe pas ou a ete retire du catalogue.
        </p>
        <Link to="/products" className="mt-6 inline-flex">
          <Button>Retour au catalogue</Button>
        </Link>
      </div>
    )
  }

  const category = flatCategories.find((c) => c.id === product.categoryId)
  const parentCategory = category?.parentId
    ? flatCategories.find((c) => c.id === category.parentId)
    : undefined

  const crumbs: { label: string; to?: string }[] = [{ label: 'Catalogue', to: '/products' }]
  if (parentCategory) crumbs.push({ label: parentCategory.name, to: `/category/${parentCategory.slug}` })
  if (category) crumbs.push({ label: category.name, to: `/category/${category.slug}` })
  crumbs.push({ label: product.name })

  const isInWishlist = wishlistIds.includes(product.id)
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 3

  function handleAddToCart() {
    if (!product) return
    addToCart(product, quantity)
  }

  function handleBuyNow() {
    if (!product) return
    addToCart(product, quantity)
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb items={crumbs} className="mb-6" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12">
        {/* Galerie */}
        <div>
          <div
            className="relative overflow-hidden rounded-2xl border border-border bg-surface"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="absolute left-4 top-4 z-10 flex flex-col gap-1.5">
              {product.oldPrice && product.oldPrice > product.price && (
                <Badge variant="danger">Promo</Badge>
              )}
              {isLowStock && <Badge variant="warning">Stock limite</Badge>}
              {isOutOfStock && <Badge variant="outline">Rupture</Badge>}
            </div>
            <img
              src={product.images[activeImage] ?? product.mainImage}
              alt={product.name}
              className="aspect-square w-full object-contain p-8"
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.slice(0, 4).map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  aria-label={`Image ${idx + 1}`}
                  className={cn(
                    'overflow-hidden rounded-lg border bg-surface transition-all',
                    activeImage === idx
                      ? 'border-primary shadow-md'
                      : 'border-border hover:border-primary/60',
                  )}
                >
                  <img
                    src={img}
                    alt=""
                    className="aspect-square w-full object-contain p-3"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className="flex flex-col gap-5">
          {product.brandName && (
            <Link
              to={`/products?brands=${product.brandName.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-xs font-semibold uppercase tracking-wider text-primary"
            >
              {product.brandName}
            </Link>
          )}

          <h1 className="font-display text-3xl font-bold leading-tight text-text md:text-4xl">
            {product.name}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <Rating value={product.rating} size="md" showValue reviewCount={product.reviewCount} />
            <span className="text-xs text-text-muted">SKU : {product.sku}</span>
          </div>

          <p className="text-base text-text-muted">{product.shortDescription}</p>

          {/* Specs highlights */}
          {product.specifications.length > 0 && (
            <ul className="grid gap-2 rounded-lg border border-border bg-surface p-4 sm:grid-cols-2">
              {product.specifications.slice(0, 4).map((spec) => (
                <li key={`${spec.group}-${spec.key}`} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-text-muted">
                    <strong className="text-text">{spec.key} :</strong> {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Prix + stock */}
          <div
            className="rounded-xl border border-border bg-surface p-5"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <PriceDisplay price={product.price} oldPrice={product.oldPrice} size="lg" />
            <p
              className={cn(
                'mt-3 flex items-center gap-2 text-sm font-medium',
                isOutOfStock ? 'text-danger' : 'text-success',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-2 w-2 rounded-full',
                  isOutOfStock ? 'bg-danger' : 'bg-success',
                )}
              />
              {isOutOfStock
                ? 'Rupture de stock'
                : isLowStock
                  ? `Seulement ${product.stock} en stock`
                  : 'En stock — livraison rapide'}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <QuantitySelector
                value={quantity}
                min={1}
                max={Math.max(1, product.stock)}
                onChange={setQuantity}
              />
              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                leftIcon={<ShoppingCart className="h-4 w-4" />}
                className="flex-1 sm:flex-none"
              >
                Ajouter au panier
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 sm:flex-none"
              >
                Acheter maintenant
              </Button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                aria-label="Ajouter aux favoris"
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-md border transition-colors',
                  isInWishlist
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-text-muted hover:border-primary hover:text-primary',
                )}
              >
                <Heart className="h-5 w-5" fill={isInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="grid gap-2 sm:grid-cols-2">
            <ServiceItem icon={Truck} title="Livraison Maroc" description="2 a 4 jours partout." />
            <ServiceItem icon={Wallet} title="Paiement livraison" description="Cash a la reception." />
            <ServiceItem icon={Shield} title="Garantie officielle" description="Produit 100% authentique." />
            <ServiceItem icon={Headphones} title="Support 7j/7" description="Assistance technique." />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <section className="mt-14">
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          <TabButton active={activeTab === 'description'} onClick={() => setActiveTab('description')}>
            Description
          </TabButton>
          <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')}>
            Specifications
          </TabButton>
          <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')}>
            Avis ({reviews.length})
          </TabButton>
          <TabButton active={activeTab === 'qa'} onClick={() => setActiveTab('qa')}>
            Questions ({MOCK_QA.length})
          </TabButton>
        </div>

        <div className="mt-6">
          {activeTab === 'description' && (
            <div className="prose max-w-3xl text-sm leading-relaxed text-text-muted sm:text-base">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="space-y-6">
              {Array.from(specsByGroup.entries()).map(([group, specs]) => (
                <div
                  key={group}
                  className="overflow-hidden rounded-lg border border-border bg-surface"
                >
                  <div className="border-b border-border bg-surface-hover px-5 py-3">
                    <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text">
                      {group}
                    </h3>
                  </div>
                  <dl className="divide-y divide-border">
                    {specs.map((spec) => (
                      <div
                        key={spec.key}
                        className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[220px_1fr] sm:gap-4"
                      >
                        <dt className="text-sm font-medium text-text-muted">{spec.key}</dt>
                        <dd className="text-sm text-text">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border bg-surface/40 p-8 text-center text-sm text-text-muted">
                  Aucun avis pour ce produit. Soyez le premier a donner votre opinion.
                </div>
              ) : (
                reviews.map((r) => (
                  <article
                    key={r.id}
                    className="rounded-lg border border-border bg-surface p-5"
                    style={{ boxShadow: 'var(--shadow-card)' }}
                  >
                    <header className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {r.userName.slice(0, 1)}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-text">{r.userName}</p>
                          <time className="text-xs text-text-muted">
                            {new Date(r.createdAt).toLocaleDateString('fr-MA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </time>
                        </div>
                      </div>
                      <Rating value={r.rating} size="sm" />
                    </header>
                    <p className="mt-3 text-sm text-text-muted">{r.comment}</p>
                  </article>
                ))
              )}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-lg border border-border bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <HelpCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-text">Une question sur ce produit ?</p>
                    <p className="text-xs text-text-muted">
                      Notre équipe répond généralement sous 24h ouvrées.
                    </p>
                  </div>
                </div>
                <Button size="sm">Poser une question</Button>
              </div>

              {MOCK_QA.map((qa) => (
                <article
                  key={qa.id}
                  className="rounded-lg border border-border bg-surface p-5"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      Q
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text">{qa.question}</p>
                      <p className="mt-0.5 text-[11px] text-text-subtle">
                        Posée par {qa.askedBy} —{' '}
                        {new Date(qa.askedAt).toLocaleDateString('fr-MA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-xs font-bold text-success">
                      R
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-text-muted">{qa.answer}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-text-subtle">
                        <span className="inline-flex items-center gap-1 font-semibold text-text">
                          {qa.answeredBy}
                          {qa.isVerified && (
                            <CheckCircle2 className="h-3 w-3 text-success" aria-label="Réponse vérifiée" />
                          )}
                        </span>
                        <span>
                          {new Date(qa.answeredAt).toLocaleDateString('fr-MA', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                        <button
                          type="button"
                          className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 font-semibold text-text-muted transition-colors hover:border-primary hover:text-primary"
                        >
                          Utile ({qa.helpfulCount})
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Produits similaires */}
      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-display text-2xl font-bold leading-tight text-text md:text-3xl">
            Produits similaires
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {similar.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={(prod) => addToCart(prod, 1)}
                onToggleWishlist={(prod) => toggleWishlist(prod.id)}
                isInWishlist={wishlistIds.includes(p.id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ======== Helpers ========

interface ServiceItemProps {
  icon: typeof Package
  title: string
  description: string
}

function ServiceItem({ icon: Icon, title, description }: ServiceItemProps) {
  return (
    <div className="flex items-start gap-2.5 rounded-md border border-border bg-surface/50 p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-semibold text-text">{title}</p>
        <p className="text-xs text-text-muted">{description}</p>
      </div>
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

function TabButton({ active, onClick, children }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative whitespace-nowrap px-5 py-3 text-sm font-semibold transition-colors',
        active ? 'text-primary' : 'text-text-muted hover:text-text',
      )}
    >
      {children}
      {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
    </button>
  )
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Skeleton className="mb-6 h-4 w-48" />
      <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  )
}
