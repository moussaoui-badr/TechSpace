import { Route, Routes } from 'react-router-dom'
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
import { NotFoundPage } from '@/pages/NotFound'
import { StubPage } from '@/pages/StubPage'
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
        <Route path="order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="account/*" element={<AccountPage />} />
        <Route path="pc-builder" element={<PcBuilderPage />} />
        <Route path="orders" element={<StubPage title="Mes commandes" subtitle="Suivi de toutes vos commandes." phase="Phase 3" />} />
        <Route path="faq" element={<StubPage title="FAQ" subtitle="Questions fréquentes sur nos services." phase="Phase 3" />} />
        <Route path="brands" element={<StubPage title="Nos marques" subtitle="Toutes les marques disponibles sur TechSpace." phase="Phase 3" />} />
        <Route path="gifts" element={<StubPage title="Cadeau offert" subtitle="Profitez de nos offres cadeaux." phase="Phase 3" />} />
        <Route path="sell" element={<StubPage title="Vendre sur TechSpace" subtitle="Rejoignez notre marketplace en tant que vendeur." phase="Phase 3" />} />
        <Route path="about" element={<StubPage title="À propos de TechSpace" subtitle="Notre histoire et notre mission." phase="Phase 3" />} />
        <Route path="contact" element={<StubPage title="Contactez-nous" subtitle="Notre équipe est disponible 7j/7." phase="Phase 3" />} />
        <Route path="shipping" element={<StubPage title="Livraison" subtitle="Délais et zones de livraison." phase="Phase 3" />} />
        <Route path="returns" element={<StubPage title="Retours & Garantie" subtitle="Politique de retour et garantie produits." phase="Phase 3" />} />
        <Route path="terms" element={<StubPage title="Conditions générales" subtitle="Conditions générales de vente." phase="Phase 3" />} />
        <Route path="legal" element={<StubPage title="Mentions légales" subtitle="Informations légales TechSpace." phase="Phase 3" />} />
        <Route path="privacy" element={<StubPage title="Confidentialité" subtitle="Notre politique de confidentialité." phase="Phase 3" />} />
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
        <Route path="stats" element={<AdminDashboardPage />} />
      </Route>
    </Routes>
  )
}
