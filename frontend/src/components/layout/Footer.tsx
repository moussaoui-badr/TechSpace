import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'

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
      <path d="M18.2 2H21l-6.5 7.4L22 22h-6l-4.7-6.2L5.9 22H3l7-8L2 2h6.2l4.3 5.7L18.2 2z" />
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

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v14H0V8zm7.5 0H12v2c.63-1.1 2.2-2.3 4.5-2.3 4.8 0 5.5 3 5.5 7.1V22h-5v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.6-2.3 3.1V22h-5V8z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M16.6 5.82c-1-.65-1.66-1.78-1.66-3.07V2.5h-3v13.4c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9 1.3-2.9 2.9-2.9c.3 0 .6.05.9.14V10c-.3-.04-.6-.06-.9-.06-3.3 0-5.9 2.7-5.9 5.9s2.7 5.9 5.9 5.9 5.9-2.7 5.9-5.9V9.52c1.2.85 2.6 1.35 4 1.35V7.87c-.7 0-1.6-.3-2.3-.75l-.04-.02z" />
    </svg>
  )
}

function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M22 12.1c0-1.2-1-2.2-2.2-2.2-.6 0-1.1.2-1.5.6-1.5-1-3.4-1.6-5.6-1.7l1-4.4 3.1.7c0 .8.6 1.4 1.4 1.4s1.5-.6 1.5-1.4S19.1 3.6 18.3 3.6c-.5 0-1 .3-1.3.7l-3.5-.8c-.1 0-.2 0-.3.1-.1 0-.1.1-.1.2l-1 5c-2.2.1-4.2.7-5.7 1.7-.4-.4-.9-.6-1.5-.6C3.7 9.9 2.7 10.9 2.7 12.1c0 .8.5 1.6 1.2 1.9v.6c0 3.3 3.8 6 8.5 6s8.5-2.7 8.5-6V14c.6-.4 1.1-1.1 1.1-1.9zM7 13.7c0-.8.6-1.4 1.4-1.4s1.4.6 1.4 1.4-.6 1.4-1.4 1.4-1.4-.6-1.4-1.4zm8.1 3.7c-.9.9-2.6 1-3.1 1s-2.2-.1-3.1-1c-.1-.1-.1-.4 0-.5s.4-.1.5 0c.6.6 1.8.8 2.6.8s2-.2 2.6-.8c.1-.1.4-.1.5 0 .1.1.1.3 0 .5zm-.4-2.3c-.8 0-1.4-.6-1.4-1.4s.6-1.4 1.4-1.4 1.4.6 1.4 1.4-.6 1.4-1.4 1.4z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M19.3 4.8c-1.5-.7-3.1-1.2-4.7-1.5-.2.4-.5.9-.6 1.3-1.7-.3-3.4-.3-5.1 0-.2-.4-.4-.9-.6-1.3C6.7 3.6 5.2 4.1 3.7 4.8c-3 4.4-3.8 8.7-3.4 13 1.9 1.4 3.7 2.2 5.6 2.8.4-.6.8-1.2 1.1-1.9-.6-.2-1.2-.5-1.8-.9.2-.1.3-.2.5-.3 3.5 1.6 7.3 1.6 10.8 0 .2.1.3.2.5.3-.6.3-1.2.6-1.8.9.3.7.7 1.3 1.1 1.9 1.9-.6 3.8-1.4 5.6-2.8.5-5-.8-9.2-3.4-13zM8 15.4c-1.1 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.1 1 2.1 2.3-.9 2.3-2.1 2.3zm8 0c-1.1 0-2.1-1-2.1-2.3s.9-2.3 2.1-2.3 2.1 1 2.1 2.3-.9 2.3-2.1 2.3z" />
    </svg>
  )
}

function TwitchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M4 2L2 6v14h5v2h3l2-2h4l5-5V2H4zm16 12l-3 3h-4l-2 2v-2H7V4h13v10zm-3-7v5h-2V7h2zm-5 0v5h-2V7h2z" />
    </svg>
  )
}

function PinterestIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.2 2.6 7.8 6.3 9.3-.1-.8-.2-2 0-2.9.2-.8 1.1-5.1 1.1-5.1s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-.8 3.1-.2.9.5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.4 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.1 0 .8.3 1.7.7 2.2l.2.1c0 .1-.1.3-.1.4l-.2.7c-.1.2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.3 2.4-6.3 6.9-6.3 3.6 0 6.4 2.6 6.4 6 0 3.6-2.3 6.5-5.4 6.5-1.1 0-2-.5-2.4-1.2l-.7 2.5c-.2.9-.9 2.2-1.4 2.9.9.3 1.9.4 3 .4 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
    </svg>
  )
}

const socialLinks: { label: string; href: string; icon: ReactNode }[] = [
  { label: 'Facebook', href: '#', icon: <FacebookIcon /> },
  { label: 'Instagram', href: '#', icon: <InstagramIcon /> },
  { label: 'Twitter / X', href: '#', icon: <TwitterIcon /> },
  { label: 'YouTube', href: '#', icon: <YoutubeIcon /> },
  { label: 'LinkedIn', href: '#', icon: <LinkedInIcon /> },
  { label: 'TikTok', href: '#', icon: <TikTokIcon /> },
  { label: 'Reddit', href: '#', icon: <RedditIcon /> },
  { label: 'Discord', href: '#', icon: <DiscordIcon /> },
  { label: 'Twitch', href: '#', icon: <TwitchIcon /> },
  { label: 'Pinterest', href: '#', icon: <PinterestIcon /> },
]

const customerServiceLinks = [
  { label: "Centre d'aide", to: '/faq' },
  { label: 'Suivre ma commande', to: '/orders' },
  { label: 'Retourner un article', to: '/returns' },
  { label: 'Politique de retour', to: '/returns' },
  { label: 'Confidentialité & sécurité', to: '/privacy' },
  { label: 'Feedback', to: '/contact' },
]

const myAccountLinks = [
  { label: 'Connexion / Inscription', to: '/login' },
  { label: 'Historique de navigation', to: '/account/history' },
  { label: 'Historique de commandes', to: '/account/orders' },
  { label: "Carnet d'adresses", to: '/account/addresses' },
  { label: 'Listes de souhaits', to: '/account/wishlist' },
  { label: 'Mes builds PC', to: '/pc-builder' },
  { label: 'Notifications email', to: '/account' },
]

const companyLinks = [
  { label: 'À propos de Loot', to: '/about' },
  { label: 'Gamer Zone', to: '/category/gaming-vr' },
  { label: 'Récompenses', to: '/about' },
  { label: 'Carrières', to: '/about' },
  { label: 'Salle de presse', to: '/about' },
  { label: 'Blog Insider', to: '/about' },
  { label: 'Chaîne d\'approvisionnement', to: '/legal' },
]

const toolsLinks = [
  { label: 'Portail fournisseurs', to: '/sell' },
  { label: 'Vendre sur Loot', to: '/sell' },
  { label: 'Compte professionnel', to: '/business' },
  { label: 'Services partenaires', to: '/sell' },
  { label: 'Programme Affiliés', to: '/sell' },
  { label: 'Créateurs de contenu', to: '/sell' },
  { label: 'Plan du site', to: '/sitemap' },
  { label: 'Rebates & remises', to: '/products?sort=rebates' },
  { label: 'Apps mobiles', to: '/about' },
  { label: 'Pack Étudiant', to: '/membership' },
  { label: 'Loot Card', to: '/membership' },
  { label: 'Trade In', to: '/contact' },
]

const brandsLinks = [
  { label: 'Loot Business', to: '/business' },
  { label: 'Loot Global', to: '/about' },
  { label: 'ABS Gaming PC', to: '/products?brands=abs' },
  { label: 'Rosewill Accessoires', to: '/products?brands=rosewill' },
]

const seoLinks = {
  'Processeurs': [
    { label: 'AMD Ryzen 7', to: '/products?search=ryzen+7' },
    { label: 'AMD Ryzen 9', to: '/products?search=ryzen+9' },
    { label: 'Intel Core i7', to: '/products?search=i7' },
    { label: 'Intel Core i9', to: '/products?search=i9' },
  ],
  'Cartes graphiques': [
    { label: 'RTX 4090', to: '/products?search=rtx+4090' },
    { label: 'RTX 4080 SUPER', to: '/products?search=rtx+4080' },
    { label: 'RTX 4070 Ti', to: '/products?search=rtx+4070' },
    { label: 'Radeon RX 7900', to: '/products?search=rx+7900' },
  ],
  'Stockage': [
    { label: 'SSD NVMe 1 To', to: '/products?search=ssd+1to' },
    { label: 'SSD NVMe 2 To', to: '/products?search=ssd+2to' },
    { label: 'HDD 4 To', to: '/products?search=hdd+4to' },
    { label: 'Stockage externe', to: '/products?search=externe' },
  ],
  'PC & Portables': [
    { label: 'PC Gamer prêt à jouer', to: '/category/pc-gamer' },
    { label: 'Portables Gamer', to: '/category/portables-gamer' },
    { label: 'All-in-One', to: '/category/all-in-one' },
    { label: 'Stations de travail', to: '/category/stations-travail' },
  ],
  'Gaming': [
    { label: 'PlayStation 5', to: '/category/console-ps5' },
    { label: 'Xbox Series X', to: '/category/console-xbox' },
    { label: 'Nintendo Switch', to: '/category/console-switch' },
    { label: 'Casques VR', to: '/category/casques-vr' },
  ],
  'Réseaux & Audio': [
    { label: 'Routeurs Wi-Fi 7', to: '/category/routeurs' },
    { label: 'Wi-Fi mesh', to: '/category/wifi-mesh' },
    { label: 'Casques audio pro', to: '/category/casques' },
    { label: 'Moniteurs 4K', to: '/category/ecrans' },
  ],
}

const paymentMethods = ['Cash', 'Visa', 'Mastercard', 'AMEX', 'PayPal', 'Apple Pay']

export function Footer() {
  return (
    <footer className="mt-16 bg-gradient-to-b from-secondary to-secondary-deep text-white/85">
      {/* ===== Top 5-column grid ===== */}
      <div className="mx-auto max-w-7xl px-6 pt-12 lg:pt-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Logo variant="dark" size="md" />
            <p className="mt-4 text-sm text-white/75">
              Le spécialiste du matériel informatique gaming et pro au Maroc. Livraison partout
              au royaume, paiement à la livraison.
            </p>
            <ul className="mt-5 space-y-2.5 text-sm text-white/75">
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>+212 5 22 00 00 00</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>contact@loot.ma</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Casablanca, Maroc</span>
              </li>
            </ul>
          </div>

          <FooterColumn title="Service Client" links={customerServiceLinks} />
          <FooterColumn title="Mon Compte" links={myAccountLinks} />
          <FooterColumn title="Entreprise" links={companyLinks} />
          <div>
            <FooterColumn title="Outils & Ressources" links={toolsLinks} />
            <h3 className="mb-3 mt-8 text-sm font-bold uppercase tracking-wide text-white">
              Nos enseignes
            </h3>
            <ul className="space-y-2.5">
              {brandsLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-white/75 transition-colors hover:text-accent">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ===== Newsletter + social ===== */}
        <div className="mt-12 grid gap-6 rounded-md border border-white/10 bg-white/5 p-5 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8 lg:p-6">
          <div>
            <h3 className="text-base font-bold text-white">Recevez les bons plans Loot</h3>
            <p className="mt-1 text-sm text-white/70">
              Deals exclusifs, nouveautés hardware et tests : 1 email par semaine, pas de spam.
            </p>
            <form className="mt-3 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="h-10 flex-1 rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/50 focus:border-accent focus:bg-white/15 focus:outline-none"
              />
              <Button type="submit" size="sm">
                S'abonner
              </Button>
            </form>
          </div>
          <div className="flex flex-col gap-3 lg:items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-white/70">
              Suivez-nous
            </span>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  title={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 text-white/70 transition-colors hover:border-accent hover:text-accent"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== SEO mega-grid ===== */}
      <div className="mx-auto max-w-7xl border-t border-white/10 px-6 py-10">
        <h3 className="mb-5 text-xs font-bold uppercase tracking-widest text-white/60">
          Populaire chez Loot
        </h3>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Object.entries(seoLinks).map(([group, items]) => (
            <div key={group}>
              <h4 className="mb-2.5 text-[13px] font-bold text-white">{group}</h4>
              <ul className="space-y-1.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-[12px] text-white/60 transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Legal bottom bar ===== */}
      <div className="border-t border-white/10 bg-secondary-deep">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 px-6 py-5 text-[11.5px] text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>© 2024-{new Date().getFullYear()} Loot. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/terms" className="hover:text-accent">Conditions générales</Link>
            <Link to="/privacy" className="hover:text-accent">Politique de confidentialité</Link>
            <Link to="/legal" className="hover:text-accent">Mentions légales</Link>
            <Link to="/privacy" className="hover:text-accent">Paramètres cookies</Link>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {paymentMethods.map((pm) => (
              <span
                key={pm}
                className="rounded-sm border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase text-white/70"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

interface FooterColumnProps {
  title: string
  links: { label: string; to: string }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{title}</h3>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-white/75 transition-colors hover:text-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
