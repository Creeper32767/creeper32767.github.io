<script setup lang="ts">
useSiteSeo();
// @nuxtjs/i18n 的 useLocaleHead 负责按当前语言写入 <html lang>、hreflang 备用链接、canonical 与 og:locale
useHead(useLocaleHead());

// 切换主题时给 <html> 短暂添加 theme-transition 类，让颜色变化有平滑过渡动画
const colorMode = useColorMode();
const themeTransitionDuration = 250;
let themeTransitionTimeout: number | undefined;

watch(
  () => colorMode.value,
  () => {
    if (!import.meta.client) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("theme-transition");

    if (themeTransitionTimeout) {
      clearTimeout(themeTransitionTimeout);
    }

    themeTransitionTimeout = window.setTimeout(() => {
      root.classList.remove("theme-transition");
      themeTransitionTimeout = undefined;
    }, themeTransitionDuration);
  },
);
</script>

<template>
  <NuxtRouteAnnouncer />
  <LayoutDefault>
    <NuxtPage />
  </LayoutDefault>
</template>