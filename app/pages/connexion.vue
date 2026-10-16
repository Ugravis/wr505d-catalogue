<script setup lang="ts">
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

useSeoMeta({
  title: 'Connexion',
  description: 'Connectez-vous à votre compte.'
})

const route = useRoute()
const auth = useAuthStore()

const username = ref('')
const password = ref('')
const pending = ref(false)
const errorMessage = ref('')

async function submit() {
  pending.value = true
  errorMessage.value = ''

  const result = await auth.login(username.value, password.value)

  if (result.success) {
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/compte'
    await navigateTo(redirect)
  } else {
    errorMessage.value = result.message
  }

  pending.value = false
}
</script>

<template>
  <div class="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>Compte de démo : emilys / emilyspass</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="flex flex-col gap-4" @submit.prevent="submit">
          <div class="flex flex-col gap-1.5">
            <label for="username" class="text-sm font-medium">Nom d'utilisateur</label>
            <Input id="username" v-model="username" autocomplete="username" required />
          </div>

          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-sm font-medium">Mot de passe</label>
            <Input id="password" v-model="password" type="password" autocomplete="current-password" required />
          </div>

          <Alert v-if="errorMessage" variant="destructive">
            <AlertDescription>{{ errorMessage }}</AlertDescription>
          </Alert>

          <Button type="submit" :disabled="pending">
            {{ pending ? 'Connexion...' : 'Se connecter' }}
          </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
