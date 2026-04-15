import type { Banner } from '@/types'
import { banners } from '@/data/banners'
import { delay } from './delay'

export async function getBanners(): Promise<Banner[]> {
  return delay(banners.filter((b) => b.isActive))
}
