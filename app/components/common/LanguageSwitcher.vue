<script setup lang="ts">

const { locale, locales, t } = useI18n();
const switchLocalePath = useSwitchLocalePath();

type SupportedLocale = "zh-CN" | "en" | "ja" | "zh-TW";

function changeLocale(nextLocale: SupportedLocale) {
  const path = switchLocalePath(nextLocale);
  if (path) void navigateTo(path, { redirectCode: 302 });
}
</script>

<template>
  <div class="inline-flex items-center gap-2 text-sm text-muted">
    <span class="sr-only">{{ t("language.label") }}</span>
    <Select :model-value="locale" @update:model-value="changeLocale($event as SupportedLocale)">
      <SelectTrigger :aria-label="t('language.label')" class="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="localeOption in locales" :key="localeOption.code" :value="localeOption.code">
          {{ localeOption.name ?? localeOption.code }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
