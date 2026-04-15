import type { Brand } from '@/types'
import { brands } from '@/data/brands'
import { delay } from './delay'

export async function getBrands(): Promise<Brand[]> {
  return delay(brands)
}
