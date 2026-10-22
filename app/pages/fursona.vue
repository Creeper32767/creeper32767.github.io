<script setup lang="ts">
import SiteFooter from "@/components/components/SiteFooter.vue";
import SiteHeader from "@/components/components/SiteHeader.vue";

type Detail = {
  title: string;
  text: string;
  extra?: string;
};

const sections: Array<{
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  details: Detail[];
}> = [
    {
      id: "personality",
      icon: "✨",
      title: "性·格",
      subtitle: "灵魂侧写 · Personality & Soul",
      details: [
        {
          title: "核心特质",
          text: "温暖、内省、文学系、真诚、坚韧。",
        },
        {
          title: "外热内秀",
          text: "外在像小太阳般温暖治愈，乐于交友；独处时则带有文人的敏感与忧郁，沉浸于阅读与思考。",
        },
        {
          title: "成长底色",
          text: "外表虽具少年感，内心却拥有一份历经迷茫后依然选择热爱生活的成熟。",
        },
      ],
    },
    {
      id: "background",
      icon: "🏘️",
      title: "背·景",
      subtitle: "渡口守望者 · Background & Story",
      details: [
        {
          title: "起源：窑湾古镇",
          text: "他是窑湾运河畔一抹未散的晨雾。千年的灯影凝成了这身橘暖。湛蓝的眼眸，倒映着静谧与波澜。他在古渡口泥沙中拾得的铜铃，每当夜风掠过时便清脆作响，回应着百年前的舟楫之声。",
        },
        {
          title: "角色定位",
          text: "他是历史的观察者，独行于斑驳墙下，在历史的缝隙里收集被遗落在风中的温热故事。",
        },
        {
          title: "氛围意象",
          text: "他融合了“晨雾般的朦胧”与“阳光穿透云层”的质感，宁静致远如冬日暖阳。",
          extra: "既属于古老青石板路的沉稳，也属于现代校园的朝气。",
        },
      ],
    },
    {
      id: "hobbies",
      icon: "🎭",
      title: "爱·好",
      subtitle: "猫的乐园 · Hobbies & Interests",
      details: [
        { title: "音乐", text: "聆听各种风格的音乐，从古典到现代，感受旋律中的情感。" },
        { title: "自然漫步", text: "喜欢在公园和森林中散步，感受大自然的宁静与美好。" },
        { title: "摄影", text: "用镜头捕捉生活中的美好瞬间，记录光影与情感。" },
        { title: "热牛奶", text: "在寒冷的夜晚喝一杯温暖的热牛奶，感受内心的宁静与温馨。" },
        { title: "被摸头", text: "享受被轻轻抚摸头顶的温暖时刻，慵懒地甩甩尾巴，感受关怀与安心。" },
      ],
    },
    {
      id: "philosophy",
      icon: "📜",
      title: "信·条",
      subtitle: "废墟上的观测 · Motto & Philosophy",
      details: [
        {
          title: "直视现实",
          text: "“我直视这世界的荒谬与寒冷，并不企图将其粉饰；但我依然选择在每一寸冰冷的现实上，留下炽热的爪印。”",
        },
        {
          title: "活在当下",
          text: "“不为虚幻的明天出卖感官，只为真实的当下梳理毛发。以悲观的清醒筑起围墙，以乐观的意志在墙内种花。”",
        },
        {
          title: "优雅生存",
          text: "“我是废墟上的观测者，也是风雨中的回响——既是不必急于求成的，便且让我们在这一方寸的‘活着’里，优雅而完整地，做一只好猫。”",
        },
      ],
    },
  ];

const appearanceDetails: Detail[] = [
  {
    title: "基本档案",
    text: "名称：渡昕 (Duxin)\n种族：虎斑猫 (Tabby Cat)\n性别：男\n年龄：16 岁（介于幼态与成熟之间）",
  },
  {
    title: "色彩与细节",
    text: "色调：暖橘色为主，深橘色虎斑条纹，毛发如冬日暖阳般柔软。\n眼睛：湛蓝色，清澈深邃，带有探究世界的灵气。\n特征：直立耳，嘴角常带温和笑意，粉色肉垫。",
  },
  {
    title: "标志性配饰",
    text: "红色项圈：脖颈上的鲜明点缀。\n金色铃铛：古渡口拾得的旧物，质感复古，是“警醒”与“印记”，随夜风清脆作响。",
  },
];

useSeoMeta({
  title: "兽设渡昕 - Haley",
  description: "渡昕的兽设档案：外貌、性格、背景、爱好与信条。",
  ogTitle: "兽设渡昕 - Haley",
  ogDescription: "渡昕的兽设档案：外貌、性格、背景、爱好与信条。",
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <SiteHeader />

    <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-10 sm:py-16">
      <header class="mb-12 max-w-3xl">
        <p class="mb-4 text-sm font-semibold tracking-[0.18em] text-primary uppercase">
          Fursona archive · Duxin
        </p>
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">
          兽设渡昕 · 理想与自我的交融
        </h1>
        <p class="mt-5 text-lg leading-8 text-muted">
          暂停一下，信号接入。虎斑猫的外表下，是更真实的内心。
        </p>
      </header>

      <section id="introduction"
        class="rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:p-8">
        <p class="mb-3 text-sm font-semibold tracking-wide text-primary">引·言 · Greeting & Self-Intro</p>
        <h2 class="text-2xl font-bold sm:text-3xl">猫的自我介绍</h2>
        <div class="mt-6 space-y-4 leading-8 text-muted">
          <p>你好，小伙伴 ~ 👋 oω&lt;</p>
          <p>这里是渡昕，是一只（并不）普通的虎斑猫哦 ww。</p>
          <p>喜欢阅读、写作、编程；还有拍好看的照片，剪有意思的视频，去好玩的地方玩，吃好吃的东西也都是我的爱好！but 不会画画 qwq... 😭</p>
          <p>这只小猫没有什么雷点，脾气也（大概）挺好的。不过在互相尊重的基础上进行交流讨论，是小猫觉得最舒服的事情呢。</p>
          <p>如果小猫感觉不太舒服，会主动说出来的。放心大胆地和小猫聊天吧，大可不必自己担心噢 ~</p>
          <p>正如设定所展现的那样，在现实生活中，我也（自认为）是一只善良、热情、（相对）有同情心的小猫呢。初次见面可能比较社恐... 😳</p>
          <p>摸头或者摸肚子都可以，不过动作要温柔一点，嘿嘿 ~ ☺️</p>
          <p>线下欢迎小伙伴邀请我一起去旅游、逛展子、撸猫 ~ 目标是继续做一只属于自己的小猫，也会继续卖萌讨人喜欢。😘</p>
          <p>and 正在努力向 fursuit 目标迈进！😤</p>
        </div>
      </section>

      <section id="appearance"
        class="mt-10 rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:p-8">
        <div class="grid gap-8 lg:grid-cols-[minmax(15rem,0.8fr)_1.2fr] lg:items-center">
          <figure>
            <div class="overflow-hidden rounded-xl border border-border bg-primary/5 p-3">
              <img src="/images/profile-photo.webp" alt="渡昕的头像" class="aspect-square w-full rounded-lg object-cover" />
            </div>
            <figcaption class="mt-3 text-center text-sm text-muted">头像 · 暖橘色虎斑猫</figcaption>
          </figure>
          <div>
            <p class="mb-3 text-sm font-semibold tracking-wide text-primary">🎨 外·貌 · Appearance & Visuals</p>
            <h2 class="text-2xl font-bold sm:text-3xl">视觉印象</h2>
            <div class="mt-6 grid gap-4 sm:grid-cols-3">
              <article v-for="detail in appearanceDetails" :key="detail.title"
                class="rounded-xl border border-border/80 p-4">
                <h3 class="font-semibold">{{ detail.title }}</h3>
                <p class="mt-3 whitespace-pre-line text-sm leading-7 text-muted">{{ detail.text }}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-10 grid gap-6 md:grid-cols-2">
        <article v-for="section in sections" :id="section.id" :key="section.id"
          class="rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur sm:p-8">
          <p class="mb-3 text-sm font-semibold tracking-wide text-primary">{{ section.icon }} {{ section.title }} · {{
            section.subtitle }}</p>
          <h2 class="text-2xl font-bold">{{ section.title === "性·格" ? "灵魂侧写" : section.subtitle.split(" · ")[0] }}</h2>
          <ul class="mt-6 space-y-5">
            <li v-for="detail in section.details" :key="detail.title" class="border-l-2 border-primary/30 pl-4">
              <h3 class="font-semibold">{{ detail.title }}</h3>
              <p class="mt-2 whitespace-pre-line text-sm leading-7 text-muted">{{ detail.text }}</p>
              <p v-if="detail.extra" class="mt-2 text-sm leading-7 text-muted">{{ detail.extra }}</p>
            </li>
          </ul>
        </article>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>