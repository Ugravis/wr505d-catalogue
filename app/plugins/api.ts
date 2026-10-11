import { hasStatusCode } from '#shared/errors'
import { singleFlight } from '@/utils/singleFlight'

type ApiFetchRequest = Parameters<typeof $fetch>[0]
type ApiFetchOptions = Parameters<typeof $fetch>[1]

export default defineNuxtPlugin(() => {
  const refreshOnce = singleFlight(() => $fetch('/api/auth/refresh', { method: 'POST' }))

  async function apiFetch<T>(request: ApiFetchRequest, options?: ApiFetchOptions): Promise<T> {
    try {
      return await $fetch<T>(request, options) as T
    } catch (error) {
      const isRefreshCall = request === '/api/auth/refresh'
      if (isRefreshCall || !hasStatusCode(error, 401)) {
        throw error
      }

      await refreshOnce()
      return await $fetch<T>(request, options) as T
    }
  }

  return {
    provide: { api: apiFetch }
  }
})

declare module '#app' {
  interface NuxtApp {
    $api: <T>(request: ApiFetchRequest, options?: ApiFetchOptions) => Promise<T>
  }
}
