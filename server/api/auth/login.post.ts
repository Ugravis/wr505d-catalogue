import type { DummyJsonLoginRequest, DummyJsonUser } from '#types/dummyjson'

export default defineEventHandler(async (event): Promise<{ user: DummyJsonUser }> => {
  const body = await readBody<DummyJsonLoginRequest>(event)

  if (!body?.username || !body?.password) {
    throw createError({ statusCode: 400, statusMessage: 'Identifiants manquants' })
  }

  const { accessToken, refreshToken, ...user } = await loginUpstream(body)
  setAuthCookies(event, accessToken, refreshToken)

  return { user }
})
