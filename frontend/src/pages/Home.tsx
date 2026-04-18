import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Blocks,
  BookOpen,
  Briefcase,
  Calculator,
  ChevronRight,
  Clock,
  Cpu,
  Disc,
  Download,
  Dumbbell,
  Flame,
  Gamepad2,
  Gift,
  GraduationCap,
  Headphones,
  LayoutGrid,
  Mail,
  Monitor,
  Mouse,
  Plug,
  Rocket,
  Server,
  Shield,
  Sparkles,
  Star,
  Tag,
  Trees,
  TrendingDown,
  Truck,
  Tv,
  Wallet,
  Wifi,
  Wrench,
  Zap,
} from 'lucide-react'

const SIDEBAR_ICONS: Record<string, React.ReactNode> = {
  'components-storage': <Cpu className="h-[18px] w-[18px]" />,
  'computer-systems': <Monitor className="h-[18px] w-[18px]" />,
  'computer-peripherals': <Mouse className="h-[18px] w-[18px]" />,
  'server-components': <Server className="h-[18px] w-[18px]" />,
  'appliances': <Plug className="h-[18px] w-[18px]" />,
  'electronics': <Tv className="h-[18px] w-[18px]" />,
  'gaming-vr': <Gamepad2 className="h-[18px] w-[18px]" />,
  'networking': <Wifi className="h-[18px] w-[18px]" />,
  'smart-home-security': <Shield className="h-[18px] w-[18px]" />,
  'office-solutions': <Briefcase className="h-[18px] w-[18px]" />,
  'software-services': <Disc className="h-[18px] w-[18px]" />,
  'automotive-tools': <Wrench className="h-[18px] w-[18px]" />,
  'home-outdoors': <Trees className="h-[18px] w-[18px]" />,
  'health-sports': <Dumbbell className="h-[18px] w-[18px]" />,
  'toys-drones-maker': <Blocks className="h-[18px] w-[18px]" />,
}
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
import { useHistoryStore } from '@/stores/historyStore'

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
      {/* ============ Hero row : sidebar + banner + promo tiles + combo up ============ */}
      <section className="mx-auto max-w-7xl px-3 pt-4 sm:px-4">
        <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          {/* Sidebar categories — style Newegg (fond bleu fonce, texte blanc, icones SVG) */}
          <aside className="hidden overflow-hidden rounded-md bg-secondary-light shadow-card lg:block lg:self-start">
            <div className="flex items-center justify-between border-b border-white/15 bg-secondary px-4 py-3 text-white">
              <span className="text-[12px] font-bold uppercase tracking-widest text-white/90">Catégories</span>
            </div>
            <ul>
              {NAV_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="group flex items-center justify-between border-b border-white/10 px-4 py-2.5 transition-colors hover:bg-white/10 last:border-b-0"
                  >
                    <span className="flex items-center gap-3 text-[13px] text-white/90 transition-colors group-hover:text-accent">
                      <span aria-hidden className="shrink-0 text-white/60 transition-colors group-hover:text-accent">
                        {SIDEBAR_ICONS[cat.slug] ?? <LayoutGrid className="h-[18px] w-[18px]" />}
                      </span>
                      {cat.label}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-white/35 transition-colors group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Colonne droite : hero + tuiles promo + combo up */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <Skeleton className="h-[260px] w-full rounded-md lg:h-[340px]" />
            ) : (
              <HeroSlider banners={banners} />
            )}

            <PromoTilesGrid />

            <ComboUpSection />
          </div>
        </div>
      </section>

      {/* ============ Promo Banner 1 — Power Supply Calculator ============ */}
      <section className="mx-auto max-w-7xl px-3 pt-8 sm:px-4">
        <PromoBanner banner={PROMO_BANNERS[0]} />
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

      {/* ============ Today's Best Deals (Newegg Select) ============ */}
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <TodayBestDeals products={promos} loading={loading} />
      </section>

      {/* ============ Carousel thématique : Gamer Paradise ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
          <CategoryCarousel config={CATEGORY_CAROUSELS[0]} products={featured} loading={loading} />
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
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7">
          {NAV_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-2.5 rounded-md border border-border bg-background p-3 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md sm:p-4"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white sm:h-14 sm:w-14">
                {SIDEBAR_ICONS[cat.slug] ?? <LayoutGrid className="h-5 w-5" />}
              </span>
              <span className="text-[11px] font-semibold text-text transition-colors group-hover:text-primary sm:text-xs">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ Promo Banner 2 — Optimize your work ============ */}
      <section className="mx-auto max-w-7xl px-3 sm:px-4">
        <PromoBanner banner={PROMO_BANNERS[1]} />
      </section>

      {/* ============ Carousel thématique : Écrans & Affichages ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
          <CategoryCarousel config={CATEGORY_CAROUSELS[1]} products={featured} loading={loading} />
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

      {/* ============ Promo Banner 3 — Gigabyte ============ */}
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <PromoBanner banner={PROMO_BANNERS[2]} />
      </section>

      {/* ============ Carousel thématique : Cartes mères ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
          <CategoryCarousel config={CATEGORY_CAROUSELS[2]} products={featured} loading={loading} />
        </div>
      </section>

      {/* ============ Featurettes grid 2×3 ============ */}
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <FeaturettesGrid />
      </section>

      {/* ============ Bandeau promo paiement livraison ============ */}
      <section className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
        <div
          className="relative overflow-hidden rounded-md border-l-4 border-accent bg-gradient-to-br from-secondary-light to-secondary-deep p-6 text-white md:p-10"
        >
          <div className="relative z-10 flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-sm bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary">
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

      {/* ============ Carousel thématique : Casques audio ============ */}
      <section className="bg-background">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-4">
          <CategoryCarousel config={CATEGORY_CAROUSELS[3]} products={promos} loading={loading} />
        </div>
      </section>

      {/* ============ Promo Banner 4 — ABS ============ */}
      <section className="mx-auto max-w-7xl px-3 py-4 sm:px-4">
        <PromoBanner banner={PROMO_BANNERS[3]} />
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
              <h2 className="mt-3 text-2xl font-black leading-tight text-secondary md:text-3xl">
                On assemble votre PC Gamer. Vous jouez des la livraison.
              </h2>
              <p className="mt-3 max-w-xl text-sm text-secondary/70">
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
                <Button size="lg" variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-accent">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Récemment vus (historique) ============ */}
      <RecentlyViewedSection />

      {/* ============ TechSpace Insider — éditorial / blog ============ */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
          <InsiderSection />
        </div>
      </section>

      {/* ============ Newsletter + App ============ */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl gap-4 px-3 py-10 sm:px-4 lg:grid-cols-2">
          <NewsletterBlock />
          <AppBlock />
        </div>
      </section>

      {/* ============ SEO descriptive section (bas de page) ============ */}
      <SeoSection />
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

interface PromoTile {
  title: string
  subtitle: string
  cta: string
  to: string
  gradient: string
  icon: React.ReactNode
  emphasis: string
}

const PROMO_TILES: PromoTile[] = [
  {
    title: 'Shell Shocker',
    subtitle: 'Deals éclairs, stocks limités',
    cta: 'Voir les deals',
    to: '/products?sort=promo',
    gradient: 'from-[#F26826] to-[#D9561C]',
    icon: <Zap className="h-4 w-4" />,
    emphasis: '-40%',
  },
  {
    title: 'PC Builder',
    subtitle: 'Montez votre config en 5 minutes',
    cta: 'Démarrer',
    to: '/pc-builder',
    gradient: 'from-secondary to-secondary-deep',
    icon: <Cpu className="h-4 w-4" />,
    emphasis: 'NEW',
  },
  {
    title: 'TechSpace Card',
    subtitle: '-10% permanent sur tout le site',
    cta: 'Adhérer',
    to: '/membership',
    gradient: 'from-[#13A971] to-[#0E8A5B]',
    icon: <Gift className="h-4 w-4" />,
    emphasis: '-10%',
  },
  {
    title: 'Gaming Zone',
    subtitle: 'Configurations pro joueurs',
    cta: 'Explorer',
    to: '/category/gaming-vr',
    gradient: 'from-[#1F4070] to-[#1B3758]',
    icon: <Gamepad2 className="h-4 w-4" />,
    emphasis: 'HOT',
  },
]

function PromoTilesGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {PROMO_TILES.map((tile) => (
        <Link
          key={tile.title}
          to={tile.to}
          className={`group relative flex min-h-[120px] flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br ${tile.gradient} p-4 text-white shadow-sm transition-all hover:shadow-md`}
        >
          <div className="flex items-start justify-between gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              {tile.icon}
            </span>
            <span className="rounded-sm bg-accent px-2 py-0.5 text-[10px] font-bold text-secondary">
              {tile.emphasis}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-black">{tile.title}</h3>
            <p className="mt-0.5 text-[11px] text-white/80">{tile.subtitle}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-accent transition-transform group-hover:translate-x-1">
              {tile.cta} <ArrowRight className="h-3 w-3" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function ComboUpSection() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          <Gift className="h-3.5 w-3.5" />
          Combo Up
        </span>
        <Link
          to="/products?sort=combos"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Plus d'options <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {COMBO_GROUPS.slice(0, 2).map((group) => (
          <ComboBlock key={group.key} group={group} />
        ))}
      </div>
    </div>
  )
}

function ComboBlock({ group }: { group: ComboGroup }) {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-background shadow-sm">
      <div className="flex items-center justify-between bg-secondary px-4 py-3 text-white">
        <div>
          <h3 className="text-sm font-bold">{group.label}</h3>
          <p className="text-[11px] text-white/70">
            Combo savings{' '}
            <span className="font-bold text-accent">
              {group.savings.toLocaleString('fr-FR')} DH
            </span>
          </p>
        </div>
        <Link
          to="/products?sort=combos"
          className="text-[11px] font-semibold text-accent transition-colors hover:text-white"
        >
          Voir tout
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {group.items.map((item) => {
          const discount = Math.round(((item.oldPrice - item.price) / item.oldPrice) * 100)
          return (
            <div
              key={item.name}
              className="group flex flex-col gap-2 rounded-md border border-border bg-background p-3 transition-all hover:border-primary hover:shadow-md"
            >
              <Link to={item.href} className="flex h-24 w-full items-center justify-center overflow-hidden rounded-md bg-surface">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </Link>
              <Link to={item.href} className="line-clamp-2 text-[12.5px] font-semibold text-text transition-colors hover:text-primary">
                {item.name}
              </Link>
              <p className="text-[11px] text-text-muted">{item.spec}</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[11px] text-text-subtle line-through">
                    {item.oldPrice.toLocaleString('fr-FR')} DH
                  </p>
                  <p className="text-base font-black text-primary">
                    {item.price.toLocaleString('fr-FR')}{' '}
                    <span className="text-[11px] font-semibold text-text-muted">DH</span>
                  </p>
                </div>
                {discount > 0 && (
                  <span className="rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-bold text-secondary">
                    -{discount}%
                  </span>
                )}
              </div>
              <div className="mt-1 flex gap-1.5">
                <Link
                  to="/pc-builder"
                  className="flex h-8 flex-1 items-center justify-center gap-1 rounded-md border border-primary bg-primary-soft text-[11px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
                >
                  <Cpu className="h-3 w-3" />
                  Configurer
                </Link>
                <Link
                  to={item.href}
                  className="flex h-8 flex-1 items-center justify-center gap-1 rounded-md bg-primary text-[11px] font-bold text-white transition-colors hover:bg-primary-hover"
                >
                  Voir
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AppBlock() {
  return (
    <div className="relative flex flex-col gap-4 overflow-hidden rounded-md bg-gradient-to-br from-secondary-light to-secondary-deep p-6 text-white md:p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent text-secondary">
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

// ================= Promo Banners (horizontaux 1150x320 — style Newegg) =================

interface PromoBannerData {
  eyebrow: string
  title: string
  subtitle: string
  cta: string
  to: string
  theme: 'dark' | 'orange' | 'blue' | 'purple'
  icon: React.ReactNode
}

const PROMO_BANNERS: PromoBannerData[] = [
  {
    eyebrow: 'Outil TechSpace',
    title: 'Trouvez votre alimentation idéale',
    subtitle: 'Calculateur de puissance : évitez les sous-dimensionnements et dimensionnez votre PSU en 2 minutes.',
    cta: 'Lancer le calculateur',
    to: '/pc-builder',
    theme: 'dark',
    icon: <Calculator className="h-6 w-6" />,
  },
  {
    eyebrow: 'DELL Latitude',
    title: 'Optimisez votre travail, redéfinissez votre jeu',
    subtitle: 'Portables pro & gaming avec écrans haute fréquence et processeurs Intel Core Ultra.',
    cta: 'Explorer DELL',
    to: '/products?brands=dell',
    theme: 'blue',
    icon: <Monitor className="h-6 w-6" />,
  },
  {
    eyebrow: 'GIGABYTE AORUS',
    title: 'Un simple changement pour une performance supérieure',
    subtitle: 'Cartes mères Z790 et X670E AORUS — connectivité Wi-Fi 7 et PCIe 5.0.',
    cta: 'Voir les cartes mères',
    to: '/category/components-storage',
    theme: 'purple',
    icon: <Cpu className="h-6 w-6" />,
  },
  {
    eyebrow: 'ABS Gaming PC',
    title: 'No Limit. No Rules. No Mercy.',
    subtitle: 'Configurations gaming assemblées au Maroc — RTX 40 Series & refroidissement liquide.',
    cta: 'Configurer mon PC',
    to: '/pc-builder',
    theme: 'orange',
    icon: <Flame className="h-6 w-6" />,
  },
]

const THEME_CLASSES: Record<PromoBannerData['theme'], { bg: string; accent: string }> = {
  dark: { bg: 'bg-gradient-to-r from-secondary-deep via-secondary to-secondary-light', accent: 'text-accent' },
  orange: { bg: 'bg-gradient-to-r from-[#F26826] via-[#D9561C] to-[#A93F0C]', accent: 'text-white' },
  blue: { bg: 'bg-gradient-to-r from-[#1F4070] via-[#2A5A8C] to-[#1B3758]', accent: 'text-accent' },
  purple: { bg: 'bg-gradient-to-r from-[#3A2A5C] via-[#5B3B8C] to-[#2E1F4D]', accent: 'text-accent' },
}

function PromoBanner({ banner }: { banner: PromoBannerData }) {
  const theme = THEME_CLASSES[banner.theme]
  return (
    <Link
      to={banner.to}
      className={`group relative flex min-h-[140px] flex-col justify-center gap-3 overflow-hidden rounded-md p-6 text-white shadow-sm transition-all hover:shadow-md md:min-h-[180px] md:flex-row md:items-center md:justify-between md:p-10 ${theme.bg}`}
    >
      <div className="flex max-w-2xl items-start gap-4">
        <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm md:flex">
          {banner.icon}
        </span>
        <div>
          <span className={`text-[11px] font-bold uppercase tracking-widest ${theme.accent}`}>
            {banner.eyebrow}
          </span>
          <h3 className="mt-1 text-lg font-black leading-tight md:text-2xl">{banner.title}</h3>
          <p className="mt-1 max-w-lg text-[13px] text-white/85">{banner.subtitle}</p>
        </div>
      </div>
      <span className="inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-md bg-white px-4 text-[13px] font-bold text-secondary transition-transform group-hover:translate-x-1 md:self-auto">
        {banner.cta} <ArrowRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

// ================= Category Carousels (Newegg "Gamer Paradise", "Monitors"...) =================

interface CategoryCarouselConfig {
  title: string
  eyebrow: string
  description: string
  linkTo: string
  slice: [number, number]
}

const CATEGORY_CAROUSELS: CategoryCarouselConfig[] = [
  {
    eyebrow: 'Gamer Paradise',
    title: 'Tout pour la performance gaming',
    description: 'Portables, GPU, périphériques et setup complet.',
    linkTo: '/category/gaming-vr',
    slice: [0, 8],
  },
  {
    eyebrow: 'Écrans & Affichages',
    title: 'Moniteurs haute fréquence et ultra-wide',
    description: 'De 144Hz à 360Hz, QHD, 4K et UltraWide.',
    linkTo: '/category/computer-peripherals',
    slice: [2, 10],
  },
  {
    eyebrow: 'Cartes mères',
    title: 'Motherboards nouvelle génération',
    description: 'Z790, X670E, AM5 et LGA 1700 — Wi-Fi 7.',
    linkTo: '/category/components-storage',
    slice: [1, 9],
  },
  {
    eyebrow: 'Casques audio',
    title: 'Immersion sonore gaming et Hi-Fi',
    description: 'Spatial Audio, ANC, drivers premium.',
    linkTo: '/category/computer-peripherals',
    slice: [0, 8],
  },
]

function CategoryCarousel({
  config,
  products,
  loading,
}: {
  config: CategoryCarouselConfig
  products: Product[]
  loading: boolean
}) {
  const [scrollRef, setScrollRef] = useState<HTMLDivElement | null>(null)
  const items = products.slice(config.slice[0], config.slice[1])

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef) return
    const amount = scrollRef.clientWidth * 0.8
    scrollRef.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-primary">
            <Tag className="h-3 w-3" />
            {config.eyebrow}
          </span>
          <h2 className="mt-1 font-display text-xl font-black leading-tight text-text md:text-2xl">
            {config.title}
          </h2>
          <p className="mt-0.5 text-sm text-text-muted">{config.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Défiler à gauche"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-text-muted transition-colors hover:border-primary hover:text-primary md:flex"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Défiler à droite"
            className="hidden h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-text-muted transition-colors hover:border-primary hover:text-primary md:flex"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            to={config.linkTo}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Voir plus <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-48 shrink-0 rounded-md" />
          ))}
        </div>
      ) : (
        <div
          ref={setScrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((p) => (
            <Link
              key={`${config.eyebrow}-${p.id}`}
              to={`/products/${p.slug}`}
              className="group flex w-48 shrink-0 snap-start flex-col overflow-hidden rounded-md border border-border bg-background transition-all hover:border-primary hover:shadow-md"
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
              <div className="flex flex-1 flex-col gap-1 border-t border-border p-3">
                <p className="line-clamp-2 text-[13px] font-medium text-text transition-colors group-hover:text-primary">
                  {p.name}
                </p>
                <PriceDisplay price={p.price} oldPrice={p.oldPrice} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ================= Today's Best Deals (Newegg Select — cartes enrichies) =================

const PROMO_CODES = ['SSF5727', 'SSF5764', 'AMZ2024', 'TS1050', 'NEW2026', 'GAMER20']

function TodayBestDeals({
  products,
  loading,
}: {
  products: Product[]
  loading: boolean
}) {
  return (
    <div>
      <SectionHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <TrendingDown className="h-3.5 w-3.5" />
            TechSpace Select
          </span>
        }
        title="Meilleurs deals du jour"
        description="Sélection éditoriale avec codes promo et livraison offerte."
        linkTo="/products?sort=promo"
      />
      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {products.slice(0, 6).map((p, idx) => {
            const discount =
              p.oldPrice && p.oldPrice > p.price
                ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                : 0
            const rating = 3.5 + (idx % 3) * 0.5
            const reviews = 124 + idx * 87
            const promoCode = PROMO_CODES[idx % PROMO_CODES.length]
            return (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-md border border-border bg-background transition-all hover:border-primary hover:shadow-md"
              >
                <div className="relative aspect-square bg-surface">
                  <img
                    src={p.mainImage}
                    alt={p.name}
                    className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  {discount > 0 && (
                    <span className="absolute left-2 top-2 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                      -{discount}%
                    </span>
                  )}
                  <span className="absolute right-2 top-2 rounded-sm bg-accent px-1.5 py-0.5 text-[10px] font-bold text-secondary">
                    TECHSPACE SELECT
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 border-t border-border p-3">
                  <p className="line-clamp-2 text-[12.5px] font-medium text-text transition-colors group-hover:text-primary">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < Math.round(rating) ? 'fill-accent text-accent' : 'text-border'}`}
                        />
                      ))}
                    </span>
                    <span className="text-text-muted">({reviews})</span>
                  </div>
                  <PriceDisplay price={p.price} oldPrice={p.oldPrice} size="sm" />
                  <div className="mt-auto flex flex-col gap-0.5 border-t border-dashed border-border pt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-success">
                      <Truck className="h-3 w-3" /> Livraison gratuite
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                      <Tag className="h-3 w-3" />
                      Code :{' '}
                      <span className="rounded-sm bg-surface px-1 font-mono font-bold text-primary">
                        {promoCode}
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ================= Featurettes grid 2×3 (Newegg) =================

interface Featurette {
  title: string
  subtitle: string
  cta: string
  to: string
  gradient: string
  size: 'small' | 'tall'
  icon: React.ReactNode
}

const FEATURETTES: Featurette[] = [
  {
    title: 'AI PC Store',
    subtitle: 'Configurations IA : Copilot+, NPU et Neural Engine dédiés.',
    cta: 'Découvrir AI PC',
    to: '/category/computer-systems',
    gradient: 'from-[#5B3B8C] to-[#2E1F4D]',
    size: 'tall',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: 'Prix le plus bas sur 30 jours',
    subtitle: 'Garantie tarifaire : le meilleur prix des 30 derniers jours.',
    cta: 'Voir les baisses',
    to: '/products?sort=lowest-price',
    gradient: 'from-[#13A971] to-[#0E8A5B]',
    size: 'small',
    icon: <TrendingDown className="h-5 w-5" />,
  },
  {
    title: 'Best Sellers',
    subtitle: 'Les produits les plus achetés par la communauté.',
    cta: 'Voir le classement',
    to: '/products?sort=best-sellers',
    gradient: 'from-[#F26826] to-[#D9561C]',
    size: 'small',
    icon: <Flame className="h-5 w-5" />,
  },
  {
    title: 'Espace Étudiant',
    subtitle: 'Tarifs réduits et financement 3× pour étudiants vérifiés.',
    cta: 'Activer mon pack',
    to: '/membership',
    gradient: 'from-[#1F4070] to-[#1B3758]',
    size: 'tall',
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    title: 'TechSpace Refreshed',
    subtitle: 'Produits reconditionnés certifiés, garantie 12 mois.',
    cta: 'Voir les reconditionnés',
    to: '/products?sort=refreshed',
    gradient: 'from-[#2A5A8C] to-[#1F4070]',
    size: 'small',
    icon: <Rocket className="h-5 w-5" />,
  },
  {
    title: 'Newegg Select',
    subtitle: 'Curation experts : tops hardware selon benchmarks 2026.',
    cta: 'Consulter les picks',
    to: '/products?sort=editor',
    gradient: 'from-[#A93F0C] to-[#7A2D08]',
    size: 'small',
    icon: <Star className="h-5 w-5" />,
  },
]

function FeaturettesGrid() {
  return (
    <div>
      <SectionHeader
        eyebrow="TechSpace Experiences"
        title="Explorez nos univers"
        description="Des espaces pensés pour chaque usage : IA, étudiant, reconditionné, gaming."
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-4">
        {FEATURETTES.map((f) => (
          <Link
            key={f.title}
            to={f.to}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-md bg-gradient-to-br ${f.gradient} p-5 text-white shadow-sm transition-all hover:shadow-md ${f.size === 'tall' ? 'row-span-2 min-h-[320px]' : 'min-h-[150px]'}`}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
              {f.icon}
            </span>
            <div>
              <h3 className="text-base font-black leading-tight md:text-lg">{f.title}</h3>
              <p className="mt-1 text-[11.5px] text-white/85">{f.subtitle}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-accent transition-transform group-hover:translate-x-1">
                {f.cta} <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ================= Récemment vus =================

function RecentlyViewedSection() {
  const entries = useHistoryStore((s) => s.entries)
  const clear = useHistoryStore((s) => s.clear)

  if (entries.length === 0) return null

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-3 py-10 sm:px-4">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
              <Clock className="h-3.5 w-3.5" />
              Historique
            </span>
            <h2 className="mt-1 font-display text-xl font-black leading-tight text-text md:text-2xl">
              Récemment vus
            </h2>
          </div>
          <button
            type="button"
            onClick={clear}
            className="text-xs font-semibold text-text-muted transition-colors hover:text-primary"
          >
            Effacer l'historique
          </button>
        </div>
        <div className="-mx-3 flex gap-3 overflow-x-auto px-3 pb-2 sm:-mx-4 sm:px-4">
          {entries.map(({ product }) => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="group flex w-[160px] shrink-0 flex-col gap-2 rounded-md border border-border bg-background p-3 transition-all hover:border-primary hover:shadow-md sm:w-[180px]"
            >
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-surface">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-contain p-2 transition-transform group-hover:scale-105"
                />
              </div>
              <h3 className="line-clamp-2 text-[12px] font-semibold leading-snug text-text transition-colors group-hover:text-primary">
                {product.name}
              </h3>
              <p className="text-sm font-black text-primary">
                {product.price.toLocaleString('fr-FR')}{' '}
                <span className="text-[10px] font-semibold text-text-muted">DH</span>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ================= TechSpace Insider — éditorial / blog =================

interface InsiderArticle {
  id: string
  category: string
  title: string
  excerpt: string
  imageUrl: string
  readMinutes: number
  href: string
}

const INSIDER_ARTICLES: InsiderArticle[] = [
  {
    id: 'rtx-5090-vs-rtx-4090',
    category: 'Hardware',
    title: 'RTX 5090 vs RTX 4090 : la nouvelle génération en vaut-elle le coût ?',
    excerpt:
      'Notre banc d\'essai complet sur 12 jeux AAA, benchmarks 4K et ray tracing — verdict sans concession.',
    imageUrl: 'https://placehold.co/640x360/1E3A5F/FBD32C?text=RTX+5090',
    readMinutes: 8,
    href: '/category/cartes-graphiques',
  },
  {
    id: 'guide-config-pc-gamer-2026',
    category: 'Guide',
    title: 'Guide config PC Gamer 2026 — 3 budgets, 3 builds optimisés',
    excerpt:
      'De 8 000 à 30 000 DH : nos configurations recommandées avec calcul de consommation et compatibilité.',
    imageUrl: 'https://placehold.co/640x360/1E3A5F/F26826?text=PC+Builder',
    readMinutes: 12,
    href: '/pc-builder',
  },
  {
    id: 'meilleurs-ssd-nvme',
    category: 'Comparatif',
    title: 'Top 5 SSD NVMe Gen 5 — vitesses réelles vs annoncées',
    excerpt:
      'On a mesuré l\'écart entre les promesses constructeurs et les performances réelles sous CrystalDiskMark.',
    imageUrl: 'https://placehold.co/640x360/0D1B2A/13A971?text=SSD+NVMe',
    readMinutes: 6,
    href: '/category/ssd',
  },
  {
    id: 'casques-vr-2026',
    category: 'Test',
    title: 'Meta Quest 3 vs PSVR 2 : quel casque VR choisir cette année ?',
    excerpt:
      'Confort, résolution, écosystème de jeux : notre comparatif détaillé après 40 heures d\'usage.',
    imageUrl: 'https://placehold.co/640x360/1E3A5F/FFFFFF?text=VR',
    readMinutes: 10,
    href: '/category/casques-vr',
  },
]

function InsiderSection() {
  return (
    <div>
      <SectionHeader
        eyebrow={
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" />
            TechSpace Insider
          </span>
        }
        title="Tests, guides et actualités tech"
        description="Nos experts décortiquent le matériel pour vous aider à choisir."
        linkTo="/insider"
        linkLabel="Tous les articles"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INSIDER_ARTICLES.map((article) => (
          <Link
            key={article.id}
            to={article.href}
            className="group flex flex-col overflow-hidden rounded-md border border-border bg-background shadow-card transition-all hover:border-primary hover:shadow-elevated"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-surface">
              <img
                src={article.imageUrl}
                alt={article.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-2 top-2 inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                {article.category}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2 p-4">
              <h3 className="line-clamp-2 text-sm font-bold leading-snug text-text transition-colors group-hover:text-primary">
                {article.title}
              </h3>
              <p className="line-clamp-2 text-xs text-text-muted">{article.excerpt}</p>
              <div className="mt-auto flex items-center gap-1.5 pt-2 text-[11px] font-semibold text-text-subtle">
                <Clock className="h-3 w-3" />
                {article.readMinutes} min de lecture
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ================= SEO descriptive section (bas de page) =================

function SeoSection() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl text-sm leading-relaxed text-text-muted">
            <h2 className="text-base font-bold text-text">TechSpace — votre marketplace tech au Maroc</h2>
            <p className="mt-2">
              Depuis 2024, TechSpace est la référence pour l'achat en ligne de matériel
              informatique au Maroc. Plus de <strong className="text-text">10 000 produits</strong>{' '}
              en stock : PC gamer, composants, portables, écrans, consoles, smart home, électroménager.
              Livraison partout au royaume en 2 à 4 jours, paiement à la livraison sans carte bancaire.
            </p>
            <p className="mt-2">
              Nos outils vous accompagnent : <Link to="/pc-builder" className="text-primary hover:underline">PC Builder</Link>{' '}
              pour configurer votre config, <Link to="/pc-builder" className="text-primary hover:underline">Calculateur d'alimentation</Link>,{' '}
              <Link to="/products?sort=best-sellers" className="text-primary hover:underline">Best Sellers</Link>,{' '}
              <Link to="/category/gaming-vr" className="text-primary hover:underline">Gaming Zone</Link>. Rejoignez notre communauté
              de <strong className="text-text">50 000+ passionnés</strong> tech et bénéficiez de tests hardware, deals exclusifs et support SAV 7j/7.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 lg:flex-col">
            <Link to="/pc-builder" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              <Cpu className="h-3.5 w-3.5" /> PC Builder
            </Link>
            <Link to="/products?sort=promo" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              <Zap className="h-3.5 w-3.5" /> Shell Shocker
            </Link>
            <Link to="/category/gaming-vr" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              <Gamepad2 className="h-3.5 w-3.5" /> Gaming Finder
            </Link>
            <Link to="/faq" className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-semibold text-text transition-colors hover:border-primary hover:text-primary">
              <Calculator className="h-3.5 w-3.5" /> Calculateur PSU
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
