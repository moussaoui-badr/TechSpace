import type { Review } from '@/types'
import { http } from './http'

export async function getReviewsByProductId(productId: number): Promise<Review[]> {
  const { data } = await http.get<Review[]>(`/products/${productId}/reviews`)
  return data
}
