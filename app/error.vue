<script setup lang="ts">
import SiteFooter from '@/components/components/SiteFooter.vue'
import SiteHeader from '@/components/components/SiteHeader.vue'
import { Button } from '@/components/components/ui/button'
import { useI18n } from 'vue-i18n'

defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
  }
}>()

const { t } = useI18n()

function returnHome() {
  clearError({ redirect: '/' })
}

useSeoMeta({
  title: "404 - 页面未找到",
  description: "您访问的页面不存在或已被删除。请返回主页继续浏览。",
  ogTitle: "404 - 页面未找到",
  ogDescription: "您访问的页面不存在或已被删除。请返回主页继续浏览。",
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <SiteHeader />

    <main class="flex flex-1 items-center justify-center px-6 py-16 text-center">
      <section class="max-w-2xl">
        <div class="flex items-center justify-center gap-4 text-primary">
          <span class="text-8xl font-bold leading-none tracking-wider sm:text-[10rem]">
            {{ error.statusCode }}
          </span>
        </div>
        <h1 class="mt-6 text-3xl font-light text-foreground sm:text-4xl">
          {{ error.statusCode === 404 ? t('notFound.title') : error.statusMessage }}
        </h1>
        <p class="mt-6 text-lg leading-8 text-muted">
          {{ t('notFound.message') }}<br />
          {{ t('notFound.farewell') }}
        </p>
        <Button size="lg" class="mt-10" @click="returnHome">
          {{ t('notFound.home') }}
        </Button>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
