import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingCart, Truck, User, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MegaMenu } from '@/components/layout/MegaMenu'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'
import { useCartStore, cartTotalItems } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { cn } from '@/utils/cn'

export function Header() {
  const navigate = useNavigate()
  const [promoVisible, setPromoVisible] = useState(true)
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
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      {/* Bandeau promo */}
      {promoVisible && (
        <div className="relative border-b border-border bg-surface">
          <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-6 py-2 text-xs text-text-muted">
            <Truck className="h-3.5 w-3.5 text-primary" />
            <span>Livraison gratuite au Maroc des 500 DH d'achat</span>
          </div>
          <button
            type="button"
            onClick={() => setPromoVisible(false)}
            aria-label="Fermer le bandeau"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Ligne principale : logo + search + icones */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:gap-6 lg:py-4">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-hover hover:text-text lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #F26826 0%, #E05A1A 100%)',
              boxShadow: '0 4px 14px -2px rgba(242, 104, 38, 0.5)',
            }}
          >
            T
          </span>
          <span className="hidden font-display text-lg font-bold tracking-tight text-text sm:inline">
            Tech<span className="text-primary">Space</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              type="search"
              placeholder="Rechercher un produit, une marque, une reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-md border border-border bg-surface pl-10 pr-24 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              size="sm"
              className="absolute right-1.5 top-1/2 h-8 -translate-y-1/2 px-4"
            >
              Chercher
            </Button>
          </div>
        </form>

        {/* Icones */}
        <nav className="flex items-center gap-1">
          <NavLink
            to="/account/wishlist"
            aria-label="Favoris"
            className={({ isActive }) =>
              cn(
                'relative flex h-10 w-10 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-hover hover:text-text',
                isActive && 'text-primary',
              )
            }
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-background">
                {wishlistCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/cart"
            aria-label="Panier"
            className={({ isActive }) =>
              cn(
                'relative flex h-10 w-10 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-hover hover:text-text',
                isActive && 'text-primary',
              )
            }
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/account"
            aria-label="Mon compte"
            className={({ isActive }) =>
              cn(
                'hidden h-10 w-10 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-hover hover:text-text sm:flex',
                isActive && 'text-primary',
              )
            }
          >
            <User className="h-5 w-5" />
          </NavLink>
        </nav>
      </div>

      {/* Nav categories desktop */}
      <nav
        onMouseLeave={() => setOpenCategory(null)}
        className="relative hidden border-t border-border lg:block"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 px-6">
          {NAV_CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onMouseEnter={() => setOpenCategory(cat.slug)}
              onClick={() => navigate(`/category/${cat.slug}`)}
              className={cn(
                'relative flex h-11 items-center gap-2 px-3 text-sm font-medium text-text-muted transition-colors hover:text-primary',
                openCategory === cat.slug && 'text-primary',
              )}
            >
              <span>{cat.label}</span>
              {openCategory === cat.slug && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        {activeCategory && <MegaMenu category={activeCategory} />}
      </nav>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm border-r border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <span className="font-display text-base font-bold text-text">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer le menu"
                className="text-text-muted transition-colors hover:text-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-2">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-md px-3 py-3 text-sm text-text transition-colors hover:bg-surface-hover hover:text-primary"
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
                className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-text transition-colors hover:bg-surface-hover"
              >
                <User className="h-4 w-4" />
                Mon compte
              </Link>
            </nav>
          </aside>
        </div>
      )}
    </header>
  )
}
