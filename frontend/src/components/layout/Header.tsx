import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Headphones,
  Heart,
  HelpCircle,
  Menu,
  Package,
  Search,
  ShoppingCart,
  Store,
  User,
  X,
} from 'lucide-react'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'
import { useCartStore, cartTotalItems } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { cn } from '@/utils/cn'

export function Header() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
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
    <header className="sticky top-0 z-30 border-b border-border bg-background">
      {/* ===================== Top bar ===================== */}
      <div className="hidden bg-secondary text-[12px] text-white/90 sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Package className="h-3.5 w-3.5 text-accent" />
            <span>Livraison gratuite au Maroc des 500 DH d'achat</span>
          </div>
          <nav className="flex items-center gap-0">
            <TopLink to="/orders" icon={<Package className="h-3.5 w-3.5" />}>Suivi commande</TopLink>
            <TopLink to="/contact" icon={<Headphones className="h-3.5 w-3.5" />}>Contact</TopLink>
            <TopLink to="/faq" icon={<HelpCircle className="h-3.5 w-3.5" />}>Aide</TopLink>
            <TopLink to="/sell" icon={<Store className="h-3.5 w-3.5" />}>Vendre sur TechSpace</TopLink>
          </nav>
        </div>
      </div>

      {/* ===================== Main bar ===================== */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6 lg:gap-8 lg:py-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-text transition-colors hover:bg-surface-hover lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Logo />

        <form onSubmit={handleSearch} className="order-last w-full lg:order-none lg:flex-1">
          <div className="flex h-11 overflow-hidden rounded-md border-2 border-primary bg-background">
            <input
              type="search"
              placeholder="Rechercher un produit, une marque, une reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full bg-transparent px-4 text-sm text-text placeholder:text-text-muted focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Rechercher"
              className="flex h-full w-12 shrink-0 items-center justify-center bg-primary text-white transition-colors hover:bg-primary-hover sm:w-14"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-1 sm:gap-2">
          <IconLink to="/account/wishlist" label="Favoris" count={wishlistCount} countBg="bg-accent" countText="text-text">
            <Heart className="h-5 w-5" />
            <span className="hidden text-[11px] font-medium text-text-muted xl:block">Favoris</span>
          </IconLink>

          <IconLink to="/cart" label="Panier" count={cartCount} countBg="bg-primary" countText="text-white">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden text-[11px] font-medium text-text-muted xl:block">Panier</span>
          </IconLink>

          <IconLink to="/account" label="Mon compte">
            <User className="h-5 w-5" />
            <span className="hidden text-[11px] font-medium text-text-muted xl:block">Compte</span>
          </IconLink>
        </nav>
      </div>

      {/* ===================== Category bar ===================== */}
      <nav
        onMouseLeave={() => setOpenCategory(null)}
        className="relative hidden border-t border-border bg-background lg:block"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6">
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
                'relative flex h-11 items-center gap-1.5 px-3 text-[13px] font-medium text-text transition-colors hover:text-primary',
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
                    <span aria-hidden>{cat.icon}</span>
                    {cat.label}
                  </span>
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
                to="/faq"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover"
              >
                <HelpCircle className="h-4 w-4" />
                Aide & FAQ
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  )
}

// =================== Sous-composants ===================

function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-sm text-base font-black text-white"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        T
      </span>
      <span className="hidden text-lg font-black leading-none tracking-tight sm:inline">
        <span className="text-text">Tech</span>
        <span className="text-primary">Space</span>
      </span>
    </Link>
  )
}

interface TopLinkProps {
  to: string
  icon: React.ReactNode
  children: React.ReactNode
}

function TopLink({ to, icon, children }: TopLinkProps) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 px-3 py-1.5 text-white/80 transition-colors hover:text-white"
    >
      {icon}
      <span>{children}</span>
    </Link>
  )
}

interface IconLinkProps {
  to: string
  label: string
  children: React.ReactNode
  count?: number
  countBg?: string
  countText?: string
}

function IconLink({ to, label, children, count, countBg = 'bg-primary', countText = 'text-white' }: IconLinkProps) {
  return (
    <NavLink
      to={to}
      aria-label={label}
      className={({ isActive }) =>
        cn(
          'relative flex h-12 min-w-11 items-center justify-center gap-1 rounded-md px-2 text-text transition-colors hover:bg-surface-hover xl:flex-col xl:gap-0.5 xl:py-1.5',
          isActive && 'text-primary',
        )
      }
    >
      {children}
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold xl:right-2',
            countBg,
            countText,
          )}
        >
          {count}
        </span>
      )}
    </NavLink>
  )
}
