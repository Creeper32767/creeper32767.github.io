import {
  i18n,
  supportedLocales,
  type SupportedLocale,
} from "@/components/i18n";
import { watch } from "vue";

function detectBrowserLocale(): SupportedLocale {
  if (!import.meta.client) return "zh-CN";

  const browserLocales = navigator.languages.length
    ? navigator.languages
    : [navigator.language];

  for (const browserLocale of browserLocales) {
    if (browserLocale.toLowerCase().startsWith("zh")) return "zh-CN";
    if (browserLocale.toLowerCase().startsWith("en")) return "en";
  }

  return "zh-CN";
}

export default defineNuxtPlugin((nuxtApp) => {
  const localeCookie = useCookie<SupportedLocale>("locale");
  const storedLocale = localeCookie.value;
  const initialLocale =
    storedLocale && supportedLocales.includes(storedLocale)
      ? storedLocale
      : "zh-CN";

  i18n.global.locale.value = initialLocale;
  watch(
    i18n.global.locale,
    (nextLocale) => {
      if (import.meta.client) {
        document.documentElement.lang = nextLocale as SupportedLocale;
      }
    },
    { immediate: true },
  );

  nuxtApp.vueApp.use(i18n);

  nuxtApp.hook("app:mounted", () => {
    if (localeCookie.value) return;
    i18n.global.locale.value = detectBrowserLocale();
  });
});
