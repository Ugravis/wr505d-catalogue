import { defineStore } from 'pinia'
import type { DummyJsonUser } from '#types/dummyjson'
import { ACCESS_TOKEN_MAX_AGE, type AuthActionResult } from '#shared/auth'
import { hasStatusCode } from '#shared/errors'
import { useApiFetch } from '@/composables/useApiFetch'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<DummyJsonUser | null>(null)
  const status = ref<AuthStatus>('idle')

  async function fetchMe(): Promise<void> {
    // SSR needs the incoming request's cookies forwarded to the internal
    // /api/auth/me call (useRequestFetch does this); the client-side
    // single-flight wrapper only makes sense once mounted in the browser.
    const fetcher = import.meta.server ? useRequestFetch() : useApiFetch()
    status.value = 'loading'

    try {
      const { user: me } = await fetcher<{ user: DummyJsonUser }>('/api/auth/me')
      user.value = me
      status.value = 'authenticated'
    } catch {
      user.value = null
      status.value = 'unauthenticated'
    }
  }

  async function login(username: string, password: string): Promise<AuthActionResult> {
    try {
      const { user: me } = await $fetch<{ user: DummyJsonUser }>('/api/auth/login', {
        method: 'POST',
        body: { username, password, expiresInMins: ACCESS_TOKEN_MAX_AGE / 60 }
      })
      user.value = me
      status.value = 'authenticated'
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: hasStatusCode(error, 401) ? 'Identifiants invalides.' : 'Une erreur est survenue, réessayez.'
      }
    }
  }

  async function logout(): Promise<void> {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    user.value = null
    status.value = 'unauthenticated'
  }

  return { user, status, fetchMe, login, logout }
})
