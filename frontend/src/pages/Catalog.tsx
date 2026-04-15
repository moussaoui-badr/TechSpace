import { useParams } from 'react-router-dom'
import { StubPage } from '@/pages/StubPage'

export function CatalogPage() {
  const { slug } = useParams<{ slug?: string }>()
  return (
    <StubPage
      title={slug ? `Catalogue — ${slug}` : 'Catalogue'}
      subtitle="Filtres, tri, pagination et grille de produits."
      phase="Phase 2"
    />
  )
}
