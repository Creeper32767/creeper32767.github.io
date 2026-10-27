import { createPinia } from "pinia";
import { usePreferencesStore } from "~/stores/preferences";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();
  nuxtApp.vueApp.use(pinia);

  const preferences = usePreferencesStore(pinia);
  preferences.initialize();

  nuxtApp.hook("app:mounted", () => {
    preferences.initializeBrowserPreferences();
  });
});
