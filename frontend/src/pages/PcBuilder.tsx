import { useState } from 'react'
import { Check, ChevronDown, ChevronUp, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice } from '@/utils/formatPrice'
import type { Product } from '@/types'
import { cn } from '@/utils/cn'

function makeProduct(
  id: number,
  name: string,
  spec: string,
  price: number,
  categoryId: number,
  categoryName: string,
): Product {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    id,
    name,
    slug,
    shortDescription: spec,
    description: spec,
    sku: `TS-PC-${id}`,
    price,
    stock: 10,
    isActive: true,
    isFeatured: false,
    mainImage: `https://placehold.co/200x200/F5F5F5/1E3A5F?text=${encodeURIComponent(name.split(' ').slice(0, 2).join('+'))}`,
    images: [],
    categoryId,
    categoryName,
    specifications: [],
    rating: 4.5,
    reviewCount: 0,
  }
}

interface BuildCategory {
  key: string
  label: string
  required: boolean
  options: Product[]
}

const BUILD_CATEGORIES: BuildCategory[] = [
  {
    key: 'cpu',
    label: 'Processeur (CPU)',
    required: true,
    options: [
      makeProduct(1001, 'AMD Ryzen 7 7800X3D', '8 cœurs / 16 threads, 3D V-Cache, 120W', 3490, 2, 'Processeurs'),
      makeProduct(1002, 'AMD Ryzen 9 7900X', '12 cœurs / 24 threads, 5.6 GHz boost, 170W', 4290, 2, 'Processeurs'),
      makeProduct(1003, 'Intel Core i7-14700K', '20 cœurs (8P+12E), 5.6 GHz boost, 125W', 3190, 2, 'Processeurs'),
      makeProduct(1004, 'Intel Core i9-14900K', '24 cœurs (8P+16E), 6.0 GHz boost, 125W', 5090, 2, 'Processeurs'),
    ],
  },
  {
    key: 'gpu',
    label: 'Carte graphique (GPU)',
    required: true,
    options: [
      makeProduct(1005, 'RTX 4060 8GB ASUS', '8 Go GDDR6, 1080p gaming, 115W TDP', 3290, 3, 'Cartes graphiques'),
      makeProduct(1006, 'RX 7800 XT 16GB Sapphire', '16 Go GDDR6, 1440p gaming, 263W TDP', 4190, 3, 'Cartes graphiques'),
      makeProduct(1007, 'RTX 4070 Ti Super 16GB', '16 Go GDDR6X, 4K gaming, 285W TDP', 7490, 3, 'Cartes graphiques'),
      makeProduct(1008, 'RTX 4080 Super 16GB MSI', '16 Go GDDR6X, 4K ultra, 320W TDP', 11990, 3, 'Cartes graphiques'),
    ],
  },
  {
    key: 'ram',
    label: 'Mémoire vive (RAM)',
    required: true,
    options: [
      makeProduct(1009, 'Corsair Vengeance DDR5 32GB', '2×16 Go DDR5-6000, CL30, RGB', 1490, 4, 'Mémoire RAM'),
      makeProduct(1010, 'Corsair Dominator DDR5 64GB', '2×32 Go DDR5-6400, CL32, RGB', 2990, 4, 'Mémoire RAM'),
      makeProduct(1011, 'G.Skill Trident Z5 DDR5 32GB', '2×16 Go DDR5-7200, CL34, RGB', 1790, 4, 'Mémoire RAM'),
    ],
  },
  {
    key: 'storage',
    label: 'Stockage principal (NVMe)',
    required: true,
    options: [
      makeProduct(1012, 'Samsung 990 Pro 1To NVMe', 'PCIe 4.0, 7 450 Mo/s lecture, M.2', 990, 5, 'Stockage'),
      makeProduct(1013, 'Samsung 990 Pro 2To NVMe', 'PCIe 4.0, 7 450 Mo/s lecture, M.2', 1890, 5, 'Stockage'),
      makeProduct(1014, 'WD Black SN850X 4To NVMe', 'PCIe 4.0, 7 300 Mo/s lecture, M.2', 3290, 5, 'Stockage'),
    ],
  },
  {
    key: 'motherboard',
    label: 'Carte mère',
    required: true,
    options: [
      makeProduct(1015, 'MSI MAG B650 Tomahawk WiFi', 'AM5, DDR5, PCIe 5.0, ATX', 2190, 6, 'Cartes mères'),
      makeProduct(1016, 'ASUS ROG Strix X670E-E', 'AM5, DDR5, PCIe 5.0, ATX haut de gamme', 3990, 6, 'Cartes mères'),
      makeProduct(1017, 'MSI MAG Z790 Tomahawk WiFi', 'LGA1700, DDR5, PCIe 5.0, ATX', 2490, 6, 'Cartes mères'),
    ],
  },
  {
    key: 'psu',
    label: 'Alimentation (PSU)',
    required: true,
    options: [
      makeProduct(1018, 'Corsair RM850x 850W Gold', '80+ Gold, modulaire, silencieux', 1390, 7, 'Alimentations'),
      makeProduct(1019, 'Corsair RM1000x 1000W Gold', '80+ Gold, modulaire, 1000W', 1790, 7, 'Alimentations'),
      makeProduct(1020, 'MSI MEG Ai1300P Platinum', '80+ Platinum, ATX 3.0, 1300W', 2990, 7, 'Alimentations'),
    ],
  },
  {
    key: 'case',
    label: 'Boîtier',
    required: false,
    options: [
      makeProduct(1021, 'Corsair 4000D Airflow', 'ATX Mid-Tower, double ventilateur 120mm inclus', 890, 8, 'Boîtiers'),
      makeProduct(1022, 'MSI MPG Sekira 500X', 'ATX Mid-Tower, 4 ventilateurs ARGB, verre trempé', 1590, 8, 'Boîtiers'),
      makeProduct(1023, 'Fractal Design Meshify 2', 'ATX, excellent airflow, filtre magnétique', 1190, 8, 'Boîtiers'),
    ],
  },
  {
    key: 'cooling',
    label: 'Refroidissement CPU',
    required: false,
    options: [
      makeProduct(1024, 'Corsair iCUE H150i Elite 360mm', 'AIO 360mm, 3×120mm RGB, AM5/LGA1700', 1890, 9, 'Refroidissement'),
      makeProduct(1025, 'MSI MAG CoreLiquid 360R', 'AIO 360mm, 3×120mm ARGB, AM5/LGA1700', 1490, 9, 'Refroidissement'),
      makeProduct(1026, 'Noctua NH-D15 chromax.black', 'Double tour, 2×NF-A15, silencieux', 990, 9, 'Refroidissement'),
    ],
  },
]

export function PcBuilderPage() {
  const addItem = useCartStore((s) => s.addItem)
  const [selected, setSelected] = useState<Record<string, Product | null>>(
    Object.fromEntries(BUILD_CATEGORIES.map((c) => [c.key, null])),
  )
  const [openKey, setOpenKey] = useState<string | null>('cpu')

  const total = Object.values(selected).reduce(
    (sum, p) => sum + (p ? p.price : 0),
    0,
  )

  const requiredDone = BUILD_CATEGORIES.filter((c) => c.required).every(
    (c) => selected[c.key] !== null,
  )

  function selectProduct(categoryKey: string, product: Product) {
    setSelected((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey]?.id === product.id ? null : product,
    }))
  }

  function addAllToCart() {
    Object.values(selected).forEach((p) => {
      if (p) addItem(p, 1)
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">PC Builder</h1>
        <p className="mt-1 text-sm text-text-muted">
          Composez votre PC pièce par pièce. Les composants sélectionnés seront ajoutés au panier.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Colonne gauche — sélecteurs */}
        <div className="space-y-3">
          {BUILD_CATEGORIES.map((cat) => {
            const choice = selected[cat.key]
            const isOpen = openKey === cat.key
            return (
              <div
                key={cat.key}
                className="overflow-hidden rounded-lg border border-border bg-background shadow-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenKey(isOpen ? null : cat.key)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-surface"
                >
                  <div className="flex items-center gap-3">
                    {choice ? (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </span>
                    ) : (
                      <span
                        className={cn(
                          'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                          cat.required ? 'border-primary' : 'border-border',
                        )}
                      />
                    )}
                    <div>
                      <span className="text-sm font-semibold text-text">{cat.label}</span>
                      {!cat.required && (
                        <span className="ml-2 text-xs text-text-subtle">(optionnel)</span>
                      )}
                      {choice && (
                        <p className="text-xs text-text-muted">{choice.name} — {formatPrice(choice.price)}</p>
                      )}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-text-muted" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-text-muted" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-border bg-surface p-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                      {cat.options.map((product) => {
                        const isChosen = selected[cat.key]?.id === product.id
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => selectProduct(cat.key, product)}
                            className={cn(
                              'flex items-center gap-3 rounded-md border p-3 text-left transition-colors',
                              isChosen
                                ? 'border-primary bg-primary-soft'
                                : 'border-border bg-background hover:border-primary/50 hover:bg-surface',
                            )}
                          >
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="h-14 w-14 shrink-0 rounded object-contain"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium leading-tight text-text line-clamp-2">
                                {product.name}
                              </p>
                              <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
                                {product.shortDescription}
                              </p>
                              <p className="mt-1 text-sm font-bold text-primary">
                                {formatPrice(product.price)}
                              </p>
                            </div>
                            {isChosen && (
                              <Check className="h-5 w-5 shrink-0 text-primary" />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {choice && (
                      <button
                        type="button"
                        onClick={() => setSelected((prev) => ({ ...prev, [cat.key]: null }))}
                        className="mt-3 flex items-center gap-1.5 text-xs text-danger hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Retirer la sélection
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Colonne droite — récapitulatif */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border border-border bg-background p-5 shadow-card">
            <h2 className="text-base font-bold text-text">Récapitulatif</h2>

            <div className="mt-4 space-y-2">
              {BUILD_CATEGORIES.map((cat) => {
                const p = selected[cat.key]
                return (
                  <div key={cat.key} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-text-muted">{cat.label.split(' (')[0]}</span>
                    {p ? (
                      <span className="font-medium text-text">{formatPrice(p.price)}</span>
                    ) : (
                      <span className="text-xs text-text-subtle italic">
                        {cat.required ? 'Requis' : '—'}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <hr className="my-4 border-border" />

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-text">Total estimé</span>
              <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
            </div>

            {!requiredDone && (
              <p className="mt-2 text-xs text-warning">
                Sélectionnez tous les composants requis pour continuer.
              </p>
            )}

            <Button
              className="mt-4 w-full"
              disabled={!requiredDone}
              onClick={addAllToCart}
              leftIcon={<ShoppingCart className="h-4 w-4" />}
            >
              Ajouter tout au panier
            </Button>

            <Button
              variant="secondary"
              className="mt-2 w-full text-sm"
              onClick={() => setSelected(Object.fromEntries(BUILD_CATEGORIES.map((c) => [c.key, null])))}
              leftIcon={<Trash2 className="h-4 w-4" />}
            >
              Réinitialiser
            </Button>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-surface p-4 text-xs text-text-muted">
            <p className="font-medium text-text">Compatibilité</p>
            <ul className="mt-2 space-y-1">
              <li>• Vérifiez la compatibilité socket CPU/carte mère</li>
              <li>• DDR5 requis pour plateformes AM5 et Intel Gen 12+</li>
              <li>• Puissance PSU recommandée ≥ CPU TDP + GPU TDP + 150W</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Badge composants sélectionnés */}
      {Object.values(selected).some(Boolean) && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-text">Sélection :</span>
          {BUILD_CATEGORIES.map((cat) => {
            const p = selected[cat.key]
            if (!p) return null
            return (
              <Badge key={cat.key} variant="secondary" className="gap-1">
                <PlusCircle className="h-3 w-3" />
                {p.name.split(' ').slice(0, 3).join(' ')}
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
