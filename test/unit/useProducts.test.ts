import { describe, expect, it } from 'vitest'
import { PRODUCTS_PAGE_SIZE, buildProductsRequest } from '../../app/composables/useProducts'

describe('buildProductsRequest', () => {
  it('shows 12 products per page', () => {
    expect(PRODUCTS_PAGE_SIZE).toBe(12)
  })

  it('targets the plain product list endpoint when there is no search query', () => {
    const { endpoint, query } = buildProductsRequest(1, '')

    expect(endpoint).toBe('https://dummyjson.com/products')
    expect(query).toEqual({ limit: 12, skip: 0 })
  })

  it('targets the search endpoint and trims the query when a search term is set', () => {
    const { endpoint, query } = buildProductsRequest(1, '  phone  ')

    expect(endpoint).toBe('https://dummyjson.com/products/search')
    expect(query).toEqual({ limit: 12, skip: 0, q: 'phone' })
  })

  it('ignores a blank/whitespace-only search term', () => {
    const { endpoint } = buildProductsRequest(1, '   ')

    expect(endpoint).toBe('https://dummyjson.com/products')
  })

  it('computes skip from the page number', () => {
    expect(buildProductsRequest(3, '').query.skip).toBe(24)
  })
})
