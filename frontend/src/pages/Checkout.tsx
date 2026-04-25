import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Banknote,
  Building2,
  ChevronRight,
  CreditCard,
  MapPin,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore, cartSubtotal } from '@/stores/cartStore'
import { formatPrice } from '@/utils/formatPrice'

const CITIES = [
  'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir',
  'Meknès', 'Oujda', 'Kénitra', 'Tétouan', 'Salé', 'Mohammedia',
  'El Jadida', 'Beni Mellal', 'Laâyoune', 'Dakhla',
]

const SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 40

interface FormState {
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  postalCode: string
}

type PaymentMethod = 'cod' | 'transfer'

const EMPTY_FORM: FormState = {
  firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: '',
}

const STEPS = [
  { label: 'Panier', icon: ShoppingCart },
  { label: 'Livraison', icon: MapPin },
  { label: 'Paiement', icon: CreditCard },
]

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export function CheckoutPage() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const subtotal = cartSubtotal(items)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [payment, setPayment] = useState<PaymentMethod>('cod')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function validate(): boolean {
    const e: Partial<FormState> = {}
    if (!form.firstName.trim()) e.firstName = 'Prénom requis'
    if (!form.lastName.trim()) e.lastName = 'Nom requis'
    if (!form.phone.trim()) e.phone = 'Téléphone requis'
    else if (!/^[0-9+\s-]{9,15}$/.test(form.phone)) e.phone = 'Numéro invalide'
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
    }, 1000)
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <ShoppingCart className="h-12 w-12 text-text-subtle" />
        <p className="text-text-muted">Votre panier est vide.</p>
        <button type="button" onClick={() => navigate('/products')} className="text-sm font-medium text-primary hover:underline">
          Voir le catalogue
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Hero compact navy */}
      <div className="bg-navy py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <h1 className="font-display text-3xl font-black uppercase tracking-wide text-white">
              Finaliser la commande
            </h1>
            {/* Breadcrumb progression */}
            <div className="mt-4 flex items-center gap-1">
              {STEPS.map((step, i) => {
                const active = i === 1
                const done = i === 0
                return (
                  <div key={step.label} className="flex items-center gap-1">
                    {i > 0 && <ChevronRight className="h-3 w-3 text-white/30" />}
                    <span className={[
                      'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all',
                      done ? 'bg-white/20 text-white/60 line-through' :
                      active ? 'bg-primary text-white shadow-cyan' :
                      'text-white/40',
                    ].join(' ')}>
                      <step.icon className="h-3 w-3" />
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contenu */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">

            {/* ── Colonne gauche ── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-5"
            >
              {/* Adresse de livraison */}
              <div className="overflow-hidden rounded-xl border border-border bg-background shadow-card">
                <div className="flex items-center gap-3 border-b border-border bg-surface px-5 py-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">1</span>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-text">
                    Adresse de livraison
                  </h2>
                </div>
                <div className="p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Prénom" value={form.firstName} error={errors.firstName}
                      onChange={(v) => handleChange('firstName', v)} placeholder="Mohammed" />
                    <Field label="Nom" value={form.lastName} error={errors.lastName}
                      onChange={(v) => handleChange('lastName', v)} placeholder="Alaoui" />
                    <div className="sm:col-span-2">
                      <Field label="Téléphone" value={form.phone} error={errors.phone} type="tel"
                        onChange={(v) => handleChange('phone', v)} placeholder="+212 6 00 00 00 00" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-text">Adresse complète</label>
                      <input
                        type="text" value={form.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        placeholder="N° rue, quartier, résidence..."
                        className={inputCls(!!errors.address)}
                      />
                      {errors.address && <p className="mt-1 text-xs text-danger">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-text">Ville</label>
                      <select value={form.city} onChange={(e) => handleChange('city', e.target.value)}
                        className={inputCls(!!errors.city)}>
                        <option value="">Choisir une ville…</option>
                        {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="mt-1 text-xs text-danger">{errors.city}</p>}
                    </div>
                    <Field label="Code postal" value={form.postalCode}
                      onChange={(v) => handleChange('postalCode', v)} placeholder="20000" />
                  </div>
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="overflow-hidden rounded-xl border border-border bg-background shadow-card">
                <div className="flex items-center gap-3 border-b border-border bg-surface px-5 py-4">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">2</span>
                  <h2 className="font-display text-lg font-bold uppercase tracking-wide text-text">
                    Mode de paiement
                  </h2>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2">
                  <PaymentCard
                    id="cod"
                    selected={payment === 'cod'}
                    onSelect={() => setPayment('cod')}
                    icon={<Banknote className="h-6 w-6" />}
                    title="Paiement à la livraison"
                    description="Espèces ou carte bancaire à réception de votre colis."
                    badge="Le plus populaire"
                  />
                  <PaymentCard
                    id="transfer"
                    selected={payment === 'transfer'}
                    onSelect={() => setPayment('transfer')}
                    icon={<Building2 className="h-6 w-6" />}
                    title="Virement bancaire"
                    description="Virement CIH ou Attijariwafa. Traitement sous 24h."
                  />
                </div>
              </div>

              {/* Info livraison */}
              <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-primary-soft px-5 py-3.5">
                <Truck className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-text-muted">
                  {shipping === 0
                    ? <><span className="font-semibold text-success">Livraison gratuite</span> — commande ≥ {formatPrice(SHIPPING_THRESHOLD)}</>
                    : <>Livraison <span className="font-semibold text-text">{formatPrice(SHIPPING_COST)}</span> — gratuite dès {formatPrice(SHIPPING_THRESHOLD)}</>
                  }
                </p>
              </div>
            </motion.div>

            {/* ── Récapitulatif sticky ── */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-background shadow-elevated">
                <div className="border-b border-border bg-navy px-5 py-4">
                  <h2 className="font-display text-base font-bold uppercase tracking-wide text-white">
                    Récapitulatif ({items.length} article{items.length > 1 ? 's' : ''})
                  </h2>
                </div>

                <div className="divide-y divide-border">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3 px-5 py-3.5 text-sm">
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-border bg-surface">
                        <img src={product.mainImage} alt={product.name}
                          className="h-full w-full object-contain p-0.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-text leading-tight">{product.name}</p>
                        <p className="mt-0.5 text-xs text-text-muted">Qté : {quantity}</p>
                      </div>
                      <span className="shrink-0 font-semibold text-text">
                        {formatPrice(product.price * quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border bg-surface px-5 py-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-text-muted">
                      <span>Sous-total</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Livraison</span>
                      <span className={shipping === 0 ? 'font-semibold text-success' : 'text-text'}>
                        {shipping === 0 ? 'Gratuite' : formatPrice(shipping)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-navy px-4 py-3">
                    <span className="font-display text-sm font-bold uppercase tracking-wide text-white/70">Total TTC</span>
                    <span className="font-display text-2xl font-black text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1">
                  <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
                    Confirmer la commande
                  </Button>
                  <p className="mt-2.5 text-center text-xs text-text-subtle">
                    Paiement 100% sécurisé · Satisfait ou remboursé 14 jours
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </form>
      </div>
    </div>
  )
}

// ── Sous-composants ──

function inputCls(hasError: boolean) {
  return [
    'h-10 w-full rounded-lg border bg-background px-3 text-sm text-text placeholder:text-text-subtle',
    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors',
    hasError ? 'border-danger' : 'border-border hover:border-border-strong',
  ].join(' ')
}

interface FieldProps {
  label: string
  value: string
  error?: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}

function Field({ label, value, error, onChange, placeholder, type = 'text' }: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-text">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} className={inputCls(!!error)} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

interface PaymentCardProps {
  id: string
  selected: boolean
  onSelect: () => void
  icon: React.ReactNode
  title: string
  description: string
  badge?: string
}

function PaymentCard({ id, selected, onSelect, icon, title, description, badge }: PaymentCardProps) {
  return (
    <label htmlFor={id} className={[
      'relative flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-4 transition-all',
      selected
        ? 'border-primary bg-primary-soft shadow-cyan'
        : 'border-border bg-background hover:border-primary/40',
    ].join(' ')}>
      <input type="radio" id={id} name="payment" checked={selected} onChange={onSelect} className="sr-only" />
      {badge && (
        <span className="absolute right-3 top-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
      <span className={selected ? 'text-primary' : 'text-text-muted'}>{icon}</span>
      <p className="text-sm font-semibold text-text leading-tight">{title}</p>
      <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      {selected && (
        <span className="absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
          <svg viewBox="0 0 10 8" className="h-2.5 w-2.5 fill-none stroke-white stroke-2">
            <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </label>
  )
}
