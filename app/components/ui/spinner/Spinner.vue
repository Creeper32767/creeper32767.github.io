<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { SpinnerIos20Regular } from "@ntkrnl64/fluentui-vue-icons"
import { cn } from "cn"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <SpinnerIos20Regular role="status" aria-label="Loading" :class="cn('size-4 animate-spin', props.class)" />
</template>
