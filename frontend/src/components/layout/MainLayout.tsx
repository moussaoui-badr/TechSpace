import { Outlet } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CompareBar } from '@/components/layout/CompareBar'
import { CookieConsent } from '@/components/layout/CookieConsent'

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
      <CookieConsent />
    </div>
  )
}
