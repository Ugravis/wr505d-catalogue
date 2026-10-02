<script setup lang="ts">
import { ShoppingCart } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'

const cart = useCartStore()
</script>

<template>
  <header class="border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <NuxtLink to="/produits" class="text-lg font-semibold">
        Catalogue
      </NuxtLink>

      <NuxtLink
        to="/panier"
        class="relative inline-flex size-10 items-center justify-center rounded-md hover:bg-accent"
        aria-label="Voir le panier"
      >
        <ShoppingCart class="size-5" />
        <Badge
          v-if="cart.itemCount > 0"
          class="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-xs"
        >
          {{ cart.itemCount }}
        </Badge>
      </NuxtLink>
    </div>
  </header>
</template>
