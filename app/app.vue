<script setup lang="ts">
const { theme } = useColorMode()

useHead({
  htmlAttrs: {
    class: computed(() => theme.value === 'dark' ? 'dark' : '')
  }
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <AppHeader />
    <NuxtPage />
  </div>
</template>
