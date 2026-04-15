# Mock Data — TechSpace

Les donnees mock vivent dans `frontend/src/data/` et sont utilisees en Phase 2 et 3 avant le
branchement backend de la Phase 4.

## Fichiers

- `categories.ts` — arbre hierarchique des categories (PC Gamer, Composants, ...)
- `brands.ts` — marques partenaires (MSI, ASUS, Corsair, AMD, NVIDIA, ...)
- `products.ts` — 30 a 40 produits realistes (noms reels, prix DH realistes, specs)
- `banners.ts` — 3 banners pour le hero slider
- `reviews.ts` — 15 a 20 avis repartis sur differents produits

## Contrats

Les types sont definis dans `src/types/index.ts` et utilises :
- par les mocks pour typer les arrays
- par la facade `src/api/` pour les retours
- plus tard (Phase 4) comme reference pour les DTOs C# backend (alignement 1:1)

## Facade API

`src/api/*.ts` expose des fonctions async qui lisent les mocks et simulent la latence reseau
(`await delay(300)`). Exemple :

```ts
export async function getProducts(params: ProductsQuery): Promise<ProductsPage> {
  await delay(300);
  // filtrer/trier/paginer les produits depuis src/data/products.ts
  return { items, totalCount, page, pageSize };
}
```

En **Phase 4**, on remplace le contenu des fonctions de `src/api/` par des appels `axios` —
les composants consommateurs ne changent pas.
