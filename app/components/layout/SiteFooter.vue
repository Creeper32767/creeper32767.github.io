<script setup lang="ts">
import { Open16Regular } from "@ntkrnl64/fluentui-vue-icons";

withDefaults(
  defineProps<{
    year?: number;
  }>(),
  {
    year: new Date().getFullYear(),
  },
);

const { t } = useI18n();
const localePath = useLocalePath();

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// <NuxtLink> 不会自动处理 i18n 语言前缀，这里统一转换为本地化路径。
// 必须用 computed 包裹：语言切换是客户端路由跳转，组件不会重新挂载，若在 setup 时一次性求值，页脚链接会停留在挂载时的语言
const siteLinks = computed(() => [
  { label: "footer.siteLinks.home", to: localePath("/") },
  { label: "footer.siteLinks.deeperIntro", to: localePath("/deeper-intro") },
  { label: "footer.siteLinks.fursona", to: localePath("/fursona") },
  { label: "footer.siteLinks.projects", to: localePath("/projects") },
  { label: "footer.siteLinks.software", to: localePath("/software-picks") },
  { label: "footer.siteLinks.portfolio", to: localePath("/portfolio") },
]);

const contentLinks = computed(() => [
  { label: "footer.contentLinks.editor", to: localePath("/projects/editor") },
  { label: "footer.contentLinks.readerCard", to: localePath("/projects/reader-card") },
  { label: "footer.contentLinks.captureScreen", to: localePath("/projects/capture-screen") },
  { label: "footer.contentLinks.colorConverter", to: localePath("/projects/color-conventor") },
]);

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Creeper32767" },
  { label: "X / Twitter", href: "https://x.com/ConsoleCreeper" },
];
</script>

<template>
  <footer class="mt-16 border-t border-border bg-background/60" data-transition-static>
    <div class="mx-auto w-[calc(100%-2rem)] max-w-6xl py-12 sm:py-14">
      <div class="grid gap-20 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <NuxtLink class="inline-flex items-center gap-3 text-lg font-bold tracking-tight text-foreground"
            :to="localePath('/')">
            <Avatar class="size-10 border border-border">
              <AvatarImage as-child src="/images/haley-avatar.webp">
                <NuxtImg src="/images/haley-avatar.webp" alt="Haley Avatar" width="96" height="96" preset="avatar"
                  class="aspect-square size-full object-cover" />
              </AvatarImage>
              <AvatarFallback class="bg-primary/10 text-sm font-semibold text-primary">H</AvatarFallback>
            </Avatar>
            Creeper32767
          </NuxtLink>
          <p class="mt-4 max-w-xl text-sm leading-7 text-muted">
            {{ t("footer.introduction") }}
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <NuxtLink v-for="link in socialLinks" :key="link.href"
              class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
              :href="link.href" target="_blank" rel="noopener noreferrer">
              <span>{{ link.label }}</span>
              <Open16Regular class="size-4 shrink-0" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>

        <div>
          <h2 class="text-sm font-semibold tracking-wide text-foreground">{{ t("footer.sitemap") }}</h2>
          <ItemGroup class="mt-4 grid grid-cols-2 items-start gap-3 sm:flex sm:flex-col"
            :aria-label="t('footer.sitemap')">
            <Item v-for="link in siteLinks" :key="link.label" size="sm" class="p-0">
              <NuxtLink :to="link.to" class="text-sm text-muted transition-colors hover:text-primary">
                {{ t(link.label) }}
              </NuxtLink>
            </Item>
          </ItemGroup>
        </div>

        <div>
          <h2 class="text-sm font-semibold tracking-wide text-foreground">{{ t("footer.toolsAndContent") }}</h2>
          <ItemGroup class="mt-4 grid grid-cols-2 items-start gap-3 sm:flex sm:flex-col"
            :aria-label="t('footer.toolsAndContent')">
            <Item v-for="link in contentLinks" :key="link.label" size="sm" class="p-0">
              <NuxtLink :to="link.to" class="text-sm text-muted transition-colors hover:text-primary">
                {{ t(link.label) }}
              </NuxtLink>
            </Item>
          </ItemGroup>
        </div>

        <div>
          <h2 class="text-sm font-semibold tracking-wide text-foreground">{{ t("footer.siteInfo") }}</h2>
          <ItemGroup class="mt-4 grid grid-cols-2 items-baseline gap-3 text-sm text-muted sm:flex sm:flex-col">
            <NuxtLink
              class="inline-flex items-center gap-1 whitespace-nowrap rounded-lg transition-colors hover:text-primary"
              to="https://github.com/Creeper32767/creeper32767.github.io" target="_blank" rel="noopener noreferrer">{{
                t("footer.source") }}
              <Open16Regular class="inline size-4" aria-hidden="true" />
            </NuxtLink>
            <Button variant="link" class="h-auto justify-start p-0 text-left leading-normal font-normal" type="button"
              @click="scrollToTop">
              {{ t("footer.backToTop") }}
            </Button>
          </ItemGroup>
        </div>
      </div>

      <div
        class="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted">
        <p>{{ t("footer.copyright", { year }) }}</p>
        <p>{{ t("footer.credit") }}</p>
      </div>
    </div>
  </footer>
</template>
