import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateProfile: (data: Partial<Pick<User, 'firstName' | 'lastName' | 'phone'>>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...data } } : state,
        ),
    }),
    { name: 'techspace-auth' },
  ),
)
