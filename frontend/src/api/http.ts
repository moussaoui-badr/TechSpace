import axios, { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5265/api'

export const http = axios.create({
  baseURL,
  timeout: 10_000,
  withCredentials: true,
  headers: { Accept: 'application/json' },
})

http.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? ''
      // Ne pas logout lors du hydrate silencieux
      if (!url.includes('/auth/me')) {
        useAuthStore.getState().logout()
      }
    }
    return Promise.reject(error)
  },
)

export function isNotFound(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404
}
