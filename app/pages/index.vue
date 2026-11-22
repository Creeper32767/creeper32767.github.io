<script setup lang="ts">
import { Open16Regular } from "@ntkrnl64/fluentui-vue-icons";
import { onMounted, ref } from "vue";

const { t } = useI18n();
const getGreetingKey = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "home.eyebrow.morning";
  if (hour >= 12 && hour < 14) return "home.eyebrow.noon";
  if (hour >= 14 && hour < 18) return "home.eyebrow.afternoon";
  if (hour >= 18 && hour < 22) return "home.eyebrow.evening";
  return "home.eyebrow.night";
};
const greetingKey = ref("home.eyebrow.night");

onMounted(() => {
  greetingKey.value = getGreetingKey();
});

</script>

<template>
  <div>
    <main id="home" class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-12 sm:py-16">
      <header class="page-header page-header--centered page-header--compact flex flex-col items-center">
        <NuxtImg src="/images/haley-avatar.webp" alt="Haley Avatar" width="96" height="96" preset="avatar"
          class="mb-5 size-24 rounded-full border-4 border-white object-cover shadow-lg" />
        <ClientOnly>
          <span class="mb-3 rounded bg-primary/5 p-2 text-xs font-bold tracking-[0.04em] text-primary">{{ t(greetingKey)
          }}</span>
          <template #fallback>
            <Skeleton class="mb-3 h-8 w-32" />
          </template>
        </ClientOnly>
        <h1 class="page-title">{{ t("home.title") }}</h1>
        <p class="page-description max-w-2xl">{{ t("home.bio") }}</p>
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
              <div class="flex w-[45%] items-center justify-center bg-indigo-600">Python 45%</div>
              <div class="flex w-[35%] items-center justify-center bg-blue-600">JS/TS 35%</div>
              <div class="flex w-[20%] items-center justify-center bg-cyan-600">Other 20%</div>
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
        <ItemGroup
          class="flex flex-col gap-6 rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center">
          <NuxtImg src="/images/haley-avatar.webp" alt="Haley Avatar" width="96" height="96" preset="avatar"
            class="size-24 rounded-full object-cover" />
          <div>
            <h3 class="text-xl font-semibold">{{ t("home.title") }}</h3>
            <p class="mt-2 text-muted">{{ t("home.bio") }}</p>
            <div class="mt-4 flex flex-wrap gap-3">
              <Button as="a" href="https://github.com/Creeper32767" target="_blank" rel="noopener noreferrer">
                {{ t("home.githubHome") }}
                <Open16Regular class="size-4" aria-hidden="true" />
              </Button>
              <Button as="a" variant="outline" href="https://x.com/ConsoleCreeper" target="_blank"
                rel="noopener noreferrer">
                {{ t("home.followX") }}
                <Open16Regular class="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </ItemGroup>
      </section>

      <section id="projects" class="mt-14">
        <h2 class="mb-6 text-3xl font-bold">{{ t("home.organizationTitle") }}</h2>
        <div
          class="flex flex-col gap-6 rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:flex-row sm:items-center">
          <NuxtImg src="/images/cosmo-avatar.webp" alt="SMS-COSMO Avatar" width="96" preset="avatar"
            height="96" class="h-24 w-24 rounded-full object-cover" />
          <div>
            <h3 class="text-xl font-semibold">SMS-COSMO</h3>
            <p class="mt-2 text-muted">{{ t("home.organizationDescription") }}</p>
            <Button as="a" class="mt-4" variant="outline" href="https://github.com/SMS-COSMO" target="_blank"
              rel="noopener noreferrer"> {{ t("home.visitGithub") }}
              <Open16Regular class="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </main>

  </div>
</template>
