<script setup lang="ts">
import { X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { FREE_SHIPPING_THRESHOLD_CENTS } from '@/utils/promotions'

const dismissed = useCookie<boolean>('shipping-banner-dismissed', {
  default: () => false,
  maxAge: 60 * 60 * 24 * 365,
  sameSite: 'lax',
  path: '/'
})

const thresholdEuros = FREE_SHIPPING_THRESHOLD_CENTS / 100
</script>

<template>
  <div v-if="!dismissed" class="relative bg-primary px-10 py-2 text-center text-sm text-primary-foreground">
    <p>Livraison offerte dès {{ thresholdEuros }} € d'achat</p>

    <Button
      variant="ghost"
      size="icon"
      class="absolute right-2 top-1/2 size-6 -translate-y-1/2 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
      aria-label="Fermer le bandeau"
      @click="dismissed = true"
    >
      <X class="size-4" />
    </Button>
  </div>
</template>
