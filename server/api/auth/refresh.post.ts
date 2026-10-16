import { REFRESH_TOKEN_COOKIE } from '#shared/auth'

export default defineEventHandler(async (event): Promise<{ success: true }> => {
  const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE)

  if (!refreshToken) {
    clearAuthCookies(event)
    throw createError({ statusCode: 401, statusMessage: 'Non authentifié' })
  }

  try {
    const refreshed = await refreshUpstream(refreshToken)
    setAuthCookies(event, refreshed.accessToken, refreshed.refreshToken)
    return { success: true }
  } catch (error) {
    clearAuthCookies(event)
    throw error
  }
})
