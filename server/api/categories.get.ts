import type { DummyJsonCategory } from '#types/dummyjson'

export default defineEventHandler((): Promise<DummyJsonCategory[]> => getUpstreamCategories())
