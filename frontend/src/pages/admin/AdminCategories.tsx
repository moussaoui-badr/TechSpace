import { useState } from 'react'
import { Edit2, Folder, FolderOpen, Plus, Search, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Category {
  id: number
  name: string
  slug: string
  parent: string | null
  productCount: number
  isActive: boolean
}

const INITIAL: Category[] = [
  { id: 1,  name: 'PC Gaming',             slug: 'pc-gaming',          parent: null,            productCount: 42, isActive: true  },
  { id: 2,  name: 'PC Assemblé',           slug: 'pc-assemble',        parent: null,            productCount: 18, isActive: true  },
  { id: 3,  name: 'Processeurs',           slug: 'processeurs',        parent: 'Composants',    productCount: 34, isActive: true  },
  { id: 4,  name: 'Cartes graphiques',     slug: 'cartes-graphiques',  parent: 'Composants',    productCount: 28, isActive: true  },
  { id: 5,  name: 'RAM & Mémoire',         slug: 'ram-memoire',        parent: 'Composants',    productCount: 21, isActive: true  },
  { id: 6,  name: 'Stockage SSD & HDD',   slug: 'stockage',           parent: 'Composants',    productCount: 35, isActive: true  },
  { id: 7,  name: 'Cartes mères',         slug: 'cartes-meres',       parent: 'Composants',    productCount: 19, isActive: true  },
  { id: 8,  name: 'Alimentations',        slug: 'alimentations',      parent: 'Composants',    productCount: 15, isActive: true  },
  { id: 9,  name: 'Refroidissement',      slug: 'refroidissement',    parent: 'Composants',    productCount: 22, isActive: true  },
  { id: 10, name: 'Boîtiers PC',          slug: 'boitiers-pc',        parent: 'Composants',    productCount: 17, isActive: true  },
  { id: 11, name: 'Composants',           slug: 'composants',         parent: null,            productCount: 0,  isActive: true  },
  { id: 12, name: 'Moniteurs',            slug: 'moniteurs',          parent: 'Périphériques', productCount: 26, isActive: true  },
  { id: 13, name: 'Claviers & Souris',    slug: 'claviers-souris',    parent: 'Périphériques', productCount: 38, isActive: true  },
  { id: 14, name: 'Casques & Audio',      slug: 'casques-audio',      parent: 'Périphériques', productCount: 23, isActive: true  },
  { id: 15, name: 'Périphériques',        slug: 'peripheriques',      parent: null,            productCount: 0,  isActive: true  },
  { id: 16, name: 'Laptops Gamer',        slug: 'laptops-gamer',      parent: 'Laptops',       productCount: 14, isActive: true  },
  { id: 17, name: 'Laptops Bureau',       slug: 'laptops-bureau',     parent: 'Laptops',       productCount: 11, isActive: true  },
  { id: 18, name: 'Laptops',             slug: 'laptops',            parent: null,            productCount: 0,  isActive: true  },
  { id: 19, name: 'Consoles',            slug: 'consoles',           parent: null,            productCount: 8,  isActive: false },
]

const EMPTY: Omit<Category, 'id' | 'productCount'> = { name: '', slug: '', parent: null, isActive: true }

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [draft, setDraft] = useState<Omit<Category, 'id' | 'productCount'>>(EMPTY)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.includes(search.toLowerCase()),
  )

  const rootNames = categories.filter((c) => c.parent === null).map((c) => c.name)

  function openAdd() { setDraft(EMPTY); setEditingId(null); setModal('add') }
  function openEdit(cat: Category) {
    setDraft({ name: cat.name, slug: cat.slug, parent: cat.parent, isActive: cat.isActive })
    setEditingId(cat.id)
    setModal('edit')
  }
  function closeModal() { setModal(null) }

  function handleNameChange(name: string) {
    setDraft((p) => ({ ...p, name, slug: slugify(name) }))
  }

  function save() {
    if (!draft.name.trim()) return
    if (modal === 'add') {
      setCategories((p) => [...p, { id: Date.now(), ...draft, productCount: 0 }])
    } else if (modal === 'edit' && editingId !== null) {
      setCategories((p) => p.map((c) => c.id === editingId ? { ...c, ...draft } : c))
    }
    closeModal()
  }

  function toggleActive(id: number) {
    setCategories((p) => p.map((c) => c.id === id ? { ...c, isActive: !c.isActive } : c))
  }

  function remove(id: number) {
    if (!window.confirm('Supprimer cette catégorie ?')) return
    setCategories((p) => p.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Catégories</h2>
          <p className="mt-0.5 text-sm text-text-muted">{categories.length} catégories au total</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
          Ajouter
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-background px-3 shadow-card">
        <Search className="h-4 w-4 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou slug…"
          className="h-10 flex-1 bg-transparent text-sm text-text placeholder:text-text-subtle focus:outline-none"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-background shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3">Produits</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((cat) => (
              <tr key={cat.id} className="hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {cat.parent === null
                      ? <FolderOpen className="h-4 w-4 text-primary" />
                      : <Folder className="h-4 w-4 text-text-subtle" />
                    }
                    <span className={`font-medium ${cat.parent === null ? 'text-text' : 'text-text-muted'}`}>
                      {cat.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-text-subtle">{cat.slug}</td>
                <td className="px-4 py-3 text-text-muted">{cat.parent ?? '—'}</td>
                <td className="px-4 py-3 text-text-muted">{cat.productCount}</td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => toggleActive(cat.id)}>
                    <Badge variant={cat.isActive ? 'success' : 'outline'} size="sm">
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label="Modifier" onClick={() => openEdit(cat)}
                      className="text-text-muted transition-colors hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button type="button" aria-label="Supprimer" onClick={() => remove(cat.id)}
                      className="text-text-muted transition-colors hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-text-muted">Aucune catégorie trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal création/édition */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text">
                {modal === 'add' ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
              </h3>
              <button onClick={closeModal} className="text-text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Nom</label>
                <input value={draft.name} onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="ex: Claviers mécaniques" className={fieldCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Slug</label>
                <input value={draft.slug} onChange={(e) => setDraft((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="ex: claviers-mecaniques" className={fieldCls} />
                <p className="mt-1 text-xs text-text-subtle">Généré automatiquement depuis le nom.</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Catégorie parente</label>
                <select value={draft.parent ?? ''} onChange={(e) => setDraft((p) => ({ ...p, parent: e.target.value || null }))}
                  className={fieldCls}>
                  <option value="">Aucune (catégorie racine)</option>
                  {rootNames.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input id="cat-active" type="checkbox" checked={draft.isActive}
                  onChange={(e) => setDraft((p) => ({ ...p, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary" />
                <label htmlFor="cat-active" className="text-sm text-text">Catégorie active</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:bg-surface">
                Annuler
              </button>
              <Button onClick={save} disabled={!draft.name.trim()}>
                {modal === 'add' ? 'Créer' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const fieldCls = 'h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-text placeholder:text-text-subtle focus:outline-none focus:ring-2 focus:ring-primary'
