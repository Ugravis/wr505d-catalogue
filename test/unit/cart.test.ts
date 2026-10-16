import { describe, expect, it } from 'vitest'
import { CART_COOKIE_PAYLOAD_LIMIT, fitsInCookie, getCartPayloadSize, type CartItem } from '../../shared/cart'

describe('getCartPayloadSize / fitsInCookie', () => {
  it('computes the byte size of the serialized cart', () => {
    const items: CartItem[] = [{ productId: 1, quantity: 2 }]
    expect(getCartPayloadSize(items)).toBe(JSON.stringify(items).length)
  })

  it('fits a reasonably sized cart within the cookie limit', () => {
    const items: CartItem[] = Array.from({ length: 20 }, (_, i) => ({ productId: i + 1, quantity: 3 }))
    expect(fitsInCookie(items)).toBe(true)
  })

  it('rejects a cart whose payload exceeds the cookie limit', () => {
    const items: CartItem[] = Array.from({ length: 1000 }, (_, i) => ({ productId: i + 1, quantity: 99 }))
    expect(getCartPayloadSize(items)).toBeGreaterThan(CART_COOKIE_PAYLOAD_LIMIT)
    expect(fitsInCookie(items)).toBe(false)
  })
})
