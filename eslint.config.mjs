// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  {
    rules: {
      // shadcn-vue 组件普遍使用类型化 props（defineProps<T>()），不适用运行时默认值要求
      "vue/require-default-prop": "off",
      // 代码库习惯把短标签的多个属性写在同一行
      "vue/first-attribute-linebreak": "off",
      // 中文文案中的全角空格（U+3000）是合法排版字符，允许出现在字符串/模板字符串中
      "no-irregular-whitespace": ["error", { skipStrings: true, skipTemplates: true }],
    },
  },
);
