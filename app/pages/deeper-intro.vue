<script setup lang="ts">
import SiteFooter from "@/components/components/SiteFooter.vue";
import SiteHeader from "@/components/components/SiteHeader.vue";
import PlaneLink from "@/components/components/PlaneLink.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

useSeoMeta({
  title: "更深的自我解构 - Kitten Haley",
  description: "Kitten Haley 的观测报告：阅读、游戏、生活与频道简介。",
  author: "Haley Herzog",
  ogTitle: "Kitten Haley · 更深的自我解构",
  ogDescription: "一份来自虎斑猫的观测报告：阅读、游戏、生活与频道简介。",
  ogType: "profile",
});

interface SectionItem {
  title: string;
  description: string;
}

interface Section {
  id: string;
  title: string;
  subtitle: string;
  items: SectionItem[];
}

const sections: Section[] = [
  {
    id: "reading",
    title: "📖 阅·读 | 思想的避难所",
    subtitle: "Reading Preferences",
    items: [
      { title: "杂食性阅读者", description: "像在图书馆废墟里寻宝，什么都看，Z-library 是精神粮仓。" },
      { title: "深度迷恋", description: "更偏爱能刺痛灵魂的文字，《茶馆》《龙须沟》《巴黎圣母院》里的悲伤底色与人性微光是心头好。" },
      { title: "拾回碎片", description: "试图用文字雕刻认知，从曾经的懒散中走出，认真潜入书海。" },
      { title: "网文绝缘体", description: "网络文学的庞大分类系统仍未 comprehend，只能抱歉旁观。" },
    ],
  },
  {
    id: "fursona-gaming",
    title: "🎮 游·戏 & 兽·设 | 第二人生的投影",
    subtitle: "Gaming & Fursona",
    items: [
      { title: "Minecraft 守望者", description: "更多时候拆解安装包、研读 Dream 速通、在 C418 的 BGM 里冥想。" },
      { title: "Changed 玩家", description: "游戏已入库，等待在雨夜投入与未知共生的紧张感。" },
      { title: "番剧萌新", description: "真·小白猫，知识储备趋近于零。" },
      { title: "Project: 渡昕 (Duxin)", description: "另一个维度的虎斑猫，努力朝 Fursuit 梦想迈进，想彻底成为大猫猫。 (=^·ω·^=)ψ🐟" },
    ],
  },
  {
    id: "life",
    title: "🌐 生·活 | 现实与理想的缝隙",
    subtitle: "Real Life & Quirks",
    items: [
      { title: "代号与呼号", description: "海外：Kitten Haley / Haley Herzog\nB 站：FreedomDrones\n线下：直接叫“猫猫”" },
      { title: "旋律捕食者", description: "偏爱 ALisa、C418、Hea2t 等纯旋律音乐，它们是对抗虚无的武器。" },
      { title: "代码编织者", description: "GitHub (Creeper32767) 是后花园，COSMO 打工攒罐头。目标：专属 Windows 笔记本。" },
      { title: "技能树", description: "🍳 会做饭\n🐔 养过一年半的鸡" },
      { title: "世界观设定", description: "乐观的悲观主义者，在瓦砾间寻找群星，立志做清醒、独立、温暖的好猫。" },
    ],
  },
];

interface Contact {
  name: string;
  handle: string;
  label: string;
  href: string;
}

const contacts: Contact[] = [
  { name: "🐾 海外呼号", handle: "Kitten Haley (Haley Herzog)", label: "发送邮件", href: "mailto:creeper_console@outlook.com" },
  { name: "📺 Bilibili", handle: "@FreedomDrones (ID: 3546616696932529)", label: "访问 Bilibili 个人主页", href: "https://space.bilibili.com/3546616696932529" },
  { name: "▶️ YouTube", handle: "@FreedomDrones", label: "访问 YouTube 频道", href: "https://www.youtube.com/@FreedomDrones" },
  { name: "💻 GitHub", handle: "@Creeper32767", label: "访问 GitHub 个人主页", href: "https://github.com/Creeper32767" },
  { name: "✖️ X", handle: "@ConsoleCreeper", label: "访问 X 个人主页", href: "https://x.com/ConsoleCreeper" },
  { name: "🐾 兽频道 Fursuit.tv", handle: "@Creeper32767", label: "访问 Fursuit.tv 个人主页", href: "https://fursuit.tv/@Creeper32767" },
];

interface Channel {
  title: string;
  description: string;
}

const channels: Channel[] = [
  { title: "#LifeRecord · 公开", description: "生活切片：风把浪雕刻成的碎花、雨夜里的蛋糕，以及值得被记录的“一二”。" },
  { title: "#Minds&Thoughts · 白名单", description: "思想暗房：不那么温顺但真实的自我对话，是我审视世界的方式。" },
  { title: "#MusicWorld · 白名单", description: "私藏歌单与拙劣琴音，欢迎交换旋律引起的共鸣。" },
  { title: "#BeFurry · 白名单", description: "Kitten Haley 相关创作与毛绒艺术收藏，专属柔软灵魂的绝对领域。" },
];

const typewriterLines = [
  "欢迎来到我的观测报告，这里记录着一只虎斑猫的阅读、游戏与生活碎片。",
  "我是渡昕，也被称为 Kitten Haley。",
  "在这里，你会发现我对书籍的热爱、对游戏的独特见解，以及我作为一个开发者的点滴。",
  "希望这些内容能让你更了解我，感谢你的到来！",
] as const;

const typewriterText = ref("");
const revealed = ref(new Set<string>());
const animatedSections = ref<HTMLElement[]>([]);

let typewriterTimer: ReturnType<typeof setTimeout> | undefined;
let intersectionObserver: IntersectionObserver | undefined;

const cardItemClass =
  "rounded-xl border border-border/70 bg-background/75 p-4 shadow-[0_0.25rem_1rem_rgb(15_23_42/0.04)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-[0.15rem] hover:border-primary/35 hover:shadow-[0_0.6rem_1.4rem_rgb(15_23_42/0.1)]";

function startTypewriter() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typewriterText.value = typewriterLines[0];
    return;
  }

  let lineIndex = 0;
  let characterIndex = 0;

  const type = () => {
    const line = typewriterLines[lineIndex] ?? "";
    if (characterIndex <= line.length) {
      typewriterText.value = line.slice(0, characterIndex);
      characterIndex += 1;
      typewriterTimer = setTimeout(type, 80);
      return;
    }

    typewriterTimer = setTimeout(() => {
      characterIndex = 0;
      lineIndex = (lineIndex + 1) % typewriterLines.length;
      type();
    }, 900);
  };

  type();
}

onMounted(() => {
  startTypewriter();
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          revealed.value.add(entry.target.id);
          intersectionObserver?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );
  animatedSections.value.forEach((section) => intersectionObserver?.observe(section));
});

onBeforeUnmount(() => {
  if (typewriterTimer) clearTimeout(typewriterTimer);
  intersectionObserver?.disconnect();
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <SiteHeader />
    <main class="mx-auto w-[calc(100%-2rem)] max-w-5xl flex-1 py-12 sm:py-16">
      <header class="mb-12 text-center">
        <p class="mb-3 text-sm font-semibold tracking-[0.12em] text-primary">⚠️ 暂停一下 | 信号接入 ⚠️</p>
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">Kitten Haley · 更深的自我解构</h1>
        <p class="mt-5 text-muted">一份来自虎斑猫的观测报告。</p>
      </header>

      <section
        class="intro-banner relative mb-10 min-h-32 overflow-hidden rounded-2xl border border-primary/25 bg-(image:--banner-gradient) p-4 shadow-[0_0.75rem_2rem_rgb(15_23_42/0.12)] after:pointer-events-none after:absolute after:-right-12 after:-bottom-20 after:size-48 after:rounded-full after:bg-white/18 sm:px-6 sm:py-5">
        <p class="font-mono text-sm text-primary">🐾 自介条载入中... |･ω･｀) 这是一只猫的观测报告 🐾</p>
        <p
          class="mt-4 inline-flex min-h-8 items-center rounded-full bg-black/[0.14] px-[0.8rem] py-[0.35rem] font-semibold leading-normal text-white after:ml-[0.4rem] after:h-[1.2rem] after:w-[0.12rem] after:animate-[cursor-blink_1s_steps(2,jump-none)_infinite] after:bg-current after:content-[''] motion-reduce:after:animate-none max-sm:w-full max-sm:rounded-xl max-sm:text-sm">
          {{ typewriterText }}
        </p>
      </section>

      <div class="space-y-8">
        <section v-for="section in sections" :id="section.id" :key="section.id" ref="animatedSections" :class="[
          'scroll-mt-24 rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur transition-[opacity,transform,border-color] duration-420 hover:border-primary/35 sm:p-8',
          revealed.has(section.id) ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
        ]">
          <h2 class="text-2xl font-bold sm:text-3xl">
            {{ section.title }}
            <span class="ml-2 text-sm font-normal text-muted">({{ section.subtitle }})</span>
          </h2>
          <ul class="mt-6 grid gap-5 sm:grid-cols-2">
            <li v-for="item in section.items" :key="item.title" :class="cardItemClass">
              <h3 class="font-semibold text-primary">{{ item.title }}</h3>
              <p class="mt-2 leading-7 text-muted whitespace-pre-line">{{ item.description }}</p>
            </li>
          </ul>
        </section>

        <section id="contact"
          class="rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:p-8">
          <h2 class="text-2xl font-bold sm:text-3xl">📬 联·系 | 猫的通讯录</h2>
          <p class="mt-2 text-sm text-muted">(Where to ping me)</p>
          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <article v-for="contact in contacts" :key="contact.name" :class="cardItemClass">
              <h3 class="font-semibold">{{ contact.name }}</h3>
              <p class="mt-2 font-mono text-sm text-muted">{{ contact.handle }}</p>
              <PlaneLink :href="contact.href" class="mt-3 w-full bg-primary shadow-sm">
                {{ contact.label }}
              </PlaneLink>
            </article>
            <article :class="cardItemClass">
              <h3 class="font-semibold">💬 微信 / QQ</h3>
              <p class="mt-2 leading-7 text-muted">暂时不公开喵~ 再等等，也许熟了之后猫猫就会悄悄告诉你了喵😸</p>
            </article>
            <article :class="cardItemClass">
              <h3 class="font-semibold">🤝 线下 / 好友</h3>
              <p class="mt-2 leading-7 text-muted">叫我“猫猫”即刻响应！</p>
            </article>
          </div>
        </section>

        <section id="channels"
          class="rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:p-8">
          <h2 class="text-2xl font-bold sm:text-3xl">📡 频·道 | 猫的信号发射塔</h2>
          <p class="mt-3 text-muted">这里有我的一点小秘密，有些公开广播，有些只留给懂我的同类。</p>
          <ul class="mt-6 grid gap-5 sm:grid-cols-2">
            <li v-for="channel in channels" :key="channel.title" :class="cardItemClass">
              <h3 class="font-semibold text-primary">{{ channel.title }}</h3>
              <p class="mt-2 leading-7 text-muted">{{ channel.description }}</p>
            </li>
          </ul>
        </section>

        <section id="conclusion" class="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center sm:p-8">
          <h2 class="text-2xl font-bold">🐾 结·语 | 信号终端</h2>
          <p class="mt-2 text-sm text-muted">(End of the Journey)</p>
          <div class="mt-5 space-y-2 text-muted">
            <p>格式 Credit：<code class="rounded-md bg-foreground/10 px-1.5 py-0.5 font-mono text-sm">不可导</code></p>
            <p>鸣谢：<code class="rounded-md bg-foreground/10 px-1.5 py-0.5 font-mono text-sm">硫酰氯喵</code></p>
            <p class="font-semibold text-primary">期待与你在某个频率产生回响。🐾</p>
          </div>
        </section>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<style scoped>
.intro-banner {
  --banner-gradient:
    radial-gradient(circle at 90% 100%, rgb(255 255 255 / 0.5), transparent 35%),
    linear-gradient(110deg,
      color-mix(in srgb, var(--app-primary) 80%, white),
      color-mix(in srgb, var(--app-primary) 55%, white));
}

:global(.dark) .intro-banner {
  --banner-gradient:
    radial-gradient(circle at 90% 100%, rgb(255 255 255 / 0.12), transparent 35%),
    linear-gradient(110deg,
      color-mix(in srgb, var(--app-primary) 75%, #111827),
      color-mix(in srgb, var(--app-primary) 45%, #111827));
}

@keyframes cursor-blink {
  50% {
    opacity: 0;
  }
}
</style>