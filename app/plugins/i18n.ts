import {
  i18n,
  supportedLocales,
  type SupportedLocale,
} from "@/components/i18n";
import { watch } from "vue";

export default defineNuxtPlugin((nuxtApp) => {
  const localeCookie = useCookie<SupportedLocale>("locale", {
    default: () => "en",
  });
  const initialLocale = supportedLocales.includes(localeCookie.value)
    ? localeCookie.value
    : "en";

  i18n.global.locale.value = initialLocale;
  watch(
    i18n.global.locale,
    (nextLocale) => {
      localeCookie.value = nextLocale as SupportedLocale;
      i18n.global.locale.value = nextLocale;
      if (import.meta.client) {
        document.documentElement.lang = nextLocale;
      }
    },
    { immediate: true },
  );

  nuxtApp.vueApp.use(i18n);
});
