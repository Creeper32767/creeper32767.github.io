// https://nuxt.com/docs/api/configuration/nuxt-config
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

interface PortfolioMeta {
  collection: string;
  items?: Array<{ id?: string }>;
}

function getPortfolioRoutes(cwd: string): string[] {
  const metaDirectory = resolve(cwd, "meta");
  if (!existsSync(metaDirectory)) {
    return [];
  }

  return readdirSync(metaDirectory)
    .filter((file: string) => file.endsWith(".json") && file !== "index.json")
    .flatMap((file: string) => {
      try {
        const raw = readFileSync(resolve(metaDirectory, file), "utf8");
        const meta = JSON.parse(raw) as PortfolioMeta;

        if (!meta.collection) {
          return [];
        }

        const basePath = `/portfolio/${encodeURIComponent(meta.collection)}`;
        const itemPaths = (meta.items ?? [])
          .filter((item): item is { id: string } => Boolean(item?.id))
          .map((item) => `${basePath}/${encodeURIComponent(item.id)}`);

        return [basePath, ...itemPaths];
      } catch (error) {
        console.warn(`[nuxt.config] 跳过无效的 meta 文件 ${file}:`, error);
        return [];
      }
    });
}

const portfolioRoutes = getPortfolioRoutes(process.cwd());

// 为 @nuxtjs/i18n 的 pruned 生成附带语言前缀变体
const i18nLocalePrefixes = ["en", "ja", "zh-TW"];

const localizedPortfolioRoutes = portfolioRoutes.flatMap((route) =>
  i18nLocalePrefixes.map((locale) => `/${locale}${route}`),
);

export default defineNuxtConfig({
  ssr: true,

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: [...portfolioRoutes, ...localizedPortfolioRoutes],
    },
    serverAssets: [
      { baseName: "content", dir: "./content" },
      { baseName: "meta", dir: "./meta" },
    ],
  },

  modules: [
    "@nuxt/content",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/color-mode",
    "@nuxt/eslint",
  ],

  i18n: {
    baseUrl: "https://creeper32767.github.io",
    strategy: "prefix_except_default",
    defaultLocale: "zh-CN",
    locales: [
      {
        code: "zh-CN",
        language: "zh-CN",
        name: "简体中文",
        file: "zh-CN.json",
      },
      {
        code: "en",
        language: "en",
        name: "English",
        file: "en.json",
      },
      {
        code: "ja",
        language: "ja",
        name: "日本語",
        file: "ja.json",
      },
      {
        code: "zh-TW",
        language: "zh-TW",
        name: "繁體中文",
        file: "zh-TW.json",
      },
    ],
    langDir: "locales",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
  },

  image: {
    quality: 80,
    format: ["avif", "webp", "png", "jpeg"],
    presets: {
      avatar: {
        modifiers: {
          format: "webp",
          width: 96,
          height: 96,
          fit: "cover",
          quality: 85,
        },
      },
    },
  },

  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },

  colorMode: {
    // 跟随系统偏好，允许用户手动选择 light / dark / system
    preference: "system",
    fallback: "system",
    classSuffix: "",
    dataValue: "theme",
  },

  devtools: { enabled: true },

  compatibilityDate: "2024-04-03",

  // vue-sonner v2 将样式独立发布，必须显式引入，否则 Toaster 弹出的 toast 无定位样式（表现为调用无效）
  css: ["~/assets/main.css", "vue-sonner/style.css"],

  app: {
    head: {
      // html lang / title / description 由 useLocaleHead 与 useSiteSeo 按语言动态处理
      link: [
        {
          rel: "icon",
          href: "/favicon.ico",
        },
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [
        "@codemirror/view",
        "@ntkrnl64/fluentui-vue-icons",
        "@vueuse/core",
        "class-variance-authority",
        "cn",
        "codemirror",
        "pinia",
        "reka-ui",
        "vue-codemirror",
      ],
    },
  },
});
