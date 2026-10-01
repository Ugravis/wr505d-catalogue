<script setup lang="ts">
import { Star } from '@lucide/vue'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import type { DummyJsonProduct } from '#types/dummyjson'

defineProps<{
  product: DummyJsonProduct
}>()

const priceFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' })
</script>

<template>
  <Card class="flex h-full flex-col overflow-hidden py-0">
    <div class="aspect-square w-full overflow-hidden bg-muted">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        loading="lazy"
        class="h-full w-full object-cover"
      >
    </div>
    <CardHeader class="pt-4">
      <CardTitle class="line-clamp-2 text-base">{{ product.title }}</CardTitle>
    </CardHeader>
    <CardContent class="flex-1">
      <div class="flex items-center gap-1 text-sm text-muted-foreground">
        <Star class="size-4 fill-yellow-400 text-yellow-400" />
        <span>{{ product.rating.toFixed(1) }}</span>
      </div>
    </CardContent>
    <CardFooter class="pb-4">
      <span class="text-lg font-semibold">{{ priceFormatter.format(product.price) }}</span>
    </CardFooter>
  </Card>
</template>
