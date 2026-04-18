/**
 * Types partages TechSpace.
 *
 * En Phase 4, ces types serviront de reference pour les DTOs C# backend
 * (alignement 1:1 pour simplifier le branchement).
 */

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: number
  children: Category[]
}

export interface Brand {
  id: number
  name: string
  slug: string
  logoUrl?: string
}

export interface ProductSpecification {
  group: string
  key: string
  value: string
}

export interface Product {
  id: number
  name: string
  slug: string
  shortDescription: string
  description: string
  sku: string
  price: number
  oldPrice?: number
  stock: number
  isActive: boolean
  isFeatured: boolean
  mainImage: string
  images: string[]
  categoryId: number
  categoryName: string
  categorySlug?: string
  brandId?: number
  brandName?: string
  specifications: ProductSpecification[]
  rating: number
  reviewCount: number
  createdAt?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Banner {
  id: number
  title: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  ctaLabel?: string
  isActive: boolean
}

export interface Review {
  id: number
  productId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export type UserRole = 'customer' | 'admin'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'

export interface OrderItem {
  productId: number
  productName: string
  productImage?: string
  unitPrice: number
  quantity: number
  total: number
}

export interface Address {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  postalCode: string
  country: string
}

export interface Order {
  id: number
  orderNumber: string
  status: OrderStatus
  items: OrderItem[]
  address: Address
  subtotal: number
  shipping: number
  discount: number
  total: number
  paymentMethod: 'cod'
  createdAt: string
}

export type ProductSort = 'price-asc' | 'price-desc' | 'newest' | 'popular' | 'rating' | 'promo'

export interface ProductsQuery {
  page?: number
  pageSize?: number
  categorySlug?: string
  brandSlugs?: string[]
  search?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  featured?: boolean
  sortBy?: ProductSort
}

export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
}

export type ProductsPage = PagedResult<Product>
