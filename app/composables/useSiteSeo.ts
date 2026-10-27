import { computed } from "vue";
import { useI18n } from "vue-i18n";

const routeSeoKeys: Record<string, string> = {
  "/": "home",
  "/deeper-intro": "deeperIntro",
  "/fursona": "fursona",
  "/portfolio": "portfolio",
  "/projects": "projects",
  "/software-picks": "software",
  "/toolkit/capture-screen": "captureScreen",
  "/toolkit/color-conventor": "colorConverter",
  "/toolkit/editor": "editor",
  "/toolkit/reader-card": "readerCard",
};

export function useSiteSeo() {
  const route = useRoute();
  const { locale, t } = useI18n();

  const seoKey = computed(() => routeSeoKeys[route.path] ?? "default");
  const title = computed(() => t(`seo.${seoKey.value}.title`));
  const description = computed(() => t(`seo.${seoKey.value}.description`));
  const siteName = computed(() => t("seo.siteName"));

  useHead(() => {
    const canonical =
      typeof window === "undefined"
        ? undefined
        : new URL(route.fullPath, window.location.origin).toString();

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
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:title", content: title.value },
        { name: "twitter:description", content: description.value },
      ],
      ...(canonical
        ? { link: [{ rel: "canonical", href: canonical }] }
        : {}),
    };
  });
}
