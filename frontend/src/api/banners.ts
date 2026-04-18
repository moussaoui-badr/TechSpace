import type { Banner } from '@/types'
import { http } from './http'

interface BannerDto {
  id: number
  title: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  ctaLabel?: string
}

export async function getBanners(): Promise<Banner[]> {
  const { data } = await http.get<BannerDto[]>('/banners')
  return data.map((b) => ({ ...b, isActive: true }))
}
