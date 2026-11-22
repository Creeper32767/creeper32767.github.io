import { computed, toValue, type MaybeRef } from "vue";

const routeSeoKeys: Record<string, string> = {
  "/": "home",
  "/deeper-intro": "deeperIntro",
  "/fursona": "fursona",
  "/portfolio": "portfolio",
  "/projects": "projects",
  "/software-picks": "software",
  "/projects/capture-screen": "captureScreen",
  "/projects/color-conventor": "colorConverter",
  "/projects/editor": "editor",
  "/projects/reader-card": "readerCard",
};

interface SiteSeoOptions {
  title?: MaybeRef<string>;
  description?: MaybeRef<string>;
  type?: MaybeRef<string>;
  image?: MaybeRef<string | undefined>;
}

/**
 * `@nuxtjs/i18n` 采用 `prefix_except_default` 策略时，非默认语言的路径会带前缀（如 /en/projects）
 * 这里把当前语言前缀去掉后再按路径查找 SEO key
 */
function stripLocalePrefix(path: string, locale: string): string {
  const prefix = `/${locale}`;
  if (path === prefix) return "/";
  if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length);
  return path;
}

export function useSiteSeo(options: SiteSeoOptions = {}) {
  const route = useRoute();
  const { locale, t } = useI18n();
  const requestUrl = useRequestURL();

  const seoKey = computed(
    () =>
      routeSeoKeys[stripLocalePrefix(route.path, locale.value)] ?? "default",
  );
  const title = computed(
    () => toValue(options.title) ?? t(`seo.${seoKey.value}.title`),
  );

  const description = computed(
    () => toValue(options.description) ?? t(`seo.${seoKey.value}.description`),
  );

  const type = computed(() => toValue(options.type) ?? "website");
  const image = computed(() => toValue(options.image));
  const siteName = computed(() => t("seo.siteName"));
  const canonical = computed(() =>
    new URL(route.fullPath, requestUrl.origin).toString(),
  );

  // html lang / canonical / hreflang / og:locale 由 useLocaleHead 统一输出，这里不再重复设置
  useHead(() => {
    return {
      title: title.value,
      meta: [
        { name: "description", content: description.value },
        { name: "author", content: "Haley Herzog (Creeper32767)" },
        { property: "og:site_name", content: siteName.value },
        { property: "og:title", content: title.value },
        { property: "og:description", content: description.value },
        { property: "og:type", content: type.value },
        { property: "og:url", content: canonical.value },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title.value },
        { name: "twitter:description", content: description.value },
        ...(image.value
          ? [
              { property: "og:image", content: image.value },
              { name: "twitter:image", content: image.value },
            ]
          : []),
      ],
    };
  });
}
