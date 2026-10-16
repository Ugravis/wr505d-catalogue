import type { DummyJsonProduct } from '#types/dummyjson'

export const PRODUCTS_PAGE_SIZE = 12

export const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Titre (A-Z)', sortBy: 'title', order: 'asc' },
  { value: 'price-asc', label: 'Prix croissant', sortBy: 'price', order: 'asc' },
  { value: 'price-desc', label: 'Prix décroissant', sortBy: 'price', order: 'desc' },
  { value: 'rating-desc', label: 'Note (meilleures d\'abord)', sortBy: 'rating', order: 'desc' }
] as const satisfies readonly { value: string, label: string, sortBy: 'title' | 'price' | 'rating', order: 'asc' | 'desc' }[]

export type SortOption = (typeof SORT_OPTIONS)[number]['value']

export const DEFAULT_SORT: SortOption = 'title-asc'

export function isSortOption(value: unknown): value is SortOption {
  return typeof value === 'string' && SORT_OPTIONS.some(option => option.value === value)
}

export interface ProductsApiQuery {
  page?: number
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: SortOption
}

export interface ProductsApiResponse {
  products: DummyJsonProduct[]
  total: number
}

export function filterByPrice(products: DummyJsonProduct[], minPrice?: number, maxPrice?: number): DummyJsonProduct[] {
  return products.filter((product) => {
    if (minPrice !== undefined && !Number.isNaN(minPrice) && product.price < minPrice) return false
    if (maxPrice !== undefined && !Number.isNaN(maxPrice) && product.price > maxPrice) return false
    return true
  })
}

export function paginate<T>(items: T[], page: number, pageSize: number = PRODUCTS_PAGE_SIZE): { items: T[], total: number } {
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), total: items.length }
}
