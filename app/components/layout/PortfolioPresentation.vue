<script setup lang="ts">
import { ArrowLeft16Regular } from "@ntkrnl64/fluentui-vue-icons";
import { useI18n } from "vue-i18n";

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

const props = withDefaults(defineProps<{
  backHref: string;
  passages?: Passage[];
  currentId?: string;
  headings?: Heading[];
}>(), {
  passages: () => [],
  headings: () => [],
});

const { t } = useI18n();
</script>

<template>
  <main class="portfolio-presentation mx-auto w-[calc(100%-2rem)] flex-1 py-12 sm:py-16 lg:mx-0 lg:w-full">
    <div v-if="props.passages.length || props.headings.length"
      class="grid grid-cols-1 items-start lg:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_minmax(0,12rem)]">
      <aside
        class="max-lg:order-3 max-lg:static max-lg:mb-4 max-lg:max-h-none max-lg:border-b max-lg:border-border max-lg:pt-4 lg:sticky lg:top-30 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:border-r lg:border-border lg:px-4">
        <Button as-child variant="ghost" size="sm"
          class="mb-6 w-fit bg-transparent p-0 text-foreground hover:bg-transparent max-lg:mb-4">
          <NuxtLink :to="props.backHref">
            <ArrowLeft16Regular class="size-4" aria-hidden="true" />
            {{ t("portfolio.returnPrevious") }}
          </NuxtLink>
        </Button>

        <template v-if="props.passages.length">
          <h2 class="mb-3 text-[0.7rem] font-bold uppercase tracking-widest text-muted">
            {{ t("portfolio.allPassages") }}
          </h2>
          <nav :aria-label="t('portfolio.allPassages')">
            <ul class="space-y-1 max-lg:flex max-lg:flex-wrap max-lg:gap-x-2 max-lg:gap-y-1">
              <li v-for="passage in props.passages" :key="passage.id" class="max-lg:max-w-full">
                <a :href="passage.url" target="_self"
                  :aria-current="passage.id === props.currentId ? 'page' : undefined"
                  class="block wrap-anywhere border-l-2 border-transparent px-2 py-1.5 text-[0.8rem] leading-normal text-muted transition-[color,border-color] duration-150 hover:border-primary hover:text-primary max-lg:rounded-full max-lg:border max-lg:px-[0.65rem] max-lg:py-1.5"
                  :class="{ 'border-primary text-primary': passage.id === props.currentId }">
                  {{ passage.title }}
                </a>
              </li>
            </ul>
          </nav>
        </template>
      </aside>

      <section class="mx-auto w-full min-w-0 max-w-6xl px-8 max-lg:w-full max-lg:px-0 max-lg:contents">
        <slot name="header" />
        <slot />
      </section>

      <aside v-if="props.headings.length"
        class="max-lg:order-2 max-lg:static max-lg:max-h-none max-lg:border-l-0 max-lg:border-t max-lg:border-border max-lg:pb-4 lg:sticky lg:top-30 lg:max-h-[calc(100vh-7.5rem)] lg:overflow-y-auto lg:border-l lg:border-border lg:px-4">
        <h2 class="mt-4 mb-6 text-lg font-bold uppercase tracking-widest text-muted">
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
      </aside>
    </div>
    <slot v-else />
  </main>
</template>
