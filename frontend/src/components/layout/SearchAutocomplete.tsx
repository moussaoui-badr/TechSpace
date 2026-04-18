import { Clock, FolderOpen, Search, X } from 'lucide-react'
import type { Product } from '@/types'
import type { CategoryHit } from '@/utils/searchSuggestions'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { cn } from '@/utils/cn'

export interface SearchAutocompleteProps {
  id: string
  query: string
  activeIndex: number
  matchedCategories: CategoryHit[]
  matchedProducts: Product[]
  recents: string[]
  onSelectProduct: (slug: string) => void
  onSelectCategory: (slug: string) => void
  onSelectRecent: (query: string) => void
  onSubmitAll: () => void
  onRemoveRecent: (query: string) => void
  onClearRecents: () => void
}

function highlightMatch(text: string, query: string) {
  const q = query.trim()
  if (q.length === 0) return text
  const lower = text.toLowerCase()
  const needle = q.toLowerCase()
  const start = lower.indexOf(needle)
  if (start === -1) return text
  const end = start + needle.length
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-accent/30 px-0.5 text-inherit">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  )
}

export function SearchAutocomplete({
  id,
  query,
  activeIndex,
  matchedCategories,
  matchedProducts,
  recents,
  onSelectProduct,
  onSelectCategory,
  onSelectRecent,
  onSubmitAll,
  onRemoveRecent,
  onClearRecents,
}: SearchAutocompleteProps) {
  const trimmed = query.trim()
  const showRecents = trimmed.length === 0 && recents.length > 0
  const showResults = trimmed.length > 0
  const hasCategories = matchedCategories.length > 0
  const hasProducts = matchedProducts.length > 0
  const nothingFound = showResults && !hasCategories && !hasProducts

  if (!showRecents && trimmed.length === 0) return null

  let idx = 0

  return (
    <div
      id={id}
      role="listbox"
      className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[460px] overflow-y-auto rounded-md border border-border bg-background shadow-lg"
    >
      {showRecents && (
        <section className="py-1">
          <header className="flex items-center justify-between px-4 py-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
              Recherches récentes
            </span>
            <button
              type="button"
              onClick={onClearRecents}
              className="text-[11px] font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              Effacer tout
            </button>
          </header>
          <ul>
            {recents.map((r) => {
              const currentIdx = idx++
              return (
                <li
                  key={r}
                  id={`sa-item-${currentIdx}`}
                  role="option"
                  aria-selected={currentIdx === activeIndex}
                  className={cn(
                    'group flex items-center gap-3 px-4 py-2 text-sm text-text transition-colors',
                    currentIdx === activeIndex
                      ? 'bg-primary-soft'
                      : 'hover:bg-primary-soft/60',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectRecent(r)}
                    className="flex flex-1 items-center gap-3 text-left"
                  >
                    <Clock className="h-4 w-4 shrink-0 text-text-muted" />
                    <span className="truncate">{r}</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveRecent(r)
                    }}
                    aria-label={`Retirer "${r}" de l'historique`}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-text-subtle transition-colors hover:bg-border hover:text-text"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {showResults && hasCategories && (
        <section className="border-t border-border py-1 first:border-t-0">
          <header className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Catégories
          </header>
          <ul>
            {matchedCategories.map((cat) => {
              const currentIdx = idx++
              return (
                <li
                  key={`${cat.parentLabel ?? 'root'}-${cat.slug}`}
                  id={`sa-item-${currentIdx}`}
                  role="option"
                  aria-selected={currentIdx === activeIndex}
                >
                  <button
                    type="button"
                    onClick={() => onSelectCategory(cat.slug)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-text transition-colors',
                      currentIdx === activeIndex
                        ? 'bg-primary-soft'
                        : 'hover:bg-primary-soft/60',
                    )}
                  >
                    <FolderOpen className="h-4 w-4 shrink-0 text-text-muted" />
                    <span className="flex-1 truncate">
                      {highlightMatch(cat.label, trimmed)}
                      {cat.parentLabel && (
                        <span className="ml-1.5 text-[12px] text-text-muted">
                          · {cat.parentLabel}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {showResults && hasProducts && (
        <section className="border-t border-border py-1 first:border-t-0">
          <header className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Produits
          </header>
          <ul>
            {matchedProducts.map((p) => {
              const currentIdx = idx++
              return (
                <li
                  key={p.id}
                  id={`sa-item-${currentIdx}`}
                  role="option"
                  aria-selected={currentIdx === activeIndex}
                >
                  <button
                    type="button"
                    onClick={() => onSelectProduct(p.slug)}
                    className={cn(
                      'flex w-full items-center gap-3 px-4 py-2 text-left transition-colors',
                      currentIdx === activeIndex
                        ? 'bg-primary-soft'
                        : 'hover:bg-primary-soft/60',
                    )}
                  >
                    <img
                      src={p.mainImage}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="h-10 w-10 shrink-0 rounded-sm border border-border bg-white object-contain p-1"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      {p.brandName && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                          {p.brandName}
                        </span>
                      )}
                      <span className="line-clamp-2 text-[13px] text-text">
                        {highlightMatch(p.name, trimmed)}
                      </span>
                    </div>
                    <div className="shrink-0">
                      <PriceDisplay price={p.price} oldPrice={p.oldPrice} size="sm" showDiscount={false} />
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {nothingFound && (
        <div className="px-4 py-6 text-center text-sm text-text-muted">
          Aucune suggestion pour « {trimmed} »
        </div>
      )}

      {showResults && (
        <div className="border-t border-border bg-surface/60 p-1">
          {(() => {
            const currentIdx = idx++
            return (
              <button
                type="button"
                id={`sa-item-${currentIdx}`}
                role="option"
                aria-selected={currentIdx === activeIndex}
                onClick={onSubmitAll}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-semibold text-primary transition-colors',
                  currentIdx === activeIndex
                    ? 'bg-primary-soft'
                    : 'hover:bg-primary-soft/60',
                )}
              >
                <Search className="h-4 w-4" />
                Voir tous les résultats pour « {trimmed} »
              </button>
            )
          })()}
        </div>
      )}
    </div>
  )
}
