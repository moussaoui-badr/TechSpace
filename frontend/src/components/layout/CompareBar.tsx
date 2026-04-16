import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronUp, Scale, Trash2, X } from 'lucide-react'
import { useCompareStore, COMPARE_LIMIT } from '@/stores/compareStore'
import { cn } from '@/utils/cn'

export function CompareBar() {
  const items = useCompareStore((s) => s.items)
  const remove = useCompareStore((s) => s.remove)
  const clear = useCompareStore((s) => s.clear)
  const [collapsed, setCollapsed] = useState(false)

  if (items.length === 0) return null

  const canCompare = items.length >= 2

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 sm:px-6">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Déplier la barre de comparaison' : 'Replier la barre de comparaison'}
          className="flex items-center gap-2 text-sm font-bold text-text"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
            <Scale className="h-4 w-4" />
          </span>
          <span>
            Comparer ({items.length}/{COMPARE_LIMIT})
          </span>
          {collapsed ? (
            <ChevronUp className="h-4 w-4 text-text-muted" />
          ) : (
            <ChevronDown className="h-4 w-4 text-text-muted" />
          )}
        </button>

        {!collapsed && (
          <div className="hidden flex-1 items-center gap-2 overflow-x-auto md:flex">
            {items.map((p) => (
              <div
                key={p.id}
                className="group relative flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-border bg-surface"
              >
                <img
                  src={p.mainImage}
                  alt={p.name}
                  className="h-full w-full object-contain p-1.5"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => remove(p.id)}
                  aria-label={`Retirer ${p.name} de la comparaison`}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
            {Array.from({ length: COMPARE_LIMIT - items.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-dashed border-border bg-surface text-[10px] text-text-subtle"
              >
                vide
              </div>
            ))}
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-3 text-[12.5px] font-semibold text-text-muted transition-colors hover:border-primary hover:text-primary"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tout effacer</span>
          </button>
          <Link
            to="/compare"
            aria-disabled={!canCompare}
            onClick={(e) => {
              if (!canCompare) e.preventDefault()
            }}
            className={cn(
              'inline-flex h-8 items-center rounded-md bg-primary px-4 text-[12.5px] font-bold text-white transition-colors hover:bg-primary-hover',
              !canCompare && 'pointer-events-none opacity-50',
            )}
          >
            Comparer {canCompare ? `(${items.length})` : ''}
          </Link>
        </div>
      </div>
    </div>
  )
}
