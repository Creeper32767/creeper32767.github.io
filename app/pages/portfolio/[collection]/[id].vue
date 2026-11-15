<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ArrowLeft16Regular } from "@ntkrnl64/fluentui-vue-icons";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Skeleton } from "~/components/ui/skeleton";

const route = useRoute();
const { t } = useI18n();
const collection = computed(() => String(route.params.collection));
const id = computed(() => String(route.params.id));
const contentPath = computed(() => `/${collection.value}/${id.value}`);

const { data: page, status, error } = await useAsyncData(
  `portfolio-${collection.value}-${id.value}`,
  () => queryCollection("content").path(contentPath.value).first(),
  { lazy: true },
);

if (error.value) {
  throw createError({ statusCode: 404, statusMessage: "Work not found", fatal: true });
}

const isLoading = computed(() => status.value === "pending");
const title = computed(() => page.value?.title ?? id.value);
const collectionTitle = computed(() =>
  t(`portfolio.collections.${collection.value}.title`),
);
const tags = computed(() => {
  const value = (page.value as { tags?: unknown } | null)?.tags;
  return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string") : [];
});
useSiteSeo({
  title: computed(() =>
    t("portfolio.detailSeoTitle", {
      title: title.value,
      collection: collectionTitle.value,
    }),
  ),
  description: computed(() =>
    t("portfolio.detailSeoDescription", { title: title.value }),
  ),
  type: "article",
});
</script>

<template>
  <main class="mx-auto w-[calc(100%-2rem)] max-w-4xl flex-1 py-12 sm:py-16">
    <Button as="a" :href="`/portfolio/${collection}`" target="_self" variant="ghost" size="sm"
      class="mb-8 w-fit bg-transparent px-0 text-foreground hover:bg-transparent">
      <ArrowLeft16Regular class="size-4" aria-hidden="true" />
      {{ t("portfolio.backToList") }}
    </Button>

    <article>
      <AspectRatio :ratio="4 / 3" class="detail-hero">
        <div class="detail-hero__mark" aria-hidden="true">{{ title.slice(0, 1) }}</div>
        <span class="detail-hero__label">{{ t("portfolio.imagePlaceholder") }}</span>
      </AspectRatio>

      <div class="mt-10">
        <template v-if="isLoading">
          <Skeleton class="h-12 w-3/4" />
          <Skeleton class="mt-5 h-5 w-1/3" />
          <div class="mt-10 space-y-4">
            <Skeleton class="h-5 w-full" />
            <Skeleton class="h-5 w-11/12" />
            <Skeleton class="h-5 w-4/5" />
            <Skeleton class="h-5 w-full" />
          </div>
        </template>
        <template v-else-if="page">
          <div class="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <p class="page-eyebrow mb-2">{{ collection }}</p>
              <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">{{ page.title }}</h1>
            </div>
            <div class="flex flex-wrap gap-2">
              <Badge v-for="tag in tags" :key="tag" variant="secondary">{{ tag }}</Badge>
            </div>
          </div>
          <ContentRenderer :value="page" class="portfolio-content" />
        </template>
      </div>
    </article>
  </main>
</template>

<style scoped>
.detail-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 1rem;
  background:
    radial-gradient(circle at 70% 30%, color-mix(in srgb, var(--app-primary) 28%, transparent), transparent 45%),
    color-mix(in srgb, var(--app-primary) 8%, var(--app-background));
  animation: hero-expand 700ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.detail-hero__mark {
  font-size: clamp(5rem, 16vw, 10rem);
  font-weight: 700;
  color: color-mix(in srgb, var(--app-primary) 24%, transparent);
}

.detail-hero__label {
  position: absolute;
  right: 1.25rem;
  bottom: 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  color: var(--app-muted);
  text-transform: uppercase;
}

.portfolio-content {
  color: var(--app-foreground);
  font-size: 1rem;
  line-height: 2rem;
}

.portfolio-content :deep(h2) {
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.portfolio-content :deep(p) {
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
}

@keyframes hero-expand {
  from {
    transform: scale(0.86);
    opacity: 0.3;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .detail-hero {
    animation: none;
  }
}
</style>
