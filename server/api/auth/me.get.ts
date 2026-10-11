import type { DummyJsonUser } from '#types/dummyjson'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '#shared/auth'
import { hasStatusCode } from '#shared/errors'

export default defineEventHandler(async (event): Promise<{ user: DummyJsonUser }> => {
  const accessToken = getCookie(event, ACCESS_TOKEN_COOKIE)

  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  try {
    return { user: await fetchMeUpstream(accessToken) }
  } catch (error) {
    if (!hasStatusCode(error, 401)) {
      throw error
    }

    const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE)
    if (!refreshToken) {
      clearAuthCookies(event)
      throw error
    }

    try {
      const refreshed = await refreshUpstream(refreshToken)
      setAuthCookies(event, refreshed.accessToken, refreshed.refreshToken)
      return { user: await fetchMeUpstream(refreshed.accessToken) }
    } catch (refreshError) {
      clearAuthCookies(event)
      throw refreshError
    }
  }
})
