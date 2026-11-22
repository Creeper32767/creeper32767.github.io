import { defineStore } from "pinia";

export type Theme = "light" | "dark";

const themeTransitionDuration = 250;
let themeTransitionTimeout: ReturnType<typeof setTimeout> | undefined;

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function detectBrowserTheme(): Theme {
  if (!import.meta.client) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export const usePreferencesStore = defineStore("preferences", {
  state: () => ({
    theme: "light" as Theme,
  }),

  actions: {
    initialize() {
      const themeCookie = useCookie<Theme>("theme");

      if (isTheme(themeCookie.value)) {
        this.setTheme(themeCookie.value, false, false);
      }
    },

    initializeBrowserPreferences() {
      const themeCookie = useCookie<Theme>("theme");

      if (!isTheme(themeCookie.value)) {
        this.setTheme(detectBrowserTheme(), true, false);
      }
    },

    setTheme(nextTheme: Theme, persist = true, animate = true) {
      this.theme = nextTheme;

      if (import.meta.client) {
        const root = document.documentElement;

        if (animate) {
          root.classList.add("theme-transition");
          if (themeTransitionTimeout) {
            clearTimeout(themeTransitionTimeout);
          }
        }

        root.classList.toggle("dark", nextTheme === "dark");

        if (animate) {
          themeTransitionTimeout = window.setTimeout(() => {
            root.classList.remove("theme-transition");
            themeTransitionTimeout = undefined;
          }, themeTransitionDuration);
        }
      }

      if (persist) useCookie<Theme>("theme").value = nextTheme;
    },

    toggleTheme() {
      this.setTheme(this.theme === "dark" ? "light" : "dark");
    },
  },
});
