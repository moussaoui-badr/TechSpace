import type { Banner } from '@/types'

/**
 * Images de bannieres issues d'Unsplash (domaine public, CDN stable).
 * Termes de recherche ciblent gaming / hardware pour un rendu editorial proche Newegg.
 * Remplacer par les visuels du client avant mise en production.
 */
const HERO_1 = 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1600&q=80'
const HERO_2 = 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1600&q=80'
const HERO_3 = 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?auto=format&fit=crop&w=1600&q=80'

export const banners: Banner[] = [
  {
    id: 1,
    title: 'Spring Tech Refresh',
    subtitle: 'Jusqu a -30% sur GPU, CPU et setups gaming. Stock limite.',
    imageUrl: HERO_1,
    linkUrl: '/products?sort=promo',
    ctaLabel: 'Shop now',
    isActive: true,
  },
  {
    id: 2,
    title: 'Nouvelle collection Gamer',
    subtitle: 'PC assembles, portables et peripheriques derniere generation.',
    imageUrl: HERO_2,
    linkUrl: '/category/pc-gamer',
    ctaLabel: 'Voir la collection',
    isActive: true,
  },
  {
    id: 3,
    title: 'Setup complet pret a jouer',
    subtitle: 'Ecran 240Hz, clavier mecanique, casque wireless. Livraison Maroc.',
    imageUrl: HERO_3,
    linkUrl: '/category/peripheriques',
    ctaLabel: 'Composer mon setup',
    isActive: true,
  },
]
