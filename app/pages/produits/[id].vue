<script setup lang="ts">
import { ArrowLeft, RotateCw, ShieldCheck, Star, Truck } from '@lucide/vue'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ProductGallery from '@/components/ProductGallery.vue'
import ProductStock from '@/components/ProductStock.vue'
import { useProduct } from '@/composables/useProduct'
import { formatPrice } from '@/utils/formatPrice'
import { getStockStatus } from '#shared/stock'

const route = useRoute()
const id = Number(route.params.id)

function throwNotFound(): never {
  throw createError({ statusCode: 404, statusMessage: 'Produit introuvable', fatal: true })
}

if (!Number.isInteger(id) || id < 1) throwNotFound()

const { product, notFound, hasError, refresh, ready } = useProduct(id)
await ready

if (notFound.value) throwNotFound()

const cart = useCartStore()
const quantityInput = ref<string | number>(1)
const addToCartError = ref('')
const addedToCart = ref(false)

const isOutOfStock = computed(() => product.value != null && getStockStatus(product.value.stock).kind === 'out')

watch(product, () => {
  quantityInput.value = 1
  addToCartError.value = ''
  addedToCart.value = false
})

function addToCart() {
  if (!product.value) return

  const quantity = Math.max(1, Math.floor(Number(quantityInput.value)) || 1)
  const result = cart.addItem(product.value.id, product.value.stock, quantity)
  if (result.success) {
    addToCartError.value = ''
    addedToCart.value = true
  } else {
    addedToCart.value = false
    addToCartError.value = result.message
  }
}
const images = computed(() => {
  if (!product.value) return []
  return product.value.images.length > 0 ? product.value.images : [product.value.thumbnail]
})

useSeoMeta({
  title: () => product.value?.title ?? 'Produit',
  description: () => product.value?.description ?? '',
  ogType: 'website',
  ogTitle: () => product.value?.title ?? 'Produit',
  ogDescription: () => product.value?.description ?? '',
  ogImage: () => product.value?.thumbnail,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <NuxtLink to="/produits" class="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeft class="size-4" />
      Retour au catalogue
    </NuxtLink>

    <Alert v-if="hasError" variant="destructive">
      <AlertTitle>Une erreur réseau est survenue</AlertTitle>
      <AlertDescription class="flex items-center justify-between gap-4">
        <span>Impossible de charger ce produit pour le moment.</span>
        <Button size="sm" variant="outline" @click="() => refresh()">
          <RotateCw class="size-4" />
          Réessayer
        </Button>
      </AlertDescription>
    </Alert>

    <article v-else-if="product" class="grid gap-8 md:grid-cols-2">
      <ProductGallery :images="images" :alt="product.title" />

      <div class="flex flex-col gap-4">
        <div>
          <p v-if="product.brand" class="text-sm uppercase tracking-wide text-muted-foreground">{{ product.brand }}</p>
          <h1 class="text-3xl font-bold">{{ product.title }}</h1>
        </div>

        <div class="flex items-center gap-1 text-sm text-muted-foreground">
          <Star class="size-4 fill-yellow-400 text-yellow-400" />
          <span>{{ product.rating.toFixed(1) }} / 5</span>
        </div>

        <p class="text-3xl font-semibold">{{ formatPrice(product.price) }}</p>

        <p class="text-muted-foreground">{{ product.description }}</p>

        <div class="flex flex-col gap-3">
          <ProductStock :stock="product.stock" />

          <div class="flex items-end gap-3">
            <div class="flex flex-col gap-1.5">
              <label for="quantity" class="text-xs text-muted-foreground">Quantité</label>
              <Input
                id="quantity"
                v-model="quantityInput"
                type="number"
                min="1"
                :max="product.stock"
                class="w-20"
                :disabled="isOutOfStock"
              />
            </div>
            <Button size="lg" class="flex-1 sm:w-fit sm:flex-none" :disabled="isOutOfStock" @click="addToCart">
              {{ isOutOfStock ? 'Rupture de stock' : 'Ajouter au panier' }}
            </Button>
          </div>

          <p v-if="addToCartError" class="text-sm text-destructive">{{ addToCartError }}</p>
          <p v-else-if="addedToCart" class="text-sm text-muted-foreground">Ajouté au panier.</p>
        </div>

        <ul class="mt-2 flex flex-col gap-3 rounded-lg border p-4 text-sm">
          <li class="flex items-start gap-3">
            <ShieldCheck class="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p class="font-medium">Garantie</p>
              <p class="text-muted-foreground">{{ product.warrantyInformation }}</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <Truck class="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p class="font-medium">Livraison</p>
              <p class="text-muted-foreground">{{ product.shippingInformation }}</p>
            </div>
          </li>
        </ul>
      </div>
    </article>
  </div>
</template>
