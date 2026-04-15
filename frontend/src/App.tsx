import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { HomePage } from '@/pages/Home'
import { CatalogPage } from '@/pages/Catalog'
import { ProductDetailPage } from '@/pages/ProductDetail'
import { CartPage } from '@/pages/Cart'
import { CheckoutPage } from '@/pages/Checkout'
import { LoginPage } from '@/pages/Login'
import { RegisterPage } from '@/pages/Register'
import { AccountPage } from '@/pages/Account'
import { NotFoundPage } from '@/pages/NotFound'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboard'
import { AdminProductsPage } from '@/pages/admin/AdminProducts'
import { AdminOrdersPage } from '@/pages/admin/AdminOrders'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategories'

export function App() {
  return (
    <Routes>
      {/* Site public */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<CatalogPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="category/:slug" element={<CatalogPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="account/*" element={<AccountPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Back-office */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="banners" element={<AdminCategoriesPage />} />
        <Route path="users" element={<AdminCategoriesPage />} />
        <Route path="stats" element={<AdminCategoriesPage />} />
      </Route>
    </Routes>
  )
}
