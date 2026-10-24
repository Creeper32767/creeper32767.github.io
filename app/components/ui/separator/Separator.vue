<script setup lang="ts">
import { Separator as RekaSeparator } from 'reka-ui'
import { cn } from '~/composables/lib/utils'

withDefaults(
  defineProps<{
    class?: string
    orientation?: 'horizontal' | 'vertical'
  }>(),
  {
    orientation: 'horizontal',
  },
)
</script>

<template>
  <RekaSeparator :orientation="orientation" :class="cn(
    'shrink-0 bg-border',
    orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
    $props.class,
  )
    " v-bind="$attrs" />
</template>
