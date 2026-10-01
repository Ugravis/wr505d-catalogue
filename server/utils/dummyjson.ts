import type { DummyJsonCategory, DummyJsonProduct, DummyJsonProductListResponse } from '#types/dummyjson'
import { SORT_OPTIONS, type SortOption } from '#shared/products'

const DUMMYJSON_BASE = 'https://dummyjson.com'

async function fetchUpstreamProducts(search: string, category: string, sort: SortOption): Promise<DummyJsonProduct[]> {
  const { sortBy, order } = SORT_OPTIONS.find(option => option.value === sort) ?? SORT_OPTIONS[0]
  const params: Record<string, string> = { limit: '0', sortBy, order }

  let endpoint = `${DUMMYJSON_BASE}/products`
  if (search) {
    endpoint = `${DUMMYJSON_BASE}/products/search`
    params.q = search
  } else if (category) {
    endpoint = `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(category)}`
  }

  const response = await $fetch<DummyJsonProductListResponse>(endpoint, { query: params })

  // DummyJSON can't combine full-text search with a category filter, so when both
  // are set we search upstream and narrow down to the category ourselves.
  return search && category
    ? response.products.filter(product => product.category === category)
    : response.products
}

/**
 * Upstream DummyJSON has no min/max price filter, so the BFF fetches the full
 * matching set (sorted, limit=0) once and caches it server-side: price
 * filtering and pagination are then recomputed locally per request without
 * re-hitting DummyJSON for every keystroke or page change.
 */
export const getUpstreamProducts = defineCachedFunction(fetchUpstreamProducts, {
  name: 'dummyjson-products',
  maxAge: 60,
  getKey: (search, category, sort) => `${search || '_'}:${category || '_'}:${sort}`
})

export const getUpstreamCategories = defineCachedFunction(
  () => $fetch<DummyJsonCategory[]>(`${DUMMYJSON_BASE}/products/categories`),
  {
    name: 'dummyjson-categories',
    maxAge: 60 * 60,
    getKey: () => 'all'
  }
)
