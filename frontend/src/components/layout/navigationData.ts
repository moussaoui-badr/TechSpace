/**
 * Navigation statique du Header / MegaMenu.
 * En Phase 2, ces donnees seront remplacees par un fetch depuis `src/api/categories`.
 */

export interface NavCategory {
  slug: string
  label: string
  icon?: string
  description?: string
  imageUrl?: string
  children: NavChild[]
}

export interface NavChild {
  slug: string
  label: string
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    slug: 'pc-gamer',
    label: 'PC Gamer',
    icon: '🖥️',
    description: 'Configurations pretes a jouer, Intel ou AMD.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=PC+Gamer',
    children: [
      { slug: 'pc-gamer-intel', label: 'PC Gamer Intel' },
      { slug: 'pc-gamer-amd', label: 'PC Gamer AMD' },
      { slug: 'pc-gamer-nvidia', label: 'PC Gamer NVIDIA' },
      { slug: 'pc-gamer-streamer', label: 'Setups Streamer' },
    ],
  },
  {
    slug: 'composants',
    label: 'Composants',
    icon: '⚙️',
    description: 'Montez ou ameliorez votre configuration.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Composants',
    children: [
      { slug: 'processeurs', label: 'Processeurs' },
      { slug: 'cartes-graphiques', label: 'Cartes graphiques' },
      { slug: 'memoire-ram', label: 'Memoire RAM' },
      { slug: 'stockage-ssd-hdd', label: 'Stockage SSD / HDD' },
      { slug: 'cartes-meres', label: 'Cartes meres' },
      { slug: 'alimentations', label: 'Alimentations' },
      { slug: 'boitiers', label: 'Boitiers' },
      { slug: 'refroidissement', label: 'Refroidissement' },
    ],
  },
  {
    slug: 'pc-portables',
    label: 'PC Portables',
    icon: '💻',
    description: 'Laptops gamer, multimedia et bureautique.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Portables',
    children: [
      { slug: 'portables-gamer', label: 'Portables Gamer' },
      { slug: 'portables-multimedia', label: 'Portables Multimedia' },
      { slug: 'portables-bureautique', label: 'Portables Bureautique' },
    ],
  },
  {
    slug: 'ecrans',
    label: 'Ecrans',
    icon: '🖵',
    description: 'Moniteurs gaming, bureautique et pro.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Ecrans',
    children: [
      { slug: 'ecrans-gaming', label: 'Ecrans Gaming' },
      { slug: 'ecrans-bureau', label: 'Ecrans Bureau' },
      { slug: 'ecrans-ultrawide', label: 'UltraWide' },
    ],
  },
  {
    slug: 'peripheriques',
    label: 'Peripheriques',
    icon: '⌨️',
    description: 'Claviers, souris, casques, tapis...',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Peripheriques',
    children: [
      { slug: 'claviers', label: 'Claviers' },
      { slug: 'souris', label: 'Souris' },
      { slug: 'casques', label: 'Casques' },
      { slug: 'tapis', label: 'Tapis de souris' },
      { slug: 'webcams-micros', label: 'Webcams & Micros' },
    ],
  },
  {
    slug: 'consoles',
    label: 'Consoles',
    icon: '🎮',
    description: 'PS5, Xbox, Switch et accessoires.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Consoles',
    children: [
      { slug: 'console-ps5', label: 'PlayStation 5' },
      { slug: 'console-xbox', label: 'Xbox Series' },
      { slug: 'console-switch', label: 'Nintendo Switch' },
      { slug: 'jeux-video', label: 'Jeux video' },
    ],
  },
  {
    slug: 'chaises-bureaux',
    label: 'Chaises & Bureaux',
    icon: '🪑',
    description: 'Gaming setup confortable et stylise.',
    imageUrl: 'https://placehold.co/400x280/1E3A5F/FBD32C?text=Gaming+Setup',
    children: [
      { slug: 'chaises-gamer', label: 'Chaises Gamer' },
      { slug: 'bureaux-gamer', label: 'Bureaux Gamer' },
      { slug: 'accessoires-setup', label: 'Accessoires Setup' },
    ],
  },
]
