<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const greetingKey = useState("home-greeting", () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "home.eyebrow.morning";
  if (hour >= 12 && hour < 18) return "home.eyebrow.afternoon";
  if (hour >= 18 && hour < 22) return "home.eyebrow.evening";
  return "home.eyebrow.night";
});

useSeoMeta({
  title: "关于我 - Haley",
  description: "Haley 的个人主页，了解他的项目、软件推荐和学习笔记。",
  ogTitle: "关于我 - Haley",
  ogDescription: "Haley 的个人主页，了解他的项目、软件推荐和学习笔记。",
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <LayoutSiteHeader />

    <main id="home" class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-12 sm:py-16">
      <header class="mb-12 flex flex-col items-center text-center">
        <img src="/images/profile-photo.webp" alt="Haley Avatar"
          class="mb-5 h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg" />
        <span class="mb-3 text-xs font-bold tracking-[0.04em] text-primary rounded bg-primary/10 p-2">{{ t(greetingKey)
        }}</span>
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">{{ t("home.title") }}</h1>
        <p class="mt-4 max-w-2xl text-lg text-muted">{{ t("home.bio") }}</p>
      </header>

      <section id="bio" class="rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:p-8">
        <h2 class="mb-4 text-2xl font-semibold">{{ t("navigation.about") }}</h2>
        <p class="leading-8 text-muted">{{ t("home.introduction") }}</p>
        <p class="mt-4 leading-8 text-muted">{{ t("home.introductionMore") }}</p>
      </section>

      <section id="tech-analysis" class="mt-14">
        <h2 class="mb-6 text-3xl font-bold">{{ t("home.technicalAnalysis") }}</h2>
        <div class="grid gap-6 md:grid-cols-2">
          <article class="rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur">
            <h3 class="text-xl font-semibold">{{ t("home.languagesTitle") }}</h3>
            <p class="mt-3 leading-7 text-muted">{{ t("home.languagesDescription") }}</p>
            <div class="mt-6 flex h-8 overflow-hidden rounded-full text-xs font-semibold text-white">
              <div class="flex w-[55%] items-center justify-center bg-blue-600">Python 55%</div>
              <div class="flex w-[20%] items-center justify-center bg-yellow-500">JS 20%</div>
              <div class="flex w-[25%] items-center justify-center bg-slate-500">Other 25%</div>
            </div>
          </article>
          <article class="rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur">
            <h3 class="text-xl font-semibold">{{ t("home.habitsTitle") }}</h3>
            <p class="mt-3 leading-7 text-muted">{{ t("home.habitsDescription") }}</p>
          </article>
        </div>
      </section>

      <section id="about" class="mt-14">
        <h2 class="mb-6 text-3xl font-bold">{{ t("home.aboutTitle") }}</h2>
        <div
          class="flex flex-col gap-6 rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center">
          <img src="/images/profile-photo.webp" alt="Haley Avatar" class="h-24 w-24 rounded-full object-cover" />
          <div>
            <h3 class="text-xl font-semibold">{{ t("home.title") }}</h3>
            <div class="mt-4 flex flex-wrap gap-3">
              <Button as="a" href="https://github.com/Creeper32767" target="_blank" rel="noopener noreferrer">
                {{ t("home.githubHome") }}
              </Button>
              <Button as="a" variant="outline" href="https://x.com/ConsoleCreeper" target="_blank"
                rel="noopener noreferrer">
                {{ t("home.followX") }}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" class="mt-14">
        <h2 class="mb-6 text-3xl font-bold">{{ t("home.organizationTitle") }}</h2>
        <div
          class="flex flex-col gap-6 rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center">
          <img src="https://avatars.githubusercontent.com/u/128388434?s=200&v=4" alt="SMS-COSMO Avatar"
            class="h-24 w-24 rounded-full object-cover" />
          <div>
            <h3 class="text-xl font-semibold">SMS-COSMO</h3>
            <p class="mt-2 text-muted">{{ t("home.organizationDescription") }}</p>
            <Button as="a" class="mt-4" variant="outline" href="https://github.com/SMS-COSMO" target="_blank"
              rel="noopener noreferrer">{{ t("home.visitGithub") }}</Button>
          </div>
        </div>
      </section>
    </main>

    <LayoutSiteFooter />
  </div>
</template>
