<script setup lang="ts">
import { Search16Regular, ErrorCircle20Regular } from "@ntkrnl64/fluentui-vue-icons";

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const collection = computed(() => String(route.params.collection));

const { data: meta, error: metaError } = await usePortfolioCollectionMeta(collection);

if (metaError.value) {
  throw createError({ statusCode: 404, statusMessage: "Collection not found", fatal: true });
}

const title = usePortfolioCollectionTitle(collection);
const items = computed(() => meta.value?.items ?? []);
const tagLabel = usePortfolioTagLabel();
const passages = usePortfolioPassages(collection, items);
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
  <LayoutPortfolioPresentation :breadcrumbs="[
    { label: t('portfolio.title'), href: localePath('/portfolio') },
    { label: title },
  ]" :passages="passages" :headings="headings">
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
        <InputGroup class="w-full sm:max-w-xs">
          <InputGroupAddon>
            <Search16Regular class="size-4" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput v-model="search" type="search" :placeholder="t('portfolio.searchPlaceholder')"
            :aria-label="t('portfolio.searchPlaceholder')" />
        </InputGroup>
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
            <p v-if="typeof item.wordCount === 'number'" class="mt-8 text-right text-xs text-muted">
              {{ t("portfolio.readingStats", {
                count: item.wordCount,
                minutes: Math.max(1, Math.ceil(item.wordCount / 200)),
              }) }}
            </p>
            <div class="mt-4 flex flex-wrap justify-end gap-2">
              <Badge v-for="tag in (item.tags ?? []).slice(0, 3)" :key="tag" variant="outline">{{ tagLabel(tag) }}
              </Badge>
            </div>
            <PlaneLink :href="localePath(`/portfolio/${collection}/${encodeURIComponent(item.id)}`)" target="_self"
              class="mt-4 w-full bg-primary shadow-sm" :view-transition-name="heroViewTransitionName(item.id)">
              {{ t("portfolio.readMore") }}
            </PlaneLink>
          </div>
        </article>
      </div>
      <Alert v-else class="border-dashed py-8 items-center justify-center bg-destructive/10 text-destructive">
        <ErrorCircle20Regular aria-hidden="true" />
        <AlertTitle class="text-base">{{ t("portfolio.noSearchResults") }}</AlertTitle>
        <AlertDescription class="mt-1.5 text-sm text-muted">{{ t("portfolio.noSearchResultsDescription") }}
        </AlertDescription>
      </Alert>
    </div>
  </LayoutPortfolioPresentation>
</template>