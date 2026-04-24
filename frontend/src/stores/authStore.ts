import { create } from 'zustand'
import * as authApi from '@/api/auth'
import type { AuthUser } from '@/types'

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'guest'

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  hydrate: () => Promise<void>
  login: (data: { email: string; password: string; rememberMe?: boolean }) => Promise<void>
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'phone'>>) => void
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  status: 'idle',

  hydrate: async () => {
    if (get().status !== 'idle') return
    set({ status: 'loading' })
    const user = await authApi.getMe()
    set({ user, status: user ? 'authenticated' : 'guest' })
  },

  login: async ({ email, password, rememberMe }) => {
    const user = await authApi.login({ email, password, rememberMe })
    set({ user, status: 'authenticated' })
  },

  register: async (data) => {
    const user = await authApi.register(data)
    set({ user, status: 'authenticated' })
  },

  logout: async () => {
    try {
      await authApi.logout()
    } catch {
      // Cookie expiré ou backend indisponible — on déconnecte quand même
    }
    set({ user: null, status: 'guest' })
  },

  updateProfile: (data) =>
    set((state) =>
      state.user ? { user: { ...state.user, ...data } } : state,
    ),
}))
