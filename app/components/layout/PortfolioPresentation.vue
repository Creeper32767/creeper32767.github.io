<script setup lang="ts">
import { pinyin } from "pinyin-pro";
import { toast } from "vue-sonner";

interface Passage {
  id: string;
  title: string;
  url?: string;
}

interface Heading {
  id: string;
  title: string;
  level: number;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

const props = withDefaults(defineProps<{
  breadcrumbs?: BreadcrumbItem[];
  passages?: Passage[];
  currentId?: string;
  headings?: Heading[];
}>(), {
  breadcrumbs: () => [],
  passages: () => [],
  headings: () => [],
});

const { t } = useI18n();

const collator = new Intl.Collator("zh-CN", {
  sensitivity: "base",
  numeric: true,
});

const getPassageInitial = (title: string) => {
  const trimmedTitle = title.trim();
  const latinInitial = trimmedTitle.match(/[A-Za-z]/)?.[0];
  if (latinInitial) return latinInitial.toUpperCase();

  const firstPinyin = pinyin(trimmedTitle, {
    pattern: "first",
    toneType: "none",
  }).trim().match(/[A-Za-z]/)?.[0];
  return firstPinyin?.toUpperCase() ?? "#";
};

const getPassagePinyin = (title: string) =>
  pinyin(title, {
    toneType: "none",
    separator: "",
  });

const passageGroups = computed(() => {
  const sorted = [...props.passages].sort((a, b) => {
    const initialCompare = getPassageInitial(a.title).localeCompare(
      getPassageInitial(b.title),
      "en",
    );
    if (initialCompare !== 0) return initialCompare;

    const pinyinCompare = getPassagePinyin(a.title).localeCompare(
      getPassagePinyin(b.title),
      "zh-CN",
    );
    return pinyinCompare || collator.compare(a.title, b.title);
  });

  const groups = new Map<string, Passage[]>();
  for (const passage of sorted) {
    const initial = getPassageInitial(passage.title);
    const group = groups.get(initial) ?? [];
    group.push(passage);
    groups.set(initial, group);
  }

  return Array.from(groups, ([initial, items]) => ({ initial, items }));
});

// 右键菜单：在新标签页打开 / 复制链接
function getPassageUrl(passage: Passage): string {
  return new URL(passage.url ?? window.location.href, window.location.origin).href;
}

function openPassageInNewTab(passage: Passage) {
  window.open(getPassageUrl(passage), "_blank", "noopener");
}

async function copyPassageLink(passage: Passage) {
  try {
    await navigator.clipboard.writeText(getPassageUrl(passage));
    toast.success(t("navigation.linkCopied"));
  } catch {
    toast.error(t("navigation.linkCopyFailed"));
  }
}
</script>

<template>
  <main class="portfolio-presentation mx-auto w-[calc(100%-2rem)] flex-1 py-12 lg:mx-0 lg:w-full"
    data-transition-content>
    <div v-if="props.breadcrumbs.length || props.passages.length || props.headings.length"
      class="grid grid-cols-1 items-start lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,12rem)]">
      <aside
        class="flex flex-col max-lg:order-3 max-lg:static max-lg:mb-8 max-lg:max-h-none lg:sticky lg:top-30 lg:max-h-[calc(100vh-7.5rem)] lg:flex-row lg:gap-4 lg:overflow-y-auto lg:px-4 lg:pr-0">
        <Separator orientation="horizontal" class="max-lg:-mt-px lg:hidden" />
        <div v-if="props.passages.length" class="min-w-0 flex-1 max-lg:pt-4">
          <h2 class="mb-3 text-[0.7rem] font-bold uppercase tracking-widest text-muted">
            {{ t("portfolio.allPassages") }}
          </h2>
          <nav :aria-label="t('portfolio.allPassages')">
            <ul
              class="mb-4 space-y-2 max-lg:flex max-lg:max-h-30 max-lg:flex-wrap max-lg:gap-x-2 max-lg:gap-y-1 max-lg:overflow-y-auto max-lg:pr-1 scrollbar-thin">
              <li v-for="group in passageGroups" :key="group.initial" class="max-lg:w-full">
                <div class="mb-1 flex items-center gap-2 max-lg:mb-0 max-lg:inline-flex max-lg:align-middle">
                  <span class="text-[0.65rem] font-bold text-primary">{{ group.initial }}</span>
                  <span class="h-px flex-1 bg-border max-lg:hidden" />
                </div>
                <ul class="space-y-1 max-lg:flex max-lg:flex-wrap max-lg:gap-x-1 max-lg:gap-y-1">
                  <li v-for="passage in group.items" :key="passage.id" class="max-lg:max-w-full">
                    <ContextMenu>
                      <ContextMenuTrigger as-child>
                        <NuxtLink :to="passage.url" target="_self"
                          :aria-current="passage.id === props.currentId ? 'page' : undefined"
                          class="block wrap-anywhere border-l-2 border-transparent px-2 py-1.5 text-[0.8rem] leading-normal text-muted transition-[color,border-color] duration-150 hover:border-primary hover:text-primary max-lg:rounded-full max-lg:border max-lg:px-[0.65rem] max-lg:py-1.5"
                          :class="{ 'border-primary text-primary': passage.id === props.currentId }">
                          {{ passage.title }}
                        </NuxtLink>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem @select="openPassageInNewTab(passage)">
                          {{ t("navigation.openInNewTab") }}
                        </ContextMenuItem>
                        <ContextMenuItem @select="copyPassageLink(passage)">
                          {{ t("navigation.copyLink") }}
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <Separator v-if="props.passages.length" orientation="horizontal" class="lg:hidden" />
        <Separator v-if="props.passages.length" orientation="vertical"
          class="hidden lg:block lg:h-auto lg:self-stretch" />
      </aside>

      <section class="mx-auto w-full min-w-0 max-w-6xl px-8 max-lg:w-full max-lg:px-0 max-lg:contents">
        <slot name="header" />
        <slot />
      </section>

      <aside
        class="flex flex-col max-lg:order-2 max-lg:static max-lg:max-h-none lg:sticky lg:top-30 lg:max-h-[calc(100vh-7.5rem)] lg:flex-row lg:gap-4 lg:overflow-y-auto lg:pl-0 lg:pr-4">
        <Separator orientation="horizontal" class="mb-4 lg:hidden" />
        <Separator v-if="props.breadcrumbs.length || props.headings.length" orientation="vertical"
          class="hidden lg:block lg:h-auto lg:self-stretch" />
        <div v-if="props.breadcrumbs.length || props.headings.length" class="min-w-0 flex-1 max-lg:pb-4">
          <Breadcrumb v-if="props.breadcrumbs.length" class="mt-4 mb-8 max-lg:mt-0 max-lg:mb-4">
            <BreadcrumbList class="flex-wrap">
              <template v-for="(breadcrumb, index) in props.breadcrumbs" :key="breadcrumb.label">
                <BreadcrumbSeparator v-if="index" />
                <BreadcrumbItem>
                  <BreadcrumbLink v-if="breadcrumb.href" as-child>
                    <NuxtLink :to="breadcrumb.href">{{ breadcrumb.label }}</NuxtLink>
                  </BreadcrumbLink>
                  <BreadcrumbPage v-else>{{ breadcrumb.label }}</BreadcrumbPage>
                </BreadcrumbItem>
              </template>
            </BreadcrumbList>
          </Breadcrumb>

          <template v-if="props.headings.length">
            <h2 class="mb-6 text-lg font-bold uppercase tracking-widest text-muted">
              {{ t("portfolio.onThisPage") }}
            </h2>
            <nav :aria-label="t('portfolio.onThisPage')">
              <ul class="space-y-2.5 max-lg:flex max-lg:flex-wrap max-lg:gap-2">
                <li v-for="heading in props.headings" :key="heading.id">
                  <Badge as="a" :href="`#${heading.id}`" variant="outline" target="_self"
                    class="max-w-full wrap-anywhere px-2.5 py-1.5 text-[0.75rem] font-normal leading-normal text-muted hover:border-primary hover:text-primary max-lg:text-[0.8rem]"
                    :class="heading.level >= 3 ? 'lg:ml-2' : ''">
                    {{ heading.title }}
                  </Badge>
                </li>
              </ul>
            </nav>
          </template>
        </div>
        <Separator v-if="props.breadcrumbs.length || props.headings.length" orientation="horizontal"
          class="lg:hidden" />
      </aside>
    </div>

    <slot v-else />
  </main>
</template>
