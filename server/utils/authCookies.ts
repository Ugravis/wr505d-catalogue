import type { H3Event } from 'h3'
import {
  ACCESS_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_MAX_AGE
} from '#shared/auth'

const COOKIE_OPTIONS = { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/' }

export function setAuthCookies(event: H3Event, accessToken: string, refreshToken: string): void {
  setCookie(event, ACCESS_TOKEN_COOKIE, accessToken, { ...COOKIE_OPTIONS, maxAge: ACCESS_TOKEN_MAX_AGE })
  setCookie(event, REFRESH_TOKEN_COOKIE, refreshToken, { ...COOKIE_OPTIONS, maxAge: REFRESH_TOKEN_MAX_AGE })
}

export function clearAuthCookies(event: H3Event): void {
  deleteCookie(event, ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS)
  deleteCookie(event, REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS)
}
