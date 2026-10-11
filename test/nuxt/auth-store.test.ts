import { beforeEach, describe, expect, it } from 'vitest'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { defineComponent } from 'vue'
import { useAuthStore } from '~/stores/auth'
import type { DummyJsonUser } from '#types/dummyjson'

const DEMO_USER: DummyJsonUser = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128'
}

async function getStore() {
  let store!: ReturnType<typeof useAuthStore>

  await mountSuspended(defineComponent({
    setup() {
      store = useAuthStore()
      return () => null
    }
  }))

  store.user = null
  store.status = 'idle'

  return store
}

describe('useAuthStore', () => {
  beforeEach(() => {
    registerEndpoint('/api/auth/login', {
      method: 'POST',
      handler: () => ({ user: DEMO_USER })
    })
    registerEndpoint('/api/auth/me', () => ({ user: DEMO_USER }))
    registerEndpoint('/api/auth/logout', { method: 'POST', handler: () => ({ success: true }) })
  })

  it('authenticates and stores the user on successful login', async () => {
    const auth = await getStore()

    const result = await auth.login('emilys', 'emilyspass')

    expect(result).toEqual({ success: true })
    expect(auth.user).toEqual(DEMO_USER)
    expect(auth.status).toBe('authenticated')
  })

  it('reports an error without touching the state on failed login', async () => {
    registerEndpoint('/api/auth/login', {
      method: 'POST',
      handler: () => {
        throw createError({ statusCode: 401, statusMessage: 'Identifiants invalides' })
      }
    })
    const auth = await getStore()

    const result = await auth.login('emilys', 'wrong-password')

    expect(result).toEqual({ success: false, message: 'Identifiants invalides.' })
    expect(auth.user).toBeNull()
    expect(auth.status).toBe('idle')
  })

  it('loads the current user via fetchMe', async () => {
    const auth = await getStore()

    await auth.fetchMe()

    expect(auth.user).toEqual(DEMO_USER)
    expect(auth.status).toBe('authenticated')
  })

  it('marks the status as unauthenticated when fetchMe fails', async () => {
    registerEndpoint('/api/auth/me', () => {
      throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
    })
    const auth = await getStore()

    await auth.fetchMe()

    expect(auth.user).toBeNull()
    expect(auth.status).toBe('unauthenticated')
  })

  it('clears the state on logout', async () => {
    const auth = await getStore()
    await auth.login('emilys', 'emilyspass')

    await auth.logout()

    expect(auth.user).toBeNull()
    expect(auth.status).toBe('unauthenticated')
  })
})
