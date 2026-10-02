<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import type { DummyJsonProduct } from '#types/dummyjson'

const props = defineProps<{
  product: Pick<DummyJsonProduct, 'category' | 'discountPercentage'>
}>()

const discount = computed(() => Math.round(props.product.discountPercentage))
const isBeauty = computed(() => props.product.category === 'beauty')
</script>

<template>
  <div v-if="discount > 0 || isBeauty" class="flex flex-wrap gap-1.5">
    <Badge v-if="discount > 0" variant="destructive">-{{ discount }} %</Badge>
    <Badge v-if="isBeauty" variant="secondary">-10 % dès 3 articles beauté</Badge>
  </div>
</template>
