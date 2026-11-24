<script setup lang="ts">
import type { ProgressRootProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { cn } from "cn"
import { ProgressIndicator, ProgressRoot } from "reka-ui"

const props = withDefaults(
  defineProps<ProgressRootProps & { class?: HTMLAttributes["class"] }>(),
  {
    modelValue: 0,
  },
)

const delegatedProps = reactiveOmit(props, "class")

const normalizedModelValue = computed(() => {
  if (typeof delegatedProps.modelValue === "number")
    return Math.min(100, Math.max(0, delegatedProps.modelValue))
  return delegatedProps.modelValue
})
</script>

<template>
  <ProgressRoot data-slot="progress" v-bind="delegatedProps" :class="cn(
    'bg-muted relative h-2 w-full overflow-hidden rounded-full',
    props.class,
  )">
    <ProgressIndicator data-slot="progress-indicator"
      :class="cn('bg-primary h-full w-full flex-1 transition-all', props.class)"
      :style="`transform: translateX(-${100 - (normalizedModelValue ?? 0)}%);`" />
  </ProgressRoot>
</template>
