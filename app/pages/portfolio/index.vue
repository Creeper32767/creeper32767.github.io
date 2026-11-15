<script setup lang="ts">
import type { Component } from "vue";
import { useI18n } from "vue-i18n";
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

interface PortfolioEntry {
  text: string;
  source?: string;
}

interface PortfolioIndex {
  collections: PortfolioCollection[];
}

import portfolioIndex from "../../../meta/index.json";

const { t } = useI18n();

const collectionIcons: Record<string, Component> = {
  books: BookStar20Regular,
  poems: TextQuote16Regular,
  writings: Edit16Filled,
};

const collections = computed(() =>
  (portfolioIndex as PortfolioIndex).collections.map((collection) => ({
    ...collection,
    title: t(`portfolio.collections.${collection.key}.title`),
    subtitle: t(`portfolio.collections.${collection.key}.subtitle`),
    description: t(`portfolio.collections.${collection.key}.description`),
    entries: Array.from({ length: 3 }, (_, index) => ({
      text: t(`portfolio.collections.${collection.key}.entries.${index}.text`),
      source: t(`portfolio.collections.${collection.key}.entries.${index}.source`),
    })).filter((entry): entry is PortfolioEntry => !entry.text.startsWith("portfolio.")),
  })),
);

useSiteSeo();
</script>

<template>
  <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-12 sm:py-16">
    <header class="page-header">
      <p class="page-eyebrow">{{ t("portfolio.eyebrow") }}</p>
      <h1 class="page-title">{{ t("portfolio.title") }}</h1>
      <p class="page-description">{{ t("portfolio.description") }}</p>
    </header>

    <div class="grid gap-12">
      <article v-for="collection in collections" :key="collection.key"
        class="group flex flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg sm:p-8">
        <div class="mb-8 flex items-center justify-between">
          <div class="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
            <component :is="collectionIcons[collection.key]" class="size-6" aria-hidden="true" />
          </div>
          <ClientOnly>
            <Badge variant="secondary">
              <BookOpen16Filled class="size-4" aria-hidden="true" />
              {{ t("portfolio.count", { count: collection.count }) }}
            </Badge>
            <template #fallback>
              <Skeleton class="h-5.5 w-10 rounded-full" />
            </template>
          </ClientOnly>
        </div>
        <div>
          <h2 class="text-2xl font-bold">{{ collection.title }}</h2>
          <p class="mt-1 text-sm tracking-wide text-muted">{{ collection.subtitle }}</p>
        </div>
        <p class="mt-8 flex-1 text-sm leading-7 text-muted">{{ collection.description }}</p>
        <ul class="mt-4 space-y-3 border-t border-border pt-6">
          <li v-for="entry in collection.entries" :key="entry.text"
            class="border-l-2 border-primary/30 pl-4 text-sm leading-7 text-muted">
            {{ entry.text }}
            <strong v-if="entry.source && !entry.source.startsWith('portfolio.')" class="font-semibold text-foreground">
              —— {{ entry.source }}
            </strong>
          </li>
        </ul>
        <PlaneLink :href="`/portfolio/${collection.key}`" target="_self" class="mt-8 w-full bg-primary shadow-sm"
          :aria-label="`浏览${collection.title}`">
          {{ t("portfolio.browse") }}
        </PlaneLink>
      </article>
    </div>
  </main>
</template>
