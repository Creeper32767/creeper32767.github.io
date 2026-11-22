<script setup lang="ts">
useSiteSeo();
// @nuxtjs/i18n 的 useLocaleHead 负责按当前语言写入 <html lang>、hreflang 备用链接、canonical 与 og:locale
useHead(useLocaleHead());
</script>

<template>
  <NuxtRouteAnnouncer />
  <LayoutDefault>
    <NuxtPage />
  </LayoutDefault>
</template>