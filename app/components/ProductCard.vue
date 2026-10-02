<script setup lang="ts">
import { Star } from '@lucide/vue'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ProductPromoBadges from '@/components/ProductPromoBadges.vue'
import { formatPrice } from '@/utils/formatPrice'
import type { DummyJsonProduct } from '#types/dummyjson'

defineProps<{
  product: DummyJsonProduct
}>()
</script>

<template>
  <Card class="relative flex h-full flex-col overflow-hidden py-0">
    <div class="aspect-square w-full overflow-hidden bg-muted">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        loading="lazy"
        class="h-full w-full object-cover"
      >
    </div>
    <CardHeader class="pt-4">
      <CardTitle class="line-clamp-2 text-base">
        <NuxtLink :to="`/produits/${product.id}`" class="after:absolute after:inset-0">{{ product.title }}</NuxtLink>
      </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-1 flex-col gap-2">
      <ProductPromoBadges :product="product" />
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <Star class="size-4 fill-yellow-400 text-yellow-400" />
        <span>{{ product.rating.toFixed(1) }}</span>
      </div>
    </CardContent>
    <CardFooter class="pb-4">
      <span class="text-lg font-semibold">{{ formatPrice(product.price) }}</span>
    </CardFooter>
  </Card>
</template>
