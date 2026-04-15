# Design System — TechSpace

## Palette (theme sombre gaming, inspiration Newegg)

| Token              | Hex       | Usage                                |
| ------------------ | --------- | ------------------------------------ |
| `--color-primary`         | `#F26826` | Orange principal (CTAs, accents)     |
| `--color-primary-hover`   | `#E05A1A` | Hover des CTAs                       |
| `--color-background`      | `#0F0F1A` | Fond de page                         |
| `--color-surface`         | `#1A1A2E` | Cards, header, surfaces              |
| `--color-surface-hover`   | `#252540` | Hover des surfaces                   |
| `--color-border`          | `#2D2D44` | Bordures subtiles                    |
| `--color-secondary`       | `#004B7D` | Bleu secondaire                      |
| `--color-accent`          | `#FBD32C` | Jaune accent (badges promo)          |
| `--color-text`            | `#F6F6F6` | Texte principal                      |
| `--color-text-muted`      | `#9CA3AF` | Texte secondaire                     |
| `--color-success`         | `#22C55E` | Confirmations, stock OK              |
| `--color-danger`          | `#EF4444` | Erreurs, promo (ancien prix barre)   |

## Typographie

- **Titres** : Outfit (weights 600, 700) via Google Fonts
- **Corps** : Inter (weights 400, 500) via Google Fonts

## Breakpoints (mobile-first)

- `sm` : 640px
- `md` : 768px
- `lg` : 1024px
- `xl` : 1280px
- `2xl` : 1536px

Cibles de test : **375** (mobile), **768** (tablette), **1440** (desktop).

## Composants UI

Primitives dans `src/components/ui/` :
- `Button` (variantes : primary, secondary, outline, ghost, danger ; tailles : sm, md, lg)
- `Input`, `Select`, `Textarea`, `Checkbox`
- `Badge` (primary, success, danger, warning)
- `Card`, `ProductCard`, `Rating`, `PriceDisplay`, `QuantitySelector`
- `Modal`, `Drawer`, `Breadcrumb`, `Pagination`, `Toast`, `Skeleton`

## Layout

- `Header` sticky, backdrop-blur, avec bandeau promo + search + icones + nav categories
- `MegaMenu` au hover sur une categorie
- `Footer` 4 colonnes + copyright

## Tokens Tailwind v4

Configures via `@theme` dans `src/styles/theme.css`. Exemple :
```css
@theme {
  --color-primary: #F26826;
  --font-sans: "Inter", system-ui, sans-serif;
  --font-display: "Outfit", system-ui, sans-serif;
}
```
