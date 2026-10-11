export default defineEventHandler((event): { success: true } => {
  clearAuthCookies(event)
  return { success: true }
})
