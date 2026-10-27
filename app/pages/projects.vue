<script setup lang="ts">
import {
  Apps16Filled,
  BookOpen16Filled,
  Camera16Filled,
  Code16Filled,
  PaintBrush16Filled,
  Open16Regular,
  Wrench16Filled,
} from "@ntkrnl64/fluentui-vue-icons";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const projectIcons = {
  apps: Apps16Filled,
  book: BookOpen16Filled,
  camera: Camera16Filled,
  code: Code16Filled,
  color: PaintBrush16Filled,
  tools: Wrench16Filled,
} as const;

interface Project {
  name: string;
  description: string;
  href: string;
  action: string;
  icon: string;
  external?: boolean;
}

interface ProjectSection {
  id: string;
  title: string;
  subtitle: string;
  items: Project[];
}

const sections: ProjectSection[] = [
  {
    id: "frontend-projects",
    title: "前端工具集",
    subtitle: "Frontend tools",
    items: [
      {
        name: "Fluent Code Editor",
        description: "一个轻量级、支持语法高亮和主题切换的在线代码编辑器。",
        href: "/toolkit/editor",
        action: "打开编辑器",
        icon: "code",
      },
      {
        name: "读者卡片生成器",
        description: "创建精美的阅读卡片，记录阅读精华，并导出为高清图片。",
        href: "/toolkit/reader-card",
        action: "进入生成器",
        icon: "book",
      },
      {
        name: "网页快照生成器",
        description: "加载任意网页，与页面交互，然后捕获整个页面的高清截图。",
        href: "/toolkit/capture-screen",
        action: "开始截图",
        icon: "camera",
      },
      {
        name: "色彩转换器",
        description: "一个多功能的颜色格式转换与调色工具，支持多种颜色模型。",
        href: "/toolkit/color-conventor",
        action: "试用工具",
        icon: "color",
      },
    ],
  },
  {
    id: "backend-projects",
    title: "后端项目",
    subtitle: "Python applications",
    items: [
      {
        name: "Audio Generator GUI",
        description: "一个带有图形用户界面的音频生成工具，可以轻松创建和导出音频文件。",
        href: "https://github.com/Creeper32767/audio_generator_gui",
        action: "查看源码",
        icon: "apps",
        external: true,
      },
      {
        name: "QR/Barcode Generator",
        description: "一个能够生成多种格式二维码和条形码的实用工具，适用于各种业务场景。",
        href: "https://github.com/Creeper32767/qrcode_barcode_generator",
        action: "查看源码",
        icon: "tools",
        external: true,
      },
      {
        name: "Python Exercises",
        description: "一系列精心设计的 Python 编程练习，旨在巩固基础和提升编程技能。",
        href: "https://github.com/Creeper32767/python_exercises",
        action: "查看源码",
        icon: "code",
        external: true,
      },
    ],
  },
];

</script>

<template>
  <div>
    <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-12 sm:py-16">
      <header class="page-header">
        <p class="page-eyebrow">{{ t("pageHeaders.projects.eyebrow") }}</p>
        <h1 class="page-title">{{ t("pageHeaders.projects.title") }}</h1>
        <p class="page-description">{{ t("pageHeaders.projects.description") }}</p>
      </header>

      <div class="flex flex-col gap-14">
        <section v-for="section in sections" :id="section.id" :key="section.id">
          <div class="mb-8 flex items-baseline gap-3 border-b border-border pb-4">
            <h2 class="text-3xl font-bold">{{ section.title }}</h2>
            <span class="text-sm text-muted">{{ section.subtitle }}</span>
          </div>

          <div class="project-grid">
            <article v-for="project in section.items" :key="project.name"
              class="flex h-full flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg">
              <div class="flex flex-1 flex-col">
                <div
                  class="mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary"
                  aria-hidden="true">
                  <component :is="projectIcons[project.icon as keyof typeof projectIcons]" class="h-8 w-8" />
                </div>
                <h3 class="text-xl font-semibold">{{ project.name }}</h3>
                <p class="mt-3 flex-1 text-sm leading-7 text-muted">
                  {{ project.description }}
                </p>
              </div>

              <PlaneLink :href="project.href" :target="project.external ? '_blank' : '_self'"
                class="mt-6 w-full bg-primary shadow-sm" :aria-label="`${project.action}：${project.name}`">
                {{ project.action }}
                <Open16Regular v-if="project.external" class="h-4 w-4" aria-hidden="true" />
              </PlaneLink>
            </article>
          </div>
        </section>
      </div>
    </main>

  </div>
</template>

<style scoped>
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
</style>
