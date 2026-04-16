import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Cpu,
  Gamepad2,
  Globe,
  Headphones,
  Heart,
  HelpCircle,
  LayoutGrid,
  Laptop,
  MapPin,
  Menu,
  Monitor,
  Moon,
  Mouse,
  Package,
  Search,
  ShoppingCart,
  Store,
  Sun,
  User,
  X,
} from 'lucide-react'

const SLUG_ICONS: Record<string, React.ReactNode> = {
  'pc-gamer': <Monitor className="h-4 w-4" />,
  'composants': <Cpu className="h-4 w-4" />,
  'pc-portables': <Laptop className="h-4 w-4" />,
  'ecrans': <Monitor className="h-4 w-4" />,
  'peripheriques': <Mouse className="h-4 w-4" />,
  'consoles': <Gamepad2 className="h-4 w-4" />,
  'chaises-bureaux': <LayoutGrid className="h-4 w-4" />,
}
import { Logo } from '@/components/layout/Logo'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'
import { useCartStore, cartTotalItems } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { cn } from '@/utils/cn'

const QUICK_LINKS: { to: string; label: string; highlight?: boolean; business?: boolean }[] = [
  { to: '/products?sort=shell-shocker', label: 'Shell Shocker', highlight: true },
  { to: '/pc-builder', label: 'PC Builder' },
  { to: '/products?sort=promo', label: 'Promotions' },
  { to: '/products?sort=best-sellers', label: 'Best Sellers' },
  { to: '/products?sort=clearance', label: 'Clearance' },
  { to: '/membership', label: 'TechSpace Card' },
  { to: '/category/pc-gamer', label: 'Gamer Community' },
  { to: '/gifts', label: 'Cadeau offert' },
  { to: '/business', label: 'TECHSPACE BUSINESS', business: true },
]

export function Header() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const cartItems = useCartStore((s) => s.items)
  const wishlistCount = useWishlistStore((s) => s.productIds.length)
  const cartCount = cartTotalItems(cartItems)

  const activeCategory = NAV_CATEGORIES.find((c) => c.slug === openCategory)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    navigate(`/products?search=${encodeURIComponent(trimmed)}`)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border">
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
            <MapPin className="h-4 w-4 text-accent" />
            <span className="flex flex-col leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-white/60">
                Livrer a
              </span>
              <span className="text-[13px] font-semibold">Maroc</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="order-last w-full lg:order-none lg:flex-1">
            <div className="flex h-10 overflow-hidden rounded-full bg-white/95 shadow-sm ring-1 ring-white/20 focus-within:ring-2 focus-within:ring-accent/70">
              <input
                type="search"
                placeholder="Rechercher un produit, une marque, une référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Icônes utilitaires */}
          <div className="hidden items-center gap-1 lg:flex">
            <button
              type="button"
              aria-label="Notifications"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Langue"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Globe className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label={darkMode ? 'Mode clair' : 'Mode sombre'}
              onClick={() => setDarkMode((d) => !d)}
              className="flex h-9 w-[52px] items-center justify-between rounded-full border border-white/20 bg-white/10 px-1.5 transition-colors hover:bg-white/20"
            >
              <Sun className={`h-3.5 w-3.5 transition-colors ${darkMode ? 'text-white/40' : 'text-accent'}`} />
              <Moon className={`h-3.5 w-3.5 transition-colors ${darkMode ? 'text-accent' : 'text-white/40'}`} />
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
                <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-text">
                  {wishlistCount}
                </span>
              )}
            </span>
          </Link>
        </div>
      </div>

      {/* ===================== Tier 2 : Category bar ===================== */}
      <nav
        onMouseLeave={() => setOpenCategory(null)}
        className="relative hidden border-t border-border bg-background lg:block"
      >
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
                  link.highlight ? 'font-bold text-primary' : link.business ? 'font-bold text-info' : 'text-text',
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

        {/* Sous-nav : categories principales (hover = mega menu) */}
        <div className="border-t border-border bg-surface">
          <div className="mx-auto flex max-w-7xl items-center gap-0 px-4 sm:px-6">
            {NAV_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onMouseEnter={() => setOpenCategory(cat.slug)}
                onClick={() => {
                  setOpenCategory(null)
                  navigate(`/category/${cat.slug}`)
                }}
                className={cn(
                  'relative flex h-10 items-center whitespace-nowrap px-3 text-[12.5px] font-medium text-text transition-colors hover:text-primary',
                  openCategory === cat.slug && 'text-primary',
                )}
              >
                <span>{cat.label}</span>
                {openCategory === cat.slug && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeCategory && <MegaMenu category={activeCategory} />}
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
                Vendre sur TechSpace
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
