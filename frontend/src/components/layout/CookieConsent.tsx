import { useEffect, useState } from 'react'
import { Cookie, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

const STORAGE_KEY = 'techspace-cookie-consent'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) setVisible(true)
  }, [])

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
      className="fixed inset-x-2 bottom-2 z-50 flex flex-col gap-3 rounded-md border border-border bg-background p-4 shadow-xl sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md sm:flex-row sm:items-start sm:gap-4 sm:p-5"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Cookie className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-text">Gestion des cookies</h3>
        <p className="mt-1 text-xs text-text-muted">
          Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et
          personnaliser les contenus. Consultez notre{' '}
          <Link to="/privacy" className="text-primary hover:underline">
            politique de confidentialité
          </Link>
          .
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={accept}>
            J'accepte
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={dismiss}>
            Paramètres
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
