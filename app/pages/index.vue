<script setup lang="ts">
import SiteHeader from "@/components/components/SiteHeader.vue";
import SiteFooter from "@/components/components/SiteFooter.vue";
import { useI18n } from "vue-i18n";
import { Button } from "@/components/components/ui/button";

const { t } = useI18n();

useSeoMeta({
  title: "Creeper32767 的个人网站",
  description: "Creeper32767 的个人网站，分享项目、文章和其他内容。",
  ogTitle: "Creeper32767 的个人网站",
  ogDescription: "Creeper32767 的个人网站，分享项目、文章和其他内容。",
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <SiteHeader />

    <main id="home" class="mx-auto flex w-[calc(100%-2rem)] max-w-6xl flex-1 items-center">
      <section class="w-full py-28 text-center max-sm:py-20" aria-labelledby="welcome-title">
        <p class="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          {{ t("home.eyebrow") }}
        </p>
        <h1 id="welcome-title"
          class="text-6xl font-bold leading-none tracking-[-0.06em] text-foreground max-sm:text-5xl">
          {{ t("home.title") }}
        </h1>
        <p class="mt-6 text-[1.05rem] text-muted">
          <i18n-t keypath="home.description" tag="span">
            <template #link>
              <Button as="a" variant="link" size="sm" class="h-auto p-0 font-semibold" href="https://vuejs.org/"
                target="_blank" rel="noopener noreferrer">vuejs.org</Button>
            </template>
          </i18n-t>
        </p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
