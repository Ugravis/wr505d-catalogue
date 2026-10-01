<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { RotateCw, Search, SearchX } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import ProductCard from '@/components/ProductCard.vue'
import ProductCardSkeleton from '@/components/ProductCardSkeleton.vue'
import { PRODUCTS_PAGE_SIZE, useProducts } from '@/composables/useProducts'

useSeoMeta({
  title: 'Produits',
  description: 'Parcourez notre catalogue de produits : recherche, filtres et pagination.'
})

const route = useRoute()
const router = useRouter()

const search = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const page = computed(() => {
  const raw = Number(route.query.page)
  return Number.isInteger(raw) && raw > 0 ? raw : 1
})

const searchInput = ref(search.value)

const { products, pending, error, pageCount, refresh } = useProducts(page, search)

const updateSearchQuery = useDebounceFn((value: string) => {
  router.replace({
    query: {
      ...route.query,
      q: value.trim() || undefined,
      page: undefined
    }
  })
}, 300)

watch(searchInput, (value) => {
  updateSearchQuery(value)
})

watch(search, (value) => {
  if (value !== searchInput.value) {
    searchInput.value = value
  }
})

function goToPage(newPage: number) {
  router.push({
    query: {
      ...route.query,
      page: newPage > 1 ? newPage : undefined
    }
  })
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold">Produits</h1>

    <div class="relative mb-8 max-w-sm">
      <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        v-model="searchInput"
        type="search"
        placeholder="Rechercher un produit..."
        class="pl-9"
        aria-label="Rechercher un produit"
      />
    </div>

    <Alert v-if="error" variant="destructive" class="mb-8">
      <AlertTitle>Une erreur réseau est survenue</AlertTitle>
      <AlertDescription class="flex items-center justify-between gap-4">
        <span>Impossible de charger les produits pour le moment.</span>
        <Button size="sm" variant="outline" @click="refresh">
          <RotateCw class="size-4" />
          Réessayer
        </Button>
      </AlertDescription>
    </Alert>

    <template v-else-if="pending">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCardSkeleton v-for="n in PRODUCTS_PAGE_SIZE" :key="n" />
      </div>
    </template>

    <div v-else-if="products.length === 0" class="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
      <SearchX class="size-10" />
      <p class="text-lg font-medium">Aucun résultat</p>
      <p class="text-sm">Essayez une autre recherche.</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>

      <Pagination
        v-if="pageCount > 1"
        :page="page"
        :items-per-page="PRODUCTS_PAGE_SIZE"
        :total="pageCount * PRODUCTS_PAGE_SIZE"
        :sibling-count="1"
        show-edges
        class="mt-10"
        @update:page="goToPage"
      >
        <PaginationContent v-slot="{ items }">
          <PaginationPrevious />
          <template v-for="(item, index) in items">
            <PaginationItem
              v-if="item.type === 'page'"
              :key="index"
              :value="item.value"
              :is-active="item.value === page"
            >
              {{ item.value }}
            </PaginationItem>
            <PaginationEllipsis v-else :key="`ellipsis-${index}`" :index="index" />
          </template>
          <PaginationNext />
        </PaginationContent>
      </Pagination>
    </template>
  </div>
</template>
