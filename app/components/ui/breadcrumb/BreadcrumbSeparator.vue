<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { ChevronRight20Regular } from "@ntkrnl64/fluentui-vue-icons"
import { cn } from "cn"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true"
    :class="cn('[&>svg]:size-3.5', props.class)">
    <slot>
      <ChevronRight20Regular />
    </slot>
  </li>
</template>
