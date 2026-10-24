import { ref } from "vue";

export type Theme = "light" | "dark";

export const theme = ref<Theme>("light");

export function applyTheme(nextTheme: Theme) {
  theme.value = nextTheme;
  if (import.meta.client) {
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }
}

export function toggleTheme() {
  applyTheme(theme.value === "dark" ? "light" : "dark");
}

export function initializeTheme() {
  applyTheme(theme.value);
}
