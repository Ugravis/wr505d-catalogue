<script setup lang="ts">
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
</script>

<template>
  <Card class="flex h-full flex-col overflow-hidden py-0">
    <Skeleton class="aspect-square w-full rounded-none" />
    <CardHeader class="pt-4">
      <Skeleton class="h-5 w-3/4" />
    </CardHeader>
    <CardContent class="flex-1">
      <Skeleton class="h-4 w-16" />
    </CardContent>
    <CardFooter class="pb-4">
      <Skeleton class="h-6 w-20" />
    </CardFooter>
  </Card>
</template>
