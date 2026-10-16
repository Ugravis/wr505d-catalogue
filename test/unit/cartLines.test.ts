import { describe, expect, it } from 'vitest'
import type { CartItemLine } from '../../app/composables/useCartItems'
import type { DummyJsonProduct } from '../../types/dummyjson'
import { toPromoLines } from '../../app/utils/cartLines'

function okLine(productId: number, category: string, price: number, quantity: number): CartItemLine {
  return { productId, quantity, status: 'ok', product: { category, price } as DummyJsonProduct }
}

describe('toPromoLines', () => {
  it('converts prices to integer cents and keeps category and quantity', () => {
    expect(toPromoLines([okLine(1, 'beauty', 9.99, 3)])).toEqual([
      { productId: 1, category: 'beauty', unitPriceCents: 999, quantity: 3 }
    ])
  })

  it('avoids floating point drift when converting to cents', () => {
    expect(toPromoLines([okLine(1, 'beauty', 19.99, 1)])[0]?.unitPriceCents).toBe(1999)
    expect(toPromoLines([okLine(2, 'beauty', 0.29, 1)])[0]?.unitPriceCents).toBe(29)
  })

  it('skips products that could not be loaded', () => {
    const lines: CartItemLine[] = [
      okLine(1, 'beauty', 10, 1),
      { productId: 2, quantity: 1, status: 'not-found' },
      { productId: 3, quantity: 1, status: 'error' }
    ]
    expect(toPromoLines(lines).map(line => line.productId)).toEqual([1])
  })
})
