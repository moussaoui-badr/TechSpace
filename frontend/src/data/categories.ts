import type { Category } from '@/types'

/**
 * Arbre des categories TechSpace.
 * Les IDs sont fixes pour garder la coherence avec les produits.
 */
export const categories: Category[] = [
  {
    id: 1,
    name: 'PC Gamer',
    slug: 'pc-gamer',
    description: 'Configurations pretes a jouer, Intel ou AMD.',
    imageUrl: 'https://placehold.co/600x400/F5F5F5/334155?text=PC+Gamer',
    children: [
      { id: 11, name: 'PC Gamer Intel', slug: 'pc-gamer-intel', parentId: 1, children: [] },
      { id: 12, name: 'PC Gamer AMD', slug: 'pc-gamer-amd', parentId: 1, children: [] },
      { id: 13, name: 'PC Gamer NVIDIA', slug: 'pc-gamer-nvidia', parentId: 1, children: [] },
      { id: 14, name: 'Setups Streamer', slug: 'pc-gamer-streamer', parentId: 1, children: [] },
    ],
  },
  {
    id: 2,
    name: 'Composants',
    slug: 'composants',
    description: 'Montez ou ameliorez votre configuration.',
    imageUrl: 'https://placehold.co/600x400/F5F5F5/334155?text=Composants',
    children: [
      { id: 21, name: 'Processeurs', slug: 'processeurs', parentId: 2, children: [] },
      { id: 22, name: 'Cartes graphiques', slug: 'cartes-graphiques', parentId: 2, children: [] },
      { id: 23, name: 'Memoire RAM', slug: 'memoire-ram', parentId: 2, children: [] },
      { id: 24, name: 'Stockage SSD / HDD', slug: 'stockage-ssd-hdd', parentId: 2, children: [] },
      { id: 25, name: 'Cartes meres', slug: 'cartes-meres', parentId: 2, children: [] },
      { id: 26, name: 'Alimentations', slug: 'alimentations', parentId: 2, children: [] },
      { id: 27, name: 'Boitiers', slug: 'boitiers', parentId: 2, children: [] },
      { id: 28, name: 'Refroidissement', slug: 'refroidissement', parentId: 2, children: [] },
    ],
  },
  {
    id: 3,
    name: 'PC Portables',
    slug: 'pc-portables',
    description: 'Laptops gamer, multimedia et bureautique.',
    imageUrl: 'https://placehold.co/600x400/F5F5F5/334155?text=Portables',
    children: [
      { id: 31, name: 'Portables Gamer', slug: 'portables-gamer', parentId: 3, children: [] },
      { id: 32, name: 'Portables Multimedia', slug: 'portables-multimedia', parentId: 3, children: [] },
      { id: 33, name: 'Portables Bureautique', slug: 'portables-bureautique', parentId: 3, children: [] },
    ],
  },
  {
    id: 4,
    name: 'Ecrans',
    slug: 'ecrans',
    description: 'Moniteurs gaming, bureautique et pro.',
    imageUrl: 'https://placehold.co/600x400/F5F5F5/334155?text=Ecrans',
    children: [
      { id: 41, name: 'Ecrans Gaming', slug: 'ecrans-gaming', parentId: 4, children: [] },
      { id: 42, name: 'Ecrans Bureau', slug: 'ecrans-bureau', parentId: 4, children: [] },
      { id: 43, name: 'UltraWide', slug: 'ecrans-ultrawide', parentId: 4, children: [] },
    ],
  },
  {
    id: 5,
    name: 'Peripheriques',
    slug: 'peripheriques',
    description: 'Claviers, souris, casques, tapis...',
    imageUrl: 'https://placehold.co/600x400/F5F5F5/334155?text=Peripheriques',
    children: [
      { id: 51, name: 'Claviers', slug: 'claviers', parentId: 5, children: [] },
      { id: 52, name: 'Souris', slug: 'souris', parentId: 5, children: [] },
      { id: 53, name: 'Casques', slug: 'casques', parentId: 5, children: [] },
      { id: 54, name: 'Tapis de souris', slug: 'tapis', parentId: 5, children: [] },
      { id: 55, name: 'Webcams & Micros', slug: 'webcams-micros', parentId: 5, children: [] },
    ],
  },
  {
    id: 6,
    name: 'Consoles',
    slug: 'consoles',
    description: 'PS5, Xbox, Switch et accessoires.',
    imageUrl: 'https://placehold.co/600x400/F5F5F5/334155?text=Consoles',
    children: [
      { id: 61, name: 'PlayStation 5', slug: 'console-ps5', parentId: 6, children: [] },
      { id: 62, name: 'Xbox Series', slug: 'console-xbox', parentId: 6, children: [] },
      { id: 63, name: 'Nintendo Switch', slug: 'console-switch', parentId: 6, children: [] },
      { id: 64, name: 'Jeux video', slug: 'jeux-video', parentId: 6, children: [] },
    ],
  },
  {
    id: 7,
    name: 'Chaises & Bureaux',
    slug: 'chaises-bureaux',
    description: 'Gaming setup confortable et stylise.',
    imageUrl: 'https://placehold.co/600x400/F5F5F5/334155?text=Gaming+Setup',
    children: [
      { id: 71, name: 'Chaises Gamer', slug: 'chaises-gamer', parentId: 7, children: [] },
      { id: 72, name: 'Bureaux Gamer', slug: 'bureaux-gamer', parentId: 7, children: [] },
      { id: 73, name: 'Accessoires Setup', slug: 'accessoires-setup', parentId: 7, children: [] },
    ],
  },
]

/**
 * Aplatit l'arbre des categories (parents + enfants) pour lookup par slug ou id.
 */
export const flatCategories: Category[] = categories.flatMap((c) => [c, ...c.children])

export function findCategoryBySlug(slug: string): Category | undefined {
  return flatCategories.find((c) => c.slug === slug)
}

export function findCategoryById(id: number): Category | undefined {
  return flatCategories.find((c) => c.id === id)
}
