import { useParams } from 'react-router-dom'
import { StubPage } from '@/pages/StubPage'

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  return (
    <StubPage
      title="Page produit"
      subtitle={`Galerie, specs et avis — slug: ${slug ?? 'inconnu'}`}
      phase="Phase 2"
    />
  )
}
