import type { DummyJsonProduct } from '#types/dummyjson'

export default defineEventHandler((event): Promise<DummyJsonProduct> => {
  const id = Number(getRouterParam(event, 'id'))

  if (!Number.isInteger(id) || id < 1) {
    throw createError({ statusCode: 404, statusMessage: 'Produit introuvable' })
  }

  return getUpstreamProduct(id)
})
