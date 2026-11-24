<script setup lang="ts">
import { computed, type Component } from "vue";
import { useRoute } from "vue-router";
import {
  AnimalPawPrint16Filled,
  Apps16Filled,
  BookOpen16Filled,
  Code16Filled,
  Globe16Filled,
  Home16Filled,
  Navigation16Filled,
  Open16Regular,
  Person16Filled,
} from "@ntkrnl64/fluentui-vue-icons";
import type { NavigationItem } from "./SiteHeader.vue";

type AnimatedNavigationItem = NavigationItem & {
  animationIndex: number;
  isCurrent: boolean;
};

const props = defineProps<{
  items: NavigationItem[];
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();
const route = useRoute();

function isCurrentItem(item: NavigationItem) {
  if (typeof item.to === "string") {
    return route.path === item.to;
  }

  return (
    item.to.path === route.path &&
    (!item.to.hash || item.to.hash === route.hash)
  );
}

const navigation = computed(() => {
  const groups = new Map<string, AnimatedNavigationItem[]>();
  const externalRaw: NavigationItem[] = [];
  let index = 0;

  for (const item of props.items) {
    if (item.external) {
      externalRaw.push(item);
      continue;
    }

    const section = item.section || "navigation.panelTitle";
    const group = groups.get(section) || [];

    group.push({
      ...item,
      animationIndex: index++,
      isCurrent: isCurrentItem(item),
    });
    groups.set(section, group);
  }

  const externals: AnimatedNavigationItem[] = externalRaw.map(
    (item, externalIndex) => ({
      ...item,
      animationIndex: index + externalIndex,
      isCurrent: false,
    }),
  );

  return {
    groups: Array.from(groups, ([title, items]) => ({ title, items })),
    externals,
  };
});

const iconMap: Record<string, Component> = {
  home: Home16Filled,
  person: Person16Filled,
  apps: Apps16Filled,
  book: BookOpen16Filled,
  paw: AnimalPawPrint16Filled,
  code: Code16Filled,
  globe: Globe16Filled,
};

function resolveIcon(name?: string): Component {
  return (name ? iconMap[name] : undefined) ?? Globe16Filled;
}

function itemDelay(index: number): string {
  return `${Math.min(450 + index * 100, 2000)}ms`;
}
</script>

<template>
  <Sheet :open="open" @update:open="(value) => !value && emit('close')">
    <SheetContent id="site-navigation-panel" side="right"
      class="flex h-dvh w-4/5 max-w-md flex-col overflow-hidden border-l border-border bg-background/95 p-5 backdrop-blur-xl sm:w-2/5">
      <SheetHeader class="border-b border-border p-0 pb-3">
        <SheetTitle class="flex items-center gap-2 text-lg">
          <Navigation16Filled class="size-6 text-primary" aria-hidden="true" />
          {{ t("navigation.panelTitle") }}
        </SheetTitle>
        <SheetDescription class="sr-only">{{ t("navigation.panelTitle") }}</SheetDescription>
      </SheetHeader>

      <ScrollArea class="navigation-scroll-area min-h-0 flex-1 pr-1">
        <nav class="mt-5 flex flex-col gap-4 pb-[5vh]" :aria-label="t('navigation.panelTitle')">
          <section v-for="group in navigation.groups" :key="group.title">
            <h2 class="mb-2 px-2 text-base font-semibold tracking-wide text-foreground">
              {{ t(group.title) }}
            </h2>
            <ItemGroup>
              <Item v-for="item in group.items" :key="`${item.label}-${item.animationIndex}`" size="sm"
                class="navigation-item rounded-xl p-0" :class="{ 'navigation-item-current': item.isCurrent }"
                :style="{ '--item-delay': itemDelay(item.animationIndex) }">
                <NuxtLink class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted
                  hover:bg-muted/20 hover:text-primary" :to="item.to"
                  :aria-current="item.isCurrent ? 'page' : undefined" @click="emit('close')">
                  <ItemMedia variant="icon" class="navigation-item-icon text-primary">
                    <component :is="resolveIcon(item.icon)" aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{{ t(item.label) }}</ItemTitle>
                  </ItemContent>
                </NuxtLink>
              </Item>
            </ItemGroup>
          </section>
        </nav>
      </ScrollArea>

      <ItemGroup v-if="navigation.externals.length" class="shrink-0 border-t border-border pt-4">
        <Item v-for="item in navigation.externals" :key="`${item.label}-${item.animationIndex}`" size="sm"
          class="navigation-item rounded-xl p-0" :style="{ '--item-delay': itemDelay(item.animationIndex) }">
          <NuxtLink class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-muted
            hover:bg-muted/20 hover:text-primary" :to="String(item.to)" target="_blank" rel="noopener noreferrer"
            @click="emit('close')">
            <ItemMedia variant="icon" class="navigation-item-icon text-primary">
              <component :is="resolveIcon(item.icon)" aria-hidden="true" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{{ t(item.label) }}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Open16Regular class="h-4 w-4 opacity-60" aria-hidden="true" />
            </ItemActions>
          </NuxtLink>
        </Item>
      </ItemGroup>
    </SheetContent>
  </Sheet>
</template>

<style scoped>
.navigation-item {
  animation: navigation-item-in 520ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
  animation-delay: var(--item-delay);
}

@keyframes navigation-item-in {
  from {
    opacity: 0;
    transform: translateX(1.5rem);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.navigation-scroll-area {
  scrollbar-width: thin;
  scrollbar-color: var(--app-muted) transparent;
}

.navigation-item-current {
  background: color-mix(in srgb, var(--app-primary) 10%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--app-primary) 30%, transparent);
}

.navigation-item-icon {
  border-color: color-mix(in srgb, var(--app-border) 70%, transparent);
  border-radius: 0.45rem;
  background: transparent;
  box-shadow: 0 1px 2px color-mix(in srgb, var(--app-foreground) 8%, transparent);
}

@media (prefers-reduced-motion: reduce) {
  .navigation-item {
    animation: none;
  }
}
</style>
