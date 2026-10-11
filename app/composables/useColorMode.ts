export type ColorTheme = 'light' | 'dark'

export function useColorMode() {
  const theme = useCookie<ColorTheme>('theme', {
    default: () => 'light',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    path: '/'
  })

  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggle }
}
