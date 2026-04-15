const PRICE_FORMATTER = new Intl.NumberFormat('fr-MA', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatPrice(amount: number): string {
  return `${PRICE_FORMATTER.format(amount)} DH`
}

export function computeDiscountPercent(currentPrice: number, oldPrice: number): number {
  if (oldPrice <= 0 || currentPrice >= oldPrice) return 0
  return Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
}
