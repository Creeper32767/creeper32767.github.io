// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import fs from 'node:fs';

export default defineNuxtConfig({
  modules: ["@nuxt/content", "shadcn-nuxt"],
  shadcn: {
    prefix: "",
    componentDir: "./app/components/ui",
  },
  devtools: { enabled: true },
  compatibilityDate: "2024-04-03",
  css: ["~/assets/main.css"],
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN",
      },
      title: "Creeper32767 的个人网站",
      meta: [
        {
          name: "description",
          content: "Creeper32767 的个人网站，分享项目、文章和其他内容。",
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
      "@ntkrnl64/fluentui-vue-icons",
      "@vueuse/core",
      "class-variance-authority",
      "cn",
      "reka-ui",
      "vue-i18n",
      "pinia",
    ],
  },
});
