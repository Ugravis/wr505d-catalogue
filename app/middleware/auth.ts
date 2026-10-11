export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()

  if (auth.status === 'idle') {
    await auth.fetchMe()
  }

  if (auth.status !== 'authenticated') {
    return navigateTo({ path: '/connexion', query: { redirect: to.fullPath } })
  }
})
