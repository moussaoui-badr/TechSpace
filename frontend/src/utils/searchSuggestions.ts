import type { Product } from '@/types'
import { NAV_CATEGORIES } from '@/components/layout/navigationData'
import { products } from '@/data/products'

export interface CategoryHit {
  slug: string
  label: string
  parentLabel?: string
}

const MAX_CATEGORIES = 5
const MAX_PRODUCTS = 6

export function computeCategoryHits(query: string): CategoryHit[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return []
  const hits: CategoryHit[] = []
  for (const cat of NAV_CATEGORIES) {
    if (cat.label.toLowerCase().includes(q)) {
      hits.push({ slug: cat.slug, label: cat.label })
    }
    for (const child of cat.children) {
      if (child.label.toLowerCase().includes(q)) {
        hits.push({ slug: child.slug, label: child.label, parentLabel: cat.label })
      }
      if (hits.length >= MAX_CATEGORIES) return hits.slice(0, MAX_CATEGORIES)
    }
  }
  return hits.slice(0, MAX_CATEGORIES)
}

export function filterProducts(query: string): Product[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) return []
  const matches = products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.brandName?.toLowerCase().includes(q) ?? false) ||
      p.sku.toLowerCase().includes(q),
  )
  return matches.sort((a, b) => b.rating - a.rating).slice(0, MAX_PRODUCTS)
}
