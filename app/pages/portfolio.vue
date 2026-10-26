<script setup lang="ts">

interface NoteSection {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  entries: Array<{
    text: string;
    source?: string;
  }>;
  href: string;
  action: string;
}

const sections: NoteSection[] = [
  {
    id: "poem-everyday",
    icon: "✦",
    title: "每日一诗",
    subtitle: "Poem of the day",
    description: "记录每天读到的诗句，感受文字的美。",
    entries: [
      { text: "诗歌是一种美丽的谎言。", source: "但丁" },
      { text: "诗是人类向未来寄发的信息，诗给人类以朝向理想的勇气。", source: "泰戈尔" },
      { text: "诗是翻腾的内心之叹息。" },
    ],
    href: "/notes/notes-poems.html",
    action: "查看更多诗句",
  },
  {
    id: "reading-notes",
    icon: "▤",
    title: "读书笔记",
    subtitle: "Reading notes",
    description: "总结阅读过的书籍，提炼其中的精华。",
    entries: [
      { text: "生命的意义在于坚持与希望，无论遭遇多少苦难。", source: "余华《活着》" },
      { text: "了解人类历史的发展，有助于我们更好地理解当下与未来。", source: "尤瓦尔·赫拉利《人类简史》" },
      { text: "制定并遵循个人和工作中的原则，可以帮助我们做出更好的决策。", source: "瑞·达利欧《原则》" },
    ],
    href: "/notes/notes-books.html",
    action: "查看更多读书笔记",
  },
  {
    id: "writing-practice",
    icon: "✎",
    title: "写作练习",
    subtitle: "Writing practice",
    description: "通过写作提升表达能力，记录生活点滴。",
    entries: [
      { text: "写作是思考的延伸，通过文字整理思绪。" },
      { text: "坚持每天写作，可以培养良好的习惯和表达能力。" },
      { text: "分享自己的故事，可以激励和帮助他人。" },
    ],
    href: "/notes/notes-writings.html",
    action: "查看更多写作练习",
  },
];

useSeoMeta({
  title: "学习笔记 - Haley",
  description: "Kitten Haley 的学习笔记：每日一诗、读书笔记与写作练习。",
  ogTitle: "学习笔记 - Haley",
  ogDescription: "Kitten Haley 的学习笔记：每日一诗、读书笔记与写作练习。",
});
</script>

<template>
  <div>
    <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-12 sm:py-16">
      <header class="mb-16 max-w-3xl">
        <p class="mb-3 text-sm font-semibold tracking-[0.12em] text-primary uppercase">
          Personal notebook
        </p>
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">学习笔记</h1>
        <p class="mt-5 text-lg leading-8 text-muted">记录我的学习过程和心得。</p>
      </header>

      <div class="grid gap-6 lg:grid-cols-3">
        <section v-for="section in sections" :id="section.id" :key="section.id"
          class="flex flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg sm:p-8">
          <div class="mb-6 flex items-start justify-between gap-4">
            <div
              class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-2xl text-primary"
              aria-hidden="true">
              {{ section.icon }}
            </div>
            <span class="pt-2 text-right text-xs tracking-wide text-muted uppercase">
              {{ section.subtitle }}
            </span>
          </div>

          <h2 class="text-2xl font-bold">{{ section.title }}</h2>
          <p class="mt-3 text-sm leading-7 text-muted">{{ section.description }}</p>

          <ul class="mt-6 flex-1 space-y-4 border-t border-border pt-6">
            <li v-for="entry in section.entries" :key="entry.text"
              class="border-l-2 border-primary/30 pl-4 text-sm leading-7 text-muted">
              {{ entry.text }}
              <strong v-if="entry.source" class="font-semibold text-foreground">
                —— {{ entry.source }}
              </strong>
            </li>
          </ul>

          <PlaneLink :href="section.href" target="_self" class="mt-8 w-full bg-primary shadow-sm"
            :aria-label="`${section.action}：${section.title}`">
            {{ section.action }}
          </PlaneLink>
        </section>
      </div>
    </main>

  </div>
</template>