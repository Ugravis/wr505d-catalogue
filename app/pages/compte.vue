<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'Mon compte',
  description: 'Gérez votre compte.'
})

const auth = useAuthStore()

async function logout() {
  await auth.logout()
  await navigateTo('/')
}
</script>

<template>
  <div class="mx-auto max-w-sm px-4 py-16">
    <Card v-if="auth.user">
      <CardHeader class="flex flex-row items-center gap-4">
        <img :src="auth.user.image" :alt="auth.user.username" class="size-16 rounded-full">
        <div>
          <CardTitle>{{ auth.user.firstName }} {{ auth.user.lastName }}</CardTitle>
          <p class="text-sm text-muted-foreground">{{ auth.user.email }}</p>
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="outline" @click="logout">Se déconnecter</Button>
      </CardContent>
    </Card>
  </div>
</template>
