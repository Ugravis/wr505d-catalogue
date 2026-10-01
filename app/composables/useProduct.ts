import type { DummyJsonProduct } from '#types/dummyjson'
import { hasStatusCode } from '#shared/errors'

export function useProduct(id: number) {
  const asyncData = useAsyncData<DummyJsonProduct>(
    `product-${id}`,
    () => $fetch<DummyJsonProduct>(`/api/products/${id}`)
  )

  const { data: product, error, refresh } = asyncData

  return {
    product,
    notFound: computed(() => hasStatusCode(error.value, 404)),
    hasError: computed(() => error.value != null),
    refresh,
    /** Thenable to `await` in a page so SSR waits for the product before rendering. */
    ready: asyncData
  }
}
