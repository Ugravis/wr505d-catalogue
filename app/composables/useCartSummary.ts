import type { CartItemLine } from '@/composables/useCartItems'
import { toPromoLines } from '@/utils/cartLines'
import { computeCart } from '@/utils/promotions'

export function useCartSummary(lines: Ref<CartItemLine[]>, promoCode: Ref<string>) {
  return computed(() => computeCart(toPromoLines(lines.value), promoCode.value))
}
