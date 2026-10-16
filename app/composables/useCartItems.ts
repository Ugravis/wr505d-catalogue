import type { DummyJsonProduct } from '#types/dummyjson'
import { hasStatusCode } from '#shared/errors'
import type { CartItem } from '#shared/cart'

export type CartItemLine =
  | { productId: number, quantity: number, status: 'ok', product: DummyJsonProduct }
  | { productId: number, quantity: number, status: 'not-found' }
  | { productId: number, quantity: number, status: 'error' }

async function fetchLine(item: CartItem): Promise<CartItemLine> {
  try {
    const product = await $fetch<DummyJsonProduct>(`/api/products/${item.productId}`)
    return { productId: item.productId, quantity: item.quantity, status: 'ok', product }
  } catch (error) {
    return {
      productId: item.productId,
      quantity: item.quantity,
      status: hasStatusCode(error, 404) ? 'not-found' : 'error'
    }
  }
}

export function useCartItems() {
  const cart = useCartStore()

  const { data, pending, refresh } = useAsyncData<CartItemLine[]>(
    'cart-products',
    () => Promise.all(cart.items.map(fetchLine)),
    { watch: [() => cart.items], default: () => [] }
  )

  return { lines: data, pending, refresh }
}
