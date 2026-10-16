<script setup lang="ts">
const props = defineProps<{
  images: string[]
  alt: string
}>()

const selectedIndex = ref(0)
const selectedImage = computed(() => props.images[selectedIndex.value] ?? props.images[0])
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="aspect-square w-full overflow-hidden rounded-lg border bg-muted">
      <img
        v-if="selectedImage"
        :src="selectedImage"
        :alt="alt"
        class="h-full w-full object-contain"
      >
    </div>

    <ul v-if="images.length > 1" class="flex flex-wrap gap-2" aria-label="Images du produit">
      <li v-for="(image, index) in images" :key="image">
        <button
          type="button"
          class="size-16 overflow-hidden rounded-md border bg-muted transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
          :class="index === selectedIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'"
          :aria-label="`Afficher l'image ${index + 1}`"
          :aria-pressed="index === selectedIndex"
          @click="selectedIndex = index"
        >
          <img :src="image" alt="" loading="lazy" class="h-full w-full object-cover">
        </button>
      </li>
    </ul>
  </div>
</template>
