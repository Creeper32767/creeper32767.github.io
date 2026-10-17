<script setup lang="ts">
import { SelectIcon, SelectTrigger as RekaSelectTrigger } from 'reka-ui'
import { cn } from '@/components/lib/utils'

defineProps<{ class?: string }>()
</script>

<template>
  <RekaSelectTrigger :class="cn(
    'flex h-9 items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50',
    $props.class,
  )
    " v-bind="$attrs">
    <slot />
    <SelectIcon as-child>
      <span class="text-xs opacity-50" aria-hidden="true">⌄</span>
    </SelectIcon>
  </RekaSelectTrigger>
</template>
