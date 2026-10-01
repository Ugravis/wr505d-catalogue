import type { DummyJsonProductListResponse } from '#types/dummyjson'

export const PRODUCTS_PAGE_SIZE = 12

export function buildProductsRequest(page: number, search: string) {
  const query = search.trim()
  const endpoint = query ? 'https://dummyjson.com/products/search' : 'https://dummyjson.com/products'

  return {
    endpoint,
    query: {
      limit: PRODUCTS_PAGE_SIZE,
      skip: (page - 1) * PRODUCTS_PAGE_SIZE,
      ...(query ? { q: query } : {})
    }
  }
}

export function useProducts(page: Ref<number>, search: Ref<string>) {
  const { data, pending, error, refresh } = useAsyncData<DummyJsonProductListResponse>(
    'products-list',
    () => {
      const { endpoint, query } = buildProductsRequest(page.value, search.value)
      return $fetch<DummyJsonProductListResponse>(endpoint, { query })
    },
    {
      watch: [page, search],
      default: () => ({ products: [], total: 0, skip: 0, limit: PRODUCTS_PAGE_SIZE })
    }
  )

  const products = computed(() => data.value.products)
  const total = computed(() => data.value.total)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PRODUCTS_PAGE_SIZE)))

  return {
    products,
    total,
    pending,
    error: computed(() => error.value !== null),
    pageCount,
    refresh
  }
}
