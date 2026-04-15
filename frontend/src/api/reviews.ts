import type { Review } from '@/types'
import { findReviewsByProductId } from '@/data/reviews'
import { delay } from './delay'

export async function getReviewsByProductId(productId: number): Promise<Review[]> {
  return delay(findReviewsByProductId(productId))
}
