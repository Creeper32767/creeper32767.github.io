<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { QuestionCircle24Filled } from '@ntkrnl64/fluentui-vue-icons'

const props = defineProps<{
  error: {
    statusCode?: number
    statusMessage?: string
  }
}>()

const { t } = useI18n()

// 固定种子的伪随机数，确保 SSR 与客户端生成一致的流星样式。
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

const meteors = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  left: `${(random() * 100).toFixed(3)}%`,
  delay: `${(random() * 10).toFixed(3)}s`,
  duration: `${(3 + random() * 4).toFixed(3)}s`,
  height: `${(4 + random() * 6).toFixed(3)}rem`,
  width: `${random() > 0.8 ? 0.15 : 0.1}rem`,
  opacity: `${(0.4 + random() * 0.6).toFixed(3)}`,
}))

// 已知错误码 / i18n 映射
const SUPPORTED_CODES = new Set([400, 401, 403, 404, 408, 429, 500, 502, 503, 504])

const statusCode = computed(() => {
  const code = props.error.statusCode
  return typeof code === 'number' && code > 0 ? code : 500
})

const isKnownCode = computed(() => SUPPORTED_CODES.has(statusCode.value))
const errorKey = computed(
  () => `error.statuses.${isKnownCode.value ? statusCode.value : 'default'}`,
)

const literaryTextIndex = ref(statusCode.value % 5)

onMounted(() => {
  literaryTextIndex.value = Math.floor(Math.random() * 5)
})

// 已知错误码 → 完全使用 i18n；未知错误码 → 优先展示服务端消息，否则 i18n 默认文案。
const title = computed(() => {
  if (isKnownCode.value) return t(`${errorKey.value}.title`)
  const serverMessage = props.error.statusMessage?.trim()
  return serverMessage || t('error.statuses.default.title')
})

const message = computed(() => t(`${errorKey.value}.message`))
const hint = computed(() => t(`${errorKey.value}.hint`))
const literaryText = computed(() =>
  t(`error.literaryTexts.${literaryTextIndex.value}`),
)
const canRetry = computed(() => statusCode.value >= 500)

useSeoMeta({
  title: () => `${statusCode.value} - ${title.value}`,
  description: () => `${message.value} - ${hint.value}`.trim(),
  ogTitle: () => `${statusCode.value} - ${title.value}`,
  ogDescription: () => `${message.value} - ${hint.value}`.trim(),
  robots: 'noindex',
})

function returnHome() {
  clearError({ redirect: '/' })
}

function retry() {
  if (import.meta.client) window.location.reload()
}
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

    <LayoutSiteHeader />

    <main class="relative z-10 flex flex-1 items-center justify-center px-6 py-16 text-center">
      <section class="max-w-2xl" role="alert" aria-live="polite">
        <div class="relative flex items-center justify-center text-primary">
          <span class="text-8xl font-bold leading-none tracking-wider sm:text-[10rem]">
            {{ statusCode }}
          </span>
          <button type="button" tabindex="0"
            class="group absolute right-10 top-0 border-0 bg-transparent p-0 text-primary sm:-right-5 sm:top-3"
            aria-label="Error details">
            <QuestionCircle24Filled class="h-6 w-6 transition-transform group-hover:scale-110 group-focus:scale-110"
              aria-hidden="true" />
            <span
              class="pointer-events-none absolute -right-10 top-full mt-3 hidden w-[min(16rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-background/95 p-4 text-left text-sm font-normal leading-6 text-foreground shadow-xl group-hover:block group-focus:block"
              role="tooltip">
              <strong class="block text-primary">{{ message }}</strong>
              <span class="mt-1 block text-muted">{{ hint }}</span>
            </span>
          </button>
        </div>

        <h1 class="mt-6 text-3xl font-light text-foreground sm:text-4xl">
          {{ title }}
        </h1>

        <p class="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">
          {{ literaryText }}
        </p>

        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button v-if="canRetry" size="lg" variant="outline" @click="retry">
            {{ t('error.actions.retry') }}
          </Button>
          <Button size="lg" @click="returnHome">
            {{ t('error.actions.home') }}
          </Button>
        </div>
      </section>
    </main>

    <LayoutSiteFooter />
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

  40%,
  100% {
    translate: -77vh 110vh;
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