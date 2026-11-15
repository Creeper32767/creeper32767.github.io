<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ArrowLeft16Regular } from "@ntkrnl64/fluentui-vue-icons";
import { AspectRatio } from "~/components/ui/aspect-ratio";

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
const metaFiles = import.meta.glob("../../../../meta/*.json", {
  eager: true,
  import: "default",
}) as Record<string, CollectionMeta>;
const meta = computed(() => metaFiles[`../../../../meta/${collection.value}.json`]);

if (!meta.value) {
  throw createError({ statusCode: 404, statusMessage: "Collection not found", fatal: true });
}

const title = computed(() => t(`portfolio.collections.${collection.value}.title`));
const items = computed(() => meta.value?.items ?? []);
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
  <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-12 sm:py-16">
    <Button as="a" href="/portfolio" target="_self" variant="ghost" size="sm"
      class="mb-8 w-fit bg-transparent px-0 text-foreground hover:bg-transparent">
      <ArrowLeft16Regular class="size-4" aria-hidden="true" />
      {{ t("portfolio.allWorks") }}
    </Button>

    <header class="page-header page-header--compact">
      <p class="page-eyebrow">{{ t("portfolio.collectionEyebrow", { key: collection }) }}</p>
      <h1 class="page-title">{{ title }}</h1>
      <p class="page-description">{{ t("portfolio.collectionDescription", { count: items.length }) }}</p>
    </header>

    <div class="portfolio-grid">
      <article v-for="item in items" :key="item.id"
        class="group overflow-hidden rounded-2xl border border-border bg-background/60 shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg">
        <PlaneLink :href="`/portfolio/${collection}/${encodeURIComponent(item.id)}`" target="_self"
          class="block h-auto w-full rounded-none bg-transparent p-0 text-left hover:bg-transparent">
          <AspectRatio :ratio="4 / 3" class="portfolio-placeholder">
            <div class="portfolio-placeholder__mark" aria-hidden="true">{{ item.title.slice(0, 1) }}</div>
            <span class="portfolio-placeholder__label">{{ t("portfolio.imagePlaceholder") }}</span>
          </AspectRatio>
          <div class="p-5 sm:p-6">
            <div class="mb-3 grid gap-2">
              <Badge v-for="tag in (item.tags ?? []).slice(0, 3)" :key="tag" variant="outline">{{ tag }}</Badge>
            </div>
            <h2 class="text-xl font-semibold">{{ item.title }}</h2>
            <p v-if="item.author || item.date" class="mt-2 text-xs text-muted">
              {{ item.author }}<span v-if="item.author && item.date"> · </span>{{ item.date }}
            </p>
            <p class="mt-4 line-clamp-3 text-sm leading-7 text-muted">
              {{ item.excerpt || t("portfolio.emptyExcerpt") }}
            </p>
          </div>
        </PlaneLink>
      </article>
    </div>
  </main>
</template>

<style scoped>
.portfolio-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.portfolio-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--app-primary) 22%, transparent), transparent 42%),
    color-mix(in srgb, var(--app-primary) 7%, var(--app-background));
}

.portfolio-placeholder__mark {
  font-size: clamp(4rem, 12vw, 7rem);
  font-weight: 700;
  color: color-mix(in srgb, var(--app-primary) 20%, transparent);
  transition: transform 300ms ease;
}

.portfolio-placeholder__label {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--app-muted);
  text-transform: uppercase;
}

:deep(.plane-link:hover) .portfolio-placeholder__mark {
  transform: scale(1.08);
}
</style>
