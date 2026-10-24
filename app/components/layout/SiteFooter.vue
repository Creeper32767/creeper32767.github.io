<script setup lang="ts">
import { useI18n } from "vue-i18n";

withDefaults(
  defineProps<{
    year?: number;
  }>(),
  {
    year: new Date().getFullYear(),
  },
);

const { t } = useI18n();
</script>

<template>
  <footer class="mx-auto flex w-[calc(100%-2rem)] max-w-6xl flex-col gap-6 py-6 text-sm text-muted">
    <Separator />
    <div class="flex w-full items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
      <slot>
        <p>{{ t("footer.copyright", { year }) }}</p>
      </slot>
      <slot name="back-to-top">
        <Button as="button" variant="link" size="sm" href="/#home">{{
          t("footer.backToTop")
          }}</Button>
      </slot>
    </div>
  </footer>
</template>
