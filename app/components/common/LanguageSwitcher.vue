<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { supportedLocales, type SupportedLocale } from "~/composables/i18n";

const { locale, t } = useI18n();
const localeCookie = useCookie<SupportedLocale>("locale");

function changeLocale(nextLocale: SupportedLocale) {
  localeCookie.value = nextLocale;
  locale.value = nextLocale;
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
        <SelectItem v-for="supportedLocale in supportedLocales" :key="supportedLocale" :value="supportedLocale">
          {{ t(`language.${supportedLocale}`) }}
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
