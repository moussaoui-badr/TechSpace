import { useState } from 'react'
import { Cookie, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const STORAGE_KEY = 'techspace-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(() => !window.localStorage.getItem(STORAGE_KEY))

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, 'dismissed')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Consentement cookies"
      className="fixed inset-x-2 bottom-2 z-50 flex items-start gap-3 rounded-md border border-border bg-background p-3 shadow-xl sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md sm:gap-4 sm:p-5"
    >
      <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary sm:flex">
        <Cookie className="h-5 w-5" />
      </span>
      <div className="flex-1 pr-6">
        <h3 className="text-sm font-bold text-text">Gestion des cookies</h3>
        <p className="mt-1 line-clamp-2 text-xs text-text-muted sm:line-clamp-none">
          Nous utilisons des cookies pour améliorer votre expérience.{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            En savoir plus
          </Link>
        </p>
        <div className="mt-2.5 flex gap-2 sm:mt-3">
          <Button type="button" size="sm" onClick={accept} className="flex-1 sm:flex-none">
            J'accepte
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={dismiss} className="flex-1 sm:flex-none">
            Refuser
          </Button>
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Fermer"
        className="absolute right-2 top-2 text-text-muted transition-colors hover:text-text sm:static"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
