import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Brand {
  name: string
  category: string
  description: string
  initials: string
}

const BRANDS: Brand[] = [
  { name: 'AMD', category: 'Processeurs & GPU', description: 'Processeurs Ryzen et cartes graphiques Radeon', initials: 'AMD' },
  { name: 'Intel', category: 'Processeurs', description: 'Processeurs Core i3, i5, i7, i9 et Xeon', initials: 'INT' },
  { name: 'NVIDIA', category: 'Cartes graphiques', description: 'GeForce RTX et quadro workstation', initials: 'NVD' },
  { name: 'ASUS', category: 'Cartes mères & Périphériques', description: 'ROG, TUF, ProArt — gaming à workstation', initials: 'ASS' },
  { name: 'MSI', category: 'Cartes mères & Gaming', description: 'Solutions gaming haute performance', initials: 'MSI' },
  { name: 'Gigabyte', category: 'Cartes mères & GPU', description: 'Composants fiables pour enthusiastes', initials: 'GIG' },
  { name: 'Corsair', category: 'RAM, Boîtiers, Refroidissement', description: 'Mémoire, alimentation et refroidissement premium', initials: 'COR' },
  { name: 'Kingston', category: 'Stockage & RAM', description: 'SSD, RAM et clés USB grand public et pro', initials: 'KNG' },
  { name: 'Samsung', category: 'Stockage & Moniteurs', description: 'SSD NVMe 980 Pro, moniteurs Odyssey', initials: 'SAM' },
  { name: 'Seagate', category: 'Stockage HDD', description: 'Disques durs pour PC, NAS et surveillance', initials: 'SEA' },
  { name: 'Western Digital', category: 'Stockage', description: 'WD Blue, Red, Black — HDD et SSD pour tous usages', initials: 'WD' },
  { name: 'Logitech', category: 'Périphériques', description: 'Souris, claviers, casques et webcams', initials: 'LOG' },
  { name: 'Razer', category: 'Gaming', description: 'Périphériques gaming ultra-performants', initials: 'RZR' },
  { name: 'SteelSeries', category: 'Gaming', description: 'Casques, souris et tapis de souris pro', initials: 'STS' },
  { name: 'Cooler Master', category: 'Refroidissement & Boîtiers', description: 'Ventilateurs, watercooling et boîtiers gaming', initials: 'CM' },
  { name: 'NZXT', category: 'Boîtiers & Refroidissement', description: 'Boîtiers élégants et AIO premium', initials: 'NZT' },
  { name: 'be quiet!', category: 'Alimentation & Refroidissement', description: 'Silence et performance — ventirad et alim', initials: 'BQT' },
  { name: 'Dell', category: 'Moniteurs & Laptops', description: 'Moniteurs UltraSharp et laptops XPS', initials: 'DEL' },
  { name: 'LG', category: 'Moniteurs', description: 'Écrans UltraWide 4K et OLED gaming', initials: 'LG' },
  { name: 'Sony', category: 'Consoles', description: 'PlayStation 5 et accessoires officiels', initials: 'SNY' },
]

const CATEGORIES = ['Tous', 'Processeurs & GPU', 'Cartes mères & Gaming', 'Stockage', 'Périphériques', 'Gaming', 'Moniteurs', 'Boîtiers & Refroidissement', 'Consoles']

const CATEGORY_COLORS: Record<string, string> = {
  'Processeurs & GPU': 'bg-blue-50 text-blue-700',
  'Cartes mères & Gaming': 'bg-purple-50 text-purple-700',
  'Cartes mères & Périphériques': 'bg-purple-50 text-purple-700',
  'Stockage & RAM': 'bg-amber-50 text-amber-700',
  'Stockage & Moniteurs': 'bg-amber-50 text-amber-700',
  'Stockage HDD': 'bg-amber-50 text-amber-700',
  'Stockage': 'bg-amber-50 text-amber-700',
  'Périphériques': 'bg-green-50 text-green-700',
  'Gaming': 'bg-red-50 text-red-700',
  'Moniteurs': 'bg-cyan-50 text-cyan-700',
  'Boîtiers & Refroidissement': 'bg-slate-50 text-slate-700',
  'Alimentation & Refroidissement': 'bg-slate-50 text-slate-700',
  'Refroidissement & Boîtiers': 'bg-slate-50 text-slate-700',
  'RAM, Boîtiers, Refroidissement': 'bg-slate-50 text-slate-700',
  'Consoles': 'bg-indigo-50 text-indigo-700',
  'Processeurs': 'bg-blue-50 text-blue-700',
  'Cartes graphiques': 'bg-green-50 text-green-700',
  'Laptops': 'bg-orange-50 text-orange-700',
}

function badgeCls(category: string): string {
  return CATEGORY_COLORS[category] ?? 'bg-surface text-text-muted'
}

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } }

export function BrandsPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tous')

  const filtered = BRANDS.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'Tous' || b.category.includes(activeCategory.replace('Tous', ''))
    return matchSearch && matchCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-navy py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6"
        >
          <h1 className="font-display text-5xl font-black uppercase tracking-tight text-white sm:text-6xl">
            Nos marques
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/70">
            {BRANDS.length} marques de référence dans l'informatique et le gaming, toutes disponibles sur Loot.
          </p>
          {/* Barre de recherche */}
          <div className="mx-auto mt-8 flex max-w-sm items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-sm">
            <Search className="h-4 w-4 shrink-0 text-white/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une marque…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </motion.div>
      </section>

      {/* Filtres catégories */}
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-5xl overflow-x-auto px-4 sm:px-6">
          <div className="flex gap-2 py-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-background text-text-muted hover:border-primary hover:text-primary border border-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille marques */}
      <section className="py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-text-muted">
              Aucune marque trouvée pour "{search}"
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            >
              {filtered.map((brand) => (
                <motion.div key={brand.name} variants={fadeUp}>
                  <Link
                    to={`/products?brand=${encodeURIComponent(brand.name)}`}
                    className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
                  >
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-navy font-display text-lg font-black text-white transition-colors group-hover:bg-primary">
                      {brand.initials}
                    </div>
                    <div className="font-semibold text-text">{brand.name}</div>
                    <div className={`mt-1.5 inline-block self-start rounded-full px-2 py-0.5 text-xs font-medium ${badgeCls(brand.category)}`}>
                      {brand.category}
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">{brand.description}</p>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
