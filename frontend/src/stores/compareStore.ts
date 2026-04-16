import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

const MAX_COMPARE = 4

interface CompareState {
  items: Product[]
  toggle: (product: Product) => void
  remove: (productId: number) => void
  clear: () => void
  has: (productId: number) => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const items = get().items
        const exists = items.some((p) => p.id === product.id)
        if (exists) {
          set({ items: items.filter((p) => p.id !== product.id) })
          return
        }
        if (items.length >= MAX_COMPARE) return
        set({ items: [...items, product] })
      },
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== productId) })),
      clear: () => set({ items: [] }),
      has: (productId) => get().items.some((p) => p.id === productId),
    }),
    { name: 'techspace-compare' },
  ),
)

export const COMPARE_LIMIT = MAX_COMPARE
