const priceFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' })

export function formatPrice(value: number): string {
  return priceFormatter.format(value)
}

export function formatPriceCents(cents: number): string {
  return formatPrice(cents / 100)
}
