// https://nuxt.com/docs/api/configuration/nuxt-config
// Node built-in modules are available when Nuxt evaluates this configuration.
// @ts-ignore — this project does not include Node type declarations.
import { readdirSync, readFileSync } from "node:fs";
// @ts-ignore — this project does not include Node type declarations.
import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";

// @ts-ignore — this project does not include Node type declarations.
const metaDirectory = resolve(process.cwd(), "meta");
const portfolioRoutes = readdirSync(metaDirectory)
  .filter((file: string) => file.endsWith(".json") && file !== "index.json")
  .flatMap((file: string) => {
    const meta = JSON.parse(
      readFileSync(resolve(metaDirectory, file), "utf8"),
    ) as {
      collection: string;
      items: Array<{ id: string }>;
    };

    return [
      `/portfolio/${meta.collection}`,
      ...meta.items.map(
        (item) =>
          `/portfolio/${meta.collection}/${encodeURIComponent(item.id)}`,
      ),
    ];
  });

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
    quality: 90,
    format: ["webp", "avif", "jpeg", "png", "gif", "svg"],
    presets: {
      avatar: {
        modifiers: {
          format: "webp",
          width: 96,
          height: 96,
          fit: "cover",
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
  },
  optimizeDeps: {
    include: [
      "@codemirror/lang-cpp",
      "@codemirror/lang-css",
      "@codemirror/lang-html",
      "@codemirror/lang-java",
      "@codemirror/lang-javascript",
      "@codemirror/lang-markdown",
      "@codemirror/lang-python",
      "@codemirror/view",
      "@ntkrnl64/fluentui-vue-icons",
      "@vueuse/core",
      "class-variance-authority",
      "cn",
      "pinia",
      "codemirror",
      "reka-ui",
      "vue-codemirror",
      "vue-i18n",
    ],
  },
});
