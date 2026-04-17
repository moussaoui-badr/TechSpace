import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/types'

const MAX_HISTORY = 12

interface HistoryEntry {
  product: Product
  viewedAt: number
}

interface HistoryState {
  entries: HistoryEntry[]
  track: (product: Product) => void
  clear: () => void
  remove: (productId: number) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      entries: [],
      track: (product) => {
        const filtered = get().entries.filter((e) => e.product.id !== product.id)
        const next = [{ product, viewedAt: Date.now() }, ...filtered].slice(0, MAX_HISTORY)
        set({ entries: next })
      },
      clear: () => set({ entries: [] }),
      remove: (productId) =>
        set((state) => ({ entries: state.entries.filter((e) => e.product.id !== productId) })),
    }),
    { name: 'techspace-history' },
  ),
)

export const HISTORY_LIMIT = MAX_HISTORY
