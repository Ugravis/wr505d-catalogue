<script setup lang="ts">
import { Minus, Plus, RotateCw, ShoppingCart, Trash2 } from '@lucide/vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartItems } from '@/composables/useCartItems'
import { useCartSummary } from '@/composables/useCartSummary'
import { formatPrice, formatPriceCents } from '@/utils/formatPrice'

useSeoMeta({
  title: 'Panier',
  description: 'Votre panier d\'achats.'
})

const cart = useCartStore()
const { lines, pending, refresh } = useCartItems()

const promoInput = ref('')
const appliedPromoCode = ref('')
const summary = useCartSummary(lines, appliedPromoCode)

function applyPromoCode() {
  appliedPromoCode.value = promoInput.value.trim()
}

const errors = reactive(new Map<number, string>())

function clearError(productId: number) {
  errors.delete(productId)
}

function updateQuantity(productId: number, quantity: number, stock: number) {
  const result = cart.setQuantity(productId, quantity, stock)
  if (result.success) {
    clearError(productId)
  } else {
    errors.set(productId, result.message)
  }
}

function remove(productId: number) {
  cart.removeItem(productId)
  clearError(productId)
}
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold">Panier</h1>

    <p v-if="pending" class="text-muted-foreground">Chargement du panier...</p>

    <div v-else-if="lines.length === 0" class="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
      <ShoppingCart class="size-10" />
      <p class="text-lg font-medium">Votre panier est vide</p>
      <Button as-child variant="outline">
        <NuxtLink to="/produits">Voir les produits</NuxtLink>
      </Button>
    </div>

    <template v-else>
      <ul class="flex flex-col gap-4">
        <li v-for="line in lines" :key="line.productId" class="flex flex-col gap-2 rounded-lg border p-4">
          <div v-if="line.status === 'ok'" class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-4">
              <img :src="line.product.thumbnail" :alt="line.product.title" class="size-16 rounded-md object-cover">
              <div>
                <NuxtLink :to="`/produits/${line.productId}`" class="font-medium hover:underline">
                  {{ line.product.title }}
                </NuxtLink>
                <p class="text-sm text-muted-foreground">{{ formatPrice(line.product.price) }} / unité</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="outline"
                  :disabled="line.quantity <= 1"
                  aria-label="Diminuer la quantité"
                  @click="updateQuantity(line.productId, line.quantity - 1, line.product.stock)"
                >
                  <Minus class="size-4" />
                </Button>
                <Input
                  type="number"
                  class="w-16 text-center"
                  :model-value="line.quantity"
                  min="1"
                  :max="line.product.stock"
                  :aria-label="`Quantité pour ${line.product.title}`"
                  @update:model-value="(v) => updateQuantity(line.productId, Number(v), line.product.stock)"
                />
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Augmenter la quantité"
                  @click="updateQuantity(line.productId, line.quantity + 1, line.product.stock)"
                >
                  <Plus class="size-4" />
                </Button>
              </div>

              <p class="w-24 text-right font-medium">{{ formatPrice(line.product.price * line.quantity) }}</p>

              <Button size="icon" variant="ghost" aria-label="Retirer du panier" @click="remove(line.productId)">
                <Trash2 class="size-4" />
              </Button>
            </div>
          </div>

          <div v-else class="flex items-center justify-between gap-4">
            <p class="text-sm text-muted-foreground">
              {{ line.status === 'not-found' ? 'Ce produit n\'est plus disponible.' : 'Erreur de chargement de ce produit.' }}
            </p>
            <div class="flex gap-2">
              <Button v-if="line.status === 'error'" size="sm" variant="outline" @click="refresh">
                <RotateCw class="size-4" />
                Réessayer
              </Button>
              <Button size="sm" variant="ghost" @click="remove(line.productId)">Retirer</Button>
            </div>
          </div>

          <p v-if="errors.get(line.productId)" class="text-sm text-destructive">{{ errors.get(line.productId) }}</p>
        </li>
      </ul>

      <div class="mt-8 flex flex-col gap-6 border-t pt-6 md:flex-row md:items-start md:justify-between">
        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button variant="ghost">Vider le panier</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Vider le panier ?</AlertDialogTitle>
              <AlertDialogDescription>
                Tous les articles de votre panier seront retirés. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction @click="cart.clear">Vider le panier</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div class="flex w-full flex-col gap-4 md:max-w-sm">
          <form class="flex flex-col gap-1.5" @submit.prevent="applyPromoCode">
            <label for="promo-code" class="text-sm font-medium">Code promo</label>
            <div class="flex gap-2">
              <Input id="promo-code" v-model="promoInput" placeholder="TROYES10" autocomplete="off" />
              <Button type="submit" variant="outline">Appliquer</Button>
            </div>
          </form>

          <ul v-if="summary.messages.length > 0" class="flex flex-col gap-1 text-sm text-destructive">
            <li v-for="message in summary.messages" :key="message">{{ message }}</li>
          </ul>

          <dl class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between">
              <dt>Sous-total</dt>
              <dd>{{ formatPriceCents(summary.grossCents) }}</dd>
            </div>
            <div v-for="discount in summary.discounts" :key="discount.id" class="flex justify-between text-green-600">
              <dt>{{ discount.label }}</dt>
              <dd>−{{ formatPriceCents(discount.amountCents) }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>Livraison</dt>
              <dd>{{ summary.shippingCents === 0 ? 'Offerte' : formatPriceCents(summary.shippingCents) }}</dd>
            </div>
            <div class="flex justify-between border-t pt-2 text-xl font-semibold">
              <dt>Total</dt>
              <dd>{{ formatPriceCents(summary.totalCents) }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </template>
  </div>
</template>
