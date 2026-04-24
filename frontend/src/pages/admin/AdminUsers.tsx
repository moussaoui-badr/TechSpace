import { useState } from 'react'
import { Search, Shield, User } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface AdminUser {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'admin' | 'customer'
  orders: number
  joined: string
  isActive: boolean
}

const MOCK_USERS: AdminUser[] = [
  { id: 1,  firstName: 'Youssef',   lastName: 'Alami',      email: 'youssef.alami@loot.ma',     role: 'admin',    orders: 0,  joined: '2024-01-15', isActive: true  },
  { id: 2,  firstName: 'Salma',     lastName: 'Benhaddou',  email: 'salma.b@loot.ma',            role: 'admin',    orders: 0,  joined: '2024-01-15', isActive: true  },
  { id: 3,  firstName: 'Karim',     lastName: 'Tahiri',     email: 'karim.t@loot.ma',            role: 'admin',    orders: 0,  joined: '2024-02-01', isActive: true  },
  { id: 4,  firstName: 'Mohamed',   lastName: 'El Fassi',   email: 'm.elfassi@gmail.com',        role: 'customer', orders: 4,  joined: '2024-03-10', isActive: true  },
  { id: 5,  firstName: 'Fatima',    lastName: 'Zahraoui',   email: 'fatima.z@hotmail.com',       role: 'customer', orders: 2,  joined: '2024-03-22', isActive: true  },
  { id: 6,  firstName: 'Omar',      lastName: 'Naciri',     email: 'omar.naciri@gmail.com',      role: 'customer', orders: 7,  joined: '2024-04-05', isActive: true  },
  { id: 7,  firstName: 'Amina',     lastName: 'Khalid',     email: 'amina.khalid@yahoo.fr',      role: 'customer', orders: 1,  joined: '2024-04-18', isActive: false },
  { id: 8,  firstName: 'Hassan',    lastName: 'Benali',     email: 'hassan.b@gmail.com',         role: 'customer', orders: 12, joined: '2024-05-02', isActive: true  },
  { id: 9,  firstName: 'Nadia',     lastName: 'Ouazzani',   email: 'nadia.o@loot.ma',            role: 'admin',    orders: 0,  joined: '2024-05-15', isActive: true  },
  { id: 10, firstName: 'Rachid',    lastName: 'Moussaoui',  email: 'rachid.m@gmail.com',         role: 'customer', orders: 3,  joined: '2024-06-01', isActive: true  },
  { id: 11, firstName: 'Sara',      lastName: 'Idrissi',    email: 'sara.idrissi@gmail.com',     role: 'customer', orders: 5,  joined: '2024-06-20', isActive: true  },
  { id: 12, firstName: 'Hamza',     lastName: 'Lahlou',     email: 'hamza.lahlou@outlook.com',   role: 'customer', orders: 0,  joined: '2024-07-10', isActive: false },
]

type RoleFilter = 'all' | 'admin' | 'customer'

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(MOCK_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')

  const filtered = users.filter((u) => {
    const matchSearch =
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  function toggleActive(id: number) {
    setUsers((p) => p.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u))
  }

  const adminCount = users.filter((u) => u.role === 'admin').length
  const activeCount = users.filter((u) => u.isActive).length

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text">Utilisateurs</h2>
        <p className="mt-0.5 text-sm text-text-muted">{users.length} utilisateurs au total</p>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: users.length, icon: User },
          { label: 'Admins', value: adminCount, icon: Shield },
          { label: 'Actifs', value: activeCount, icon: User },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 shadow-card">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <div>
              <div className="text-xl font-bold text-text">{value}</div>
              <div className="text-xs text-text-muted">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3 shadow-card">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email…"
            className="h-10 flex-1 bg-transparent text-sm text-text placeholder:text-text-subtle focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'admin', 'customer'] as RoleFilter[]).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                roleFilter === r ? 'bg-primary text-white' : 'border border-border text-text-muted hover:border-primary hover:text-primary'
              }`}
            >
              {r === 'all' ? 'Tous' : r === 'admin' ? 'Admins' : 'Clients'}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3">Utilisateur</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rôle</th>
              <th className="px-4 py-3">Commandes</th>
              <th className="px-4 py-3">Inscription</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy font-display text-xs font-bold text-white">
                      {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                    </span>
                    <span className="font-medium text-text">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.role === 'admin' ? 'primary' : 'outline'} size="sm">
                    {u.role === 'admin' ? 'Admin' : 'Client'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-text-muted">{u.orders}</td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(u.joined).toLocaleDateString('fr-MA')}
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => toggleActive(u.id)}>
                    <Badge variant={u.isActive ? 'success' : 'danger'} size="sm">
                      {u.isActive ? 'Actif' : 'Suspendu'}
                    </Badge>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-text-subtle">
        {filtered.length} résultat{filtered.length > 1 ? 's' : ''} sur {users.length} utilisateurs.
      </p>
    </div>
  )
}
