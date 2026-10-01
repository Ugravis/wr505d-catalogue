import { describe, expect, it } from 'vitest'
import { buildProductsRequest, PRODUCTS_PAGE_SIZE } from '../../app/composables/useProducts'
import type { DummyJsonProduct } from '../../types/dummyjson'
import { DEFAULT_SORT, filterByPrice, isSortOption, paginate } from '../../shared/products'

function product(id: number, price: number): DummyJsonProduct {
  return { id, price } as DummyJsonProduct
}

describe('buildProductsRequest (client)', () => {
  it('shows 12 products per page', () => {
    expect(PRODUCTS_PAGE_SIZE).toBe(12)
  })

  it('targets the BFF endpoint and omits empty filters', () => {
    const { endpoint, query } = buildProductsRequest({
      page: 1,
      search: '',
      category: '',
      sort: DEFAULT_SORT
    })

    expect(endpoint).toBe('/api/products')
    expect(query).toEqual({ page: 1, q: undefined, category: undefined, minPrice: undefined, maxPrice: undefined, sort: DEFAULT_SORT })
  })

  it('forwards search, category and price bounds as-is', () => {
    const { query } = buildProductsRequest({
      page: 2,
      search: 'phone',
      category: 'smartphones',
      minPrice: 10,
      maxPrice: 500,
      sort: 'price-asc'
    })

    expect(query).toEqual({ page: 2, q: 'phone', category: 'smartphones', minPrice: 10, maxPrice: 500, sort: 'price-asc' })
  })
})

describe('isSortOption', () => {
  it('accepts the known sort values', () => {
    expect(isSortOption('price-asc')).toBe(true)
    expect(isSortOption('rating-desc')).toBe(true)
  })

  it('rejects unknown values', () => {
    expect(isSortOption('popularity')).toBe(false)
    expect(isSortOption(undefined)).toBe(false)
  })
})

describe('filterByPrice', () => {
  const products = [product(1, 9.99), product(2, 49.99), product(3, 199.99)]

  it('keeps everything when no bound is given', () => {
    expect(filterByPrice(products)).toHaveLength(3)
  })

  it('excludes products below minPrice', () => {
    expect(filterByPrice(products, 50).map(p => p.id)).toEqual([3])
  })

  it('excludes products above maxPrice', () => {
    expect(filterByPrice(products, undefined, 50).map(p => p.id)).toEqual([1, 2])
  })

  it('applies both bounds together', () => {
    expect(filterByPrice(products, 10, 100).map(p => p.id)).toEqual([2])
  })
})

describe('paginate', () => {
  const items = Array.from({ length: 30 }, (_, i) => i + 1)

  it('returns the total before slicing', () => {
    expect(paginate(items, 1, 12).total).toBe(30)
  })

  it('slices the requested page', () => {
    expect(paginate(items, 2, 12).items).toEqual(Array.from({ length: 12 }, (_, i) => i + 13))
  })

  it('returns a partial last page', () => {
    expect(paginate(items, 3, 12).items).toEqual([25, 26, 27, 28, 29, 30])
  })
})
