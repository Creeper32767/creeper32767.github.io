import { initializeTheme } from '@/components/theme'

export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    initializeTheme()
  }
})
