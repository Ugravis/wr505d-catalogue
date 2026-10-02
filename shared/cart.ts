export const CART_COOKIE_NAME = 'cart'
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30 // 30 jours

/** Limite réelle des cookies côté navigateur. */
const CART_COOKIE_MAX_BYTES = 4096
/** Marge de sécurité pour le nom du cookie et ses attributs (path, max-age, etc.). */
const CART_COOKIE_SAFETY_MARGIN = 200
export const CART_COOKIE_PAYLOAD_LIMIT = CART_COOKIE_MAX_BYTES - CART_COOKIE_SAFETY_MARGIN

export interface CartItem {
  productId: number
  quantity: number
}

export type CartActionResult = { success: true } | { success: false, message: string }

export function getCartPayloadSize(items: CartItem[]): number {
  return new TextEncoder().encode(JSON.stringify(items)).length
}

export function fitsInCookie(items: CartItem[]): boolean {
  return getCartPayloadSize(items) <= CART_COOKIE_PAYLOAD_LIMIT
}
