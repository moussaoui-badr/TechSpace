import { http } from './http'
import type { AuthUser } from '@/types'

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

export interface LoginData {
  email: string
  password: string
  rememberMe?: boolean
}

export async function register(data: RegisterData): Promise<AuthUser> {
  const res = await http.post<AuthUser>('/auth/register', data)
  return res.data
}

export async function login(data: LoginData): Promise<AuthUser> {
  const res = await http.post<AuthUser>('/auth/login', data)
  return res.data
}

export async function logout(): Promise<void> {
  await http.post('/auth/logout')
}

export async function getMe(): Promise<AuthUser | null> {
  try {
    const res = await http.get<AuthUser>('/auth/me')
    return res.data
  } catch {
    return null
  }
}
