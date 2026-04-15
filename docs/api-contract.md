# API Contract — TechSpace (Phase 4)

Ce document sera rempli en **Phase 4** lors de la construction du backend ASP.NET Core.

## Endpoints prevus (ebauche)

### Auth (Cookie Auth)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Public
- `GET /api/products?page=&pageSize=&categorySlug=&brandSlug=&search=&minPrice=&maxPrice=&sortBy=`
- `GET /api/products/{slug}`
- `GET /api/categories`
- `GET /api/banners`
- `GET /api/products/{id}/reviews`

### Client (authentifie)
- `GET/POST/PUT/DELETE /api/cart`
- `GET/POST /api/orders`
- `GET /api/orders/{id}`
- `GET/POST/DELETE /api/wishlist`

### Admin (role Admin)
- `POST/PUT/DELETE /api/admin/products`
- `POST/PUT/DELETE /api/admin/categories`
- `POST/PUT/DELETE /api/admin/banners`
- `PUT /api/admin/orders/{id}/status`

## Format de reponse

Paginations :
```json
{
  "items": [...],
  "totalCount": 120,
  "page": 1,
  "pageSize": 20
}
```

Erreurs :
```json
{
  "message": "...",
  "errors": { "field": ["erreur 1", "erreur 2"] }
}
```
