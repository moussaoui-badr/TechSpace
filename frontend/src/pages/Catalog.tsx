import { useEffect, useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import type { Brand, Category, Product, ProductSort, ProductsPage } from '@/types'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Drawer } from '@/components/ui/Drawer'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { ProductCard } from '@/components/ui/ProductCard'
import { Select } from '@/components/ui/Select'
import { Skeleton } from '@/components/ui/Skeleton'
import { getBrands, getProducts } from '@/api'
import { useCatalogStore } from '@/stores/catalogStore'
import { useDebounce } from '@/hooks/useDebounce'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'

const PAGE_SIZE = 12
const PRICE_MIN = 0
const PRICE_MAX = 40000

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'newest', label: 'Plus recents' },
  { value: 'popular', label: 'Plus populaires' },
  { value: 'rating', label: 'Mieux notes' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix decroissant' },
  { value: 'promo', label: 'Meilleures promos' },
]

export function CatalogPage() {
  const { slug: urlCategorySlug } = useParams<{ slug?: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [brandsList, setBrandsList] = useState<Brand[]>([])
  const [page, setPage] = useState<ProductsPage>({ items: [], totalCount: 0, page: 1, pageSize: PAGE_SIZE })
  const [loading, setLoading] = useState(true)

  // Etat des filtres, source de verite = searchParams
  const currentCategorySlug = urlCategorySlug ?? searchParams.get('category') ?? undefined
  const selectedBrandSlugs = searchParams.get('brands')?.split(',').filter(Boolean) ?? []
  const searchTerm = searchParams.get('search') ?? ''
  const sortBy = (searchParams.get('sort') as ProductSort) ?? 'newest'
  const minPrice = searchParams.get('min') ? Number(searchParams.get('min')) : undefined
  const maxPrice = searchParams.get('max') ? Number(searchParams.get('max')) : undefined
  const onlyInStock = searchParams.get('stock') === '1'
  const currentPage = Number(searchParams.get('page') ?? '1')

  const [searchInput, setSearchInput] = useState(searchTerm)
  const debouncedSearch = useDebounce(searchInput, 350)

  const findCategoryBySlug = useCatalogStore((s) => s.findCategoryBySlug)
  const findCategoryById = useCatalogStore((s) => s.findCategoryById)
  const currentCategory: Category | undefined = currentCategorySlug
    ? findCategoryBySlug(currentCategorySlug)
    : undefined

  // Sync la recherche debounced vers l URL
  useEffect(() => {
    if (debouncedSearch === searchTerm) return
    const next = new URLSearchParams(searchParams)
    if (debouncedSearch) next.set('search', debouncedSearch)
    else next.delete('search')
    next.delete('page')
    setSearchParams(next, { replace: true })
  }, [debouncedSearch, searchTerm, searchParams, setSearchParams])

  // Charge les marques une fois
  useEffect(() => {
    getBrands().then(setBrandsList)
  }, [])

  // Recharge les produits chaque fois que les filtres changent
  useEffect(() => {
    setLoading(true)
    getProducts({
      page: currentPage,
      pageSize: PAGE_SIZE,
      categorySlug: currentCategorySlug,
      brandSlugs: selectedBrandSlugs.length > 0 ? selectedBrandSlugs : undefined,
      search: searchTerm || undefined,
      minPrice,
      maxPrice,
      inStock: onlyInStock || undefined,
      sortBy,
    }).then((result) => {
      setPage(result)
      setLoading(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentCategorySlug,
    searchTerm,
    sortBy,
    minPrice,
    maxPrice,
    onlyInStock,
    currentPage,
    selectedBrandSlugs.join(','),
  ])

  function updateParam(key: string, value: string | undefined) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next, { replace: true })
  }

  function toggleBrand(slug: string) {
    const set = new Set(selectedBrandSlugs)
    if (set.has(slug)) set.delete(slug)
    else set.add(slug)
    updateParam('brands', Array.from(set).join(',') || undefined)
  }

  function resetFilters() {
    const next = new URLSearchParams()
    setSearchParams(next, { replace: true })
    setSearchInput('')
  }

  const totalPages = Math.max(1, Math.ceil(page.totalCount / PAGE_SIZE))

  const crumbs = useMemo(() => {
    const items: { label: string; to?: string }[] = []
    items.push({ label: 'Catalogue', to: currentCategorySlug ? '/products' : undefined })
    if (currentCategory?.parentId) {
      const parent = findCategoryById(currentCategory.parentId)
      if (parent) items.push({ label: parent.name, to: `/category/${parent.slug}` })
    }
    if (currentCategory) items.push({ label: currentCategory.name })
    return items
  }, [currentCategory, currentCategorySlug])

  const pageTitle = currentCategory ? currentCategory.name : searchTerm ? `Recherche : "${searchTerm}"` : 'Tous les produits'

  const activeFiltersCount =
    (selectedBrandSlugs.length > 0 ? 1 : 0) +
    (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
    (onlyInStock ? 1 : 0)

  const filtersPanel = (
    <FilterPanel
      brands={brandsList}
      selectedBrandSlugs={selectedBrandSlugs}
      onToggleBrand={toggleBrand}
      minPrice={minPrice}
      maxPrice={maxPrice}
      onChangeMinPrice={(v) => updateParam('min', v !== undefined ? String(v) : undefined)}
      onChangeMaxPrice={(v) => updateParam('max', v !== undefined ? String(v) : undefined)}
      onlyInStock={onlyInStock}
      onToggleInStock={() => updateParam('stock', onlyInStock ? undefined : '1')}
      onReset={resetFilters}
    />
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <Breadcrumb items={crumbs} className="mb-4" />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold leading-tight text-text md:text-4xl">
            {pageTitle}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {loading
              ? 'Recherche en cours...'
              : `${page.totalCount} produit${page.totalCount > 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Search + Sort (desktop) */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="sm:w-64">
            <Input
              leftIcon={<Search className="h-4 w-4" />}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Rechercher..."
            />
          </div>
          <div className="sm:w-56">
            <Select
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
              options={SORT_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Sidebar filters (desktop) */}
        <aside className="hidden w-72 shrink-0 lg:block">{filtersPanel}</aside>

        {/* Barre filtres mobile */}
        <div className="lg:hidden">
          <Button
            variant="outline"
            size="md"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setMobileFiltersOpen(true)}
          >
            Filtres {activeFiltersCount > 0 && <span className="ml-1 text-primary">({activeFiltersCount})</span>}
          </Button>
        </div>

        {/* Main grid */}
        <main className="flex-1">
          {loading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : page.items.length === 0 ? (
            <EmptyState onReset={resetFilters} />
          ) : (
            <ProductsGrid products={page.items} />
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => updateParam('page', String(p))}
              />
            </div>
          )}
        </main>
      </div>

      {/* Drawer mobile filters */}
      <Drawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filtres"
        side="right"
        footer={
          <div className="flex gap-2">
            <Button variant="ghost" onClick={resetFilters} className="flex-1">
              Reinitialiser
            </Button>
            <Button onClick={() => setMobileFiltersOpen(false)} className="flex-1">
              Voir les resultats
            </Button>
          </div>
        }
      >
        {filtersPanel}
      </Drawer>
    </div>
  )
}

// ============ Sous-composants ============

interface FilterPanelProps {
  brands: Brand[]
  selectedBrandSlugs: string[]
  onToggleBrand: (slug: string) => void
  minPrice?: number
  maxPrice?: number
  onChangeMinPrice: (v: number | undefined) => void
  onChangeMaxPrice: (v: number | undefined) => void
  onlyInStock: boolean
  onToggleInStock: () => void
  onReset: () => void
}

function FilterPanel(props: FilterPanelProps) {
  const {
    brands,
    selectedBrandSlugs,
    onToggleBrand,
    minPrice,
    maxPrice,
    onChangeMinPrice,
    onChangeMaxPrice,
    onlyInStock,
    onToggleInStock,
    onReset,
  } = props

  return (
    <div className="space-y-6">
      <FilterSection title="Prix (DH)">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder={String(PRICE_MIN)}
            min={0}
            value={minPrice ?? ''}
            onChange={(e) => {
              const v = e.target.value
              onChangeMinPrice(v === '' ? undefined : Number(v))
            }}
            className="w-full"
          />
          <span className="text-text-muted">-</span>
          <Input
            type="number"
            placeholder={String(PRICE_MAX)}
            min={0}
            value={maxPrice ?? ''}
            onChange={(e) => {
              const v = e.target.value
              onChangeMaxPrice(v === '' ? undefined : Number(v))
            }}
            className="w-full"
          />
        </div>
      </FilterSection>

      <FilterSection title="Marques">
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {brands.map((b) => (
            <Checkbox
              key={b.id}
              checked={selectedBrandSlugs.includes(b.slug)}
              onChange={() => onToggleBrand(b.slug)}
              label={b.name}
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Disponibilite">
        <Checkbox
          checked={onlyInStock}
          onChange={onToggleInStock}
          label="En stock uniquement"
        />
      </FilterSection>

      <Button variant="ghost" size="sm" onClick={onReset} className="w-full">
        <X className="h-4 w-4" />
        Reinitialiser les filtres
      </Button>
    </div>
  )
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div
      className="rounded-lg border border-border bg-surface p-4"
      style={{ boxShadow: 'var(--shadow-card)' }}
    >
      <h3 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-text">
        {title}
      </h3>
      {children}
    </div>
  )
}

function ProductsGrid({ products }: { products: Product[] }) {
  const addToCart = useCartStore((s) => s.addItem)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistIds = useWishlistStore((s) => s.productIds)

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAddToCart={(product) => addToCart(product, 1)}
          onToggleWishlist={(product) => toggleWishlist(product.id)}
          isInWishlist={wishlistIds.includes(p.id)}
        />
      ))}
    </div>
  )
}

function ProductGridSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4"
        >
          <Skeleton className="aspect-square w-full rounded" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-5 w-1/3" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div
      className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-surface/40 px-6 py-16 text-center"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-primary">
        <Search className="h-6 w-6" />
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold text-text">Aucun produit trouve</h3>
        <p className="mt-1 text-sm text-text-muted">
          Essayez de relacher les filtres ou d elargir la recherche.
        </p>
      </div>
      <Button variant="outline" onClick={onReset}>
        Reinitialiser les filtres
      </Button>
    </div>
  )
}
