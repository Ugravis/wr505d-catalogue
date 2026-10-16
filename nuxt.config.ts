import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxt/test-utils', 'shadcn-nuxt'],
  css: ['~/assets/css/tailwind.css'],
  routeRules: {
    '/': { redirect: '/produits' }
  },
  vite: {
    plugins: [tailwindcss()]
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  alias: {
    '#types': fileURLToPath(new URL('./types', import.meta.url))
  },
  typescript: {
    strict: true,
    typeCheck: true
  }
})
