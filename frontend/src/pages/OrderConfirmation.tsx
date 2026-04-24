import { Link } from 'react-router-dom'
import { CheckCircle, Package, Truck } from 'lucide-react'

export function OrderConfirmationPage() {
  const orderNumber = `TS-${Date.now().toString().slice(-8)}`

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 text-center">
      <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </span>

      <h1 className="mt-6 text-3xl font-bold text-text">Commande confirmée !</h1>
      <p className="mt-2 text-text-muted">
        Merci pour votre commande. Nous vous contacterons pour confirmer la livraison.
      </p>

      <div className="mt-8 rounded-xl border border-border bg-surface p-6 text-left">
        <p className="text-sm text-text-muted">Numéro de commande</p>
        <p className="mt-1 font-mono text-lg font-bold text-primary">{orderNumber}</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left">
          <Truck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-text">Délai de livraison</p>
            <p className="text-sm text-text-muted">2 à 4 jours ouvrés au Maroc</p>
          </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-left">
          <Package className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-semibold text-text">Paiement</p>
            <p className="text-sm text-text-muted">À la livraison en espèces ou carte</p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          to="/products"
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(0,159,227,0.45)] transition-colors hover:bg-primary-hover"
        >
          Continuer mes achats
        </Link>
        <Link
          to="/account"
          className="inline-flex h-11 items-center justify-center rounded-md border border-primary px-5 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
        >
          Voir mes commandes
        </Link>
      </div>
    </div>
  )
}
