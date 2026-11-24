<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { CheckmarkCircle20Regular, DismissCircle20Regular, Dismiss20Regular, Info20Regular, SpinnerIos20Regular, Warning20Regular } from "@ntkrnl64/fluentui-vue-icons"
import { cn } from "cn"
import { Toaster as Sonner } from "vue-sonner"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner :class="cn('toaster group', props.class)" :style="{
    '--normal-bg': 'var(--popover)',
    '--normal-text': 'var(--popover-foreground)',
    '--normal-border': 'var(--border)',
    '--border-radius': 'var(--radius)',
  }" v-bind="props">
    <template #success-icon>
      <CheckmarkCircle20Regular class="size-4" />
    </template>
    <template #info-icon>
      <Info20Regular class="size-4" />
    </template>
    <template #warning-icon>
      <Warning20Regular class="size-4" />
    </template>
    <template #error-icon>
      <DismissCircle20Regular class="size-4" />
    </template>
    <template #loading-icon>
      <div>
        <SpinnerIos20Regular class="size-4 animate-spin" />
      </div>
    </template>
    <template #close-icon>
      <Dismiss20Regular class="size-4" />
    </template>
  </Sonner>
</template>
