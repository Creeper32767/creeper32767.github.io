import { watch } from "vue";
import { initializeTheme, theme } from "~/composables/theme";

type ThemePreference = "light" | "dark";

function detectBrowserTheme(): ThemePreference {
  if (!import.meta.client) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default defineNuxtPlugin((nuxtApp) => {
  const themeCookie = useCookie<ThemePreference>("theme");
  const initialTheme: ThemePreference =
    themeCookie.value === "dark" || themeCookie.value === "light"
      ? themeCookie.value
      : "light";

  theme.value = initialTheme;

  watch(
    theme,
    (nextTheme) => {
      if (import.meta.client) {
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      }
    },
    { immediate: true },
  );
  initializeTheme();

  nuxtApp.hook("app:mounted", () => {
    if (themeCookie.value) return;
    theme.value = detectBrowserTheme();
  });
});
