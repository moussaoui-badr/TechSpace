import type { Category } from '@/types'
import { categories, flatCategories, findCategoryBySlug } from '@/data/categories'
import { delay } from './delay'

export async function getCategories(): Promise<Category[]> {
  return delay(categories)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cat = findCategoryBySlug(slug)
  return delay(cat ?? null)
}

/**
 * Retourne les IDs de la categorie + toutes ses descendantes.
 * Utilise pour filtrer les produits quand l utilisateur clique sur une
 * categorie parente (ex. "Composants" doit matcher tous les Processeurs, GPUs...).
 */
export function getCategoryAndDescendantIds(slug: string): number[] {
  const cat = flatCategories.find((c) => c.slug === slug)
  if (!cat) return []
  if (cat.children.length === 0) return [cat.id]
  return [cat.id, ...cat.children.map((c) => c.id)]
}
