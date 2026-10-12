export interface CartLine { productId: number, category: string, unitPriceCents: number, quantity: number }
export interface AppliedDiscount { id: 'BEAUTY_3' | 'TROYES10', label: string, amountCents: number }
export interface LineDiscount { productId: number, label: string, amountCents: number }
export interface CartSummary {
  grossCents: number
  discounts: AppliedDiscount[]
  /** Per-product breakdown of discounts tied to specific items (e.g. the beauty discount), for display on each cart line. Cart-wide discounts (e.g. a promo code) aren't included here. */
  lineDiscounts: LineDiscount[]
  shippingCents: number
  totalCents: number
  messages: string[]
}

const BEAUTY_CATEGORY = 'beauty'
const BEAUTY_MIN_ITEMS = 3
const BEAUTY_RATE_PERCENT = 10

const PROMO_CODE = 'TROYES10'
const PROMO_AMOUNT_CENTS = 1000
const PROMO_MIN_SUBTOTAL_CENTS = 5000

const MAX_DISCOUNT_RATE_PERCENT = 25

const SHIPPING_CENTS = 490
export const FREE_SHIPPING_THRESHOLD_CENTS = 8000
const NO_FREE_SHIPPING_CATEGORY = 'furniture'

/** Percentage of an integer amount of cents, rounded half up to the cent. */
function percentOf(cents: number, percent: number): number {
  return Math.floor((cents * percent + 50) / 100)
}

function lineTotal(line: CartLine): number {
  return line.unitPriceCents * line.quantity
}

const BEAUTY_LABEL = 'Remise beauté −10 %'

function beautyDiscount(lines: CartLine[]): { discount: AppliedDiscount, lineDiscounts: LineDiscount[] } | null {
  const beautyLines = lines.filter(line => line.category === BEAUTY_CATEGORY)
  const itemCount = beautyLines.reduce((sum, line) => sum + line.quantity, 0)
  if (itemCount < BEAUTY_MIN_ITEMS) return null

  const lineDiscounts = beautyLines.map(line => ({
    productId: line.productId,
    label: BEAUTY_LABEL,
    amountCents: percentOf(lineTotal(line), BEAUTY_RATE_PERCENT)
  }))
  const amountCents = lineDiscounts.reduce((sum, discount) => sum + discount.amountCents, 0)
  return { discount: { id: 'BEAUTY_3', label: BEAUTY_LABEL, amountCents }, lineDiscounts }
}

type PromoCodeResult =
  | { discount: AppliedDiscount, message?: undefined }
  | { discount: null, message?: string }

function promoCodeDiscount(promoCode: string | undefined, subtotalCents: number): PromoCodeResult {
  const code = promoCode?.trim().toUpperCase()
  if (!code) return { discount: null }
  if (code !== PROMO_CODE) return { discount: null, message: `Le code « ${promoCode?.trim()} » est inconnu.` }
  if (subtotalCents <= PROMO_MIN_SUBTOTAL_CENTS) {
    return { discount: null, message: `Le code ${PROMO_CODE} nécessite un sous-total supérieur à 50,00 € après remises.` }
  }
  return { discount: { id: 'TROYES10', label: `Code ${PROMO_CODE}`, amountCents: PROMO_AMOUNT_CENTS } }
}

function shippingFor(lines: CartLine[], amountAfterDiscountsCents: number): number {
  if (lines.length === 0) return 0
  const hasFurniture = lines.some(line => line.category === NO_FREE_SHIPPING_CATEGORY)
  return !hasFurniture && amountAfterDiscountsCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS
}

export function computeCart(lines: CartLine[], promoCode?: string): CartSummary {
  const cartLines = lines.filter(line => line.quantity > 0)
  const grossCents = cartLines.reduce((sum, line) => sum + lineTotal(line), 0)
  const discounts: AppliedDiscount[] = []
  const messages: string[] = []

  const beauty = beautyDiscount(cartLines)
  if (beauty) discounts.push(beauty.discount)
  const beautyCents = beauty?.discount.amountCents ?? 0

  const promo = promoCodeDiscount(promoCode, grossCents - beautyCents)
  if (promo.message) messages.push(promo.message)

  if (promo.discount) {
    const capCents = percentOf(grossCents, MAX_DISCOUNT_RATE_PERCENT)
    const allowedCents = Math.max(0, capCents - beautyCents)
    const amountCents = Math.min(promo.discount.amountCents, allowedCents)

    if (amountCents < promo.discount.amountCents) {
      messages.push('Les remises sont plafonnées à 25 % du sous-total : le code promo a été réduit.')
    }
    if (amountCents > 0) discounts.push({ ...promo.discount, amountCents })
  }

  const discountCents = discounts.reduce((sum, discount) => sum + discount.amountCents, 0)
  const shippingCents = shippingFor(cartLines, grossCents - discountCents)

  return {
    grossCents,
    discounts,
    lineDiscounts: beauty?.lineDiscounts ?? [],
    shippingCents,
    totalCents: grossCents - discountCents + shippingCents,
    messages
  }
}
