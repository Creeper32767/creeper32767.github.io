<script setup lang="ts">
import { useI18n } from "vue-i18n";
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

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const siteLinks = [
  { label: "footer.siteLinks.home", to: "/" },
  { label: "footer.siteLinks.deeperIntro", to: "/deeper-intro" },
  { label: "footer.siteLinks.fursona", to: "/fursona" },
  { label: "footer.siteLinks.projects", to: "/projects" },
  { label: "footer.siteLinks.software", to: "/software-picks" },
  { label: "footer.siteLinks.portfolio", to: "/portfolio" },
];

const contentLinks = [
  { label: "footer.contentLinks.editor", to: "/projects/editor" },
  { label: "footer.contentLinks.readerCard", to: "/projects/reader-card" },
  { label: "footer.contentLinks.captureScreen", to: "/projects/capture-screen" },
  { label: "footer.contentLinks.colorConverter", to: "/projects/color-conventor" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Creeper32767" },
  { label: "X / Twitter", href: "https://x.com/ConsoleCreeper" },
];
</script>

<template>
  <footer class="mt-16 border-t border-border bg-background/60">
    <div class="mx-auto w-[calc(100%-2rem)] max-w-6xl py-12 sm:py-14">
      <div class="grid gap-20 sm:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <NuxtLink class="inline-flex items-center gap-3 text-lg font-bold tracking-tight text-foreground" to="/">
            <NuxtImg src="/images/haley-avatar.webp" alt="Haley Avatar" width="96" height="96" preset="avatar"
              class="h-10 w-10 rounded-full border border-border object-cover" />
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
            <NuxtLink class="inline-flex items-center gap-1 whitespace-nowrap rounded-lg transition-colors hover:text-primary"
              to="https://github.com/Creeper32767/creeper32767.github.io" target="_blank" rel="noopener noreferrer">{{
                t("footer.source") }}
              <Open16Regular class="inline size-4" aria-hidden="true" />
            </NuxtLink>
            <Button variant="link" class="h-auto justify-start p-0 text-left leading-normal font-normal" type="button" @click="scrollToTop">
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
