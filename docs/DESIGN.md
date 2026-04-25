---
project: Loot
version: 2.0
context: >
  Marketplace e-commerce B2C gaming, marché marocain.
  Références : Razer + Noon.com + Discord.
  Public : gamers et pros IT 18–35 ans. Thème clair, accents forts.
tone: Gaming-first, accessible, direct. Prix en DH (dirhams marocains).
stack: React 19 + TypeScript + TailwindCSS v4
tokens: theme.css (@theme block)
---

## Setup

```css
/* global.css */
@import "tailwindcss";
@import "./theme.css";
```

```html
<!-- index.html <head> -->
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Nunito:ital,wght@1,700;1,800;1,900&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
```

---

## Identity

**Loot** — marketplace de matériel gaming pour le Maroc.
Logo : L et T en navy texturé + toggle chrome (= OO) + tagline "Gear up **game on**".

---

## Colors

| Token CSS | Valeur | Classes Tailwind |
|---|---|---|
| `--color-primary` | `#009FE3` | `bg-primary` `text-primary` `border-primary` `ring-primary` |
| `--color-primary-light` | `#33B8F0` | `bg-primary-light` `hover:bg-primary-light` |
| `--color-primary-dark` | `#0077B3` | `hover:bg-primary-dark` |
| `--color-navy` | `#162844` | `bg-navy` `text-navy` `border-navy` |
| `--color-navy-mid` | `#1E3A6E` | `bg-navy-mid` |
| `--color-navy-deep` | `#0E1A2E` | `bg-navy-deep` |
| `--color-navy-purple` | `#1B1F4A` | `bg-navy-purple` |
| `--color-surface` | `#F5F7FA` | `bg-surface` |
| `--color-surface-2` | `#E8EDF5` | `bg-surface-2` |
| `--color-border` | `#D4DCE8` | `border-border` `divide-border` |
| `--color-text` | `#0F1B30` | `text-text` |
| `--color-muted` | `#5A6A85` | `text-muted` |
| `--color-success` | `#22C55E` | `bg-success` `text-success` |
| `--color-danger` | `#EF4444` | `bg-danger` `text-danger` |
| `--color-warning` | `#F59E0B` | `bg-warning` `text-warning` |

### Règles d'usage

- `bg-navy` — header, footer, fond logo
- `bg-navy-mid` — barre de navigation des catégories
- `bg-navy-deep` — top bar, bande footer
- `bg-surface` — fond de page principal
- `text-primary` — prix, liens actifs, badge count
- `border-primary` — focus ring, hover card border

---

## Typography

| Token CSS | Classe Tailwind | Usage |
|---|---|---|
| `--font-display` | `font-display` | H1–H6, prix, CTA, badges |
| `--font-tagline` | `font-tagline` | Tagline hero uniquement |
| `--font-body` | `font-body` | Corps, nav, labels |

### Scale de texte

| Token | px | Classe | Usage |
|---|---|---|---|
| `--text-2xs` | 11px | `text-2xs` | Badges, overlines |
| `--text-xs` | 12px | `text-xs` | Captions, prix barrés |
| `--text-sm` | 13px | `text-sm` | Labels, meta |
| `--text-base` | 15px | `text-base` | Body principal |
| `--text-lg` | 17px | `text-lg` | Corps proéminent |
| `--text-xl` | 20px | `text-xl` | Petits titres |
| `--text-2xl` | 24px | `text-2xl` | Sous-titres |
| `--text-3xl` | 32px | `text-3xl` | H3 |
| `--text-4xl` | 44px | `text-4xl` | H2, prix principaux |
| `--text-5xl` | 60px | `text-5xl` | H1, hero |

### Combinaisons fréquentes

```tsx
// Titre produit
<h1 className="font-display text-5xl font-black uppercase tracking-tight text-text">

// Prix principal
<span className="font-display text-4xl font-black text-primary">12 990</span>
<span className="font-body text-base font-semibold text-primary">DH</span>

// Prix barré
<span className="font-body text-xs text-muted line-through">15 800 DH</span>

// Body
<p className="font-body text-base text-text leading-relaxed">

// Label muet
<span className="font-body text-sm font-medium text-muted uppercase tracking-wide">
```

---

## Spacing

Base : **4px** (`--spacing: 0.25rem`). Scale Tailwind standard.

---

## Border Radius

| Token CSS | Classe Tailwind | Usage |
|---|---|---|
| `--radius-sm` | `rounded-sm` | Badges, chips (4px) |
| `--radius-md` | `rounded-md` | Boutons, inputs (8px) |
| `--radius-lg` | `rounded-lg` | Cards produit (12px) |
| `--radius-xl` | `rounded-xl` | Modales, drawers (16px) |
| `--radius-full` | `rounded-full` | Avatars, badges pill |

---

## Shadows

| Token CSS | Classe Tailwind | Usage |
|---|---|---|
| `--shadow-card` | `shadow-card` | Card produit repos |
| `--shadow-elevated` | `shadow-elevated` | Dropdowns, drawers |
| `--shadow-cyan` | `shadow-cyan` | Hover ProductCard |
| `--shadow-focus` | `shadow-focus` | Focus ring inputs/boutons |

---

## Components

### Button

```tsx
// Primary
<button className="
  font-display text-base font-extrabold uppercase tracking-wide
  bg-primary hover:bg-primary-dark text-white
  rounded-md px-5 py-2.5
  transition-colors duration-[150ms]
  focus-visible:shadow-focus focus-visible:outline-none
">

// Secondary
<button className="
  font-display text-base font-extrabold uppercase tracking-wide
  bg-navy hover:bg-navy-mid text-white
  rounded-md px-5 py-2.5 transition-colors duration-[150ms]
">

// Outline
<button className="
  font-display text-base font-bold uppercase tracking-wide
  border border-border hover:border-primary text-text
  rounded-md px-5 py-2.5 transition-colors duration-[150ms]
">
```

### Badge

```tsx
// Variantes : primary | navy | danger | warning | success
<span className="
  font-display text-2xs font-bold uppercase tracking-[0.06em]
  bg-primary text-white rounded-sm px-1.5 py-0.5 inline-block
">
  −18%
</span>
```

### ProductCard

```tsx
<article className="
  w-[252px] bg-white rounded-lg
  border-[1.5px] border-border hover:border-primary
  shadow-card hover:shadow-cyan
  transition-all duration-[180ms] cursor-pointer
">
  {/* Image zone */}
  <div className="relative bg-surface h-44 flex items-center justify-center">
    {/* Badges abs. top-left */}
    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
      <span className="font-display text-2xs font-bold uppercase tracking-[0.06em]
                       bg-danger text-white rounded-sm px-1.5 py-0.5">−18%</span>
    </div>
    {/* Wishlist abs. top-right */}
    <button className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full
                       bg-white border border-border flex items-center justify-center
                       hover:border-primary hover:bg-primary transition-colors duration-[150ms]">
    </button>
  </div>

  {/* Content */}
  <div className="p-3.5">
    <p className="font-body text-2xs font-medium text-muted mb-1">ASUS ROG</p>
    <h3 className="font-body text-sm font-medium text-text leading-snug mb-2 line-clamp-2">
      RTX 5080 ROG STRIX 16 Go GDDR7
    </h3>

    {/* Prix */}
    <div className="mt-2.5 mb-3">
      <div className="flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-black text-primary tracking-tight">
          12{"\u00A0"}990
        </span>
        <span className="font-body text-sm font-semibold text-primary">DH</span>
      </div>
      <p className="font-body text-xs text-muted line-through mt-0.5">15{"\u00A0"}800 DH</p>
    </div>

    {/* Stock warning */}
    <p className="font-body text-xs font-medium text-warning mb-2.5">
      ⚠ Plus que 3 en stock
    </p>

    {/* CTA */}
    <button className="w-full bg-primary hover:bg-primary-dark text-white
                       font-display text-base font-extrabold uppercase tracking-wide
                       rounded-md py-2.5 transition-colors duration-[150ms]">
      Ajouter au panier
    </button>
  </div>
</article>
```

### Header

```tsx
<header className="sticky top-0 z-50">

  {/* Top bar */}
  <div className="bg-navy-deep px-6 py-1.5 flex justify-between items-center">
    <p className="font-body text-xs text-white/45">
      🇲🇦 Livraison rapide partout au Maroc · Paiement en 3× sans frais
    </p>
    <nav className="flex gap-4">
      {["Mon compte", "Mes commandes", "Aide"].map(l => (
        <a key={l} className="font-body text-xs text-white/40 hover:text-white/70
                              transition-colors duration-[150ms]">{l}</a>
      ))}
    </nav>
  </div>

  {/* Main bar */}
  <div className="bg-navy px-6 py-3.5 flex items-center gap-4">
    {/* Logo — voir composant LootLogo */}

    {/* Search */}
    <div className="flex-1">
      <div className="flex rounded-md overflow-hidden
                      ring-0 focus-within:ring-2 focus-within:ring-primary
                      transition-shadow duration-[150ms]">
        <select className="bg-surface-2 border-r border-border px-3 py-2.5
                           font-body text-sm text-text outline-none cursor-pointer" />
        <input className="flex-1 bg-white px-3.5 py-2.5
                          font-body text-sm text-text outline-none"
               placeholder="Chercher un produit, marque, référence..." />
        <button className="bg-primary hover:bg-primary-dark px-5
                           flex items-center transition-colors duration-[150ms]">
          {/* Icône loupe */}
        </button>
      </div>
    </div>

    {/* Icônes — favoris, panier */}
  </div>

  {/* Nav categories */}
  <nav className="bg-navy-mid px-6 flex overflow-x-auto">
    {categories.map((cat, i) => (
      <button key={cat}
        className={`font-body text-sm py-2.5 px-3.5 whitespace-nowrap
                    border-b-[3px] transition-colors duration-[150ms]
                    ${i === 0
                      ? "border-primary text-primary font-semibold"
                      : "border-transparent text-white/70 hover:text-primary hover:border-primary"
                    }`}>
        {cat}
      </button>
    ))}
  </nav>

</header>
```

---

## Format des prix

```tsx
// Toujours DH, espace insécable comme séparateur milliers
const formatPrice = (n: number) =>
  n.toLocaleString("fr-MA").replace(/\s/g, "\u00A0") + "\u00A0DH";

// Résultat : "12 990 DH"
```

Classes pour l'affichage du prix :
```
font-display text-4xl font-black text-primary   ← montant
font-body text-sm font-semibold text-primary     ← "DH"
font-body text-xs text-muted line-through        ← prix barré
```

---

## Responsive

| Breakpoint | Largeur | Usage |
|---|---|---|
| `sm` | 375px | Mobile (iPhone SE) |
| `md` | 768px | Tablette |
| `lg` | 1024px | Desktop compact |
| `xl` | 1440px | Desktop large |

Grille produits : `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`

---

## Do / Don't

### DO ✅
- `bg-navy` pour le header — jamais `bg-white`
- `text-primary` pour les prix et éléments interactifs actifs
- `font-display uppercase` pour les CTAs et badges
- Espace insécable `\u00A0` dans les prix
- `focus-visible:shadow-focus` sur tous les éléments focusables
- `transition-colors duration-[150ms]` sur les boutons et cards

### DON'T ❌
- ❌ Jamais `#F26826` (orange TechSpace) ni `#1B3758` (bleu Newegg)
- ❌ Jamais `font-sans` pour les titres — utiliser `font-display`
- ❌ Pas d'Inter, Roboto ni font système comme police principale
- ❌ Pas de dégradés violet/indigo génériques
- ❌ Pas de dark mode par défaut
- ❌ `font-tagline` réservé au logo/hero — jamais dans les composants UI courants
