import { useState } from 'react'
import { Edit2, Image, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Banner {
  id: number
  title: string
  subtitle: string
  ctaLabel: string
  ctaLink: string
  color: string
  isActive: boolean
  order: number
}

const INITIAL: Banner[] = [
  { id: 1, title: 'Shell Shocker', subtitle: 'Offres flash — jusqu\'à -40% sur les GPU', ctaLabel: 'Voir les offres', ctaLink: '/products?promo=true', color: '#E53E3E', isActive: true, order: 1 },
  { id: 2, title: 'PC Gaming RTX 4090', subtitle: 'Le setup ultime pour gamers exigeants', ctaLabel: 'Configurer', ctaLink: '/pc-builder', color: '#009FE3', isActive: true, order: 2 },
  { id: 3, title: 'Livraison gratuite', subtitle: 'À partir de 500 DH partout au Maroc', ctaLabel: 'Commander', ctaLink: '/products', color: '#22C55E', isActive: true, order: 3 },
  { id: 4, title: 'Nouveaux laptops 2025', subtitle: 'Découvrez les derniers portables gaming', ctaLabel: 'Explorer', ctaLink: '/products?category=laptops', color: '#162844', isActive: false, order: 4 },
]

const EMPTY: Omit<Banner, 'id'> = { title: '', subtitle: '', ctaLabel: 'En savoir plus', ctaLink: '/products', color: '#009FE3', isActive: true, order: 1 }

export function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>(INITIAL)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [draft, setDraft] = useState<Omit<Banner, 'id'>>(EMPTY)
  const [editingId, setEditingId] = useState<number | null>(null)

  function openAdd() { setDraft({ ...EMPTY, order: banners.length + 1 }); setEditingId(null); setModal('add') }
  function openEdit(b: Banner) {
    setDraft({ title: b.title, subtitle: b.subtitle, ctaLabel: b.ctaLabel, ctaLink: b.ctaLink, color: b.color, isActive: b.isActive, order: b.order })
    setEditingId(b.id)
    setModal('edit')
  }
  function closeModal() { setModal(null) }

  function save() {
    if (!draft.title.trim()) return
    if (modal === 'add') {
      setBanners((p) => [...p, { id: Date.now(), ...draft }])
    } else if (modal === 'edit' && editingId !== null) {
      setBanners((p) => p.map((b) => b.id === editingId ? { ...b, ...draft } : b))
    }
    closeModal()
  }

  function toggleActive(id: number) {
    setBanners((p) => p.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b))
  }

  function remove(id: number) {
    if (!window.confirm('Supprimer cette bannière ?')) return
    setBanners((p) => p.filter((b) => b.id !== id))
  }

  const sorted = [...banners].sort((a, b) => a.order - b.order)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Bannières</h2>
          <p className="mt-0.5 text-sm text-text-muted">{banners.length} bannières — Hero Slider</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={openAdd}>
          Ajouter
        </Button>
      </div>

      {/* Aperçu liste */}
      <div className="space-y-3">
        {sorted.map((b) => (
          <div
            key={b.id}
            className={`flex items-center gap-4 rounded-xl border p-4 transition-opacity ${b.isActive ? 'border-border bg-background' : 'border-border bg-surface opacity-60'}`}
          >
            {/* Miniature couleur */}
            <div
              className="flex h-14 w-24 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: b.color }}
            >
              <Image className="h-5 w-5 text-white/60" />
            </div>

            {/* Infos */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-text">{b.title}</span>
                <Badge variant={b.isActive ? 'success' : 'outline'} size="sm">
                  {b.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <span className="text-xs text-text-subtle">Ordre #{b.order}</span>
              </div>
              <p className="mt-0.5 truncate text-sm text-text-muted">{b.subtitle}</p>
              <p className="text-xs text-text-subtle">
                CTA : <span className="font-medium text-primary">{b.ctaLabel}</span> → {b.ctaLink}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button type="button" onClick={() => toggleActive(b.id)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:border-primary hover:text-primary transition-colors">
                {b.isActive ? 'Désactiver' : 'Activer'}
              </button>
              <button type="button" aria-label="Modifier" onClick={() => openEdit(b)}
                className="text-text-muted hover:text-primary transition-colors">
                <Edit2 className="h-4 w-4" />
              </button>
              <button type="button" aria-label="Supprimer" onClick={() => remove(b.id)}
                className="text-text-muted hover:text-danger transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-background p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text">
                {modal === 'add' ? 'Nouvelle bannière' : 'Modifier la bannière'}
              </h3>
              <button onClick={closeModal} className="text-text-muted hover:text-text">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Titre</label>
                <input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))}
                  placeholder="ex: Shell Shocker" className={fieldCls} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-text">Sous-titre</label>
                <input value={draft.subtitle} onChange={(e) => setDraft((p) => ({ ...p, subtitle: e.target.value }))}
                  placeholder="ex: Offres flash jusqu'à -40%" className={fieldCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Label du bouton</label>
                  <input value={draft.ctaLabel} onChange={(e) => setDraft((p) => ({ ...p, ctaLabel: e.target.value }))}
                    placeholder="ex: Voir les offres" className={fieldCls} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Lien du bouton</label>
                  <input value={draft.ctaLink} onChange={(e) => setDraft((p) => ({ ...p, ctaLink: e.target.value }))}
                    placeholder="/products" className={fieldCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Couleur de fond</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={draft.color}
                      onChange={(e) => setDraft((p) => ({ ...p, color: e.target.value }))}
                      className="h-10 w-14 cursor-pointer rounded border border-border bg-background p-1" />
                    <input value={draft.color} onChange={(e) => setDraft((p) => ({ ...p, color: e.target.value }))}
                      className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm font-mono text-text focus:outline-none focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text">Ordre d'affichage</label>
                  <input type="number" min={1} value={draft.order}
                    onChange={(e) => setDraft((p) => ({ ...p, order: Number(e.target.value) }))}
                    className={fieldCls} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input id="banner-active" type="checkbox" checked={draft.isActive}
                  onChange={(e) => setDraft((p) => ({ ...p, isActive: e.target.checked }))}
                  className="h-4 w-4 rounded border-border text-primary" />
                <label htmlFor="banner-active" className="text-sm text-text">Bannière active</label>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="rounded-lg border border-border px-4 py-2 text-sm text-text-muted hover:bg-surface">
                Annuler
              </button>
              <Button onClick={save} disabled={!draft.title.trim()}>
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
