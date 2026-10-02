import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { useCartStore } from '~/stores/cart'

async function getStore() {
  let store!: ReturnType<typeof useCartStore>

  await mountSuspended(defineComponent({
    setup() {
      store = useCartStore()
      return () => null
    }
  }))

  // The Pinia store (and its backing cookie) is a singleton shared across
  // tests in this file, so each test starts from a clean cart.
  store.clear()

  return store
}

describe('useCartStore', () => {
  it('adds a new product to the cart', async () => {
    const cart = await getStore()

    const result = cart.addItem(1, 10, 2)

    expect(result).toEqual({ success: true })
    expect(cart.items).toEqual([{ productId: 1, quantity: 2 }])
    expect(cart.itemCount).toBe(2)
  })

  it('accumulates quantity when adding the same product again', async () => {
    const cart = await getStore()

    cart.addItem(1, 10, 2)
    cart.addItem(1, 10, 3)

    expect(cart.items).toEqual([{ productId: 1, quantity: 5 }])
  })

  it('refuses to add more than the available stock', async () => {
    const cart = await getStore()

    const result = cart.addItem(1, 3, 5)

    expect(result).toEqual({ success: false, message: 'Stock insuffisant : seulement 3 disponible(s).' })
    expect(cart.items).toEqual([])
  })

  it('updates the quantity of an existing item', async () => {
    const cart = await getStore()
    cart.addItem(1, 10, 1)

    const result = cart.setQuantity(1, 4, 10)

    expect(result).toEqual({ success: true })
    expect(cart.items).toEqual([{ productId: 1, quantity: 4 }])
  })

  it('refuses to set a quantity above stock', async () => {
    const cart = await getStore()
    cart.addItem(1, 10, 1)

    const result = cart.setQuantity(1, 20, 10)

    expect(result).toEqual({ success: false, message: 'Stock insuffisant : seulement 10 disponible(s).' })
    expect(cart.items).toEqual([{ productId: 1, quantity: 1 }])
  })

  it('removes the item when the quantity is set to zero or less', async () => {
    const cart = await getStore()
    cart.addItem(1, 10, 1)

    cart.setQuantity(1, 0, 10)

    expect(cart.items).toEqual([])
  })

  it('removes an item explicitly', async () => {
    const cart = await getStore()
    cart.addItem(1, 10, 1)
    cart.addItem(2, 10, 1)

    cart.removeItem(1)

    expect(cart.items).toEqual([{ productId: 2, quantity: 1 }])
  })

  it('clears the whole cart', async () => {
    const cart = await getStore()
    cart.addItem(1, 10, 1)
    cart.addItem(2, 10, 1)

    cart.clear()

    expect(cart.items).toEqual([])
  })

  it('reports the quantity already in the cart for a given product', async () => {
    const cart = await getStore()
    cart.addItem(1, 10, 3)

    expect(cart.quantityInCart(1)).toBe(3)
    expect(cart.quantityInCart(2)).toBe(0)
  })
})
