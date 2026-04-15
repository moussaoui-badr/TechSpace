import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const socialLinks: { label: string; href: string; icon: string }[] = [
  { label: 'Facebook', href: '#', icon: 'F' },
  { label: 'Instagram', href: '#', icon: 'IG' },
  { label: 'Twitter', href: '#', icon: 'X' },
  { label: 'YouTube', href: '#', icon: 'YT' },
]

const navLinks = [
  { label: 'Accueil', to: '/' },
  { label: 'Catalogue', to: '/products' },
  { label: 'Promotions', to: '/products?sort=promo' },
  { label: 'Marques', to: '/brands' },
  { label: 'A propos', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const serviceLinks = [
  { label: 'FAQ', to: '/faq' },
  { label: 'Livraison', to: '/shipping' },
  { label: 'Retours & Garantie', to: '/returns' },
  { label: 'Conditions generales', to: '/terms' },
  { label: 'Mentions legales', to: '/legal' },
  { label: 'Politique de confidentialite', to: '/privacy' },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Col 1 — Marque + signature */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold text-white"
                style={{
                  background: 'linear-gradient(135deg, #F26826 0%, #E05A1A 100%)',
                }}
              >
                T
              </span>
              <span className="font-display text-lg font-bold tracking-tight text-text">
                Tech<span className="text-primary">Space</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-muted">
              Le spécialiste du matériel informatique gaming et pro au Maroc. Livraison partout
              au royaume, paiement à la livraison.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-xs font-bold text-text-muted transition-colors hover:border-primary hover:text-primary"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-text-muted transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Service client */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text">
              Service client
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-text-muted transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact + newsletter */}
          <div>
            <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wide text-text">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>+212 5 22 00 00 00</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>contact@techspace.ma</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Casablanca, Maroc</span>
              </li>
            </ul>

            <h3 className="mb-3 mt-6 font-display text-sm font-semibold uppercase tracking-wide text-text">
              Newsletter
            </h3>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Votre email"
                className="h-10 flex-1 rounded-md border border-border bg-background px-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button type="submit" size="sm">
                OK
              </Button>
            </form>
          </div>
        </div>

        <hr className="my-10 border-border" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} TechSpace. Tous droits reserves.</p>
          <p>Paiement a la livraison uniquement — Service disponible au Maroc.</p>
        </div>
      </div>
    </footer>
  )
}
