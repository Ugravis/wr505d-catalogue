import type { DummyJsonCategory } from '#types/dummyjson'

export function useCategories() {
  const { data } = useAsyncData<DummyJsonCategory[]>(
    'categories-list',
    () => $fetch<DummyJsonCategory[]>('/api/categories'),
    { default: () => [] }
  )

  return { categories: data }
}
