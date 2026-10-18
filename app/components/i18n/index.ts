import { createI18n } from "vue-i18n";

export const supportedLocales = ["en", "zh-CN"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const messages = {
  en: {
    navigation: {
      home: "Home",
      about: "About",
      projects: "Projects",
      github: "GitHub",
      label: "Main navigation",
    },
    home: {
      eyebrow: {
        morning: "Good morning, human. A purr-fect day awaits!",
        afternoon: "Good afternoon, human. Time for a little catnap?",
        evening: "Good evening, human. The moon is calling this cat.",
        night: "Good night, human. May your dreams be full of warm naps.",
      },
      title: "Haley (Creeper32767)",
      bio: "An optimistic pessimist, who is determined to be a good cat.",
      introduction:
        "Hello, traveller! This is Haley Herzog (you can also call me Kitten, or just call me Kitty in person).",
      introductionMore:
        "I'm absolutely passionate about two things: connecting with amazing people like you and the incredible world of coding. There's something magical about bringing ideas to life, line by line, and building innovative solutions that can make a real difference. I truly believe that through collaboration and the power of code, we can create a better, more connected world for everyone. Whether you're a seasoned developer or just starting your coding journey, I'd be thrilled to team up, share knowledge, and build something wonderful together. Let's combine our creativity and skills to turn our dreams into reality and leave our very own warm pawprints on the world. Let's code together and build the future!",
      technicalAnalysis: "GitHub technical analysis",
      languagesTitle: "Common languages",
      languagesDescription:
        "I mainly use Python for backend development and data processing, along with JavaScript, HTML, and CSS for frontend interfaces.",
      habitsTitle: "Coding habits",
      habitsDescription:
        "Active at night, with a focus on robust, readable code. I prefer writing detailed documentation and comments.",
      aboutTitle: "About me",
      githubHome: "GitHub profile",
      followX: "Follow me on X",
      organizationTitle: "My organization",
      organizationDescription:
        "A student developer community focused on open-source collaboration and technical innovation.",
      visitGithub: "Visit GitHub profile",
    },
    footer: {
      copyright: "© {year} Creeper32767. Built with Vue.",
      backToTop: "Back to top",
    },
    notFound: {
      title: "Error: Page not found",
      message: "You seem to have reached the edge of the world…",
      farewell:
        "If we do not meet again, good morning, good afternoon, and good night.",
      home: "Return home",
    },
    language: {
      label: "Language",
      en: "English",
      "zh-CN": "简体中文",
    },
    theme: {
      switchToLight: "Switch to light theme",
      switchToDark: "Switch to dark theme",
    },
  },
  "zh-CN": {
    navigation: {
      home: "首页",
      about: "关于",
      projects: "项目",
      github: "GitHub",
      label: "主导航",
    },
    home: {
      eyebrow: {
        morning: "早安，人类。今天也要喵力全开！",
        afternoon: "午安，人类。现在正适合打个小盹喵。",
        evening: "晚上好，人类。月亮正在召唤本喵。",
        night: "晚安，人类。愿你梦见温暖的猫窝喵。",
      },
      title: "Haley（Creeper32767）",
      bio: "一个乐观的悲观主义者，励志做一只好猫。",
      introduction:
        "你好，旅行者！这里是渡昕（你也可以叫我 Haley，或者线下直接叫我猫猫）。",
      introductionMore:
        "我满怀热情地致力于两件事：与像你一样优秀的人交流，以及投身于奇妙的编程世界。将想法一行行代码变为现实，并构建能够真正改变世界的创新解决方案，这其中蕴含着一种魔力。我坚信，通过协作和代码的力量，我们可以为每个人创造一个更美好、更紧密联系的世界。无论你是经验丰富的开发者，还是刚刚开启你的编程之旅，我都非常乐意与你合作，分享知识，共同创造美好的事物。让我们结合彼此的创造力和技能，将梦想变为现实，为世界留下属于我们的温暖爪印。一起用代码构筑未来吧！",
      technicalAnalysis: "GitHub 技术分析",
      languagesTitle: "常用语言",
      languagesDescription:
        "主要使用 Python 进行后端开发和数据处理，并使用 JavaScript、HTML 和 CSS 构建前端界面。",
      habitsTitle: "编码习惯",
      habitsDescription:
        "活跃于夜间，专注于代码的健壮性和可读性。倾向于编写详细的文档和注释。",
      aboutTitle: "关于我",
      githubHome: "GitHub 主页",
      followX: "在 X 上关注我",
      organizationTitle: "我的组织",
      organizationDescription: "一个专注于开源协作和技术创新的学生开发者社区。",
      visitGithub: "访问 GitHub 主页",
    },
    footer: {
      copyright: "© {year} Creeper32767。使用 Vue 构建。",
      backToTop: "返回顶部",
    },
    notFound: {
      title: "发生错误：页面未找到",
      message: "你似乎到达了世界的边缘……",
      farewell: "若无缘再见，便祝你早安，午安，夜夜好梦。",
      home: "返回主页",
    },
    language: {
      label: "语言",
      en: "English",
      "zh-CN": "简体中文",
    },
    theme: {
      switchToLight: "切换到浅色主题",
      switchToDark: "切换到深色主题",
    },
  },
} as const;

export const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});
