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
      followX: "Follow me on X",
      openPanel: "Open navigation",
      closePanel: "Close navigation",
      panelTitle: "Navigation",
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
      copyright: "© {year} Creeper32767. All rights reserved.",
      backToTop: "Back to top",
      introduction:
        "A coding cat's little corner for projects, ideas, and experiments.",
      sitemap: "Sitemap",
      siteLinks: {
        home: "Home",
        about: "About me",
        projects: "Projects",
        software: "Software picks",
        portfolio: "Portfolio",
      },
      contentLinks: {
        deeperIntro: "More about me",
        fursona: "Fursona",
        editor: "Code editor",
        readerCard: "Reader card",
      },
      siteInfo: "Site information",
      toolsAndContent: "Tools & content",
      source: "Source code",
      credit: "Designed & built by Creeper32767, made with Vue & Nuxt.",
    },
    error: {
      literaryTexts: [
        "Every detour is part of the journey. Pause for a moment, then continue sailing forward.",
        "Even the stars need a moment of darkness before they can shine again.",
        "The road may end here, but the story has not yet reached its final page.",
        "Take a breath, look toward the horizon, and let the next chapter find you.",
        "You seem to have reached the edge of the world... If we don't meet again, I wish you good morning, good afternoon, and sweet dreams.",
      ],
      statuses: {
        "400": {
          title: "Bad request",
          message: "The server could not understand your request.",
          hint: "Please check your input and try again.",
        },
        "401": {
          title: "Authentication required",
          message: "This page requires you to be signed in.",
          hint: "Please sign in and try again.",
        },
        "403": {
          title: "Access denied",
          message: "You don't have permission to view this page.",
          hint: "If you believe this is a mistake, contact the administrator.",
        },
        "404": {
          title: "Page not found",
          message:
            "The page you are looking for does not exist or has been removed.",
          hint: "Return to the homepage to continue browsing.",
        },
        "408": {
          title: "Request timeout",
          message: "The server timed out waiting for your request.",
          hint: "Please check your connection and try again.",
        },
        "429": {
          title: "Too many requests",
          message: "You have sent too many requests in a short period.",
          hint: "Please try again later.",
        },
        "500": {
          title: "Server error",
          message:
            "The server ran into a problem and couldn't complete the request.",
          hint: "Please try again later or return to the homepage.",
        },
        "502": {
          title: "Bad gateway",
          message: "The upstream service returned an invalid response.",
          hint: "Please try again later.",
        },
        "503": {
          title: "Service unavailable",
          message: "The server is temporarily unable to handle the request.",
          hint: "Please try again later.",
        },
        "504": {
          title: "Gateway timeout",
          message: "The upstream service took too long to respond.",
          hint: "Please try again later.",
        },
        default: {
          title: "Something went wrong",
          message: "An unexpected error occurred.",
          hint: "Return to the homepage to continue browsing.",
        },
      },
      actions: {
        home: "Return home",
        retry: "Retry",
      },
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
      followX: "在 X 上关注我",
      openPanel: "打开导航",
      closePanel: "关闭导航",
      panelTitle: "导航",
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
      copyright: "© {year} Creeper32767。保留所有权利。",
      backToTop: "返回顶部",
      introduction: "这里是一只猫猫记录项目、想法与各种小实验的个人空间。",
      sitemap: "网站地图",
      siteLinks: {
        home: "首页",
        about: "关于我",
        projects: "项目",
        software: "软件推荐",
        portfolio: "作品集",
      },
      contentLinks: {
        deeperIntro: "深入介绍",
        fursona: "兽设",
        editor: "代码编辑器",
        readerCard: "阅读卡片",
      },
      siteInfo: "站点信息",
      toolsAndContent: "工具与内容",
      source: "网站源码",
      credit: "由 Creeper32767 设计与构建，使用 Vue & Nuxt 制作。",
    },
    error: {
      literaryTexts: [
        "每一次绕路都是旅途的一部分，停下片刻，再继续扬帆前行吧。",
        "星星也需要经过一段黑暗，才能再次闪耀。",
        "道路或许在此处尽头，但故事还没有翻到最后一页。",
        "不妨深呼吸，望向远方，让下一章如期而至。",
        "你似乎到达了世界的边缘…… 若无缘再见，便祝你早安，午安，夜夜好梦。",
      ],
      statuses: {
        "400": {
          title: "请求有误",
          message: "服务器无法理解您的请求。",
          hint: "请检查输入内容后重试。",
        },
        "401": {
          title: "需要登录",
          message: "此页面需要身份验证。",
          hint: "请先登录后再访问。",
        },
        "403": {
          title: "没有权限",
          message: "您无权访问此页面。",
          hint: "如果认为这是误判，请联系管理员。",
        },
        "404": {
          title: "页面未找到",
          message: "您访问的页面不存在或已被删除。",
          hint: "请返回主页继续浏览。",
        },
        "408": {
          title: "请求超时",
          message: "服务器等待请求超时。",
          hint: "请检查网络后重试。",
        },
        "429": {
          title: "请求过于频繁",
          message: "您短时间内发送了过多请求。",
          hint: "请稍后再试。",
        },
        "500": {
          title: "服务器错误",
          message: "服务器遇到问题，无法完成请求。",
          hint: "请稍后重试或返回主页。",
        },
        "502": {
          title: "网关错误",
          message: "上游服务响应无效。",
          hint: "请稍后重试。",
        },
        "503": {
          title: "服务暂不可用",
          message: "服务器暂时无法处理请求。",
          hint: "请稍后重试。",
        },
        "504": {
          title: "网关超时",
          message: "上游服务响应超时。",
          hint: "请稍后重试。",
        },
        default: {
          title: "出现了一点问题",
          message: "发生了未知错误。",
          hint: "请返回主页继续浏览。",
        },
      },
      actions: {
        home: "返回主页",
        retry: "重试",
      },
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
  locale: "zh-CN",
  fallbackLocale: "zh-CN",
  messages,
});
