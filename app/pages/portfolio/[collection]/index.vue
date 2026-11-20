<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Search16Regular, ErrorCircle16Regular } from "@ntkrnl64/fluentui-vue-icons";

interface PortfolioItem {
  id: string;
  title: string;
  collection: string;
  author?: string;
  dynasty?: string;
  date?: string;
  tags?: string[];
  excerpt?: string;
  wordCount?: number;
  url: string;
}

interface CollectionMeta {
  collection: string;
  count: number;
  items: PortfolioItem[];
}

const route = useRoute();
const { t } = useI18n();
const collection = computed(() => String(route.params.collection));

const { data: meta, error: metaError } = await useAsyncData(
  () => `portfolio-meta-${collection.value}`,
  async () => {
    const loader = usePortfolioMeta(`${collection.value}.json`);
    if (!loader) throw new Error("Collection not found");
    return await (loader as () => Promise<CollectionMeta>)();
  },
  { watch: [collection] },
);

if (metaError.value) {
  throw createError({ statusCode: 404, statusMessage: "Collection not found", fatal: true });
}

const title = computed(() => t(`portfolio.collections.${collection.value}.title`));
const items = computed(() => meta.value?.items ?? []);
const search = ref("");
const filteredItems = computed(() => {
  const query = search.value.trim().toLocaleLowerCase();
  if (!query) return items.value;
  return items.value.filter((item) =>
    [item.title, item.author, item.excerpt, ...(item.tags ?? [])]
      .filter(Boolean)
      .some((value) => value?.toLocaleLowerCase().includes(query)),
  );
});

const heroViewTransitionName = (itemId: string) =>
  `portfolio-hero-${Array.from(`${collection.value}/${itemId}`)
    .map((character) => character.charCodeAt(0).toString(16))
    .join("-")}`;

const headings = computed(() => [
  { id: "collection-title", title: title.value, level: 1 },
  { id: "collection-works", title: t("portfolio.collectionWorks"), level: 2 },
]);

useSiteSeo({
  title: computed(() =>
    t("portfolio.collectionSeoTitle", { title: title.value }),
  ),
  description: computed(() =>
    t("portfolio.collectionSeoDescription", {
      title: title.value,
      count: items.value.length,
    }),
  ),
});
</script>

<template>
  <LayoutPortfolioPresentation back-href="/portfolio" :headings="headings">
    <template #header>
      <header class="page-header page-header--compact w-full max-lg:order-1">
        <p class="page-eyebrow">{{ t("portfolio.collectionEyebrow", { key: collection }) }}</p>
        <h1 id="collection-title" class="page-title">{{ title }}</h1>
        <p class="page-description">{{ t("portfolio.collectionDescription", { count: items.length }) }}</p>
      </header>
    </template>

    <div class="mx-auto w-full max-w-6xl max-lg:order-4">
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="collection-works" class="text-xl font-semibold">{{ t("portfolio.collectionWorks") }}</h2>
        <div class="relative w-full sm:max-w-xs">
          <Search16Regular class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden="true" />
          <Input v-model="search" type="search" :placeholder="t('portfolio.searchPlaceholder')"
            :aria-label="t('portfolio.searchPlaceholder')" class="pl-9" />
        </div>
      </div>

      <div v-if="filteredItems.length" class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <article v-for="item in filteredItems" :key="item.id"
          class="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background/60 shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg">
          <AspectRatio :ratio="16 / 9"
            class="portfolio-placeholder flex w-full items-center justify-center overflow-hidden"
            :style="{ viewTransitionName: heroViewTransitionName(item.id) }">
            <div
              class="text-[clamp(4rem,12vw,7rem)] font-bold text-[color-mix(in_srgb,var(--app-primary)_20%,transparent)] transition-transform duration-300 group-hover:scale-[1.08]"
              aria-hidden="true">{{ item.title.slice(0, 1) }}</div>
            <span class="absolute bottom-4 left-4 text-[0.7rem] uppercase tracking-[0.12em] text-muted">
              {{ t("portfolio.imagePlaceholder") }}
            </span>
          </AspectRatio>
          <div class="flex flex-1 flex-col p-5 sm:p-6">
            <h2 class="text-xl font-semibold">{{ item.title }}</h2>
            <p v-if="item.author || item.date" class="mt-2 text-xs text-muted">
              {{ item.author }}<span v-if="item.author && item.date"> · </span>{{ item.date }}
            </p>
            <p class="mt-4 line-clamp-3 text-sm leading-7 text-muted">
              {{ item.excerpt || t("portfolio.emptyExcerpt") }}
            </p>
            <div class="mt-8 flex flex-wrap justify-end gap-2">
              <Badge v-for="tag in (item.tags ?? []).slice(0, 3)" :key="tag" variant="outline">{{ tag }}</Badge>
            </div>
            <PlaneLink :href="`/portfolio/${collection}/${encodeURIComponent(item.id)}`" target="_self"
              class="mt-4 w-full bg-primary shadow-sm" :view-transition-name="heroViewTransitionName(item.id)">
              {{ t("portfolio.readMore") }}
            </PlaneLink>
          </div>
        </article>
      </div>
      <p v-else class="rounded-xl border border-dashed border-border p-8 text-center text-muted">
        <ErrorCircle16Regular class="size-7 inline-flex" />
        {{ t("portfolio.noSearchResults") }}
      </p>
    </div>
  </LayoutPortfolioPresentation>
</template>