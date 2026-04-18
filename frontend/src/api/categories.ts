import type { Category } from '@/types'
import { http } from './http'

function flatten(tree: Category[]): Category[] {
  const out: Category[] = []
  for (const c of tree) {
    out.push(c)
    if (c.children?.length) out.push(...flatten(c.children))
  }
  return out
}

let cache: Promise<Category[]> | null = null

export async function getCategories(): Promise<Category[]> {
  if (!cache) {
    cache = http.get<Category[]>('/categories').then((r) => r.data)
  }
  return cache
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const tree = await getCategories()
  return flatten(tree).find((c) => c.slug === slug) ?? null
}

export async function getCategoryAndDescendantIds(slug: string): Promise<number[]> {
  const cat = await getCategoryBySlug(slug)
  if (!cat) return []
  if (!cat.children || cat.children.length === 0) return [cat.id]
  return [cat.id, ...flatten(cat.children).map((c) => c.id)]
}
