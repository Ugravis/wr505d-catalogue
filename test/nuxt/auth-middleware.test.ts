import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockNuxtImport, mountSuspended } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
mockNuxtImport('navigateTo', () => navigateToMock)

const { default: authMiddleware } = await import('~/middleware/auth')
const { useAuthStore } = await import('~/stores/auth')

function route(path: string): RouteLocationNormalized {
  return { fullPath: path } as RouteLocationNormalized
}

async function getStore() {
  let store!: ReturnType<typeof useAuthStore>

  await mountSuspended(defineComponent({
    setup() {
      store = useAuthStore()
      return () => null
    }
  }))

  return store
}

describe('auth middleware', () => {
  beforeEach(() => {
    navigateToMock.mockClear()
  })

  it('redirects to /connexion with the original path when not authenticated', async () => {
    const auth = await getStore()
    auth.status = 'unauthenticated'

    await authMiddleware(route('/compte'), route('/'))

    expect(navigateToMock).toHaveBeenCalledWith({ path: '/connexion', query: { redirect: '/compte' } })
  })

  it('does not redirect when already authenticated', async () => {
    const auth = await getStore()
    auth.status = 'authenticated'

    await authMiddleware(route('/compte'), route('/'))

    expect(navigateToMock).not.toHaveBeenCalled()
  })
})
