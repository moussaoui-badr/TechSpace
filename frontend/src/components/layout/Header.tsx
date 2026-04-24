import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  Blocks,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Cpu,
  Disc,
  Dumbbell,
  Gamepad2,
  Gift,
  Headphones,
  Heart,
  HelpCircle,
  LayoutGrid,
  Menu,
  Monitor,
  Moon,
  Mouse,
  Package,
  Plug,
  Search,
  Server,
  Shield,
  ShoppingCart,
  Store,
  Sun,
  Trees,
  Truck,
  Tv,
  User,
  Wifi,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

const SLUG_ICONS: Record<string, React.ReactNode> = {
  'components-storage': <Cpu className="h-4 w-4" />,
  'computer-systems': <Monitor className="h-4 w-4" />,
  'computer-peripherals': <Mouse className="h-4 w-4" />,
  'server-components': <Server className="h-4 w-4" />,
  'appliances': <Plug className="h-4 w-4" />,
  'electronics': <Tv className="h-4 w-4" />,
  'gaming-vr': <Gamepad2 className="h-4 w-4" />,
  'networking': <Wifi className="h-4 w-4" />,
  'smart-home-security': <Shield className="h-4 w-4" />,
  'office-solutions': <Briefcase className="h-4 w-4" />,
  'software-services': <Disc className="h-4 w-4" />,
  'automotive-tools': <Wrench className="h-4 w-4" />,
  'home-outdoors': <Trees className="h-4 w-4" />,
  'health-sports': <Dumbbell className="h-4 w-4" />,
  'toys-drones-maker': <Blocks className="h-4 w-4" />,
}
import { Logo } from '@/components/layout/Logo'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'
import { SearchAutocomplete } from '@/components/layout/SearchAutocomplete'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useCartStore, cartTotalItems } from '@/stores/cartStore'
import { useSearchHistoryStore } from '@/stores/searchHistoryStore'
import { useCatalogStore } from '@/stores/catalogStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { cn } from '@/utils/cn'
import { computeCategoryHits, filterProducts } from '@/utils/searchSuggestions'

type NavigableItem =
  | { type: 'recent'; value: string }
  | { type: 'category'; slug: string }
  | { type: 'product'; slug: string }
  | { type: 'submit' }

const QUICK_LINKS: { to: string; label: string; highlight?: boolean; business?: boolean }[] = [
  { to: '/products?sort=shell-shocker', label: 'Shell Shocker', highlight: true },
  { to: '/pc-builder', label: 'PC Builder' },
  { to: '/products?sort=promo', label: 'Promotions' },
  { to: '/products?sort=best-sellers', label: 'Best Sellers' },
  { to: '/products?sort=clearance', label: 'Clearance' },
  { to: '/membership', label: 'Loot Card' },
  { to: '/category/gaming-vr', label: 'Gamer Community' },
  { to: '/gifts', label: 'Cadeau offert' },
  { to: '/business', label: 'LOOT PRO', business: true },
]

export function Header() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const searchWrapperRef = useRef<HTMLDivElement>(null)

  const cartItems = useCartStore((s) => s.items)
  const wishlistCount = useWishlistStore((s) => s.productIds.length)
  const cartCount = cartTotalItems(cartItems)
  const recents = useSearchHistoryStore((s) => s.queries)
  const addRecent = useSearchHistoryStore((s) => s.add)
  const removeRecent = useSearchHistoryStore((s) => s.remove)
  const clearRecents = useSearchHistoryStore((s) => s.clear)

  const productsIndex = useCatalogStore((s) => s.productsIndex)

  const { matchedCategories, matchedProducts, navigableItems } = useMemo(() => {
    const trimmed = searchQuery.trim()
    const cats = computeCategoryHits(trimmed)
    const prods = filterProducts(trimmed, productsIndex)
    const items: NavigableItem[] = []
    if (trimmed.length === 0) {
      recents.forEach((r) => items.push({ type: 'recent', value: r }))
    } else {
      cats.forEach((c) => items.push({ type: 'category', slug: c.slug }))
      prods.forEach((p) => items.push({ type: 'product', slug: p.slug }))
      items.push({ type: 'submit' })
    }
    return { matchedCategories: cats, matchedProducts: prods, navigableItems: items }
  }, [searchQuery, recents, productsIndex])

  useClickOutside(searchWrapperRef, () => {
    setIsSearchOpen(false)
    setActiveIndex(-1)
  })

  function closeSearch() {
    setIsSearchOpen(false)
    setActiveIndex(-1)
  }

  function submitSearch(query: string) {
    const trimmed = query.trim()
    if (!trimmed) return
    addRecent(trimmed)
    closeSearch()
    navigate(`/products?search=${encodeURIComponent(trimmed)}`)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (activeIndex >= 0 && activeIndex < navigableItems.length) {
      executeItem(navigableItems[activeIndex])
      return
    }
    submitSearch(searchQuery)
  }

  function executeItem(item: NavigableItem) {
    if (item.type === 'recent') {
      setSearchQuery(item.value)
      closeSearch()
      navigate(`/products?search=${encodeURIComponent(item.value)}`)
      return
    }
    if (item.type === 'category') {
      closeSearch()
      navigate(`/category/${item.slug}`)
      return
    }
    if (item.type === 'product') {
      addRecent(searchQuery)
      closeSearch()
      navigate(`/products/${item.slug}`)
      return
    }
    submitSearch(searchQuery)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
    if (!isSearchOpen || navigableItems.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, navigableItems.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeSearch()
    }
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border">
      <TopPromoBar />
      {/* ===================== Tier 1 : Dark bar (logo + deliver + search + user) ===================== */}
      <div className="bg-secondary text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 lg:gap-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu"
            className="flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Logo variant="dark" size="md" />

          <Link
            to="/account/addresses"
            className="hidden items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-white/80 transition-colors hover:bg-white/10 hover:text-white lg:inline-flex"
          >
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-white/60">
                Livrer à
              </span>
              <span className="text-[13px] font-semibold">Maroc</span>
            </span>
          </Link>

          <div
            ref={searchWrapperRef}
            className="relative order-last w-full lg:order-none lg:flex-1"
          >
            <form onSubmit={handleSearch} onKeyDown={handleKeyDown}>
              <div className="flex h-10 overflow-hidden rounded-full bg-white/95 shadow-sm ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-accent/70">
                <input
                  type="search"
                  placeholder="Rechercher un produit, une marque, une référence..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setIsSearchOpen(true)
                    setActiveIndex(-1)
                  }}
                  onFocus={() => {
                    if (recents.length > 0 || searchQuery.trim().length > 0) {
                      setIsSearchOpen(true)
                    }
                  }}
                  role="combobox"
                  aria-expanded={isSearchOpen}
                  aria-controls="search-suggestions"
                  aria-autocomplete="list"
                  aria-activedescendant={
                    activeIndex >= 0 ? `sa-item-${activeIndex}` : undefined
                  }
                  autoComplete="off"
                  className="h-full w-full bg-transparent pl-5 pr-2 text-sm text-text placeholder:text-text-muted focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Rechercher"
                  className="flex h-full w-12 shrink-0 items-center justify-center rounded-r-full bg-primary text-white transition-colors hover:bg-primary-hover sm:w-14"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            {isSearchOpen && (
              <SearchAutocomplete
                id="search-suggestions"
                query={searchQuery}
                activeIndex={activeIndex}
                matchedCategories={matchedCategories}
                matchedProducts={matchedProducts}
                recents={recents}
                onSelectProduct={(slug) => {
                  addRecent(searchQuery)
                  closeSearch()
                  navigate(`/products/${slug}`)
                }}
                onSelectCategory={(slug) => {
                  closeSearch()
                  navigate(`/category/${slug}`)
                }}
                onSelectRecent={(q) => {
                  setSearchQuery(q)
                  closeSearch()
                  navigate(`/products?search=${encodeURIComponent(q)}`)
                }}
                onSubmitAll={() => submitSearch(searchQuery)}
                onRemoveRecent={removeRecent}
                onClearRecents={clearRecents}
              />
            )}
          </div>

          {/* Icônes utilitaires : notifications + toggle slide + flag pill */}
          <div className="hidden items-center gap-2 lg:flex">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Bell className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label={darkMode ? 'Mode clair' : 'Mode sombre'}
              onClick={() => setDarkMode((d) => !d)}
              className="relative flex h-7 w-14 items-center rounded-full bg-white/10 ring-1 ring-white/20 transition-colors hover:bg-white/20"
            >
              <span
                className={cn(
                  'absolute top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent shadow-md transition-transform duration-200',
                  darkMode ? 'translate-x-7' : 'translate-x-0.5',
                )}
              >
                {darkMode ? (
                  <Moon className="h-3.5 w-3.5 text-secondary" />
                ) : (
                  <Sun className="h-3.5 w-3.5 text-secondary" />
                )}
              </span>
            </button>

            <button
              type="button"
              aria-label="Changer la langue"
              className="flex h-9 items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] leading-none"
              >
                🇲🇦
              </span>
              MA
            </button>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <UserLink to="/account" label="Bonjour" sub="Compte & listes" icon={<User className="h-4 w-4" />} />
            <UserLink to="/orders" label="Retours" sub="& commandes" icon={<Package className="h-4 w-4" />} />
          </nav>

          <Link
            to="/cart"
            aria-label="Panier"
            className="relative flex h-11 items-center gap-2 rounded-md px-2 text-white transition-colors hover:bg-white/10"
          >
            <span className="relative">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </span>
            <span className="hidden text-[13px] font-semibold lg:inline">Panier</span>
          </Link>

          <Link
            to="/account/wishlist"
            aria-label="Favoris"
            className="relative hidden h-11 items-center gap-1 rounded-md px-2 text-white transition-colors hover:bg-white/10 sm:flex"
          >
            <span className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-secondary">
                  {wishlistCount}
                </span>
              )}
            </span>
          </Link>
        </div>
      </div>

      {/* ===================== Tier 2 : Quick links bar ===================== */}
      <nav className="hidden border-t border-border bg-background lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 items-center gap-2 border-r border-border px-3 text-[13px] font-semibold text-text transition-colors hover:text-primary"
          >
            <Menu className="h-4 w-4" />
            Menu
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          <div className="flex flex-1 items-center gap-0 overflow-x-auto">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'flex h-10 items-center whitespace-nowrap px-3 text-[12.5px] font-medium transition-colors hover:text-primary',
                  link.highlight
                    ? 'font-bold text-primary'
                    : link.business
                      ? 'font-bold text-info'
                      : 'text-text',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-0 border-l border-border xl:flex">
            <Link
              to="/faq"
              className="flex h-10 items-center px-3 text-[12.5px] font-medium text-text-muted transition-colors hover:text-primary"
            >
              Feedback
            </Link>
            <Link
              to="/faq"
              className="flex h-10 items-center px-3 text-[12.5px] font-medium text-text-muted transition-colors hover:text-primary"
            >
              Centre d'aide
            </Link>
          </div>
        </div>
      </nav>

      {/* ===================== Menu mobile ===================== */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="absolute left-0 top-0 bottom-0 flex w-[85%] max-w-sm flex-col border-r border-border bg-background">
            <div className="flex items-center justify-between border-b border-border bg-secondary px-5 py-4 text-white">
              <span className="text-base font-bold">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
                className="text-white/80 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover hover:text-primary"
                >
                  <span className="flex items-center gap-3">
                    <span aria-hidden className="text-text-muted">
                      {SLUG_ICONS[cat.slug] ?? <LayoutGrid className="h-4 w-4" />}
                    </span>
                    {cat.label}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-text-subtle" />
                </Link>
              ))}
              <hr className="my-2 border-border" />
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                <User className="h-4 w-4" />
                Mon compte
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                <Package className="h-4 w-4" />
                Suivi de commande
              </Link>
              <Link
                to="/sell"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                <Store className="h-4 w-4" />
                Vendre sur Loot
              </Link>
              <Link
                to="/faq"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                <HelpCircle className="h-4 w-4" />
                Aide & FAQ
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                <Headphones className="h-4 w-4" />
                Contact
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  )
}

// =================== Sous-composants ===================

interface UserLinkProps {
  to: string
  label: string
  sub: string
  icon: React.ReactNode
}

function useCountdown(totalSeconds: number) {
  const [remaining, setRemaining] = useState(totalSeconds)
  useEffect(() => {
    const id = window.setInterval(() => {
      setRemaining((r) => (r > 0 ? r - 1 : totalSeconds))
    }, 1000)
    return () => window.clearInterval(id)
  }, [totalSeconds])
  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  return { h, m, s }
}

function TopPromoBar() {
  const { h, m, s } = useCountdown(6 * 3600)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <div className="bg-gradient-to-r from-primary via-primary-hover to-primary text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-[11.5px] font-semibold sm:px-6">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-accent" />
          <span className="hidden sm:inline">Shell Shocker actif —</span>
          <span>Deals éclairs se terminent dans</span>
          <span className="flex items-center gap-0.5 rounded-sm bg-black/20 px-1.5 py-0.5 font-mono tracking-tight">
            <span>{pad(h)}</span>
            <span>:</span>
            <span>{pad(m)}</span>
            <span>:</span>
            <span>{pad(s)}</span>
          </span>
        </div>
        <div className="hidden items-center gap-4 md:flex">
          <Link to="/gifts" className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <Gift className="h-3.5 w-3.5" /> Cadeau AMD offert
          </Link>
          <Link to="/shipping" className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-80">
            <Truck className="h-3.5 w-3.5" /> Livraison gratuite dès 500 DH
          </Link>
          <Link to="/business" className="hidden rounded-sm bg-white/15 px-2 py-0.5 text-white transition-colors hover:bg-white/25 lg:inline-flex">
            TECHSPACE BUSINESS
          </Link>
        </div>
      </div>
    </div>
  )
}

function UserLink({ to, label, sub, icon }: UserLinkProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex h-11 items-center gap-1.5 rounded-md px-2 text-white transition-colors hover:bg-white/10',
          isActive && 'bg-white/10',
        )
      }
    >
      <span className="text-white/70">{icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-wider text-white/60">{label}</span>
        <span className="text-[12px] font-semibold">{sub}</span>
      </span>
    </NavLink>
  )
}
