import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M13.5 9H16V6h-2.5C11.6 6 10 7.6 10 9.5V11H8v3h2v7h3v-7h2.3l.4-3H13v-1.2c0-.3.2-.5.5-.5z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.2L5.9 22H3l7-8L2 2h6.2l4.3 5.7L18.2 2zm-2.1 18h1.6L8 4H6.3l9.8 16z" />
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M22 8.4c0-1.5-1.2-2.7-2.7-2.7H4.7C3.2 5.7 2 6.9 2 8.4v7.2c0 1.5 1.2 2.7 2.7 2.7h14.6c1.5 0 2.7-1.2 2.7-2.7V8.4zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  )
}

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  { label: 'Facebook', href: '#', icon: <FacebookIcon /> },
  { label: 'Instagram', href: '#', icon: <InstagramIcon /> },
  { label: 'Twitter', href: '#', icon: <TwitterIcon /> },
  { label: 'YouTube', href: '#', icon: <YoutubeIcon /> },
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
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:border-primary hover:text-primary"
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
