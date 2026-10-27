import { watch } from "vue";
import { i18n } from "~/i18n";
import { usePreferencesStore } from "~/stores/preferences";

export default defineNuxtPlugin((nuxtApp) => {
  const preferences = usePreferencesStore();

  i18n.global.locale.value = preferences.locale;
  watch(
    () => preferences.locale,
    (nextLocale) => (i18n.global.locale.value = nextLocale),
    { immediate: true },
  );

  nuxtApp.vueApp.use(i18n);
});
