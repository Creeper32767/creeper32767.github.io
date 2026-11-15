import { computed, toValue, type MaybeRef } from "vue";
import { useI18n } from "vue-i18n";

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

export function useSiteSeo(options: SiteSeoOptions = {}) {
  const route = useRoute();
  const { locale, t } = useI18n();
  const requestUrl = useRequestURL();

  const seoKey = computed(() => routeSeoKeys[route.path] ?? "default");
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

  useHead(() => {
    return {
      htmlAttrs: {
        lang: locale.value,
      },
      title: title.value,
      meta: [
        { name: "description", content: description.value },
        { name: "author", content: "Haley Herzog (Creeper32767)" },
        { property: "og:site_name", content: siteName.value },
        { property: "og:title", content: title.value },
        { property: "og:description", content: description.value },
        { property: "og:type", content: type.value },
        { property: "og:url", content: canonical.value },
        { property: "og:locale", content: locale.value },
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
      link: [{ rel: "canonical", href: canonical.value }],
    };
  });
}
