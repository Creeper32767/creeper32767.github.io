<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  type Component,
} from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
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

const panelRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const panelTitleId = "site-navigation-panel-title";

let previouslyFocused: HTMLElement | null = null;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";
let scrollLocked = false;

function isCurrentItem(item: NavigationItem) {
  if (typeof item.to === "string") {
    return route.path === item.to;
  }

  return (
    item.to.path === route.path &&
    (!item.to.hash || item.to.hash === route.hash)
  );
}

function setBodyScrollLock(locked: boolean) {
  if (typeof document === "undefined" || locked === scrollLocked) {
    return;
  }

  scrollLocked = locked;
  const body = document.body;

  if (locked) {
    previousBodyOverflow = body.style.overflow;
    previousBodyPaddingRight = body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      const currentPadding =
        parseFloat(getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
  } else {
    body.style.overflow = previousBodyOverflow;
    body.style.paddingRight = previousBodyPaddingRight;
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");
    return;
  }

  if (event.key !== "Tab" || !panelRef.value) {
    return;
  }

  const focusable = panelRef.value.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
  );
  if (!focusable.length) {
    return;
  }

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (!first || !last) {
    return;
  }

  const active = document.activeElement;

  if (event.shiftKey) {
    if (active === first || !panelRef.value.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last || !panelRef.value.contains(active)) {
    event.preventDefault();
    first.focus();
  }
}

watch(
  () => props.open,
  async (open) => {
    setBodyScrollLock(open);

    if (typeof document === "undefined") {
      return;
    }

    if (open) {
      previouslyFocused = document.activeElement as HTMLElement | null;
      document.addEventListener("keydown", onKeydown);
      await nextTick();
      closeButtonRef.value?.focus();
    } else {
      document.removeEventListener("keydown", onKeydown);
      if (previouslyFocused) {
        previouslyFocused.focus();
        previouslyFocused = null;
      }
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (typeof document === "undefined") {
    return;
  }

  document.removeEventListener("keydown", onKeydown);
  setBodyScrollLock(false);

  if (previouslyFocused) {
    previouslyFocused.focus();
    previouslyFocused = null;
  }
});

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
  return `${Math.min(450 + index * 100, 1150)}ms`;
}
</script>

<template>
  <Transition name="navigation-panel">
    <div v-if="open" id="site-navigation-panel" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-slate-950/20 backdrop-blur-sm" aria-hidden="true" @click="emit('close')" />
      <aside ref="panelRef"
        class="absolute top-0 right-0 flex h-dvh w-3/4 max-w-md flex-col overflow-hidden border-l border-border bg-background/95 p-5 shadow-2xl backdrop-blur-xl sm:w-1/4"
        role="dialog" aria-modal="true" :aria-labelledby="panelTitleId">
        <div class="flex items-center justify-between border-b border-border pb-3">
          <div :id="panelTitleId" class="flex items-center gap-2 text-sm font-semibold">
            <Navigation16Filled class="h-4 w-4 text-primary" aria-hidden="true" />
            {{ t("navigation.panelTitle") }}
          </div>
          <button ref="closeButtonRef"
            class="rounded-lg p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary" type="button"
            :aria-label="t('navigation.closePanel')" :title="t('navigation.closePanel')" @click="emit('close')">
            <Dismiss24Filled class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div
          class="navigation-scroll-area min-h-0 flex-1 overflow-x-hidden overflow-y-scroll overscroll-contain pr-1 touch-pan-y"
          tabindex="0" @wheel.stop @touchmove.stop>
          <nav class="mt-5 flex flex-col gap-6 pb-[20vh]" :aria-label="t('navigation.panelTitle')">
            <section v-for="group in navigation.groups" :key="group.title">
              <h2 class="mb-2 px-4 text-base font-semibold tracking-wide text-foreground">
                {{ t(group.title) }}
              </h2>
              <div class="flex flex-col gap-1">
                <NuxtLink v-for="item in group.items" :key="`${item.label}-${item.animationIndex}`"
                  class="navigation-item flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                  :class="{
                    'navigation-item-current bg-primary/10 font-semibold text-primary':
                      item.isCurrent,
                  }" :style="{ '--item-delay': itemDelay(item.animationIndex) }" :to="item.to"
                  :aria-current="item.isCurrent ? 'page' : undefined" @click="emit('close')">
                  <component :is="resolveIcon(item.icon)" class="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{{ t(item.label) }}</span>
                </NuxtLink>
              </div>
            </section>
          </nav>
        </div>

        <div v-if="navigation.externals.length" class="shrink-0 border-t border-border pt-4">
          <div class="flex w-full flex-col gap-1">
            <a v-for="item in navigation.externals" :key="`${item.label}-${item.animationIndex}`"
              class="navigation-item flex w-full items-center gap-3 whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-primary/10 hover:text-primary"
              :style="{ '--item-delay': itemDelay(item.animationIndex) }" :href="String(item.to)" target="_blank"
              rel="noopener noreferrer" @click="emit('close')">
              <component :is="resolveIcon(item.icon)" class="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>{{ t(item.label) }}</span>
              <Open16Regular class="ml-auto h-4 w-4 opacity-60" aria-hidden="true" />
            </a>
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

.navigation-panel-leave-active {
  transition-duration: 420ms;
}

.navigation-panel-enter-active aside,
.navigation-panel-leave-active aside {
  transition: transform 420ms cubic-bezier(0.2, 0.75, 0.25, 1);
}

.navigation-panel-enter-from,
.navigation-panel-leave-to {
  opacity: 0;
}

.navigation-panel-enter-from aside,
.navigation-panel-leave-to aside {
  transform: translateX(100%);
}

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

.navigation-scroll-area::-webkit-scrollbar {
  width: 0.4rem;
}

.navigation-scroll-area::-webkit-scrollbar-thumb {
  background-color: var(--app-muted);
  border-radius: 9999px;
}

.navigation-scroll-area:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--app-primary) 60%, transparent);
  outline-offset: -2px;
  border-radius: 0.75rem;
}

.navigation-item-current {
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--app-primary) 35%, transparent);
}

@media (prefers-reduced-motion: reduce) {

  .navigation-panel-enter-active,
  .navigation-panel-leave-active,
  .navigation-panel-enter-active aside,
  .navigation-panel-leave-active aside {
    transition: none;
  }

  .navigation-item {
    animation: none;
  }
}
</style>