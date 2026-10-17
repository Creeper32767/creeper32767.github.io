<script setup lang="ts">
import { SelectItem as RekaSelectItem, SelectItemIndicator, SelectItemText } from 'reka-ui'
import { cn } from '@/components/lib/utils'

const props = defineProps<{
  class?: string
  value: string
  disabled?: boolean
  textValue?: string
}>()
</script>

<template>
  <RekaSelectItem :class="cn(
    'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-blue-50 focus:text-blue-700 data-disabled:pointer-events-none data-disabled:opacity-50',
    $props.class,
  )
    " :value="props.value" :disabled="props.disabled" :text-value="props.textValue" v-bind="$attrs">
    <span class="absolute left-2 flex size-4 items-center justify-center">
      <SelectItemIndicator>
        <span class="text-xs" aria-hidden="true">✓</span>
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </RekaSelectItem>
</template>
