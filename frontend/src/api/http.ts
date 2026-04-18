import axios, { AxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5265/api'

export const http = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})

export function isNotFound(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 404
}
