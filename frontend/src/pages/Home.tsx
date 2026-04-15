import { Link } from 'react-router-dom'
import { ArrowRight, Headphones, Shield, Truck, Wallet } from 'lucide-react'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'

const trustItems = [
  { icon: Truck, title: 'Livraison rapide', description: 'Partout au Maroc en 2 a 4 jours.' },
  { icon: Shield, title: 'Garantie constructeur', description: 'Produits 100% authentiques.' },
  { icon: Headphones, title: 'SAV reactif', description: 'Support technique 7j/7.' },
  { icon: Wallet, title: 'Paiement a la livraison', description: 'Payez quand vous recevez.' },
]

export function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-xl border border-border p-8 md:p-16"
        style={{
          background:
            'radial-gradient(circle at 0% 0%, rgba(242, 104, 38, 0.15) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(0, 75, 125, 0.2) 0%, transparent 50%), linear-gradient(180deg, #1A1A2E 0%, #0F0F1A 100%)',
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Nouveau — Offres de lancement
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-text md:text-5xl lg:text-6xl">
            Votre setup de reve, <span className="text-primary">livre au Maroc</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base text-text-muted md:text-lg">
            PC Gamer, composants, peripheriques, consoles. Les meilleures marques au
            meilleur prix, avec livraison et paiement a la reception.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 text-base font-semibold text-white transition-colors hover:bg-primary-hover"
              style={{ boxShadow: '0 4px 14px -4px rgba(242, 104, 38, 0.45)' }}
            >
              Decouvrir le catalogue
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/category/pc-gamer"
              className="inline-flex h-12 items-center justify-center rounded-md border border-border bg-surface px-6 text-base font-medium text-text transition-colors hover:border-primary hover:text-primary"
            >
              Configurations PC Gamer
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mt-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Categories populaires</h2>
          <Link
            to="/products"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {NAV_CATEGORIES.slice(0, 8).map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-5 text-center transition-all hover:border-primary/60"
              style={{ boxShadow: 'var(--shadow-card)' }}
            >
              <span className="text-3xl transition-transform group-hover:scale-110">
                {cat.icon}
              </span>
              <span className="text-sm font-medium text-text transition-colors group-hover:text-primary">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Placeholder produits vedettes — rempli en Phase 2 */}
      <section className="mt-12">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Produits vedettes</h2>
          <Link
            to="/products"
            className="text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Voir tout →
          </Link>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-surface/50 p-12 text-center text-sm text-text-muted">
          Les produits vedettes seront ajoutes en Phase 2 (mock data).
        </div>
      </section>

      {/* Trust badges */}
      <section className="mt-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-3 rounded-lg border border-border bg-surface p-5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
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
    </div>
  )
}
