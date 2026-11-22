<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();

// @nuxtjs/i18n 的 prefix_except_default 策略会给非默认语言加前缀，
// 而 content 集合中的路径始终是无前缀的，这里先去掉当前语言前缀再查询
function stripLocalePrefix() {
  const path = route.path;
  if (locale.value === "zh-CN") return path;
  const prefix = `/${locale.value}`;
  if (path === prefix) return "/";
  if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length);
  return path;
}

const { data: page } = await useAsyncData("page-" + route.path, () => {
  return queryCollection("content").path(stripLocalePrefix()).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
