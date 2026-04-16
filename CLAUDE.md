# TechSpace — Site E-Commerce Materiel Informatique (Maroc)

## Vue d'ensemble

Site e-commerce B2C (PC Gamer, composants, peripheriques, portables, consoles) pour le marche
marocain. Identite visuelle fidele a Newegg : theme clair marketplace, accent rouge #E31837,
jaune #F6C60C en secondaire, header 3 niveaux.

**Approche : Frontend-First** — on construit toute l'UX avec des donnees mock dans `/src/data/`.
Le backend ASP.NET Core viendra APRES validation visuelle, en Phase 4.

## Stack

### Frontend (Phases 1-3)
- Vite 6 + React 19 + TypeScript strict
- TailwindCSS v4 (config `@theme` dans `src/styles/theme.css`, **pas** de `tailwind.config.ts`)
- React Router v7, Zustand, axios, lucide-react, framer-motion, clsx

### Backend (Phase 4)
- ASP.NET Core 10 Web API (`net10.0`), EF Core 10, ASP.NET Identity + **Cookie Auth**
- SQL Server LocalDB (dev) / SQL Server Express (prod)
- Structure plate : `Models/`, `Data/`, `Services/`, `Controllers/`, `DTOs/`, `Helpers/`
- IIS + Windows Server pour la prod (pas de Docker)

## Commandes

### Frontend
```bash
cd frontend
npm run dev      # Demarre Vite en dev sur localhost:5173
npm run build    # Build de prod (output: frontend/dist/)
npm run preview  # Preview du build
npm run lint     # ESLint
```

### Backend (Phase 4)
```bash
cd backend/TechSpace.Api
dotnet run       # Demarre l'API (Swagger sur /swagger en dev)
dotnet build     # Build
dotnet ef migrations add <Name>  # Nouvelle migration
dotnet ef database update        # Applique migrations
```

## Conventions

### Code
- **TypeScript strict**, INTERDICTION d'utiliser `any`
- Composants fonctionnels uniquement, named exports
- 1 fichier = 1 composant
- TailwindCSS uniquement — pas de CSS inline, pas de fichiers `.css` custom (sauf `theme.css`)
- Zustand pour etat global (cart, auth, ui, wishlist)
- Donnees mock dans `/src/data/` — fichiers `.ts` avec arrays typees
- Prix toujours affiches en `"X,XXX DH"` via `utils/formatPrice.ts`
- Mobile-first responsive (breakpoints : 375, 768, 1440)

### Langue
- Tout en francais : reponses, commentaires, commits, docs, README, UI
- Noms de variables/fonctions/classes en anglais (convention technique)
- Commits conventionnels : `type(scope): description en francais`
  - Types : `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`

### Design
- Theme CLAIR marketplace style Newegg. Body `#FFFFFF`, sections alternees `#F5F5F5`
- Accent rouge `#E31837` (CTAs, prix, badges promo). Jaune `#F6C60C` (logo, badges jaunes)
- Top bar header et footer `#334155` (bleu-gris fonce) avec texte clair
- Ombres subtiles light theme (jamais de glow colore). Radius modestes (default 0.375rem)
- Font sans-serif : Inter pour corps et titres

## Philosophie

1. **KISS / YAGNI** : pas de sur-engineering, pas d'abstraction premature
2. **DRY** : 3+ repetitions = extraire en fonction/composant
3. **Fonctions courtes** (< 30 lignes), nommage explicite, zero magic numbers
4. **Gestion d'erreurs explicite** : jamais de catch vide
5. **Securite** : valider les entrees utilisateur, echapper les sorties

## Interdictions

- NE PAS ajouter de packages sans validation
- NE PAS utiliser de CSS modules ou styled-components
- NE PAS creer de fichiers de test vides
- NE PAS utiliser `any` en TypeScript
- NE PAS commit de secrets, `.env`, credentials
- NE PAS creer de backend avant la Phase 4 (on reste sur mock data)
- NE PAS ajouter d'abstractions (Repository, UoW, MediatR, CQRS) au backend

## Structure

```
/TechSpace
|-- CLAUDE.md
|-- README.md
|-- .gitignore
|-- /docs
|   |-- design-system.md
|   |-- mock-data.md
|   `-- api-contract.md          # A remplir en Phase 4
|-- /frontend                    # Phase 1 a 3
|   |-- vite.config.ts
|   |-- tsconfig.json
|   `-- src/
|       |-- main.tsx, App.tsx
|       |-- /components/ui       # Primitives reutilisables
|       |-- /components/layout   # Header, Footer, MegaMenu
|       |-- /pages               # 1 page = 1 route
|       |-- /stores              # Zustand
|       |-- /data                # Mock data (Phase 2)
|       |-- /api                 # Facade API (mock -> axios en Phase 4)
|       |-- /types               # Types TS partages
|       |-- /utils               # formatPrice, cn
|       `-- /styles/theme.css    # Tokens Tailwind v4
|-- /backend                     # Phase 4
|   `-- TechSpace.Api/
`-- /deploy                      # Phase 4
    |-- publish.ps1
    |-- web.config
    `-- deploy.md
```

## Phases

- **Phase 0** : Init repo + CLAUDE + docs — DONE
- **Phase 1** : Setup frontend + design system + composants UI + layout — DONE
- **Phase 2** : Mock data + Home + Catalogue + ProductDetail
- **Phase 3** : Panier + Checkout + Auth mock + Compte + Admin
- **Phase 4** : Backend ASP.NET Core + integration + deploiement IIS

## Template session Claude Code

```
Projet TechSpace. Lis CLAUDE.md.
Phase [N] : [Nom].
Scope : [Feature precise].
NE PAS ajouter : [Hors scope].

Verifie npm run build a la fin.
```
