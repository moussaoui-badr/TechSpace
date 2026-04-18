import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const MAX_SEARCH_HISTORY = 8

interface SearchHistoryState {
  queries: string[]
  add: (query: string) => void
  remove: (query: string) => void
  clear: () => void
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      queries: [],
      add: (query) => {
        const q = query.trim()
        if (q.length < 2) return
        const filtered = get().queries.filter((x) => x.toLowerCase() !== q.toLowerCase())
        set({ queries: [q, ...filtered].slice(0, MAX_SEARCH_HISTORY) })
      },
      remove: (query) =>
        set((state) => ({ queries: state.queries.filter((x) => x !== query) })),
      clear: () => set({ queries: [] }),
    }),
    { name: 'techspace-search-history' },
  ),
)

export const SEARCH_HISTORY_LIMIT = MAX_SEARCH_HISTORY
