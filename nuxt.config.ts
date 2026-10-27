// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

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
      "codemirror",
      "reka-ui",
      "vue-codemirror",
      "vue-i18n",
    ],
  },
});
