<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  AnimalPawPrint16Filled,
  Apps16Filled,
  BookOpen16Filled,
  Code16Filled,
  Dismiss24Filled,
  Globe16Filled,
  Home16Filled,
  Navigation16Filled,
  Open16Regular,
  Person16Filled,
} from "@ntkrnl64/fluentui-vue-icons";
import type { NavigationItem } from "./SiteHeader.vue";

const props = defineProps<{
  items: NavigationItem[];
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const { t } = useI18n();
const groupedItems = computed(() => {
  const groups = new Map<string, NavigationItem[]>();
  for (const item of props.items.filter((item) => !item.external)) {
    const section = item.section || "navigation.panelTitle";
    const group = groups.get(section) || [];
    group.push(item);
    groups.set(section, group);
  }
  return Array.from(groups, ([title, items]) => ({ title, items }));
});
const externalItems = computed(() => props.items.filter((item) => item.external));
const iconMap: Record<string, typeof Home16Filled> = {
  home: Home16Filled,
  person: Person16Filled,
  apps: Apps16Filled,
  book: BookOpen16Filled,
  paw: AnimalPawPrint16Filled,
  code: Code16Filled,
  globe: Globe16Filled,
};
</script>

<template>
  <Transition name="navigation-panel">
    <div v-if="open" id="site-navigation-panel" class="fixed inset-0 z-50" @click.self="emit('close')">
      <div class="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" aria-hidden="true" @click="emit('close')" />
      <aside
        class="absolute top-0 right-0 flex h-screen w-3/4 flex-col border-l border-border bg-background/95 p-5 shadow-2xl backdrop-blur-xl sm:w-1/4"
        role="dialog" aria-modal="true" :aria-label="t('navigation.panelTitle')" @click.stop>
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div class="flex items-center gap-2 text-sm font-semibold">
            <Navigation16Filled class="h-4 w-4 text-primary" aria-hidden="true" />
            {{ t("navigation.panelTitle") }}
          </div>
          <button class="rounded-lg p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary"
            type="button" :aria-label="t('navigation.closePanel')" :title="t('navigation.closePanel')"
            @click="emit('close')">
            <Dismiss24Filled class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav class="mt-5 flex flex-col gap-6" :aria-label="t('navigation.panelTitle')">
          <section v-for="group in groupedItems" :key="group.title">
            <h2 class="mb-2 px-4 text-base font-semibold tracking-wide text-foreground">
              {{ t(group.title) }}
            </h2>
            <div class="flex flex-col gap-1">
              <NuxtLink v-for="(item, index) in group.items" :key="item.label"
                class="navigation-item flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                :style="{ '--item-delay': `${index * 70}ms` }" :to="item.to" @click="emit('close')">
                <component :is="iconMap[item.icon || 'globe']" class="h-5 w-5 shrink-0 text-primary"
                  aria-hidden="true" />
                <span>{{ t(item.label) }}</span>
              </NuxtLink>
            </div>
          </section>
        </nav>
        <div v-if="externalItems.length" class="mt-auto pt-25">
          <div class="border-t border-border pt-4">
            <div class="flex w-full flex-col gap-1">
              <template v-for="(item, index) in externalItems" :key="item.label">
                <a class="navigation-item flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                  :style="{ '--item-delay': `${index * 70}ms` }" :href="item.to.toString()" target="_blank"
                  rel="noopener noreferrer" @click="emit('close')">
                  <component :is="iconMap[item.icon || 'globe']" class="h-5 w-5 shrink-0 text-primary"
                    aria-hidden="true" />
                  <span>{{ t(item.label) }}</span>
                  <Open16Regular class="ml-auto h-4 w-4 opacity-60" aria-hidden="true" />
                </a>
              </template>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </Transition>
</template>

<style scoped>
.navigation-panel-enter-active,
.navigation-panel-leave-active {
  transition: opacity 180ms ease;
}

.navigation-panel-enter-from,
.navigation-panel-leave-to {
  opacity: 0;
}

.navigation-item {
  animation: navigation-item-in 360ms cubic-bezier(.2, .75, .25, 1) both;
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

@media (prefers-reduced-motion: reduce) {
  .navigation-item {
    animation: none;
  }
}
</style>