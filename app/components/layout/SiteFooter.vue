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
  { label: "footer.siteLinks.about", to: { path: "/", hash: "#about" } },
  { label: "footer.siteLinks.deeperIntro", to: "/deeper-intro" },
  { label: "footer.siteLinks.fursona", to: "/fursona" },
  { label: "footer.siteLinks.projects", to: "/projects" },
  { label: "footer.siteLinks.software", to: "/software-picks" },
  { label: "footer.siteLinks.portfolio", to: "/portfolio" },
];

const contentLinks = [
  { label: "footer.contentLinks.editor", to: "/toolkit/editor" },
  { label: "footer.contentLinks.readerCard", to: "/toolkit/reader-card" },
  { label: "footer.contentLinks.captureScreen", to: "/toolkit/capture-screen" },
  { label: "footer.contentLinks.colorConverter", to: "/toolkit/color-conventor" },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Creeper32767" },
  { label: "X / Twitter", href: "https://x.com/ConsoleCreeper" },
];
</script>

<template>
  <footer class="mt-16 border-t border-border bg-background/60">
    <div class="mx-auto w-[calc(100%-2rem)] max-w-6xl py-12 sm:py-14">
      <div class="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <NuxtLink class="inline-flex items-center gap-3 text-lg font-bold tracking-tight text-foreground" to="/">
            <img src="/images/profile-photo.webp" alt=""
              class="h-10 w-10 rounded-full border border-border object-cover" />
            Creeper32767
          </NuxtLink>
          <p class="mt-4 max-w-xl text-sm leading-7 text-muted">
            {{ t("footer.introduction") }}
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <a v-for="link in socialLinks" :key="link.href"
              class="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-primary/40 hover:text-primary"
              :href="link.href" target="_blank" rel="noopener noreferrer">
              <span>{{ link.label }}</span>
              <Open16Regular class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div>
          <h2 class="text-sm font-semibold tracking-wide text-foreground">{{ t("footer.sitemap") }}</h2>
          <nav class="mt-4 grid grid-cols-2 items-start gap-3 sm:flex sm:flex-col" :aria-label="t('footer.sitemap')">
            <NuxtLink v-for="link in siteLinks" :key="link.label" :to="link.to"
              class="text-sm text-muted transition-colors hover:text-primary">
              {{ t(link.label) }}
            </NuxtLink>
          </nav>
        </div>

        <div>
          <h2 class="text-sm font-semibold tracking-wide text-foreground">{{ t("footer.toolsAndContent") }}</h2>
          <nav class="mt-4 grid grid-cols-2 items-start gap-3 sm:flex sm:flex-col"
            :aria-label="t('footer.toolsAndContent')">
            <NuxtLink v-for="link in contentLinks" :key="link.label" :to="link.to"
              class="text-sm text-muted transition-colors hover:text-primary">
              {{ t(link.label) }}
            </NuxtLink>
          </nav>
        </div>

        <div>
          <h2 class="text-sm font-semibold tracking-wide text-foreground">{{ t("footer.siteInfo") }}</h2>
          <div class="mt-4 grid grid-cols-2 items-start gap-3 text-sm text-muted sm:flex sm:flex-col">
            <a class="transition-colors hover:text-primary"
              href="https://github.com/Creeper32767/creeper32767.github.io" target="_blank" rel="noopener noreferrer">{{
                t("footer.source") }}
              <Open16Regular class="inline h-3.5 w-3.5" aria-hidden="true" />
            </a>
            <button class="self-start text-left transition-colors hover:text-primary" type="button" @click="scrollToTop">
              {{ t("footer.backToTop") }}
            </button>
          </div>
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
