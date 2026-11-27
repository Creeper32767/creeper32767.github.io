<script setup lang="ts">
import type { Component } from "vue";
import {
  BookOpen16Filled,
  BookStar20Regular,
  Edit16Filled,
  TextQuote16Regular,
} from "@ntkrnl64/fluentui-vue-icons";

interface PortfolioCollection {
  key: string;
  count: number;
  metaPath: string;
}

interface PortfolioIndex {
  collections: PortfolioCollection[];
}

const collectionIcons: Record<string, Component> = {
  books: BookStar20Regular,
  poems: TextQuote16Regular,
  writings: Edit16Filled,
};

const portfolioIndexLoader = usePortfolioMeta("index.json") as
  | (() => Promise<PortfolioIndex>)
  | undefined;

const { data: portfolioIndex, error: portfolioIndexError } = await useAsyncData(
  "portfolio-index",
  async () => {
    if (!portfolioIndexLoader) throw new Error("Meta index not found");
    return await portfolioIndexLoader();
  },
);

if (portfolioIndexError.value || !portfolioIndex.value) {
  throw createError({ statusCode: 500, statusMessage: "Portfolio index unavailable", fatal: true });
}

const { t, te } = useI18n();
const localePath = useLocalePath();

const collections = computed(() =>
  (portfolioIndex.value?.collections ?? []).map((collection) => ({
    ...collection,
    title: t(`portfolio.collections.${collection.key}.title`),
    subtitle: t(`portfolio.collections.${collection.key}.subtitle`),
    description: t(`portfolio.collections.${collection.key}.description`),
    entries: Array.from({ length: 3 }, (_, index) => ({
      text: t(`portfolio.collections.${collection.key}.entries.${index}.text`),
      source: te(`portfolio.collections.${collection.key}.entries.${index}.source`)
        ? t(`portfolio.collections.${collection.key}.entries.${index}.source`)
        : undefined,
    })).filter((entry) => !entry.text.startsWith("portfolio.")),
  })),
);

useSiteSeo();
</script>

<template>
  <LayoutPortfolioPresentation :back-href="localePath('/')" :headings="[
    { id: 'portfolio-title', title: t('portfolio.title'), level: 1 },
    ...collections.map((collection) => ({ id: `collection-${collection.key}`, title: collection.title, level: 2 })),
  ]">
    <template #header>
      <header class="page-header w-full max-lg:order-1">
        <p class="page-eyebrow">{{ t("portfolio.eyebrow") }}</p>
        <h1 id="portfolio-title" class="page-title">{{ t("portfolio.title") }}</h1>
        <p class="page-description">{{ t("portfolio.description") }}</p>
      </header>
    </template>

    <div class="mx-auto w-full max-w-6xl max-lg:order-4">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <article v-for="collection in collections" :key="collection.key"
          class="group flex flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg sm:p-8">
          <div class="mb-8 flex items-center justify-between">
            <div
              class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
              <component :is="collectionIcons[collection.key]" class="size-6" aria-hidden="true" />
            </div>
            <!-- 移除 ClientOnly，让 SSR 直接渲染正确的数量，避免闪烁 -->
            <Badge variant="secondary">
              <BookOpen16Filled class="size-4" aria-hidden="true" />
              {{ t("portfolio.count", { count: collection.count }) }}
            </Badge>
          </div>
          <div>
            <h2 :id="`collection-${collection.key}`" class="text-2xl font-bold">{{ collection.title }}</h2>
            <p class="mt-1 text-sm tracking-wide text-muted">{{ collection.subtitle }}</p>
          </div>
          <p class="mt-8 flex-1 text-sm leading-7 text-muted">{{ collection.description }}</p>
          <ul class="mt-4 space-y-3 border-t border-border pt-6">
            <li v-for="entry in collection.entries" :key="entry.text"
              class="border-l-2 border-primary/30 pl-4 text-sm leading-7 text-muted">
              {{ entry.text }}
              <strong v-if="entry.source && !entry.source.startsWith('portfolio.')"
                class="font-semibold text-foreground">
                —— {{ entry.source }}
              </strong>
            </li>
          </ul>
          <TransitionLink :href="localePath(`/portfolio/${collection.key}`)" target="_self"
            class="mt-8 w-full bg-primary shadow-sm" :aria-label="`浏览${collection.title}`">
            {{ t("portfolio.browse") }}
          </TransitionLink>
        </article>
      </div>
    </div>
  </LayoutPortfolioPresentation>
</template>