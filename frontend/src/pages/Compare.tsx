import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Scale, Trash2, X } from 'lucide-react'
import { useCompareStore } from '@/stores/compareStore'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/Button'
import { Rating } from '@/components/ui/Rating'
import { PriceDisplay } from '@/components/ui/PriceDisplay'

export function ComparePage() {
  const items = useCompareStore((s) => s.items)
  const remove = useCompareStore((s) => s.remove)
  const clear = useCompareStore((s) => s.clear)
  const addToCart = useCartStore((s) => s.addItem)

  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Scale className="h-8 w-8" />
        </span>
        <h1 className="font-display text-2xl font-black text-text md:text-3xl">
          Aucun produit à comparer
        </h1>
        <p className="max-w-lg text-sm text-text-muted">
          Ajoutez au moins 2 produits depuis le catalogue pour afficher une comparaison détaillée
          côte à côte.
        </p>
        <Link to="/products">
          <Button leftIcon={<ArrowLeft className="h-4 w-4" />}>Parcourir le catalogue</Button>
        </Link>
      </section>
    )
  }

  const specGroups = collectSpecGroups(items)

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-black text-text md:text-3xl">
            Comparer les produits
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {items.length} produit{items.length > 1 ? 's' : ''} sélectionné
            {items.length > 1 ? 's' : ''} — visualisation côte à côte.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Trash2 className="h-3.5 w-3.5" />} onClick={clear}>
          Tout effacer
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border border-border">
        <table className="w-full min-w-[720px] border-collapse bg-background text-sm">
          <thead>
            <tr>
              <th className="w-44 border-b border-r border-border bg-surface p-3 text-left text-xs font-bold uppercase tracking-wider text-text-muted">
                Caractéristique
              </th>
              {items.map((p) => (
                <th key={p.id} className="relative border-b border-r border-border p-3 align-top last:border-r-0">
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label={`Retirer ${p.name}`}
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-surface hover:text-danger"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <Link to={`/products/${p.slug}`} className="block h-28 w-28">
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                    </Link>
                    <Link
                      to={`/products/${p.slug}`}
                      className="line-clamp-2 text-center text-[13px] font-semibold text-text transition-colors hover:text-primary"
                    >
                      {p.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Marque">
              {items.map((p) => (
                <td key={p.id} className="border-b border-r border-border p-3 last:border-r-0">
                  {p.brandName ?? '—'}
                </td>
              ))}
            </Row>
            <Row label="Prix">
              {items.map((p) => (
                <td key={p.id} className="border-b border-r border-border p-3 last:border-r-0">
                  <PriceDisplay price={p.price} oldPrice={p.oldPrice} size="md" />
                </td>
              ))}
            </Row>
            <Row label="Note">
              {items.map((p) => (
                <td key={p.id} className="border-b border-r border-border p-3 last:border-r-0">
                  <Rating value={p.rating} size="sm" showValue reviewCount={p.reviewCount} />
                </td>
              ))}
            </Row>
            <Row label="Stock">
              {items.map((p) => (
                <td key={p.id} className="border-b border-r border-border p-3 last:border-r-0">
                  {p.stock > 0 ? (
                    <span className="text-success">En stock ({p.stock})</span>
                  ) : (
                    <span className="text-danger">Rupture</span>
                  )}
                </td>
              ))}
            </Row>
            <Row label="Catégorie">
              {items.map((p) => (
                <td key={p.id} className="border-b border-r border-border p-3 last:border-r-0">
                  {p.categoryName}
                </td>
              ))}
            </Row>

            {specGroups.map((group) => (
              <Fragment key={group.name}>
                <tr>
                  <td
                    colSpan={items.length + 1}
                    className="border-b border-border bg-surface px-3 py-2 text-xs font-bold uppercase tracking-wider text-text"
                  >
                    {group.name}
                  </td>
                </tr>
                {group.keys.map((key) => (
                  <Row key={`${group.name}-${key}`} label={key}>
                    {items.map((p) => {
                      const spec = p.specifications.find(
                        (s) => s.group === group.name && s.key === key,
                      )
                      return (
                        <td
                          key={p.id}
                          className="border-b border-r border-border p-3 text-text-muted last:border-r-0"
                        >
                          {spec?.value ?? '—'}
                        </td>
                      )
                    })}
                  </Row>
                ))}
              </Fragment>
            ))}

            <tr>
              <td className="w-44 border-r border-border bg-surface p-3" />
              {items.map((p) => (
                <td key={p.id} className="border-r border-border p-3 last:border-r-0">
                  <Button
                    size="sm"
                    onClick={() => addToCart(p, 1)}
                    disabled={p.stock <= 0}
                  >
                    Ajouter au panier
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}

interface RowProps {
  label: string
  children: React.ReactNode
}

function Row({ label, children }: RowProps) {
  return (
    <tr>
      <td className="w-44 border-b border-r border-border bg-surface p-3 text-xs font-semibold text-text-muted">
        {label}
      </td>
      {children}
    </tr>
  )
}

function collectSpecGroups(items: { specifications: { group: string; key: string }[] }[]) {
  const map = new Map<string, Set<string>>()
  for (const item of items) {
    for (const spec of item.specifications) {
      if (!map.has(spec.group)) map.set(spec.group, new Set())
      map.get(spec.group)!.add(spec.key)
    }
  }
  return Array.from(map.entries()).map(([name, set]) => ({
    name,
    keys: Array.from(set),
  }))
}
