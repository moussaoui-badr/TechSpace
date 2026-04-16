import type { Banner } from '@/types'

export const banners: Banner[] = [
  {
    id: 1,
    title: 'Promo GPU -20%',
    subtitle: 'RTX 4070 Ti SUPER a 9 500 DH au lieu de 10 800 DH. Stock limite.',
    imageUrl: 'https://placehold.co/1400x500/E31837/FFFFFF?text=PROMO+GPU+RTX+4070+Ti',
    linkUrl: '/products?sort=promo',
    ctaLabel: 'Profiter de l offre',
    isActive: true,
  },
  {
    id: 2,
    title: 'Nouvelle collection Gamer',
    subtitle: 'PC assembles, portables et peripheriques derniere generation.',
    imageUrl: 'https://placehold.co/1400x500/334155/F6C60C?text=COLLECTION+GAMER+2026',
    linkUrl: '/category/pc-gamer',
    ctaLabel: 'Voir la collection',
    isActive: true,
  },
  {
    id: 3,
    title: 'Setup complet pret a jouer',
    subtitle: 'Ecran 240 Hz, clavier mecanique, casque wireless. Livraison Maroc.',
    imageUrl: 'https://placehold.co/1400x500/F6C60C/334155?text=SETUP+COMPLET+GAMER',
    linkUrl: '/category/peripheriques',
    ctaLabel: 'Composer mon setup',
    isActive: true,
  },
]
