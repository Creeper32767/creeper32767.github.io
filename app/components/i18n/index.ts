import { createI18n } from 'vue-i18n'

export const supportedLocales = ['en', 'zh-CN'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

const messages = {
  en: {
    navigation: {
      home: 'Home',
      about: 'About',
      projects: 'Projects',
      github: 'GitHub',
      label: 'Main navigation',
    },
    home: {
      eyebrow: 'Welcome',
      title: 'You did it!',
      description: 'Visit {link} to read the documentation.',
    },
    footer: {
      copyright: '© {year} Creeper32767. Built with Vue.',
      backToTop: 'Back to top',
    },
    notFound: {
      title: 'Error: Page not found',
      message: 'You seem to have reached the edge of the world…',
      farewell: 'If we do not meet again, good morning, good afternoon, and good night.',
      home: 'Return home',
    },
    language: {
      label: 'Language',
      en: 'English',
      'zh-CN': '简体中文',
    },
    theme: {
      switchToLight: 'Switch to light theme',
      switchToDark: 'Switch to dark theme',
    },
  },
  'zh-CN': {
    navigation: {
      home: '首页',
      about: '关于',
      projects: '项目',
      github: 'GitHub',
      label: '主导航',
    },
    home: {
      eyebrow: '欢迎',
      title: '你做到了！',
      description: '访问 {link} 阅读文档。',
    },
    footer: {
      copyright: '© {year} Creeper32767。使用 Vue 构建。',
      backToTop: '返回顶部',
    },
    notFound: {
      title: '发生错误：页面未找到',
      message: '你似乎到达了世界的边缘……',
      farewell: '若无缘再见，便祝你早安，午安，夜夜好梦。',
      home: '返回主页',
    },
    language: {
      label: '语言',
      en: 'English',
      'zh-CN': '简体中文',
    },
    theme: {
      switchToLight: '切换到浅色主题',
      switchToDark: '切换到深色主题',
    },
  },
} as const

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
})
