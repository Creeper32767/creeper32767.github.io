<script setup lang="ts">
import {
  DocumentText16Regular,
  ErrorCircle16Regular,
  Open16Regular,
} from "@ntkrnl64/fluentui-vue-icons";
import type { TocLink } from "@nuxt/content";

definePageMeta({ pageTransition: false });

const route = useRoute();
const { t } = useI18n();
const localePath = useLocalePath();

const collection = computed(() => String(route.params.collection));
const id = computed(() => String(route.params.id));
const sharedHeroId = computed(() => `portfolio-${collection.value}/${id.value}`);

const { data: collectionMeta } = await usePortfolioCollectionMeta(collection);

const passages = usePortfolioPassages(
  collection,
  () => collectionMeta.value?.items,
);

const { data: page, status, error, refresh } = await useAsyncData(
  () => `portfolio-${collection.value}-${id.value}`,
  async () => {
    let decodedId = id.value;
    try {
      decodedId = decodeURIComponent(id.value);
    } catch {
      throw new Error("Invalid passage ID");
    }

    // content 集合的 path 只会包含一级目录，并不会包含文件名，因此必须改用 stem / title / id 才能按文章精确查询
    const byStem = await queryCollection("content")
      .where("stem", "=", `${collection.value}/${decodedId}`)
      .first();
    if (byStem) return byStem;

    // 文件名与标题可能不一致，按标题匹配一次
    const byTitle = await queryCollection("content")
      .where("title", "=", decodedId)
      .first();
    if (byTitle) return byTitle;

    // 最后按完整 id 匹配
    const byId = await queryCollection("content")
      .where("id", "=", `content/${collection.value}/${decodedId}.md`)
      .first();
    return byId ?? null;
  },
  { watch: [collection, id] },
);

if (!error.value && !page.value && status.value === "success") {
  throw createError({ statusCode: 404, statusMessage: "Work not found", fatal: true });
}

const hasLoadError = computed(() => Boolean(error.value));
const title = computed(() => page.value?.title ?? id.value);
const collectionTitle = usePortfolioCollectionTitle(collection);

const tags = usePortfolioTags(page);
const tagLabel = usePortfolioTagLabel();
const metadata = usePortfolioItemMetadata(page);

const headings = computed(() => {
  const result: Array<{ id: string; title: string; level: number }> = [];
  const visit = (links: TocLink[]) => {
    for (const link of links) {
      result.push({
        id: link.id,
        title: link.text,
        level: link.depth,
      });
      if (link.children) visit(link.children);
    }
  };
  visit(page.value?.body.toc?.links ?? []);
  return result;
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
  <LayoutPortfolioPresentation :breadcrumbs="[
    { label: t('portfolio.title'), href: localePath('/portfolio') },
    { label: collectionTitle, href: localePath(`/portfolio/${collection}`) },
    { label: title },
  ]" :passages="passages" :current-id="id" :headings="headings">
    <template #header>
      <AspectRatio :ratio="2 / 1"
        class="detail-hero mx-auto mb-8 flex w-full items-center justify-center overflow-hidden rounded-2xl max-lg:order-1"
        :data-shared-id="sharedHeroId">
        <div
          class="text-[clamp(5rem,16vw,10rem)] font-bold text-[color-mix(in_srgb,var(--app-primary)_24%,transparent)]"
          aria-hidden="true">{{ title.slice(0, 1) }}</div>
        <span class="absolute right-5 bottom-4 text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          {{ t("portfolio.imagePlaceholder") }}
        </span>
      </AspectRatio>
    </template>

    <article class="mx-auto w-full max-lg:order-4">
      <div class="mt-4">
        <template v-if="hasLoadError">
          <Alert variant="destructive" class="items-center p-6 text-center sm:items-start sm:text-left">
            <ErrorCircle16Regular class="size-7" />
            <AlertTitle class="text-xl font-semibold">{{ t("portfolio.passageLoadError") }}</AlertTitle>
            <AlertDescription class="mt-2 leading-6">
              {{ t("portfolio.passageLoadErrorDescription") }}
            </AlertDescription>
            <Button class="col-start-2 mt-5" type="button" @click="refresh">
              {{ t("error.actions.retry") }}
            </Button>
          </Alert>
        </template>
        <template v-else-if="page">
          <div class="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <p class="page-eyebrow mb-2">{{ collection }}</p>
              <h1 class="text-4xl font-bold tracking-tight sm:text-5xl" tabindex="-1" data-transition-heading>
                {{ page.title }}
              </h1>
            </div>
          </div>
          <section v-if="metadata.length || tags.length" class="mb-8 rounded-xl border border-border p-5">
            <h2 class="mb-4 text-lg font-semibold">{{ t("portfolio.metadata") }}</h2>
            <dl v-if="metadata.length" class="grid gap-3 sm:grid-cols-2">
              <div v-for="item in metadata" :key="item.label">
                <dt class="text-sm text-muted">{{ t(`portfolio.metadataFields.${item.label}`) }}</dt>
                <dd class="font-medium">{{ item.value }}</dd>
              </div>
            </dl>
            <div v-if="tags.length" class="mt-4 flex flex-wrap gap-2">
              <Badge v-for="tag in tags" :key="tag" variant="secondary">{{ tagLabel(tag) }}</Badge>
            </div>
          </section>
          <ContentRenderer :value="page"
            class="text-base leading-8 text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:my-5" />
          <aside class="mt-10 rounded-xl border border-border bg-muted/20 p-5 text-sm leading-6 text-muted"
            :aria-label="t('portfolio.licenseTitle')">
            <h2 class="font-semibold text-foreground">
              <DocumentText16Regular class="inline-block size-4 align-[-0.2em]" aria-hidden="true" />
              {{ t("portfolio.licenseTitle") }}
            </h2>
            <p class="mt-2">{{ t("portfolio.licenseDescription") }}</p>
            <p class="mt-2">
              <NuxtLink to="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer"
                class="font-medium text-primary underline underline-offset-4">
                {{ t("portfolio.licenseReference") }}
                <Open16Regular class="inline-block size-4 align-[-0.2em]" aria-hidden="true" />
              </NuxtLink>
            </p>
          </aside>
        </template>
        <template v-else>
          <Skeleton class="h-12 w-3/4" />
          <Skeleton class="mt-5 h-5 w-1/3" />
          <div class="mt-10 space-y-4">
            <Skeleton class="h-5 w-full" />
            <Skeleton class="h-5 w-11/12" />
            <Skeleton class="h-5 w-4/5" />
            <Skeleton class="h-5 w-full" />
          </div>
        </template>
      </div>
    </article>
  </LayoutPortfolioPresentation>
</template>