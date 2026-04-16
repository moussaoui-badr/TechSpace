import { useState } from 'react'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/utils/formatPrice'
import type { OrderStatus } from '@/types'

interface AdminOrder {
  id: string
  client: string
  phone: string
  city: string
  total: number
  status: OrderStatus
  date: string
  itemCount: number
}

const INIT_ORDERS: AdminOrder[] = [
  { id: 'TS-00000045', client: 'Khalid Benali', phone: '+212 6 11 22 33 44', city: 'Casablanca', total: 7290, status: 'shipping', date: '2026-04-15', itemCount: 2 },
  { id: 'TS-00000044', client: 'Fatima Zahra El Idrissi', phone: '+212 6 55 66 77 88', city: 'Rabat', total: 3190, status: 'confirmed', date: '2026-04-14', itemCount: 1 },
  { id: 'TS-00000043', client: 'Youssef El Amrani', phone: '+212 6 99 00 11 22', city: 'Marrakech', total: 12490, status: 'preparing', date: '2026-04-14', itemCount: 3 },
  { id: 'TS-00000042', client: 'Laila Tazi', phone: '+212 6 33 44 55 66', city: 'Fès', total: 1890, status: 'delivered', date: '2026-04-13', itemCount: 1 },
  { id: 'TS-00000041', client: 'Omar Chraibi', phone: '+212 6 77 88 99 00', city: 'Tanger', total: 4990, status: 'delivered', date: '2026-04-12', itemCount: 2 },
  { id: 'TS-00000040', client: 'Nadia Boussouf', phone: '+212 6 22 33 44 55', city: 'Agadir', total: 890, status: 'cancelled', date: '2026-04-11', itemCount: 1 },
  { id: 'TS-00000039', client: 'Ahmed Fassi', phone: '+212 6 44 55 66 77', city: 'Meknès', total: 19990, status: 'pending', date: '2026-04-16', itemCount: 4 },
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

const ALL_STATUSES: { value: '' | OrderStatus; label: string }[] = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'preparing', label: 'En préparation' },
  { value: 'shipping', label: 'En livraison' },
  { value: 'delivered', label: 'Livrées' },
  { value: 'cancelled', label: 'Annulées' },
]

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INIT_ORDERS)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'' | OrderStatus>('')

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.id.includes(search) ||
      o.client.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === '' || o.status === filterStatus
    return matchSearch && matchStatus
  })

  function updateStatus(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o)),
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text">Commandes</h2>
        <p className="mt-0.5 text-sm text-text-muted">{orders.length} commandes au total</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 shadow-card">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par N°, client, ville..."
            className="h-10 flex-1 bg-transparent text-sm text-text placeholder:text-text-subtle focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as '' | OrderStatus)}
          className="h-10 rounded-md border border-border bg-background px-3 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3">N° commande</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Ville</th>
              <th className="px-4 py-3">Articles</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Changer statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((order) => (
              <tr key={order.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-mono font-medium text-primary">{order.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-text">{order.client}</p>
                  <p className="text-xs text-text-muted">{order.phone}</p>
                </td>
                <td className="px-4 py-3 text-text-muted">{order.city}</td>
                <td className="px-4 py-3 text-center text-text-muted">{order.itemCount}</td>
                <td className="px-4 py-3 font-medium text-primary">{formatPrice(order.total)}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANTS[order.status]} size="sm">
                    {STATUS_LABELS[order.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(order.date).toLocaleDateString('fr-MA')}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                    className="h-8 rounded border border-border bg-background px-2 text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {ALL_STATUSES.filter((s) => s.value !== '').map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
