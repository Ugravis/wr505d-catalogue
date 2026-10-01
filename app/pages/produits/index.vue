<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { RotateCw, Search, SearchX } from '@lucide/vue'
import type { LocationQueryRaw } from 'vue-router'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ProductCard from '@/components/ProductCard.vue'
import ProductCardSkeleton from '@/components/ProductCardSkeleton.vue'
import { useCategories } from '@/composables/useCategories'
import { PRODUCTS_PAGE_SIZE, useProducts, type ProductsFilters } from '@/composables/useProducts'
import { DEFAULT_SORT, SORT_OPTIONS, isSortOption } from '#shared/products'

useSeoMeta({
  title: 'Produits',
  description: 'Parcourez notre catalogue de produits : recherche, filtres, tri et pagination.'
})

const route = useRoute()
const router = useRouter()
const { categories } = useCategories()

function parsePage(value: unknown) {
  const raw = Number(value)
  return Number.isInteger(raw) && raw > 0 ? raw : 1
}

function parsePrice(value: unknown) {
  if (typeof value !== 'string' || value === '') return undefined
  const n = Number(value)
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

const filters = computed<ProductsFilters>(() => ({
  page: parsePage(route.query.page),
  search: typeof route.query.q === 'string' ? route.query.q : '',
  category: typeof route.query.category === 'string' ? route.query.category : '',
  minPrice: parsePrice(route.query.minPrice),
  maxPrice: parsePrice(route.query.maxPrice),
  sort: isSortOption(route.query.sort) ? route.query.sort : DEFAULT_SORT
}))

const { products, pending, error, pageCount, refresh } = useProducts(filters)

const searchInput = ref(filters.value.search)
const minPriceInput = ref(filters.value.minPrice?.toString() ?? '')
const maxPriceInput = ref(filters.value.maxPrice?.toString() ?? '')

function patchQuery(patch: LocationQueryRaw) {
  router.replace({
    query: {
      ...route.query,
      ...patch,
      page: undefined
    }
  })
}

const debouncedSearchUpdate = useDebounceFn((value: string) => patchQuery({ q: value.trim() || undefined }), 300)
const debouncedMinPriceUpdate = useDebounceFn((value: string) => patchQuery({ minPrice: value || undefined }), 300)
const debouncedMaxPriceUpdate = useDebounceFn((value: string) => patchQuery({ maxPrice: value || undefined }), 300)

watch(searchInput, debouncedSearchUpdate)
watch(minPriceInput, debouncedMinPriceUpdate)
watch(maxPriceInput, debouncedMaxPriceUpdate)

// Keep local inputs in sync with the URL (source of truth), e.g. on back/forward navigation.
watch(filters, (value) => {
  if (value.search !== searchInput.value) searchInput.value = value.search
  const minStr = value.minPrice?.toString() ?? ''
  if (minStr !== minPriceInput.value) minPriceInput.value = minStr
  const maxStr = value.maxPrice?.toString() ?? ''
  if (maxStr !== maxPriceInput.value) maxPriceInput.value = maxStr
})

function setCategory(value: string) {
  patchQuery({ category: value === 'all' ? undefined : value })
}

function setSort(value: string) {
  patchQuery({ sort: value === DEFAULT_SORT ? undefined : value })
}

function goToPage(newPage: number) {
  router.push({
    query: {
      ...route.query,
      page: newPage > 1 ? newPage : undefined
    }
  })
}

const hasActiveFilters = computed(() =>
  Boolean(filters.value.search || filters.value.category || filters.value.minPrice !== undefined || filters.value.maxPrice !== undefined || filters.value.sort !== DEFAULT_SORT)
)

function resetFilters() {
  router.replace({ query: {} })
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="mb-6 text-2xl font-bold">Produits</h1>

    <div class="mb-8 flex flex-wrap items-end gap-4">
      <div class="relative w-full max-w-sm">
        <Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          v-model="searchInput"
          type="search"
          placeholder="Rechercher un produit..."
          class="pl-9"
          aria-label="Rechercher un produit"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="category" class="text-xs text-muted-foreground">Catégorie</label>
        <Select :model-value="filters.category || 'all'" @update:model-value="(v) => setCategory(String(v))">
          <SelectTrigger id="category" class="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem v-for="category in categories" :key="category.slug" :value="category.slug">
              {{ category.name }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="min-price" class="text-xs text-muted-foreground">Prix min</label>
        <Input id="min-price" v-model="minPriceInput" type="number" min="0" placeholder="0" class="w-24" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="max-price" class="text-xs text-muted-foreground">Prix max</label>
        <Input id="max-price" v-model="maxPriceInput" type="number" min="0" placeholder="999" class="w-24" />
      </div>

      <div class="flex flex-col gap-1.5">
        <label for="sort" class="text-xs text-muted-foreground">Trier par</label>
        <Select :model-value="filters.sort" @update:model-value="(v) => setSort(String(v))">
          <SelectTrigger id="sort" class="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="option in SORT_OPTIONS" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button v-if="hasActiveFilters" variant="ghost" size="sm" @click="resetFilters">
        Réinitialiser les filtres
      </Button>
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
      <p class="text-sm">Essayez d'élargir votre recherche ou vos filtres.</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>

      <Pagination
        v-if="pageCount > 1"
        :page="filters.page"
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
              :is-active="item.value === filters.page"
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
