<script setup lang="ts">
import { Moon, ShoppingCart, Sun, User } from '@lucide/vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const cart = useCartStore()
const auth = useAuthStore()
const { theme, toggle: toggleTheme } = useColorMode()
</script>

<template>
  <header class="border-b">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <NuxtLink to="/produits" class="text-lg font-semibold">
        ChampaShop
      </NuxtLink>

      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Changer de thème" @click="toggleTheme">
          <Sun v-if="theme === 'dark'" class="size-5" />
          <Moon v-else class="size-5" />
        </Button>

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

        <NuxtLink
          v-if="auth.status === 'authenticated'"
          to="/compte"
          class="inline-flex size-10 items-center justify-center rounded-md hover:bg-accent"
          aria-label="Voir mon compte"
        >
          <User class="size-5" />
        </NuxtLink>
        <Button v-else as-child variant="outline" size="sm">
          <NuxtLink to="/connexion">Se connecter</NuxtLink>
        </Button>
      </div>
    </div>
  </header>
</template>
