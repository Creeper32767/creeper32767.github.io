<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { RouteLocationRaw } from "vue-router";
import {
  Settings20Regular,
  Navigation20Filled,
  Search20Regular,
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
      { label: "footer.siteLinks.deeperIntro", to: "/deeper-intro", icon: "book", section: "footer.sitemap" },
      { label: "footer.siteLinks.fursona", to: "/fursona", icon: "paw", section: "footer.sitemap" },
      { label: "footer.siteLinks.projects", to: "/projects", icon: "apps", section: "footer.sitemap" },
      { label: "footer.siteLinks.software", to: "/software-picks", icon: "apps", section: "footer.sitemap" },
      { label: "footer.siteLinks.portfolio", to: "/portfolio", icon: "book", section: "footer.sitemap" },
      { label: "footer.contentLinks.editor", to: "/projects/editor", icon: "code", section: "footer.toolsAndContent" },
      { label: "footer.contentLinks.readerCard", to: "/projects/reader-card", icon: "book", section: "footer.toolsAndContent" },
      { label: "footer.contentLinks.captureScreen", to: "/projects/capture-screen", icon: "apps", section: "footer.toolsAndContent" },
      { label: "footer.contentLinks.colorConverter", to: "/projects/color-conventor", icon: "apps", section: "footer.toolsAndContent" },
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
const localePath = useLocalePath();
const colorMode = useColorMode();
// <NuxtLink> 不会自动处理 i18n 语言前缀，非外部链接统一通过 localePath 本地化
const navigationItems = computed(() =>
  props.items.map((item) =>
    item.external ? item : { ...item, to: localePath(item.to) },
  ),
);
const isPanelOpen = ref(false);
const isSettingsPanelOpen = ref(false);
const themeModes = ["light", "dark", "system"] as const;
const currentThemeLabel = computed(() => {
  const preference = themeModes.find((mode) => mode === colorMode.preference) ?? "system";
  return t(`theme.${preference}`);
});
// 移动端设置面板改用 Popover 组件：焦点圈定、Esc 关闭与点击外部关闭均由组件内置处理
// 站内搜索（Command 面板）：Ctrl / ⌘ + K 全局快捷键唤起
const isCommandOpen = ref(false);

const commandGroups = computed(() => {
  const groups = new Map<string, NavigationItem[]>();
  for (const item of navigationItems.value) {
    const section = item.section ?? "navigation.panelTitle";
    const group = groups.get(section) ?? [];
    group.push(item);
    groups.set(section, group);
  }
  return Array.from(groups, ([title, items]) => ({ title, items }));
});

function runNavigationItem(item: NavigationItem) {
  isCommandOpen.value = false;
  if (item.external) {
    window.open(String(item.to), "_blank", "noopener");
    return;
  }
  void navigateTo(item.to);
}

function onGlobalKeydown(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    isCommandOpen.value = !isCommandOpen.value;
  }
}

onMounted(() => window.addEventListener("keydown", onGlobalKeydown));

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onGlobalKeydown);
});
</script>

<template>
  <header class="h-24 max-sm:h-36" data-transition-static>
    <nav
      class="fixed top-4 left-1/2 z-50 flex min-h-16 w-[calc(100%-2rem)] sm:max-w-4/5 -translate-x-1/2 flex-col items-stretch gap-3 rounded-2xl border border-border/70 bg-background/80 px-5 py-3 shadow-lg shadow-slate-900/5 backdrop-blur-xl supports-backdrop-filter:bg-background/65 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-0">
      <div class="order-1 flex w-full items-center justify-between sm:contents">
        <slot name="brand">
          <NuxtLink class="flex items-center gap-3 text-foreground" :to="localePath('/')"
            aria-label="Creeper32767 home">
            <Avatar class="size-10 border-2 border-white shadow-sm">
              <AvatarImage as-child src="/images/haley-avatar.webp">
                <NuxtImg preload src="/images/haley-avatar.webp" alt="Creeper32767 Logo" width="96" height="96"
                  preset="avatar" class="aspect-square size-full object-cover" />
              </AvatarImage>
              <AvatarFallback class="bg-primary/10 text-sm font-semibold text-primary">H</AvatarFallback>
            </Avatar>
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
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="ghost" size="icon" type="button" :aria-label="t('navigation.searchLabel')"
                @click="isCommandOpen = true">
                <Search20Regular class="size-5" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{{ t("navigation.searchLabel") }} (Ctrl K)</TooltipContent>
          </Tooltip>
        </div>
        <Popover v-model:open="isSettingsPanelOpen">
          <PopoverTrigger as-child>
            <Button variant="ghost" size="icon" type="button"
              class="text-muted hover:bg-primary/10 hover:text-primary sm:hidden"
              :aria-label="t(isSettingsPanelOpen ? 'navigation.closeSettings' : 'navigation.openSettings')"
              :title="t(isSettingsPanelOpen ? 'navigation.closeSettings' : 'navigation.openSettings')">
              <span class="block transition-transform duration-250" :class="{ 'rotate-180': isSettingsPanelOpen }">
                <Settings20Regular class="size-5" aria-hidden="true" />
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent id="site-settings-panel" align="end" side="bottom" class="w-64"
            :aria-label="t('navigation.settingsPanelTitle')">
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between gap-6">
                <span class="text-sm text-muted">{{ t("language.label") }}</span>
                <slot name="actions">
                  <CommonLanguageSwitcher />
                </slot>
              </div>
              <div class="flex items-center justify-between gap-6">
                <span class="text-sm text-muted">{{ t("theme.label") }}</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-muted">{{ currentThemeLabel }}</span>
                  <CommonThemeToggle />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button variant="ghost" size="icon" type="button"
              :aria-label="t(isPanelOpen ? 'navigation.closePanel' : 'navigation.openPanel')"
              :aria-expanded="isPanelOpen" aria-controls="site-navigation-panel" @click="isPanelOpen = !isPanelOpen">
              <Navigation20Filled class="size-5" aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{{ t(isPanelOpen ? "navigation.closePanel" : "navigation.openPanel") }}</TooltipContent>
        </Tooltip>
      </div>
    </nav>
    <LayoutSiteNavigationPanel :items="navigationItems" :open="isPanelOpen" @close="isPanelOpen = false" />

    <!-- 站内搜索（Ctrl / ⌘ + K） -->
    <CommandDialog v-model:open="isCommandOpen" :title="t('navigation.searchLabel')"
      :description="t('navigation.searchPlaceholder')">
      <CommandInput :placeholder="t('navigation.searchPlaceholder')" />
      <CommandList>
        <CommandEmpty>{{ t("navigation.searchEmpty") }}</CommandEmpty>
        <CommandGroup v-for="group in commandGroups" :key="group.title" :heading="t(group.title)">
          <CommandItem v-for="item in group.items" :key="`${item.section}-${item.label}`" :value="t(item.label)"
            @select="runNavigationItem(item)">
            {{ t(item.label) }}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </header>
</template>
