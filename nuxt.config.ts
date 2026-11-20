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
    .filter((file) => file.endsWith(".json") && file !== "index.json")
    .flatMap((file) => {
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

export default defineNuxtConfig({
  ssr: true,

  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: portfolioRoutes,
    },
    serverAssets: [
      { baseName: "content", dir: "./content" },
      { baseName: "meta", dir: "./meta" },
    ],
  },

  modules: ["@nuxt/content", "@nuxt/image", "shadcn-nuxt"],

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

  devtools: { enabled: true },

  compatibilityDate: "2024-04-03",

  experimental: {
    inlineStyles: true,
  },

  css: ["~/assets/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
      title: "Haley 的个人网站",
      meta: [
        {
          name: "description",
          content: "分享 Haley 的项目、笔记、工具与思考。",
        },
      ],
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
        "vue-i18n",
      ],
    },
  },
});