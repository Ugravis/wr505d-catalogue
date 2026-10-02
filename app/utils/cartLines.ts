import type { CartItemLine } from '@/composables/useCartItems'
import type { CartLine } from '@/utils/promotions'

/** Converts the loaded cart lines to the engine's input (prices in integer cents), skipping unavailable products. */
export function toPromoLines(lines: CartItemLine[]): CartLine[] {
  return lines.flatMap((line) => {
    if (line.status !== 'ok') return []
    return [{
      productId: line.productId,
      category: line.product.category,
      unitPriceCents: Math.round(line.product.price * 100),
      quantity: line.quantity
    }]
  })
}
