import { hasStatusCode } from '#shared/errors'
import { singleFlight } from '@/utils/singleFlight'

type ApiFetchRequest = Parameters<typeof $fetch>[0]
type ApiFetchOptions = Parameters<typeof $fetch>[1]

const REFRESH_ENDPOINT = '/api/auth/refresh'

export default defineNuxtPlugin(() => {
  // Explicit <unknown> keeps TS from inferring the return type from the
  // literal route (which blows the type-checker's stack: "Excessive stack
  // depth comparing types" — a known cost of Nitro's typed-route matching).
  const refreshOnce = singleFlight(() => $fetch<unknown>(REFRESH_ENDPOINT, { method: 'POST' }))

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
