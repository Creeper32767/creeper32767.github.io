<script setup lang="ts">
import { SelectContent as RekaSelectContent, SelectPortal, SelectViewport } from 'reka-ui'
import { cn } from '~/composables/lib/utils'

defineProps<{ class?: string }>()
</script>

<template>
  <SelectPortal>
    <RekaSelectContent :class="cn(
      'relative z-50 min-w-32 overflow-hidden rounded-md border border-border bg-background text-foreground shadow-md',
      $props.class,
    )
      " position="popper" v-bind="$attrs">
      <SelectViewport class="p-1">
        <slot />
      </SelectViewport>
    </RekaSelectContent>
  </SelectPortal>
</template>
