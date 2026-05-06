import { http } from './http'
import type { ApiOrder } from '@/types'

export interface CheckoutPayload {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  postalCode: string
  paymentMethod: 0 | 1
  items: { productId: number; quantity: number }[]
}

export async function createOrder(payload: CheckoutPayload): Promise<ApiOrder> {
  const res = await http.post<ApiOrder>('/orders/checkout', payload)
  return res.data
}

export async function getMyOrders(): Promise<ApiOrder[]> {
  const res = await http.get<ApiOrder[]>('/orders/mine')
  return res.data
}

export async function getOrder(orderNumber: string): Promise<ApiOrder> {
  const res = await http.get<ApiOrder>(`/orders/${orderNumber}`)
  return res.data
}
