import { PRODUCTS_PAGE_SIZE, type ProductsApiResponse, type SortOption } from '#shared/products'

export { PRODUCTS_PAGE_SIZE }

export interface ProductsFilters {
  page: number
  search: string
  category: string
  minPrice?: number
  maxPrice?: number
  sort: SortOption
}

export function buildProductsRequest(filters: ProductsFilters) {
  return {
    endpoint: '/api/products',
    query: {
      page: filters.page,
      q: filters.search || undefined,
      category: filters.category || undefined,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort
    }
  }
}

export function useProducts(filters: Ref<ProductsFilters>) {
  const { data, pending, error, refresh } = useAsyncData<ProductsApiResponse>(
    'products-list',
    () => {
      const { endpoint, query } = buildProductsRequest(filters.value)
      return $fetch<ProductsApiResponse>(endpoint, { query })
    },
    {
      watch: [filters],
      default: () => ({ products: [], total: 0 })
    }
  )

  const products = computed(() => data.value.products)
  const total = computed(() => data.value.total)
  const pageCount = computed(() => Math.max(1, Math.ceil(total.value / PRODUCTS_PAGE_SIZE)))

  return {
    products,
    total,
    pending,
    error: computed(() => error.value != null),
    pageCount,
    refresh
  }
}
