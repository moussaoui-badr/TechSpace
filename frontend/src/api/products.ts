import type { Product, ProductsPage, ProductsQuery } from '@/types'
import { products, findProductBySlug } from '@/data/products'
import { getCategoryAndDescendantIds } from './categories'
import { delay } from './delay'

const DEFAULT_PAGE_SIZE = 12

function brandToSlug(brandName: string | undefined): string | undefined {
  return brandName?.toLowerCase().replace(/\s+/g, '-')
}

export async function getProducts(query: ProductsQuery = {}): Promise<ProductsPage> {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    categorySlug,
    brandSlugs,
    search,
    minPrice,
    maxPrice,
    inStock,
    sortBy = 'newest',
  } = query

  let list = [...products].filter((p) => p.isActive)

  if (categorySlug) {
    const ids = getCategoryAndDescendantIds(categorySlug)
    list = list.filter((p) => ids.includes(p.categoryId))
  }

  if (brandSlugs && brandSlugs.length > 0) {
    const set = new Set(brandSlugs)
    list = list.filter((p) => {
      const slug = brandToSlug(p.brandName)
      return slug !== undefined && set.has(slug)
    })
  }

  if (search && search.trim().length > 0) {
    const q = search.trim().toLowerCase()
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    )
  }

  if (typeof minPrice === 'number') {
    list = list.filter((p) => p.price >= minPrice)
  }
  if (typeof maxPrice === 'number') {
    list = list.filter((p) => p.price <= maxPrice)
  }
  if (inStock) {
    list = list.filter((p) => p.stock > 0)
  }

  switch (sortBy) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      list.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      list.sort((a, b) => b.rating - a.rating)
      break
    case 'popular':
      list.sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'promo':
      list = list.filter((p) => typeof p.oldPrice === 'number' && p.oldPrice > p.price)
      list.sort((a, b) => {
        const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0
        const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0
        return db - da
      })
      break
    case 'newest':
    default:
      list.sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
      break
  }

  const totalCount = list.length
  const start = (page - 1) * pageSize
  const items = list.slice(start, start + pageSize)

  return delay({ items, totalCount, page, pageSize })
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = findProductBySlug(slug)
  return delay(product ?? null)
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const featured = products.filter((p) => p.isActive && p.isFeatured).slice(0, limit)
  return delay(featured)
}

export async function getPromoProducts(limit = 8): Promise<Product[]> {
  const promos = products
    .filter((p) => p.isActive && typeof p.oldPrice === 'number' && p.oldPrice > p.price)
    .slice(0, limit)
  return delay(promos)
}

export async function getSimilarProducts(product: Product, limit = 4): Promise<Product[]> {
  const similar = products
    .filter((p) => p.isActive && p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit)
  return delay(similar)
}
