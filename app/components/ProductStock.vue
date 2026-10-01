<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { getStockLabel, getStockStatus } from '#shared/stock'

const props = defineProps<{
  stock: number
}>()

const status = computed(() => getStockStatus(props.stock))
const label = computed(() => getStockLabel(status.value))
const VARIANTS = {
  out: 'destructive',
  low: 'outline',
  in: 'secondary'
} as const

const variant = computed(() => VARIANTS[status.value.kind])
</script>

<template>
  <Badge :variant="variant" :class="status.kind === 'low' ? 'border-orange-500 text-orange-600' : ''">
    {{ label }}
  </Badge>
</template>
