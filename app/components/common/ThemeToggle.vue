<script setup lang="ts">
import { computed } from 'vue'
import {
  Desktop24Regular,
  WeatherMoon24Filled,
  WeatherSunny24Filled,
} from '@ntkrnl64/fluentui-vue-icons'

const { t } = useI18n()
const colorMode = useColorMode()

// 循环顺序：浅色 -> 深色 -> 跟随系统
const modeCycle = ['light', 'dark', 'system'] as const
type Mode = (typeof modeCycle)[number]

const currentMode = computed<Mode>(() =>
  modeCycle.find((mode) => mode === colorMode.preference) ?? 'system',
)
const nextMode = computed<Mode>(
  () => modeCycle[(modeCycle.indexOf(currentMode.value) + 1) % modeCycle.length]!,
)
const switchLabel = computed(() => t('theme.switchTo', { mode: t(`theme.${nextMode.value}`) }))

function changeTheme() {
  colorMode.preference = nextMode.value
}
</script>

<template>
  <Button variant="ghost" size="icon" :aria-label="switchLabel" :title="switchLabel" @click="changeTheme">
    <WeatherSunny24Filled v-if="currentMode === 'light'" aria-hidden="true" />
    <WeatherMoon24Filled v-else-if="currentMode === 'dark'" aria-hidden="true" />
    <Desktop24Regular v-else aria-hidden="true" />
  </Button>
</template>
