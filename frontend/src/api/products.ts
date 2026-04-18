import type { Product, ProductsPage, ProductsQuery } from '@/types'
import { http, isNotFound } from './http'

interface ProductSummaryDto {
  id: number
  name: string
  slug: string
  shortDescription: string
  sku: string
  price: number
  oldPrice?: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  mainImage: string
  categoryId: number
  categoryName: string
  categorySlug: string
  brandId?: number
  brandName?: string
  rating: number
  reviewCount: number
  createdAt?: string
}

interface ProductDetailDto extends ProductSummaryDto {
  description: string
  images: string[]
  specifications: { group: string; key: string; value: string }[]
}

interface PagedResultDto<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

function summaryToProduct(dto: ProductSummaryDto): Product {
  return {
    ...dto,
    description: '',
    images: [],
    specifications: [],
  }
}

function detailToProduct(dto: ProductDetailDto): Product {
  return {
    ...dto,
    images: dto.images,
    specifications: dto.specifications,
  }
}

function buildParams(query: ProductsQuery): URLSearchParams {
  const params = new URLSearchParams()
  if (query.page) params.set('page', String(query.page))
  if (query.pageSize) params.set('pageSize', String(query.pageSize))
  if (query.search) params.set('search', query.search)
  if (query.categorySlug) params.set('categorySlug', query.categorySlug)
  if (typeof query.minPrice === 'number') params.set('minPrice', String(query.minPrice))
  if (typeof query.maxPrice === 'number') params.set('maxPrice', String(query.maxPrice))
  if (query.inStock) params.set('inStock', 'true')
  if (query.featured) params.set('featured', 'true')
  if (query.sortBy) params.set('sortBy', query.sortBy)
  if (query.brandSlugs) {
    for (const slug of query.brandSlugs) params.append('brandSlugs', slug)
  }
  return params
}

export async function getProducts(query: ProductsQuery = {}): Promise<ProductsPage> {
  const { data } = await http.get<PagedResultDto<ProductSummaryDto>>('/products', {
    params: buildParams(query),
  })
  return {
    items: data.items.map(summaryToProduct),
    totalCount: data.totalCount,
    page: data.page,
    pageSize: data.pageSize,
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data } = await http.get<ProductDetailDto>(`/products/${encodeURIComponent(slug)}`)
    return detailToProduct(data)
  } catch (error) {
    if (isNotFound(error)) return null
    throw error
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const page = await getProducts({ pageSize: limit, featured: true })
  return page.items
}

export async function getPromoProducts(limit = 8): Promise<Product[]> {
  const page = await getProducts({ pageSize: limit, sortBy: 'promo' })
  return page.items
}

export async function getSimilarProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!product.categorySlug) return []
  const page = await getProducts({
    categorySlug: product.categorySlug,
    pageSize: limit + 1,
  })
  return page.items.filter((p) => p.id !== product.id).slice(0, limit)
}
