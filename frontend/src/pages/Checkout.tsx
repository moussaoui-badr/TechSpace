import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useCartStore, cartSubtotal } from '@/stores/cartStore'
import { formatPrice } from '@/utils/formatPrice'

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia',
]

interface FormState {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
}

const EMPTY_FORM: FormState = {
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const subtotal = cartSubtotal(items)
  const shipping = subtotal >= 500 ? 0 : 49
  const total = subtotal + shipping

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    else if (!/^[0-9+\s\-]{9,15}$/.test(form.phone)) e.phone = 'Numéro invalide'
    if (!form.address.trim()) e.address = 'Adresse requise'
    if (!form.city) e.city = 'Ville requise'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    setTimeout(() => {
      clear()
      navigate('/order-confirmation')
    }, 800)
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <p className="text-text-muted">Votre panier est vide.</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Voir le catalogue
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold text-text">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Formulaire livraison */}
          <div className="rounded-lg border border-border bg-background p-6 shadow-card">
            <h2 className="mb-5 text-base font-bold text-text">Adresse de livraison</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Prénom"
                value={form.firstName}
                error={errors.firstName}
                onChange={(v) => handleChange('firstName', v)}
                placeholder="Mohammed"
              />
              <Field
                label="Nom"
                value={form.lastName}
                error={errors.lastName}
                onChange={(v) => handleChange('lastName', v)}
                placeholder="Alaoui"
              />
              <Field
                label="Téléphone"
                value={form.phone}
                error={errors.phone}
                onChange={(v) => handleChange('phone', v)}
                placeholder="+212 6 00 00 00 00"
                type="tel"
                className="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-text">
                  Adresse complète
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="N° rue, quartier, résidence..."
                  className={fieldCls(!!errors.address)}
                />
                {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-text">Ville</label>
                <select
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={fieldCls(!!errors.city)}
                >
                  <option value="">Choisir une ville...</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.city && <p className="mt-1 text-xs text-danger">{errors.city}</p>}
              </div>
            </div>

            <div className="mt-6 rounded-md border border-border bg-surface p-4 text-sm text-text-muted">
              <p className="font-medium text-text">Paiement à la livraison</p>
              <p className="mt-1">Le livreur accepte les espèces et la carte bancaire à la réception.</p>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-lg border border-border bg-background p-5 shadow-card">
              <h2 className="mb-4 text-base font-bold text-text">Votre commande</h2>

              <div className="space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={product.mainImage}
                      alt={product.name}
                      className="h-10 w-10 shrink-0 rounded object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-text truncate">{product.name}</p>
                      <p className="text-text-muted">× {quantity}</p>
                    </div>
                    <span className="font-medium text-text shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <hr className="my-4 border-border" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Livraison</span>
                  <span className={shipping === 0 ? 'font-medium text-success' : ''}>
                    {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <hr className="my-4 border-border" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-text">Total</span>
                <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
              </div>

              <Button
                type="submit"
                className="mt-4 w-full"
                isLoading={isSubmitting}
              >
                Confirmer la commande
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

// ————————————— Sous-composants —————————————

function fieldCls(hasError: boolean) {
  return [
    'h-10 w-full rounded-md border bg-background px-3 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary',
    hasError ? 'border-danger' : 'border-border',
  ].join(' ')
}

interface FieldProps {
  label: string
  value: string
  error?: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  className?: string
}

function Field({ label, value, error, onChange, placeholder, type = 'text', className }: FieldProps) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={fieldCls(!!error)}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}
