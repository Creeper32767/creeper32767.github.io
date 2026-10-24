<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  RouterLink,
  useRoute,
  useRouter,
  type RouteLocationRaw,
} from "vue-router";

export interface NavigationItem {
  label: string;
  to: RouteLocationRaw;
  external?: boolean;
}

const props = withDefaults(
  defineProps<{
    items?: NavigationItem[];
  }>(),
  {
    items: () => [
      { label: "navigation.home", to: "/" },
      { label: "navigation.about", to: { path: "/", hash: "#about" } },
      { label: "navigation.projects", to: { path: "/", hash: "#projects" } },
      {
        label: "navigation.github",
        to: "https://github.com/Creeper32767",
        external: true,
      },
    ],
  },
);

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const navigationItems = computed(() => props.items);

function isItemActive(item: NavigationItem) {
  if (item.external) {
    return false;
  }

  const target = router.resolve(item.to);
  return target.path === route.path && target.hash === route.hash;
}
</script>

<template>
  <header class="h-20 max-sm:h-32">
    <nav
      class="fixed top-4 z-50 left-1/2 -translate-x-1/2 flex min-h-17 w-[calc(100%-2rem)] max-w-[79.2rem] items-center justify-between gap-16 rounded-2xl border border-border/70 bg-background/75 px-5 shadow-lg shadow-slate-900/5 backdrop-blur-xl supports-backdrop-filter:bg-background/60 max-sm:flex-col max-sm:items-start max-sm:gap-3 max-sm:py-4"
      :aria-label="t('navigation.label')">
      <div class="flex items-center gap-3">
        <img src="/images/profile-photo.webp" alt="Creeper32767 Logo"
          class="h-10 w-10 rounded-full border-2 border-white object-cover" />
        <slot name="brand">
          <NuxtLink class="text-lg font-bold tracking-tight text-foreground" to="/" aria-label="Creeper32767 home">
            Creeper32767
          </NuxtLink>
        </slot>
      </div>

      <div class="flex items-center gap-1 max-sm:w-full max-sm:justify-between">
        <template v-for="item in navigationItems" :key="item.label">
          <Button v-if="item.external" as="a" variant="ghost" size="sm" class="text-muted" :href="item.to.toString()"
            target="_blank" rel="noopener noreferrer">
            {{ t(item.label) }}
          </Button>
          <Button v-else as="button" variant="ghost" size="sm" :class="isItemActive(item) ? 'bg-primary/10 text-primary' : 'text-muted'
            ">
            <NuxtLink :to="item.to">
              {{ t(item.label) }}
            </NuxtLink>
          </Button>
        </template>
        <slot name="actions">
          <CommonLanguageSwitcher />
        </slot>
        <CommonThemeToggle />
      </div>
    </nav>
  </header>
</template>
