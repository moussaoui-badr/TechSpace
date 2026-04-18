import { create } from 'zustand'
import type { Brand, Category, Product } from '@/types'
import { getCategories } from '@/api/categories'
import { getBrands } from '@/api/brands'
import { getProducts } from '@/api/products'

interface CatalogState {
  categories: Category[]
  flatCategories: Category[]
  brands: Brand[]
  productsIndex: Product[]
  hydrated: boolean
  hydrate: () => Promise<void>
  findCategoryBySlug: (slug: string) => Category | undefined
  findCategoryById: (id: number) => Category | undefined
}

function flatten(tree: Category[]): Category[] {
  const out: Category[] = []
  for (const c of tree) {
    out.push(c)
    if (c.children?.length) out.push(...flatten(c.children))
  }
  return out
}

let inflight: Promise<void> | null = null

export const useCatalogStore = create<CatalogState>((set, get) => ({
  categories: [],
  flatCategories: [],
  brands: [],
  productsIndex: [],
  hydrated: false,

  hydrate: async () => {
    if (get().hydrated || inflight) return inflight ?? undefined
    inflight = (async () => {
      const [categories, brands, firstPage] = await Promise.all([
        getCategories(),
        getBrands(),
        getProducts({ pageSize: 100 }),
      ])
      set({
        categories,
        flatCategories: flatten(categories),
        brands,
        productsIndex: firstPage.items,
        hydrated: true,
      })
    })()
    try {
      await inflight
    } finally {
      inflight = null
    }
  },

  findCategoryBySlug: (slug) => get().flatCategories.find((c) => c.slug === slug),
  findCategoryById: (id) => get().flatCategories.find((c) => c.id === id),
}))
