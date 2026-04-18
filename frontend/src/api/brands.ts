import type { Brand } from '@/types'
import { http } from './http'

export async function getBrands(): Promise<Brand[]> {
  const { data } = await http.get<Brand[]>('/brands')
  return data
}
