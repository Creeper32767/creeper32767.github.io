<script setup lang="ts">
import { SelectValue as RekaSelectValue } from 'reka-ui'
</script>

<template>
  <RekaSelectValue v-bind="$attrs">
    <slot />
  </RekaSelectValue>
</template>
