import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  Edit2,
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Trash2,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/stores/authStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'
import * as addressesApi from '@/api/addresses'
import { formatPrice } from '@/utils/formatPrice'
import { cn } from '@/utils/cn'
import type { OrderStatus, SavedAddress } from '@/types'

// ————— Mock commandes (Phase 4b) —————
interface MockOrderItem {
  name: string
  qty: number
  price: number
  image: string
}
interface MockOrder {
  id: string
  status: OrderStatus
  date: string
  total: number
  items: MockOrderItem[]
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'TS-00000001',
    status: 'delivered',
    date: '2026-03-12',
    total: 6890,
    items: [
      { name: 'AMD Ryzen 7 7800X3D', qty: 1, price: 3490, image: 'https://placehold.co/60x60/F5F5F5/1E3A5F?text=CPU' },
      { name: 'Corsair Vengeance DDR5 32GB', qty: 2, price: 1700, image: 'https://placehold.co/60x60/F5F5F5/1E3A5F?text=RAM' },
    ],
  },
  {
    id: 'TS-00000002',
    status: 'shipping',
    date: '2026-04-10',
    total: 11990,
    items: [
      { name: 'RTX 4080 Super 16GB MSI', qty: 1, price: 11990, image: 'https://placehold.co/60x60/F5F5F5/1E3A5F?text=GPU' },
    ],
  },
]

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  preparing: 'En préparation',
  shipping: 'En livraison',
  delivered: 'Livrée',
  cancelled: 'Annulée',
}

const STATUS_VARIANTS: Record<OrderStatus, 'outline' | 'warning' | 'primary' | 'success' | 'danger'> = {
  pending: 'outline',
  confirmed: 'primary',
  preparing: 'warning',
  shipping: 'primary',
  delivered: 'success',
  cancelled: 'danger',
}

type Tab = 'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'profile'

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: <User className="h-4 w-4" /> },
  { key: 'orders', label: 'Mes commandes', icon: <Package className="h-4 w-4" /> },
  { key: 'wishlist', label: 'Favoris', icon: <Heart className="h-4 w-4" /> },
  { key: 'addresses', label: 'Adresses', icon: <MapPin className="h-4 w-4" /> },
  { key: 'profile', label: 'Profil', icon: <Settings className="h-4 w-4" /> },
]

export function AccountPage() {
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)
  const logout = useAuthStore((s) => s.logout)
  const updateProfile = useAuthStore((s) => s.updateProfile)
  const wishlistIds = useWishlistStore((s) => s.productIds)
  const cartItems = useCartStore((s) => s.items)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  if (status === 'guest' || (status !== 'loading' && status !== 'idle' && !user)) {
    return <Navigate to="/login" replace />
  }

  if (!user) return null

  const fullName = `${user.firstName} ${user.lastName}`.trim()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-background p-4 shadow-card">
            <div className="mb-4 flex items-center gap-3 border-b border-border pb-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {user.firstName.charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text">{fullName}</p>
                <p className="truncate text-xs text-text-muted">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                    activeTab === tab.key
                      ? 'bg-primary-soft text-primary'
                      : 'text-text hover:bg-surface hover:text-primary',
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-4 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => void logout()}
                className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-danger transition-colors hover:bg-danger/10"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </aside>

        {/* Contenu */}
        <div>
          {activeTab === 'dashboard' && (
            <DashboardTab
              name={fullName}
              orderCount={MOCK_ORDERS.length}
              wishlistCount={wishlistIds.length}
              cartCount={cartItems.length}
              onNavigate={setActiveTab}
            />
          )}
          {activeTab === 'orders' && <OrdersTab orders={MOCK_ORDERS} />}
          {activeTab === 'wishlist' && <WishlistTab wishlistIds={wishlistIds} />}
          {activeTab === 'addresses' && <AddressesTab user={user} />}
          {activeTab === 'profile' && (
            <ProfileTab user={user} onSave={updateProfile} />
          )}
        </div>
      </div>
    </div>
  )
}

// ————— Onglets —————

function DashboardTab({
  name,
  orderCount,
  wishlistCount,
  cartCount,
  onNavigate,
}: {
  name: string
  orderCount: number
  wishlistCount: number
  cartCount: number
  onNavigate: (tab: Tab) => void
}) {
  return (
    <div>
      <h1 className="text-xl font-bold text-text">Bonjour, {name || 'Client'} 👋</h1>
      <p className="mt-1 text-sm text-text-muted">Bienvenue dans votre espace personnel.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: <Package className="h-6 w-6 text-primary" />, label: 'Commandes', count: orderCount, tab: 'orders' as Tab },
          { icon: <Heart className="h-6 w-6 text-accent" />, label: 'Favoris', count: wishlistCount, tab: 'wishlist' as Tab },
          { icon: <ShoppingBag className="h-6 w-6 text-secondary" />, label: 'Articles panier', count: cartCount, tab: 'orders' as Tab },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.tab)}
            className="flex flex-col items-center rounded-lg border border-border bg-background p-5 shadow-card transition-shadow hover:shadow-elevated"
          >
            {item.icon}
            <span className="mt-2 text-2xl font-bold text-text">{item.count}</span>
            <span className="text-xs text-text-muted">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm text-text-muted">
        <p className="font-medium text-text">Besoin d'aide ?</p>
        <p className="mt-1">
          Consultez notre{' '}
          <Link to="/faq" className="text-primary hover:underline">FAQ</Link>
          {' '}ou{' '}
          <Link to="/contact" className="text-primary hover:underline">contactez-nous</Link>.
        </p>
      </div>
    </div>
  )
}

function OrdersTab({ orders }: { orders: MockOrder[] }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-text">Mes commandes</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-text-muted">Aucune commande pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-lg border border-border bg-background p-4 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-text">{order.id}</p>
                  <p className="text-xs text-text-muted">{new Date(order.date).toLocaleDateString('fr-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANTS[order.status]} size="sm">
                    {STATUS_LABELS[order.status]}
                  </Badge>
                  <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {order.items.map((item) => (
                  <div key={item.name} className="flex shrink-0 items-center gap-2 text-xs text-text-muted">
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-contain" />
                    <span className="max-w-[100px] truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function WishlistTab({ wishlistIds }: { wishlistIds: number[] }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-text">Mes favoris</h2>
      {wishlistIds.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-text-subtle" />
          <p className="mt-4 text-sm text-text-muted">Aucun favori enregistré.</p>
          <Link to="/products" className="mt-3 inline-block text-sm text-primary hover:underline">
            Parcourir le catalogue
          </Link>
        </div>
      ) : (
        <p className="text-sm text-text-muted">
          {wishlistIds.length} produit{wishlistIds.length > 1 ? 's' : ''} en favoris.
          <Link to="/products" className="ml-2 text-primary hover:underline">Voir le catalogue</Link>
        </p>
      )}
    </div>
  )
}

// ————— Onglet Adresses (branché API) —————

const CITIES_MA = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'El Jadida', 'Beni Mellal', 'Laâyoune', 'Dakhla']

const EMPTY_DRAFT: addressesApi.UpsertAddressData = {
  label: '', fullName: '', phone: '', line1: '', city: '', postalCode: '', country: 'Maroc',
}

function AddressesTab({ user }: { user: { firstName: string; lastName: string } }) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [editing, setEditing] = useState<SavedAddress | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [draft, setDraft] = useState<addressesApi.UpsertAddressData>(EMPTY_DRAFT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    addressesApi.listAddresses()
      .then(setAddresses)
      .catch(() => setError('Impossible de charger les adresses.'))
      .finally(() => setLoading(false))
  }, [])

  function openAdd() {
    setDraft({ ...EMPTY_DRAFT, fullName: `${user.firstName} ${user.lastName}`.trim() })
    setIsAdding(true)
    setEditing(null)
  }

  function openEdit(addr: SavedAddress) {
    setDraft({ label: addr.label, fullName: addr.fullName, phone: addr.phone, line1: addr.line1, line2: addr.line2, city: addr.city, postalCode: addr.postalCode, country: addr.country })
    setEditing(addr)
    setIsAdding(false)
  }

  function closeForm() { setIsAdding(false); setEditing(null) }

  async function save() {
    if (!draft.fullName.trim() || !draft.line1.trim() || !draft.city) return
    setSaving(true)
    try {
      if (editing) {
        const updated = await addressesApi.updateAddress(editing.id, draft)
        setAddresses((p) => p.map((a) => a.id === updated.id ? updated : a))
      } else {
        const created = await addressesApi.createAddress(draft)
        setAddresses((p) => [...p, created])
      }
      closeForm()
    } catch {
      setError('Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Supprimer cette adresse ?')) return
    await addressesApi.deleteAddress(id)
    setAddresses((p) => p.filter((a) => a.id !== id))
  }

  async function setDefault(id: string) {
    const updated = await addressesApi.setDefaultAddress(id)
    setAddresses((p) => p.map((a) => ({ ...a, isDefault: a.id === updated.id })))
  }

  const showForm = isAdding || !!editing

  if (loading) {
    return <div className="py-8 text-center text-sm text-text-muted">Chargement…</div>
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-md bg-danger/10 p-3 text-sm text-danger">{error}</div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text">Mes adresses</h2>
        {!showForm && (
          <button onClick={openAdd} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        )}
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-surface p-5">
          <h3 className="mb-4 font-semibold text-text">{editing ? "Modifier l'adresse" : 'Nouvelle adresse'}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-text">Étiquette</label>
                <input value={draft.label} onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))} placeholder="Domicile, Bureau…" className={addrInput} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text">Nom complet</label>
                <input value={draft.fullName} onChange={(e) => setDraft((p) => ({ ...p, fullName: e.target.value }))} placeholder="Prénom Nom" className={addrInput} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text">Téléphone</label>
              <input type="tel" value={draft.phone} onChange={(e) => setDraft((p) => ({ ...p, phone: e.target.value }))} placeholder="+212 6 00 00 00 00" className={addrInput} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-text">Adresse</label>
              <input value={draft.line1} onChange={(e) => setDraft((p) => ({ ...p, line1: e.target.value }))} placeholder="Numéro et nom de rue" className={addrInput} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-text">Ville</label>
                <select value={draft.city} onChange={(e) => setDraft((p) => ({ ...p, city: e.target.value }))} className={addrInput}>
                  <option value="" disabled>Choisir…</option>
                  {CITIES_MA.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-text">Code postal</label>
                <input value={draft.postalCode} onChange={(e) => setDraft((p) => ({ ...p, postalCode: e.target.value }))} placeholder="20000" className={addrInput} />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={draft.isDefault ?? false}
                onChange={(e) => setDraft((p) => ({ ...p, isDefault: e.target.checked }))}
                className="rounded border-border accent-primary"
              />
              Définir comme adresse par défaut
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={() => void save()} isLoading={saving}>
              {editing ? 'Mettre à jour' : 'Ajouter'}
            </Button>
            <button onClick={closeForm} className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:border-text-muted">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-text-muted">
          <MapPin className="mx-auto mb-3 h-8 w-8 text-text-subtle" />
          <p>Aucune adresse enregistrée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className={`rounded-lg border p-4 ${addr.isDefault ? 'border-primary bg-primary-soft' : 'border-border bg-background'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text">{addr.label || 'Adresse'}</span>
                    {addr.isDefault && <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">Par défaut</span>}
                  </div>
                  <p className="mt-1 text-sm text-text-muted">{addr.fullName}</p>
                  <p className="text-sm text-text-muted">{addr.line1}, {addr.city} {addr.postalCode}</p>
                  <p className="text-xs text-text-subtle">{addr.phone}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {!addr.isDefault && (
                    <button onClick={() => void setDefault(addr.id)} className="text-xs text-text-muted hover:text-primary">
                      Par défaut
                    </button>
                  )}
                  <button onClick={() => openEdit(addr)} className="text-text-muted hover:text-primary">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => void remove(addr.id)} className="text-text-muted hover:text-danger">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const addrInput = 'h-9 w-full rounded-md border border-border bg-background px-3 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary'

function ProfileTab({
  user,
  onSave,
}: {
  user: { firstName: string; lastName: string; phone?: string }
  onSave: (data: { firstName: string; lastName: string; phone?: string }) => void
}) {
  const [firstName, setFirstName] = useState(user.firstName)
  const [lastName, setLastName] = useState(user.lastName)
  const [phone, setPhone] = useState(user.phone ?? '')
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ firstName, lastName, phone: phone || undefined })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-text">Mon profil</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Prénom</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text">Nom</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text">Téléphone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+212 6 00 00 00 00"
            className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button type="submit">Enregistrer</Button>
          {saved && <span className="text-sm text-success">✓ Sauvegardé</span>}
        </div>
      </form>
    </div>
  )
}
