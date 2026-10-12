<script setup lang="ts">
import { Maximize2, ShoppingCart } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import CartContents from '@/components/CartContents.vue'

const cart = useCartStore()
const open = ref(false)
</script>

<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <button
        type="button"
        class="relative hidden size-10 items-center justify-center rounded-md hover:bg-accent md:inline-flex"
        aria-label="Voir le panier"
      >
        <ShoppingCart class="size-5" />
        <Badge
          v-if="cart.itemCount > 0"
          class="absolute -right-1 -top-1 size-5 justify-center rounded-full p-0 text-xs"
        >
          {{ cart.itemCount }}
        </Badge>
      </button>
    </SheetTrigger>

    <SheetContent class="gap-0 overflow-y-auto sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Panier</SheetTitle>
        <SheetDescription class="sr-only">Contenu de votre panier et récapitulatif de la commande.</SheetDescription>
      </SheetHeader>

      <div class="flex-1 px-4">
        <CartContents layout="panel" />
      </div>

      <div class="mt-auto flex flex-col gap-2 border-t p-4">
        <Button as-child variant="outline" @click="open = false">
          <NuxtLink to="/panier">
            <Maximize2 class="size-4" />
            Voir en pleine page
          </NuxtLink>
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>
