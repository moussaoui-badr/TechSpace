import { useEffect, useState } from 'react'
import { Edit2, Plus, Search, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { formatPrice } from '@/utils/formatPrice'
import { getProducts } from '@/api'
import type { Product } from '@/types'

type AdminProductRow = Pick<Product, 'id' | 'name' | 'categoryName' | 'price' | 'stock' | 'isActive' | 'sku'>

export function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getProducts({ pageSize: 100 }).then((page) => {
      setProducts(
        page.items.map((p) => ({
          id: p.id,
          name: p.name,
          categoryName: p.categoryName,
          price: p.price,
          stock: p.stock,
          isActive: p.isActive,
          sku: p.sku,
        })),
      )
      setLoading(false)
    })
  }, [])

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()),
  )

  function toggleActive(id: number) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    )
  }

  function deleteProduct(id: number) {
    if (!window.confirm('Supprimer ce produit ? Cette action est irréversible.')) return
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
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-3">
                  <Skeleton className="h-6 w-full" />
                </td>
              </tr>
            )}
            {!loading && filtered.map((product) => (
              <tr key={product.id} className="hover:bg-surface">
                <td className="px-4 py-3 font-medium text-text">{product.name}</td>
                <td className="px-4 py-3 text-text-muted">{product.categoryName}</td>
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
            {!loading && filtered.length === 0 && (
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
