import { describe, expect, it } from 'vitest'
import { computeCart, type CartLine } from '../../app/utils/promotions'

function line(category: string, euros: number, quantity: number, productId = 1): CartLine {
  return { productId, category, unitPriceCents: Math.round(euros * 100), quantity }
}

function amountOf(summary: ReturnType<typeof computeCart>, id: 'BEAUTY_3' | 'TROYES10') {
  return summary.discounts.find(discount => discount.id === id)?.amountCents
}

describe('computeCart — acceptance scenarios', () => {
  it('1: 3 beauty at 9.99, no code', () => {
    const cart = computeCart([line('beauty', 9.99, 3)])
    expect(cart.grossCents).toBe(2997)
    expect(amountOf(cart, 'BEAUTY_3')).toBe(300)
    expect(amountOf(cart, 'TROYES10')).toBeUndefined()
    expect(cart.shippingCents).toBe(490)
    expect(cart.totalCents).toBe(3187)
  })

  it('2: 3 beauty at 19.99 with TROYES10', () => {
    const cart = computeCart([line('beauty', 19.99, 3)], 'TROYES10')
    expect(cart.grossCents).toBe(5997)
    expect(amountOf(cart, 'BEAUTY_3')).toBe(600)
    expect(amountOf(cart, 'TROYES10')).toBe(899)
    expect(cart.shippingCents).toBe(490)
    expect(cart.totalCents).toBe(4988)
  })

  it('3: beauty 39.00 + groceries 15.00 with TROYES10 (no beauty discount)', () => {
    const cart = computeCart([line('beauty', 39, 1, 1), line('groceries', 15, 1, 2)], 'TROYES10')
    expect(cart.grossCents).toBe(5400)
    expect(amountOf(cart, 'BEAUTY_3')).toBeUndefined()
    expect(amountOf(cart, 'TROYES10')).toBe(1000)
    expect(cart.shippingCents).toBe(490)
    expect(cart.totalCents).toBe(4890)
  })

  it('4: furniture 89.99 with TROYES10', () => {
    const cart = computeCart([line('furniture', 89.99, 1)], 'TROYES10')
    expect(amountOf(cart, 'TROYES10')).toBe(1000)
    expect(cart.shippingCents).toBe(490)
    expect(cart.totalCents).toBe(8489)
  })

  it('5: 2 laptops at 45.00 with TROYES10 get free shipping', () => {
    const cart = computeCart([line('laptops', 45, 2)], 'TROYES10')
    expect(cart.shippingCents).toBe(0)
    expect(cart.totalCents).toBe(8000)
  })

  it('6: 4 beauty at 12.50 refuses TROYES10 (50.00 − 5.00 is not > 50.00)', () => {
    const cart = computeCart([line('beauty', 12.5, 4)], 'TROYES10')
    expect(amountOf(cart, 'BEAUTY_3')).toBe(500)
    expect(amountOf(cart, 'TROYES10')).toBeUndefined()
    expect(cart.messages).toHaveLength(1)
    expect(cart.messages[0]).toContain('TROYES10')
    expect(cart.shippingCents).toBe(490)
    expect(cart.totalCents).toBe(4990)
  })

  it('7: the code is case-insensitive and ignores surrounding spaces', () => {
    const cart = computeCart([line('groceries', 30, 2)], ' troyes10 ')
    expect(amountOf(cart, 'TROYES10')).toBe(1000)
    expect(cart.shippingCents).toBe(490)
    expect(cart.totalCents).toBe(5490)
  })

  it('8: 1 groceries at 79.99, no code', () => {
    const cart = computeCart([line('groceries', 79.99, 1)])
    expect(cart.discounts).toEqual([])
    expect(cart.shippingCents).toBe(490)
    expect(cart.totalCents).toBe(8489)
  })
})

describe('computeCart — edge cases', () => {
  it('returns an empty summary for an empty cart', () => {
    expect(computeCart([])).toEqual({ grossCents: 0, discounts: [], shippingCents: 0, totalCents: 0, messages: [] })
  })

  it('ignores lines with a zero or negative quantity', () => {
    const cart = computeCart([line('beauty', 10, 0), line('beauty', 10, -2)], 'TROYES10')
    expect(cart.grossCents).toBe(0)
    expect(cart.shippingCents).toBe(0)
    expect(cart.discounts).toEqual([])
    expect(cart.totalCents).toBe(0)
  })

  it('counts beauty quantities across several lines', () => {
    const cart = computeCart([line('beauty', 10, 2, 1), line('beauty', 10, 1, 2)])
    expect(amountOf(cart, 'BEAUTY_3')).toBe(300)
  })

  it('does not apply the beauty discount below 3 items', () => {
    expect(amountOf(computeCart([line('beauty', 10, 2)]), 'BEAUTY_3')).toBeUndefined()
  })

  it('rounds the beauty discount half up, line by line', () => {
    // 2 × 0.05 € = 10 cents → 1 cent; 1 × 0.05 € = 5 cents → 0.5 → 1 cent
    const cart = computeCart([line('beauty', 0.05, 2, 1), line('beauty', 0.05, 1, 2)])
    expect(amountOf(cart, 'BEAUTY_3')).toBe(2)
  })

  it('ignores an undefined or blank code silently', () => {
    expect(computeCart([line('groceries', 60, 1)]).messages).toEqual([])
    expect(computeCart([line('groceries', 60, 1)], '   ').messages).toEqual([])
  })

  it('refuses an unknown code with an explanation', () => {
    const cart = computeCart([line('groceries', 60, 1)], 'FOO')
    expect(cart.discounts).toEqual([])
    expect(cart.messages[0]).toContain('FOO')
  })

  it('requires a sub-total strictly above 50.00 for the code', () => {
    expect(amountOf(computeCart([line('groceries', 50, 1)], 'TROYES10'), 'TROYES10')).toBeUndefined()
    expect(amountOf(computeCart([line('groceries', 50.01, 1)], 'TROYES10'), 'TROYES10')).toBe(1000)
  })

  it('grants free shipping from exactly 80.00 after discounts', () => {
    expect(computeCart([line('groceries', 80, 1)]).shippingCents).toBe(0)
    expect(computeCart([line('groceries', 79.99, 1)]).shippingCents).toBe(490)
  })

  it('never grants free shipping when the cart has furniture', () => {
    expect(computeCart([line('furniture', 200, 1)]).shippingCents).toBe(490)
  })

  it('caps total discounts at 25 % by reducing the promo code', () => {
    // gross 60.00, beauty 6.00 → code would be 10.00 but the cap is 15.00 → code 9.00
    const cart = computeCart([line('beauty', 20, 3)], 'TROYES10')
    expect(amountOf(cart, 'BEAUTY_3')).toBe(600)
    expect(amountOf(cart, 'TROYES10')).toBe(900)
    expect(cart.messages.some(message => message.includes('plafonn'))).toBe(true)
  })

  it('does not report a cap message when the code fits under the cap', () => {
    expect(computeCart([line('groceries', 60, 1)], 'TROYES10').messages).toEqual([])
  })
})
