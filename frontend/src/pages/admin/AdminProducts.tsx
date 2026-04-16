import { useState } from 'react'
import { Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/utils/formatPrice'

interface AdminProduct {
  id: number
  name: string
  category: string
  price: number
  stock: number
  isActive: boolean
  sku: string
}

const INIT_PRODUCTS: AdminProduct[] = [
  { id: 1, name: 'AMD Ryzen 7 7800X3D', category: 'Processeurs', price: 3490, stock: 12, isActive: true, sku: 'CPU-R7-7800X3D' },
  { id: 2, name: 'Intel Core i9-14900K', category: 'Processeurs', price: 5090, stock: 5, isActive: true, sku: 'CPU-I9-14900K' },
  { id: 3, name: 'RTX 4080 Super 16GB MSI', category: 'Cartes graphiques', price: 11990, stock: 3, isActive: true, sku: 'GPU-RTX4080S' },
  { id: 4, name: 'RTX 4060 8GB ASUS', category: 'Cartes graphiques', price: 3290, stock: 0, isActive: false, sku: 'GPU-RTX4060' },
  { id: 5, name: 'Corsair Vengeance DDR5 32GB', category: 'Mémoire RAM', price: 1490, stock: 20, isActive: true, sku: 'RAM-CV-DDR5-32' },
  { id: 6, name: 'Samsung 990 Pro 2To', category: 'Stockage', price: 1890, stock: 8, isActive: true, sku: 'SSD-990P-2TB' },
  { id: 7, name: 'ASUS ROG Strix X670E-E', category: 'Cartes mères', price: 3990, stock: 4, isActive: true, sku: 'MB-ROGX670E' },
  { id: 8, name: 'Corsair RM850x 850W', category: 'Alimentations', price: 1390, stock: 15, isActive: true, sku: 'PSU-RM850X' },
]

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>(INIT_PRODUCTS)
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  )

  function toggleActive(id: number) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    )
  }

  function deleteProduct(id: number) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Produits</h2>
          <p className="mt-0.5 text-sm text-text-muted">{products.length} produits au total</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />}>
          Ajouter un produit
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 shadow-card">
        <Search className="h-4 w-4 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, catégorie, SKU..."
          className="h-10 flex-1 bg-transparent text-sm text-text placeholder:text-text-subtle focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3">Produit</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((product) => (
              <tr key={product.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-medium text-text">{product.name}</td>
                <td className="px-4 py-3 text-text-muted">{product.category}</td>
                <td className="px-4 py-3 font-mono text-xs text-text-subtle">{product.sku}</td>
                <td className="px-4 py-3 font-medium text-primary">{formatPrice(product.price)}</td>
                <td className="px-4 py-3">
                  <span className={product.stock === 0 ? 'text-danger' : 'text-text'}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleActive(product.id)}
                    title="Changer le statut"
                  >
                    <Badge variant={product.isActive ? 'success' : 'outline'} size="sm">
                      {product.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Modifier"
                      className="text-text-muted transition-colors hover:text-primary"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Supprimer"
                      onClick={() => deleteProduct(product.id)}
                      className="text-text-muted transition-colors hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
