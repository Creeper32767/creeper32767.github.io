import { defineStore } from "pinia";
import { supportedLocales, type SupportedLocale } from "~/i18n";

export type Theme = "light" | "dark";

const themeTransitionDuration = 250;
let themeTransitionTimeout: ReturnType<typeof setTimeout> | undefined;

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

function isSupportedLocale(value: unknown): value is SupportedLocale {
  return (
    typeof value === "string" &&
    supportedLocales.includes(value as SupportedLocale)
  );
}

function detectBrowserTheme(): Theme {
  if (!import.meta.client) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function detectBrowserLocale(): SupportedLocale {
  if (!import.meta.client) return "zh-CN";

  const browserLocales = navigator.languages.length
    ? navigator.languages
    : [navigator.language];

  for (const browserLocale of browserLocales) {
    const normalizedLocale = browserLocale.toLowerCase();
    if (
      normalizedLocale.startsWith("zh-tw") ||
      normalizedLocale.startsWith("zh-hk")
    ) {
      return "zh-TW";
    }
    if (normalizedLocale.startsWith("zh")) return "zh-CN";
    if (normalizedLocale.startsWith("en")) return "en";
    if (
      normalizedLocale.startsWith("ja") ||
      normalizedLocale.startsWith("jp")
    ) {
      return "jp";
    }
  }

  return "zh-CN";
}

export const usePreferencesStore = defineStore("preferences", {
  state: () => ({
    theme: "light" as Theme,
    locale: "zh-CN" as SupportedLocale,
  }),

  actions: {
    initialize() {
      const themeCookie = useCookie<Theme>("theme");
      const localeCookie = useCookie<SupportedLocale>("locale");

      if (isTheme(themeCookie.value)) {
        this.setTheme(themeCookie.value, false, false);
      }

      if (isSupportedLocale(localeCookie.value)) {
        this.setLocale(localeCookie.value, false);
      }
    },

    initializeBrowserPreferences() {
      const themeCookie = useCookie<Theme>("theme");
      const localeCookie = useCookie<SupportedLocale>("locale");

      if (!isTheme(themeCookie.value)) {
        this.setTheme(detectBrowserTheme(), true, false);
      }
      if (!isSupportedLocale(localeCookie.value)) {
        this.setLocale(detectBrowserLocale());
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

    setLocale(nextLocale: SupportedLocale, persist = true) {
      if (!isSupportedLocale(nextLocale)) return;

      this.locale = nextLocale;
      if (import.meta.client) document.documentElement.lang = nextLocale;
      if (persist) useCookie<SupportedLocale>("locale").value = nextLocale;
    },
  },
});
