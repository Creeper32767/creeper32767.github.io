<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { MoreHorizontal20Regular } from "@ntkrnl64/fluentui-vue-icons"
import { cn } from "cn"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true"
    :class="cn('flex size-9 items-center justify-center', props.class)">
    <slot>
      <MoreHorizontal20Regular class="size-4" />
    </slot>
    <span class="sr-only">More</span>
  </span>
</template>
