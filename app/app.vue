<script setup lang="ts">
const { theme } = useColorMode()

useHead({
  htmlAttrs: {
    class: computed(() => theme.value === 'dark' ? 'dark' : '')
  }
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <NuxtRouteAnnouncer />
    <AppAnnouncementBar />
    <AppHeader />
    <main class="flex-1">
      <NuxtPage />
    </main>
    <AppFooter />
  </div>
</template>
