<script setup lang="ts">
import { Flower } from '@lucide/vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p class="flex items-center gap-2">
        <Flower class="size-4 text-primary" aria-hidden="true" />
        &copy; {{ year }} ChampaShop
      </p>

      <nav class="flex gap-4" aria-label="Liens du pied de page">
        <NuxtLink to="/produits" class="hover:text-foreground hover:underline">Produits</NuxtLink>
        <NuxtLink to="/panier" class="hover:text-foreground hover:underline">Panier</NuxtLink>
        <NuxtLink to="/compte" class="hover:text-foreground hover:underline">Mon compte</NuxtLink>
      </nav>
    </div>
  </footer>
</template>
