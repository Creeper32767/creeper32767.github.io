import { defineStore } from "pinia";
import { supportedLocales, type SupportedLocale } from "~/i18n";

export type Theme = "light" | "dark";

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
    if (browserLocale.toLowerCase().startsWith("zh")) return "zh-CN";
    if (browserLocale.toLowerCase().startsWith("en")) return "en";
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
        this.setTheme(themeCookie.value, false);
      }

      if (isSupportedLocale(localeCookie.value)) {
        this.setLocale(localeCookie.value, false);
      }
    },

    initializeBrowserPreferences() {
      const themeCookie = useCookie<Theme>("theme");
      const localeCookie = useCookie<SupportedLocale>("locale");

      if (!isTheme(themeCookie.value)) this.setTheme(detectBrowserTheme());
      if (!isSupportedLocale(localeCookie.value)) {
        this.setLocale(detectBrowserLocale());
      }
    },

    setTheme(nextTheme: Theme, persist = true) {
      this.theme = nextTheme;

      if (import.meta.client) {
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
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
