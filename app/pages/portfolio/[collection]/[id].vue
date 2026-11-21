<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ErrorCircle16Regular } from "@ntkrnl64/fluentui-vue-icons";

const route = useRoute();
const { t } = useI18n();
const collection = computed(() => String(route.params.collection));
const id = computed(() => String(route.params.id));
const heroViewTransitionName = computed(() =>
  `portfolio-hero-${Array.from(`${collection.value}/${id.value}`)
    .map((character) => character.charCodeAt(0).toString(16))
    .join("-")}`,
);

const { data: collectionMeta } = await useAsyncData(
  `portfolio-detail-meta-${collection.value}`,
  async () => {
    const loader = usePortfolioMeta(`${collection.value}.json`);
    if (!loader) throw new Error("Collection not found");
    return await (loader as () => Promise<{ items: Array<{ id: string; title: string }> }>)();
  },
  { watch: [collection] },
);

const passages = computed(() =>
  collectionMeta.value?.items.map((item) => ({
    ...item,
    url: `/portfolio/${collection.value}/${encodeURIComponent(item.id)}`,
  })) ?? [],
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

    // content 集合的 path 只会落到一级目录，并不会包含文件名，因此必须改用 stem / title / id 才能按文章精确查询
    const byStem = await queryCollection("content")
      .where("stem", "=", `${collection.value}/${decodedId}`)
      .first();
    if (byStem) return byStem;

    // 文件名与标题可能不一致，因此按标题兜底匹配一次
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
const collectionTitle = computed(() =>
  t(`portfolio.collections.${collection.value}.title`),
);

const tags = computed(() => {
  const value = (page.value as { tags?: unknown } | null)?.tags;
  return Array.isArray(value) ? value.filter((tag): tag is string => typeof tag === "string") : [];
});

interface ContentNode {
  tag?: string;
  props?: { id?: string };
  children?: ContentNode[];
  value?: string;
}

const headingText = (node: ContentNode): string =>
  node.value ?? (node.children ?? []).map(headingText).join("");

const slugify = (value: string): string =>
  value.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, "").replace(/\s+/g, "-");

const headings = computed(() => {
  const result: Array<{ id: string; title: string; level: number }> = [];
  const visit = (node: ContentNode) => {
    if (node.tag && /^h[1-6]$/.test(node.tag)) {
      const title = headingText(node);
      result.push({
        id: node.props?.id ?? slugify(title),
        title,
        level: Number(node.tag.slice(1)),
      });
    }
    node.children?.forEach(visit);
  };
  visit((page.value?.body ?? {}) as ContentNode);
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
  <LayoutPortfolioPresentation :back-href="`/portfolio/${collection}`" :passages="passages" :current-id="id"
    :headings="headings">
    <template #header>
      <AspectRatio :ratio="2 / 1"
        class="detail-hero mx-auto flex w-full max-w-4xl items-center justify-center overflow-hidden rounded-2xl motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-700 motion-safe:ease-out max-lg:order-1"
        :style="{ viewTransitionName: heroViewTransitionName }">
        <div
          class="text-[clamp(5rem,16vw,10rem)] font-bold text-[color-mix(in_srgb,var(--app-primary)_24%,transparent)]"
          aria-hidden="true">{{ title.slice(0, 1) }}</div>
        <span class="absolute right-5 bottom-4 text-[0.7rem] uppercase tracking-[0.12em] text-muted">
          {{ t("portfolio.imagePlaceholder") }}
        </span>
      </AspectRatio>
    </template>

    <article class="mx-auto w-full max-w-4xl max-lg:order-4">
      <div class="mt-10">
        <template v-if="hasLoadError">
          <div class="rounded-xl border border-destructive/40 bg-destructive/5 p-6 text-center items-center"
            role="alert">
            <h1 class="text-xl font-semibold">
              <ErrorCircle16Regular class="size-7 inline-flex" />
              {{ t("portfolio.passageLoadError") }}
            </h1>
            <p class="mt-2 text-sm leading-6 text-muted">{{ t("portfolio.passageLoadErrorDescription") }}</p>
            <Button class="mt-5" type="button" @click="refresh">
              {{ t("error.actions.retry") }}
            </Button>
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
          <ContentRenderer :value="page"
            class="text-base leading-8 text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_p]:my-5" />
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