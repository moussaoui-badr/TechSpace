# TechSpace

Site e-commerce B2C pour le marche marocain — materiel informatique (PC Gamer, composants,
peripheriques, portables, consoles).

## Stack

- **Frontend** : React 19 + TypeScript + Vite 6 + TailwindCSS v4 + Zustand
- **Backend** (Phase 4) : ASP.NET Core 10 + EF Core + SQL Server Express + Cookie Auth
- **Hebergement** : Windows Server + IIS

## Approche

**Frontend-First** : le site est d'abord construit avec des donnees mock dans `src/data/` pour
validation visuelle rapide. Le backend est integre par la suite en remplacant la couche
`src/api/` par de vrais appels axios.

## Demarrer en local

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Ouvrir `http://localhost:5173`.

### Backend (Phase 4)
```bash
cd backend/TechSpace.Api
dotnet restore
dotnet ef database update
dotnet run
```
Swagger sur `https://localhost:7xxx/swagger`.

## Documentation

- [Design system](docs/design-system.md) — palette, typo, tokens Tailwind
- [Mock data](docs/mock-data.md) — structure des donnees de demonstration
- [API contract](docs/api-contract.md) — endpoints backend (Phase 4)

## Conventions

Voir [CLAUDE.md](CLAUDE.md) pour les conventions de code, commits, et philosophie du projet.

## Licence

Proprietaire.
