import type { Brand } from '@/types'

export const brands: Brand[] = [
  { id: 1, name: 'MSI', slug: 'msi', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=MSI' },
  { id: 2, name: 'ASUS', slug: 'asus', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=ASUS' },
  { id: 3, name: 'Corsair', slug: 'corsair', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=CORSAIR' },
  { id: 4, name: 'AMD', slug: 'amd', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=AMD' },
  { id: 5, name: 'NVIDIA', slug: 'nvidia', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=NVIDIA' },
  { id: 6, name: 'Intel', slug: 'intel', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=intel' },
  { id: 7, name: 'Logitech', slug: 'logitech', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=Logitech' },
  { id: 8, name: 'HyperX', slug: 'hyperx', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=HyperX' },
  { id: 9, name: 'Samsung', slug: 'samsung', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=SAMSUNG' },
  { id: 10, name: 'Western Digital', slug: 'western-digital', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=WD' },
  { id: 11, name: 'Sony', slug: 'sony', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=SONY' },
  { id: 12, name: 'Microsoft', slug: 'microsoft', logoUrl: 'https://placehold.co/200x80/1A1A2E/F6F6F6?text=Microsoft' },
]

export function findBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug)
}

export function findBrandById(id: number): Brand | undefined {
  return brands.find((b) => b.id === id)
}
