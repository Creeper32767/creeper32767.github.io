<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { WeatherMoon24Filled, WeatherSunny24Filled } from '@ntkrnl64/fluentui-vue-icons'
import { Button } from '@/components/components/ui/button'
import { theme, toggleTheme, type Theme } from '@/components/theme'

const { t } = useI18n()
const isDark = computed(() => theme.value === 'dark')
const themeCookie = useCookie<Theme>('theme')

function changeTheme() {
  toggleTheme()
  themeCookie.value = theme.value
}
</script>

<template>
  <Button variant="ghost" size="icon" :aria-label="isDark ? t('theme.switchToLight') : t('theme.switchToDark')"
    :title="isDark ? t('theme.switchToLight') : t('theme.switchToDark')" @click="changeTheme">
    <WeatherSunny24Filled v-if="isDark" aria-hidden="true" />
    <WeatherMoon24Filled v-else aria-hidden="true" />
  </Button>
</template>
