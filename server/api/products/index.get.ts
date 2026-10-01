import { DEFAULT_SORT, filterByPrice, isSortOption, paginate, type ProductsApiResponse } from '#shared/products'

export default defineEventHandler(async (event): Promise<ProductsApiResponse> => {
  const query = getQuery(event)

  const page = Math.max(1, Math.floor(Number(query.page)) || 1)
  const search = typeof query.q === 'string' ? query.q.trim() : ''
  const category = typeof query.category === 'string' ? query.category.trim() : ''
  const sort = isSortOption(query.sort) ? query.sort : DEFAULT_SORT

  const minPrice = query.minPrice !== undefined ? Number(query.minPrice) : undefined
  const maxPrice = query.maxPrice !== undefined ? Number(query.maxPrice) : undefined

  const products = await getUpstreamProducts(search, category, sort)
  const filtered = filterByPrice(products, minPrice, maxPrice)
  const { items, total } = paginate(filtered, page)

  return { products: items, total }
})
