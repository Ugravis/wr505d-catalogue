<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { DummyJsonProduct } from '#types/dummyjson'

const props = defineProps<{
  product: Pick<DummyJsonProduct, 'category'>
}>()

const isBeauty = computed(() => props.product.category === 'beauty')
</script>

<template>
  <div v-if="isBeauty" class="flex flex-wrap gap-1.5">
    <Badge variant="secondary">-10 % dès 3 articles beauté</Badge>
  </div>
</template>
