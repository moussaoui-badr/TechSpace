import { create } from 'zustand'

interface UiState {
  isCartOpen: boolean
  isMobileMenuOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useUiStore = create<UiState>((set) => ({
  isCartOpen: false,
  isMobileMenuOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}))
