import { NavLink, Outlet } from 'react-router-dom'
import { BarChart3, Image, LayoutDashboard, Package, ShoppingBag, Tag, Users } from 'lucide-react'
import { cn } from '@/utils/cn'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Produits', icon: Package },
  { to: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/banners', label: 'Banners', icon: Image },
  { to: '/admin/users', label: 'Clients', icon: Users },
  { to: '/admin/stats', label: 'Statistiques', icon: BarChart3 },
]

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-background text-text">
      <aside className="w-60 shrink-0 border-r border-border bg-surface">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-sm font-black text-white"
          >
            T
          </span>
          <span className="text-sm font-bold text-text">TechSpace Admin</span>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {adminLinks.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-muted transition-colors',
                  'hover:bg-surface-hover hover:text-text',
                  isActive && 'bg-primary-soft text-primary',
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border px-8">
          <h1 className="font-display text-lg font-semibold">Back-office</h1>
          <NavLink
            to="/"
            className="text-sm text-text-muted transition-colors hover:text-primary"
          >
            ← Retour au site
          </NavLink>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
