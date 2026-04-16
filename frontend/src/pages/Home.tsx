import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Download,
  Flame,
  Gift,
  Headphones,
  Mail,
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
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'
import { getBanners, getFeaturedProducts, getPromoProducts, getBrands } from '@/api'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { cn } from '@/utils/cn'

const trustItems = [
  { icon: Truck, title: 'Livraison rapide', description: 'Partout au Maroc en 2 a 4 jours.' },
  { icon: Shield, title: 'Garantie constructeur', description: 'Produits 100% authentiques.' },
  { icon: Headphones, title: 'SAV reactif', description: 'Support technique 7j/7.' },
  { icon: Wallet, title: 'Paiement a la livraison', description: 'Payez quand vous recevez.' },
]

interface ComboItem {
  name: string
  spec: string
  price: number
  oldPrice: number
  imageUrl: string
  href: string
}

interface ComboGroup {
  key: string
  label: string
  savings: number
  items: ComboItem[]
}

const COMBO_GROUPS: ComboGroup[] = [
  {
    key: 'amd',
    label: 'AMD Ryzen',
    savings: 1250,
    items: [
      {
        name: 'Combo Ryzen 7 7800X3D',
        spec: 'CPU + B650 + 32GB DDR5',
        price: 5990,
        oldPrice: 7240,
        imageUrl: 'https://placehold.co/240x180/F5F5F5/1E3A5F?text=Ryzen+7',
        href: '/products?search=ryzen+7',
      },
      {
        name: 'Combo Ryzen 9 7900X',
        spec: 'CPU + X670 + 32GB DDR5',
        price: 7290,
        oldPrice: 8540,
        imageUrl: 'https://placehold.co/240x180/F5F5F5/1E3A5F?text=Ryzen+9',
        href: '/products?search=ryzen+9',
      },
    ],
  },
  {
    key: 'intel',
    label: 'Intel Core',
    savings: 980,
    items: [
      {
        name: 'Combo Core i7-14700K',
        spec: 'CPU + Z790 + 32GB DDR5',
        price: 6490,
        oldPrice: 7470,
        imageUrl: 'https://placehold.co/240x180/F5F5F5/1E3A5F?text=Core+i7',
        href: '/products?search=i7',
      },
      {
        name: 'Combo Core i9-14900K',
        spec: 'CPU + Z790 Gaming + 64GB',
        price: 9890,
        oldPrice: 10870,
        imageUrl: 'https://placehold.co/240x180/F5F5F5/1E3A5F?text=Core+i9',
        href: '/products?search=i9',
      },
    ],
  },
  {
    key: 'desktop',
    label: 'Desktop Computers',
    savings: 650,
    items: [
      {
        name: 'PC Gamer RTX 4070 Ti',
        spec: 'Ryzen 7 + RTX 4070 Ti SUPER',
        price: 14890,
        oldPrice: 15540,
        imageUrl: 'https://placehold.co/240x180/F5F5F5/1E3A5F?text=PC+Gamer',
        href: '/category/pc-gamer',
      },
      {
        name: 'PC Gamer RTX 4080',
        spec: 'Core i9 + RTX 4080 SUPER',
        price: 22490,
        oldPrice: 23140,
        imageUrl: 'https://placehold.co/240x180/F5F5F5/1E3A5F?text=PC+Pro',
        href: '/category/pc-gamer',
      },
    ],
  },
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

  const shellShocker = useMemo(() => featured.slice(0, 6), [featured])

  return (
    <div className="bg-surface">
      {/* ============ Hero row : sidebar + banner ============ */}
      <section className="mx-auto max-w-7xl px-3 pt-4 sm:px-4">
        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Sidebar categories — style Newegg (fond bleu fonce, texte blanc) */}
          <aside className="hidden overflow-hidden rounded-md bg-secondary shadow-sm lg:block">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
              <span className="text-[13px] font-bold uppercase tracking-wide">Categories</span>
            </div>
            <ul>
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="group flex items-center justify-between border-b border-white/5 px-4 py-2.5 text-[13px] text-white/90 transition-colors hover:bg-white/10 hover:text-accent last:border-b-0"
                  >
                    <span className="flex items-center gap-2.5">
                      <span aria-hidden className="text-base">{cat.icon}</span>
                      {cat.label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-white/50 transition-colors group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Hero banner */}
          <div>
            {loading ? (
              <Skeleton className="h-[260px] w-full rounded-md lg:h-[340px]" />
            ) : (
              <HeroSlider banners={banners} />
            )}
          </div>
        </div>
      </section>

      {/* ============ Combo Up Savings (tabs AMD/Intel/Desktop) ============ */}
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <ComboUpSection />
      </section>

      {/* ============ Shell Shocker (deals flash) ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                <Zap className="h-3.5 w-3.5" />
                Shell Shocker
              </span>
              <h2 className="mt-2 font-display text-2xl font-black leading-tight text-text md:text-3xl">
                Deals eclairs, stocks limites
              </h2>
              <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                <Clock className="h-4 w-4 text-primary" />
                Nouveaux deals toutes les 6 heures.
              </p>
            </div>
            <Link
              to="/products?sort=promo"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Voir tous les deals <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {shellShocker.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-md border border-border bg-background transition-all hover:border-primary hover:shadow-md"
                >
                  <div className="relative aspect-square bg-surface">
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                    {p.oldPrice && p.oldPrice > p.price && (
                      <span className="absolute left-2 top-2 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                        -{Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1 border-t border-border p-2.5">
                    <p className="line-clamp-2 text-xs font-medium text-text transition-colors group-hover:text-primary">
                      {p.name}
                    </p>
                    <PriceDisplay price={p.price} oldPrice={p.oldPrice} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============ Categories tiles ============ */}
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <SectionHeader
          eyebrow="Nos rayons"
          title="Toutes les categories"
          description="Trouvez rapidement ce qui vous correspond."
          linkTo="/products"
        />
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2.5 rounded-md border border-border bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md sm:p-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-2xl transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white sm:h-14 sm:w-14">
                {cat.icon}
              </span>
              <span className="text-[11px] font-semibold text-text transition-colors group-hover:text-primary sm:text-xs">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Produits vedettes ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
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
        </div>
      </section>

      {/* ============ Bandeau promo paiement livraison ============ */}
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <div
          className="relative overflow-hidden rounded-md border-l-4 border-accent bg-secondary p-6 text-white md:p-10"
        >
          <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-sm bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-text">
                <Flame className="h-3.5 w-3.5" />
                Offres du moment
              </div>
              <h2 className="text-2xl font-black leading-tight text-white md:text-4xl">
                Payez a la livraison, <span className="text-accent">sans carte bancaire</span>.
              </h2>
              <p className="mt-3 max-w-lg text-sm text-white/85 md:text-base">
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
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-secondary">
                  Configurations PC
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Offres speciales (stock limite) ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
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
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
        </div>
      </section>

      {/* ============ Featured Brands ============ */}
      {!loading && brands.length > 0 && (
        <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
          <SectionHeader
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5" />
                Partenaires officiels
              </span>
            }
            title="Nos marques"
            description="Uniquement des produits officiels et garantis."
          />
          <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-background p-4 sm:grid-cols-4 md:grid-cols-6">
            {brands.map((b) => (
              <Link
                key={b.id}
                to={`/products?brands=${b.slug}`}
                className="flex h-16 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-bold text-text-muted transition-all hover:border-primary hover:text-primary hover:shadow-sm"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ============ Trust badges ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group flex items-start gap-3 rounded-md border border-border bg-background p-4 transition-all hover:border-primary hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary transition-all group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-text">{title}</h3>
                  <p className="mt-0.5 text-xs text-text-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Bandeau assemblage ============ */}
      <section className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
        <div className="relative overflow-hidden rounded-md bg-accent p-6 md:p-10">
          <div className="relative z-10 grid gap-5 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-sm bg-secondary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                <Zap className="h-3.5 w-3.5" />
                Service TechSpace
              </span>
              <h2 className="mt-3 text-2xl font-black leading-tight text-text md:text-3xl">
                On assemble votre PC Gamer. Vous jouez des la livraison.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-text/80">
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
                <Button size="lg" variant="outline" className="border-text text-text hover:bg-text hover:text-accent">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Newsletter + App ============ */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-3 py-10 sm:px-4 lg:grid-cols-2">
          <NewsletterBlock />
          <AppBlock />
        </div>
      </section>
    </div>
  )
}

// ======== Helpers ========

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
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-1 font-display text-xl font-black leading-tight text-text md:text-2xl">
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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-md border border-border bg-surface p-4"
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

function NewsletterBlock() {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-surface p-6 md:p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white">
        <Mail className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-display text-xl font-black text-text">
          Bons plans & bons conseils
        </h3>
        <p className="mt-1 text-sm text-text-muted">
          Recevez les promos exclusives, les tests hardware et les nouveautes 1 fois par semaine.
        </p>
      </div>
      <form className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          placeholder="Votre adresse email"
          className="h-11 flex-1 rounded-md border border-border bg-background px-4 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
        />
        <Button type="submit" size="md">
          S abonner
        </Button>
      </form>
      <p className="text-[11px] text-text-subtle">
        En vous inscrivant, vous acceptez notre politique de confidentialite.
      </p>
    </div>
  )
}

function ComboUpSection() {
  const [activeKey, setActiveKey] = useState<string>(COMBO_GROUPS[0].key)
  const active = COMBO_GROUPS.find((g) => g.key === activeKey) ?? COMBO_GROUPS[0]

  return (
    <div className="rounded-md border border-border bg-background shadow-sm">
      {/* Header avec eyebrow + tabs */}
      <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <Gift className="h-3 w-3" />
            Combo Up & Save
          </span>
          <div>
            <p className="text-[13px] font-semibold text-text">
              Combo up savings {active.savings.toLocaleString('fr-FR')} DH
            </p>
            <p className="text-[11px] text-text-muted">
              Economisez en achetant plusieurs produits compatibles.
            </p>
          </div>
        </div>
        <Link
          to="/products?sort=combos"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Plus d'options <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border px-3 py-2">
        {COMBO_GROUPS.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setActiveKey(g.key)}
            className={cn(
              'rounded-md px-3 py-1.5 text-[12.5px] font-semibold transition-colors',
              activeKey === g.key
                ? 'bg-primary-soft text-primary'
                : 'text-text-muted hover:text-text',
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Produits combos */}
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {active.items.map((item) => {
          const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
          return (
            <Link
              key={item.name}
              to={item.href}
              className="group flex gap-3 rounded-md border border-border bg-background p-3 transition-all hover:border-primary hover:shadow-md"
            >
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-contain p-2"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="line-clamp-2 text-[13px] font-semibold text-text transition-colors group-hover:text-primary">
                  {item.name}
                </p>
                <p className="text-[11px] text-text-muted">{item.spec}</p>
                <div className="mt-auto flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-text-subtle line-through">
                      {item.oldPrice.toLocaleString('fr-FR')} DH
                    </p>
                    <p className="text-lg font-black text-primary">
                      {item.price.toLocaleString('fr-FR')}{' '}
                      <span className="text-[11px] font-semibold text-text-muted">DH</span>
                    </p>
                  </div>
                  {discount > 0 && (
                    <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-bold text-text">
                      -{discount}%
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function AppBlock() {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-md bg-secondary p-6 text-white md:p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-text">
        <Download className="h-5 w-5" />
      </span>
      <div>
        <h3 className="font-display text-xl font-black text-white">
          Telechargez l application TechSpace
        </h3>
        <p className="mt-1 text-sm text-white/80">
          Suivi commande en temps reel, alertes promo et paiement en 1 tap. Disponible bientot
          sur iOS et Android.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 text-sm font-semibold text-white/80">
          <Download className="h-4 w-4" /> iOS bientot
        </span>
        <span className="inline-flex h-10 items-center gap-2 rounded-md border border-white/20 bg-white/5 px-3 text-sm font-semibold text-white/80">
          <Download className="h-4 w-4" /> Android bientot
        </span>
      </div>
    </div>
  )
}
