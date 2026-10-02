import type { DummyJsonProduct } from '#types/dummyjson'
import { hasStatusCode } from '#shared/errors'
import type { CartItem } from '#shared/cart'

export type CartLine =
  | { productId: number, quantity: number, status: 'ok', product: DummyJsonProduct }
  | { productId: number, quantity: number, status: 'not-found' }
  | { productId: number, quantity: number, status: 'error' }

async function fetchLine(item: CartItem): Promise<CartLine> {
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

  const { data, pending, refresh } = useAsyncData<CartLine[]>(
    'cart-products',
    () => Promise.all(cart.items.map(fetchLine)),
    { watch: [() => cart.items], default: () => [] }
  )

  const total = computed(() => data.value
    .filter(line => line.status === 'ok')
    .reduce((sum, line) => sum + line.product.price * line.quantity, 0))

  return { lines: data, pending, total, refresh }
}
