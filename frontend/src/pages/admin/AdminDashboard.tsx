import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { formatPrice } from '@/utils/formatPrice'

const KPI = [
  { label: 'Chiffre d\'affaires', value: formatPrice(284500), sub: '+12% ce mois', icon: <DollarSign className="h-6 w-6" />, color: 'text-primary' },
  { label: 'Commandes', value: '142', sub: '18 en attente', icon: <ShoppingCart className="h-6 w-6" />, color: 'text-secondary' },
  { label: 'Produits actifs', value: '486', sub: '23 en rupture', icon: <Package className="h-6 w-6" />, color: 'text-info' },
  { label: 'Clients', value: '1 204', sub: '+34 cette semaine', icon: <Users className="h-6 w-6" />, color: 'text-success' },
]

const RECENT_ORDERS = [
  { id: 'TS-00000045', client: 'Khalid Benali', total: 7290, status: 'En livraison', date: '2026-04-15' },
  { id: 'TS-00000044', client: 'Fatima Zahra', total: 3190, status: 'Confirmée', date: '2026-04-14' },
  { id: 'TS-00000043', client: 'Youssef El Amrani', total: 12490, status: 'En préparation', date: '2026-04-14' },
  { id: 'TS-00000042', client: 'Laila Tazi', total: 1890, status: 'Livrée', date: '2026-04-13' },
  { id: 'TS-00000041', client: 'Omar Chraibi', total: 4990, status: 'Livrée', date: '2026-04-12' },
]

export function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-text">Tableau de bord</h2>
      <p className="mt-1 text-sm text-text-muted">Vue d'ensemble de l'activité Loot</p>

      {/* KPI */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {KPI.map((kpi) => (
          <div key={kpi.label} className="rounded-lg border border-border bg-background p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-sm text-text-muted">{kpi.label}</p>
              <span className={kpi.color}>{kpi.icon}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-text">{kpi.value}</p>
            <p className="mt-0.5 text-xs text-text-subtle">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Commandes récentes */}
      <div className="mt-8">
        <h3 className="mb-3 text-base font-bold text-text">Commandes récentes</h3>
        <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3">N°</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-surface">
                  <td className="px-4 py-3 font-mono font-medium text-primary">{order.id}</td>
                  <td className="px-4 py-3 text-text">{order.client}</td>
                  <td className="px-4 py-3 font-medium text-text">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-text-muted">{order.status}</td>
                  <td className="px-4 py-3 text-text-muted">{new Date(order.date).toLocaleDateString('fr-MA')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
