import { http } from './http'
import type { SavedAddress } from '@/types'

export interface UpsertAddressData {
  label: string
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  postalCode: string
  country?: string
  isDefault?: boolean
}

export async function listAddresses(): Promise<SavedAddress[]> {
  const res = await http.get<SavedAddress[]>('/addresses')
  return res.data
}

export async function createAddress(data: UpsertAddressData): Promise<SavedAddress> {
  const res = await http.post<SavedAddress>('/addresses', data)
  return res.data
}

export async function updateAddress(id: string, data: UpsertAddressData): Promise<SavedAddress> {
  const res = await http.put<SavedAddress>(`/addresses/${id}`, data)
  return res.data
}

export async function deleteAddress(id: string): Promise<void> {
  await http.delete(`/addresses/${id}`)
}

export async function setDefaultAddress(id: string): Promise<SavedAddress> {
  const res = await http.post<SavedAddress>(`/addresses/${id}/default`)
  return res.data
}
