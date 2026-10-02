import { defineStore } from 'pinia'
import { CART_COOKIE_MAX_AGE, CART_COOKIE_NAME, fitsInCookie, type CartActionResult, type CartItem } from '#shared/cart'

export const useCartStore = defineStore('cart', () => {
  const items = useCookie<CartItem[]>(CART_COOKIE_NAME, {
    default: () => [],
    maxAge: CART_COOKIE_MAX_AGE,
    sameSite: 'lax',
    path: '/'
  })

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  function findItem(productId: number) {
    return items.value.find(item => item.productId === productId)
  }

  function quantityInCart(productId: number): number {
    return findItem(productId)?.quantity ?? 0
  }

  function addItem(productId: number, stock: number, quantity = 1): CartActionResult {
    const nextQuantity = quantityInCart(productId) + quantity

    if (nextQuantity > stock) {
      return { success: false, message: `Stock insuffisant : seulement ${stock} disponible(s).` }
    }

    const nextItems = findItem(productId)
      ? items.value.map(item => item.productId === productId ? { ...item, quantity: nextQuantity } : item)
      : [...items.value, { productId, quantity: nextQuantity }]

    if (!fitsInCookie(nextItems)) {
      return { success: false, message: 'Panier plein : impossible d\'ajouter cet article.' }
    }

    items.value = nextItems
    return { success: true }
  }

  function setQuantity(productId: number, quantity: number, stock: number): CartActionResult {
    if (quantity <= 0) {
      removeItem(productId)
      return { success: true }
    }

    if (quantity > stock) {
      return { success: false, message: `Stock insuffisant : seulement ${stock} disponible(s).` }
    }

    const nextItems = items.value.map(item => item.productId === productId ? { ...item, quantity } : item)

    if (!fitsInCookie(nextItems)) {
      return { success: false, message: 'Panier plein : impossible de mettre à jour cet article.' }
    }

    items.value = nextItems
    return { success: true }
  }

  function removeItem(productId: number) {
    items.value = items.value.filter(item => item.productId !== productId)
  }

  function clear() {
    items.value = []
  }

  return {
    items,
    itemCount,
    quantityInCart,
    addItem,
    setQuantity,
    removeItem,
    clear
  }
})
