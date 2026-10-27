<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { RouteLocationRaw } from "vue-router";
import {
  ChevronDown20Regular,
  ChevronUp20Regular,
  Navigation16Filled,
} from "@ntkrnl64/fluentui-vue-icons";

export interface NavigationItem {
  label: string;
  to: RouteLocationRaw;
  external?: boolean;
  icon?: string;
  section?: string;
}

const props = withDefaults(
  defineProps<{
    items?: NavigationItem[];
  }>(),
  {
    items: () => [
      { label: "navigation.home", to: "/", icon: "home", section: "footer.sitemap" },
      { label: "footer.siteLinks.projects", to: "/projects", icon: "apps", section: "footer.sitemap" },
      { label: "footer.siteLinks.software", to: "/software-reco", icon: "apps", section: "footer.sitemap" },
      { label: "footer.siteLinks.portfolio", to: "/portfolio", icon: "book", section: "footer.sitemap" },
      { label: "footer.contentLinks.deeperIntro", to: "/deeper-intro", icon: "book", section: "footer.toolsAndContent" },
      { label: "footer.contentLinks.fursona", to: "/fursona", icon: "paw", section: "footer.toolsAndContent" },
      { label: "footer.contentLinks.editor", to: "/toolkit/editor", icon: "code", section: "footer.toolsAndContent" },
      { label: "footer.contentLinks.readerCard", to: "/toolkit/reader-card", icon: "book", section: "footer.toolsAndContent" },
      {
        label: "navigation.github",
        to: "https://github.com/Creeper32767",
        external: true,
        icon: "globe",
        section: "footer.sitemap",
      },
      {
        label: "navigation.followX",
        to: "https://x.com/ConsoleCreeper",
        external: true,
        icon: "globe",
        section: "footer.sitemap",
      },
    ],
  },
);

const { t } = useI18n();
const navigationItems = computed(() => props.items);
const isPanelOpen = ref(false);
const isSettingsPanelOpen = ref(false);
</script>

<template>
  <header class="h-24 max-sm:h-36">
    <nav
      class="fixed top-4 left-1/2 z-50 flex min-h-16 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 flex-col items-stretch gap-3 rounded-2xl border border-border/70 bg-background/80 px-5 py-3 shadow-lg shadow-slate-900/5 backdrop-blur-xl supports-backdrop-filter:bg-background/65 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-0">
      <div class="order-1 flex w-full items-center justify-between sm:contents">
        <slot name="brand">
          <NuxtLink class="flex items-center gap-3 text-foreground" to="/" aria-label="Creeper32767 home">
            <img src="/images/profile-photo.webp" alt="Creeper32767 Logo"
              class="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm" />
            <span class="text-lg font-bold tracking-tight">Creeper32767</span>
          </NuxtLink>
        </slot>
      </div>

      <div class="absolute top-3 right-5 flex items-center gap-1 sm:static sm:order-3">
        <div class="hidden items-center gap-1 sm:flex">
          <slot name="actions">
            <CommonLanguageSwitcher />
          </slot>
          <CommonThemeToggle />
        </div>
        <button class="rounded-lg p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary sm:hidden"
          type="button" :aria-label="t(isSettingsPanelOpen ? 'navigation.closeSettings' : 'navigation.openSettings')"
          :title="t(isSettingsPanelOpen ? 'navigation.closeSettings' : 'navigation.openSettings')"
          :aria-expanded="isSettingsPanelOpen" aria-controls="site-settings-panel"
          @click="isSettingsPanelOpen = !isSettingsPanelOpen">
          <ChevronUp20Regular v-if="isSettingsPanelOpen" class="h-5 w-5" aria-hidden="true" />
          <ChevronDown20Regular v-else class="h-5 w-5" aria-hidden="true" />
        </button>
        <button class="rounded-lg p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary" type="button"
          :aria-label="t(isPanelOpen ? 'navigation.closePanel' : 'navigation.openPanel')"
          :title="t(isPanelOpen ? 'navigation.closePanel' : 'navigation.openPanel')" :aria-expanded="isPanelOpen"
          aria-controls="site-navigation-panel" @click="isPanelOpen = !isPanelOpen">
          <Navigation16Filled class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      <div v-if="isSettingsPanelOpen" id="site-settings-panel"
        class="absolute top-full right-5 mt-2 flex flex-col gap-3 rounded-xl border border-border bg-background/95 p-3 shadow-lg backdrop-blur-xl sm:hidden"
        :aria-label="t('navigation.settingsPanelTitle')">
        <slot name="actions">
          <CommonLanguageSwitcher />
        </slot>
        <CommonThemeToggle />
      </div>
    </nav>
    <LayoutSiteNavigationPanel :items="navigationItems" :open="isPanelOpen" @close="isPanelOpen = false" />
  </header>
</template>
