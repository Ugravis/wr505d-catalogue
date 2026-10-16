<script setup lang="ts">
import CartContents from '@/components/CartContents.vue'

useSeoMeta({
  title: 'Panier',
  description: 'Votre panier d\'achats.'
})
</script>

<template>
  <div class="mx-auto max-w-4xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold">Panier</h1>
    <CartContents layout="page" />
  </div>
</template>
