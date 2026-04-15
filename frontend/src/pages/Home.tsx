import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Flame,
  Headphones,
  Shield,
  Sparkles,
  Star,
  Truck,
  Wallet,
  Zap,
} from 'lucide-react'
import type { Banner, Brand, Product } from '@/types'
import { HeroSlider } from '@/components/ui/HeroSlider'
import { ProductCard } from '@/components/ui/ProductCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { Button } from '@/components/ui/Button'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'
import { getBanners, getFeaturedProducts, getPromoProducts, getBrands } from '@/api'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

const trustItems = [
  { icon: Truck, title: 'Livraison rapide', description: 'Partout au Maroc en 2 a 4 jours.' },
  { icon: Shield, title: 'Garantie constructeur', description: 'Produits 100% authentiques.' },
  { icon: Headphones, title: 'SAV reactif', description: 'Support technique 7j/7.' },
  { icon: Wallet, title: 'Paiement a la livraison', description: 'Payez quand vous recevez.' },
]

export function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [promos, setPromos] = useState<Product[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  const addToCart = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistIds = useWishlistStore((s) => s.productIds)

  useEffect(() => {
    let alive = true
    Promise.all([getBanners(), getFeaturedProducts(8), getPromoProducts(4), getBrands()]).then(
      ([b, f, p, br]) => {
        if (!alive) return
        setBanners(b)
        setFeatured(f)
        setPromos(p)
        setBrands(br)
        setLoading(false)
      },
    )
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6 lg:space-y-20 lg:py-12">
      {/* 1. Hero slider */}
      {loading ? (
        <Skeleton className="h-[300px] w-full rounded-2xl lg:h-[380px]" />
      ) : (
        <HeroSlider banners={banners} />
      )}

      {/* 2. Categories grid */}
      <section>
        <SectionHeader
          eyebrow="Nos rayons"
          title="Categories populaires"
          description="Trouvez rapidement ce qui vous correspond."
          linkTo="/products"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-surface p-4 text-center transition-all hover:-translate-y-1 hover:border-primary/60"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <span
                className="flex h-14 w-14 items-center justify-center rounded-full text-2xl transition-all group-hover:scale-110"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(242,104,38,0.15) 0%, rgba(242,104,38,0.05) 100%)',
                }}
              >
                {cat.icon}
              </span>
              <span className="text-xs font-semibold text-text transition-colors group-hover:text-primary sm:text-sm">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Produits vedettes */}
      <section>
        <SectionHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Selection TechSpace
            </span>
          }
          title="Produits vedettes"
          description="Les coups de coeur de notre equipe."
          linkTo="/products"
        />
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={(product) => addToCart(product, 1)}
                onToggleWishlist={(product) => toggleWishlist(product.id)}
                isInWishlist={wishlistIds.includes(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 4. Bandeau promo */}
      <section
        className="relative overflow-hidden rounded-2xl border border-primary/30 p-8 md:p-12"
        style={{
          background:
            'radial-gradient(circle at 100% 0%, rgba(242,104,38,0.25) 0%, transparent 60%), radial-gradient(circle at 0% 100%, rgba(0,75,125,0.35) 0%, transparent 55%), linear-gradient(135deg, #1A1A2E 0%, #0F0F1A 100%)',
        }}
      >
        <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Flame className="h-3.5 w-3.5" />
              Offres du moment
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-text md:text-4xl">
              Payez a la livraison, <span className="text-primary">sans carte bancaire</span>.
            </h2>
            <p className="mt-3 max-w-lg text-sm text-text-muted md:text-base">
              Recevez votre commande chez vous, inspectez le colis, puis payez en especes. Zero
              risque, zero stress.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/products?sort=promo">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Voir les promos
              </Button>
            </Link>
            <Link to="/category/pc-gamer">
              <Button size="lg" variant="outline">
                Configurations PC
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Offres speciales (promos) */}
      <section>
        <SectionHeader
          eyebrow={
            <span className="inline-flex items-center gap-1.5 text-danger">
              <Flame className="h-3.5 w-3.5" />
              Stock limite
            </span>
          }
          title="Offres speciales"
          description="Profitez des reductions avant rupture de stock."
          linkTo="/products?sort=promo"
        />
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {promos.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={(product) => addToCart(product, 1)}
                onToggleWishlist={(product) => toggleWishlist(product.id)}
                isInWishlist={wishlistIds.includes(p.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 6. Marques */}
      {!loading && brands.length > 0 && (
        <section>
          <SectionHeader
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                Partenaires
              </span>
            }
            title="Nos marques"
            description="Uniquement des produits officiels et garantis."
          />
          <div
            className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-6 sm:gap-6 sm:p-8"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            {brands.map((b) => (
              <div
                key={b.id}
                className="flex h-14 w-28 items-center justify-center rounded-md border border-border/50 bg-background/40 px-4 text-sm font-semibold text-text-muted transition-colors hover:border-primary/50 hover:text-text sm:h-16 sm:w-36"
              >
                {b.name}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Trust badges */}
      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="group flex items-start gap-3 rounded-xl border border-border bg-surface p-5 transition-all hover:border-primary/50"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-primary transition-transform group-hover:scale-110"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(242,104,38,0.15) 0%, rgba(242,104,38,0.05) 100%)',
                }}
              >
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-text">{title}</h3>
                <p className="mt-1 text-sm text-text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Bandeau assemblage */}
      <section
        className="relative overflow-hidden rounded-2xl border border-border p-8 md:p-12"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,75,125,0.25) 0%, rgba(15,15,26,0.95) 50%, rgba(242,104,38,0.2) 100%)',
        }}
      >
        <div className="relative z-10 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <Zap className="h-3.5 w-3.5" />
              Service TechSpace
            </span>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-text md:text-3xl">
              On assemble votre PC Gamer. Vous jouez des la livraison.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-text-muted">
              Nos techniciens montent, testent et garantissent votre configuration. Livraison
              et installation disponibles a Casablanca, Rabat, Marrakech et plus.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <Link to="/category/pc-gamer">
              <Button size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Configurer mon PC
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="ghost">
                Nous contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

interface SectionHeaderProps {
  eyebrow?: React.ReactNode
  title: string
  description?: string
  linkTo?: string
  linkLabel?: string
}

function SectionHeader({
  eyebrow,
  title,
  description,
  linkTo,
  linkLabel = 'Voir tout',
}: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-text md:text-3xl">
          {title}
        </h2>
        {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          {linkLabel} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4"
        >
          <Skeleton className="aspect-square w-full rounded" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  )
}
