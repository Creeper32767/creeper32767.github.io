import { watch } from "vue";
import { initializeTheme, theme } from "@/components/theme";

export default defineNuxtPlugin(() => {
  const themeCookie = useCookie<"light" | "dark">("theme", {
    default: () => "light",
  });
  theme.value = themeCookie.value;

  watch(
    theme,
    (nextTheme) => {
      themeCookie.value = nextTheme;
      if (import.meta.client) {
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      }
    },
    { immediate: true },
  );
  initializeTheme();
});
