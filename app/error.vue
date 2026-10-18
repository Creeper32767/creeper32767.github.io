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

// 使用固定种子的伪随机数，确保 SSR 和客户端生成完全相同的样式。
const createRandom = (seed: number) => {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

const random = createRandom(0x40404)

// 生成 18 颗固定参数的流星，避免 hydration 时重新产生样式值。
const meteors = Array.from({ length: 18 }, (_, index) => {
  return {
    id: index,
    left: `${(random() * 100).toFixed(3)}%`,
    delay: `${(random() * 10).toFixed(3)}s`,
    duration: `${(3 + random() * 4).toFixed(3)}s`,
    height: `${(4 + random() * 6).toFixed(3)}rem`,
    width: `${random() > 0.8 ? 0.15 : 0.1}rem`,
    opacity: `${(0.4 + random() * 0.6).toFixed(3)}`,
  }
})

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
  <div class="relative flex min-h-screen flex-col overflow-hidden bg-background text-foreground">
    <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span v-for="meteor in meteors" :key="meteor.id" class="meteor absolute top-[-10vh] rotate-35 rounded-full"
        :style="{
          '--left': meteor.left,
          '--delay': meteor.delay,
          '--duration': meteor.duration,
          '--height': meteor.height,
          '--width': meteor.width,
          '--opacity': meteor.opacity,
        }" />
    </div>

    <SiteHeader />

    <main class="relative z-10 flex flex-1 items-center justify-center px-6 py-16 text-center">
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

<style scoped>
.meteor {
  left: var(--left, 50%);
  width: var(--width, 0.1rem);
  height: var(--height, 6rem);
  background: linear-gradient(to bottom,
      transparent 0%,
      color-mix(in srgb, var(--app-primary) 60%, white) 80%,
      #ffffff 100%);
  box-shadow: 0 0 0.65rem color-mix(in srgb, var(--app-primary) 70%, transparent);
  opacity: 0;
  animation: meteor-fall var(--duration, 4s) linear var(--delay, 0s) infinite;
}

@keyframes meteor-fall {
  0% {
    translate: 0 -10vh;
    opacity: 0;
  }

  10% {
    opacity: var(--opacity, 0.8);
  }

  40% {
    translate: -40vw 110vh;
    opacity: 0;
  }

  100% {
    translate: -40vw 110vh;
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .meteor {
    animation: none;
    opacity: 0.2;
    translate: 0 50vh;
  }
}
</style>