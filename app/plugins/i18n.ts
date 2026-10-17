import { i18n, supportedLocales, type SupportedLocale } from '@/components/i18n'

export default defineNuxtPlugin((nuxtApp) => {
  const localeCookie = useCookie<string>('locale')
  const savedLocale = localeCookie.value
  const initialLocale: SupportedLocale =
    savedLocale && supportedLocales.includes(savedLocale as SupportedLocale)
      ? (savedLocale as SupportedLocale)
      : 'en'

  i18n.global.locale.value = initialLocale
  localeCookie.value = initialLocale
  if (import.meta.client) {
    document.documentElement.lang = initialLocale
  }

  nuxtApp.vueApp.use(i18n)
})
