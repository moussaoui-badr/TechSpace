import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useCatalogStore } from '@/stores/catalogStore'
import { MainLayout } from '@/components/layout/MainLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { HomePage } from '@/pages/Home'
import { CatalogPage } from '@/pages/Catalog'
import { ProductDetailPage } from '@/pages/ProductDetail'
import { CartPage } from '@/pages/Cart'
import { CheckoutPage } from '@/pages/Checkout'
import { OrderConfirmationPage } from '@/pages/OrderConfirmation'
import { LoginPage } from '@/pages/Login'
import { RegisterPage } from '@/pages/Register'
import { AccountPage } from '@/pages/Account'
import { PcBuilderPage } from '@/pages/PcBuilder'
import { ComparePage } from '@/pages/Compare'
import { NotFoundPage } from '@/pages/NotFound'
import { AboutPage } from '@/pages/About'
import { ContactPage } from '@/pages/Contact'
import { FaqPage } from '@/pages/Faq'
import { ShippingPage } from '@/pages/Shipping'
import { BrandsPage } from '@/pages/Brands'
import { TermsPage } from '@/pages/Terms'
import { LegalPage } from '@/pages/Legal'
import { PrivacyPage } from '@/pages/Privacy'
import { ReturnsPage } from '@/pages/Returns'
import { StubPage } from '@/pages/StubPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboard'
import { AdminProductsPage } from '@/pages/admin/AdminProducts'
import { AdminOrdersPage } from '@/pages/admin/AdminOrders'
import { AdminCategoriesPage } from '@/pages/admin/AdminCategories'
import { AdminUsersPage } from '@/pages/admin/AdminUsers'
import { AdminBannersPage } from '@/pages/admin/AdminBanners'

export function App() {
  const hydrate = useCatalogStore((s) => s.hydrate)
  useEffect(() => {
    void hydrate()
  }, [hydrate])
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
        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="account/*" element={<AccountPage />} />
        <Route path="pc-builder" element={<PcBuilderPage />} />
        <Route path="compare" element={<ComparePage />} />

        {/* Pages vitrine */}
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="shipping" element={<ShippingPage />} />
        <Route path="brands" element={<BrandsPage />} />

        {/* Pages légales */}
        <Route path="terms" element={<TermsPage />} />
        <Route path="legal" element={<LegalPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="returns" element={<ReturnsPage />} />

        {/* Stubs restants */}
        <Route path="orders" element={<StubPage title="Mes commandes" subtitle="Accédez à vos commandes depuis votre espace client." />} />
        <Route path="gifts" element={<StubPage title="Cadeau offert" subtitle="Profitez de nos offres cadeaux exclusives." />} />
        <Route path="sell" element={<StubPage title="Vendre sur Loot" subtitle="Rejoignez notre marketplace en tant que vendeur." />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Back-office */}
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="banners" element={<AdminBannersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="stats" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  )
}
