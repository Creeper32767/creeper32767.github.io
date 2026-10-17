import { ref } from 'vue'

export type Theme = 'light' | 'dark'

export const theme = ref<Theme>('light')

export function applyTheme(nextTheme: Theme) {
  theme.value = nextTheme
  document.documentElement.classList.toggle('dark', nextTheme === 'dark')
  localStorage.setItem('theme', nextTheme)
}

export function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

export function initializeTheme() {
  applyTheme(theme.value)
}
