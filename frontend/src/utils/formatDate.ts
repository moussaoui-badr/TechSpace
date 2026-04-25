export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
