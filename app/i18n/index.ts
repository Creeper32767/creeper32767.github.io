import { createI18n } from "vue-i18n";
import en from "./locales/en.json";
import jp from "./locales/jp.json";
import zhCN from "./locales/zh-CN.json";
import zhTW from "./locales/zh-TW.json";

export const supportedLocales = ["en", "zh-CN", "zh-TW", "jp"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const messages = {
  en,
  jp,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export const i18n = createI18n({
  legacy: false,
  locale: "zh-CN",
  fallbackLocale: "zh-CN",
  messages,
});
