import { createI18n } from "vue-i18n";

export const supportedLocales = ["en", "zh-CN"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

const messages = {
  en: {
    seo: {
      siteName: "Haley's personal website",
      default: {
        title: "Haley's personal website",
        description: "Projects, notes, tools, and quiet thoughts from Haley.",
      },
      home: {
        title: "About me - Haley",
        description: "Haley's personal homepage, projects, tools, and notes.",
      },
      deeperIntro: {
        title: "A deeper self-portrait - Kitten Haley",
        description: "A field report on reading, games, life, and identity.",
      },
      fursona: {
        title: "Duxin's fursona profile - Haley",
        description: "Duxin's appearance, personality, background, and beliefs.",
      },
      portfolio: {
        title: "Study notes - Haley",
        description: "Daily poems, reading notes, and writing exercises.",
      },
      projects: {
        title: "Projects - Haley",
        description: "A collection of frontend tools and backend applications.",
      },
      software: {
        title: "Software recommendations - Kitten Haley",
        description: "A curated list of useful software for development and daily life.",
      },
      captureScreen: {
        title: "Web snapshot generator - Haley",
        description: "Load a webpage and export a PNG snapshot.",
      },
      colorConverter: {
        title: "Color converter - Haley",
        description: "Convert color formats and build accessible color palettes.",
      },
      editor: {
        title: "Fluent Code Editor - Haley",
        description: "An online code editor with language support, file I/O, and themes.",
      },
      readerCard: {
        title: "Reader card generator - Haley",
        description: "Create beautiful reading cards and export them as high-resolution images.",
      },
    },
    pageHeaders: {
      deeperIntro: {
        eyebrow: "⚠️ Pause here · Signal connected ⚠️",
        title: "Haley · A deeper self-portrait",
        description: "A field report from a tabby cat.",
      },
      fursona: {
        eyebrow: "Fursona archive · Duxin",
        title: "Duxin · Where ideals meet identity",
        description: "A truer inner self beneath a tabby cat's fluffy exterior.",
      },
      portfolio: {
        eyebrow: "Personal notebook",
        title: "Study notes",
        description: "A record of my learning process and reflections.",
      },
      projects: {
        eyebrow: "Project archive",
        title: "My projects",
        description: "Explore the frontend tools and backend applications I build.",
      },
      software: {
        eyebrow: "Software recommendations",
        title: "Software picks",
        description: "A selection of useful software I recommend.",
      },
      captureScreen: {
        eyebrow: "Capture toolkit",
        title: "Web snapshot generator",
        description: "Interact with a webpage preview and save it as a PNG image.",
      },
      colorConverter: {
        eyebrow: "Color toolkit",
        title: "Color converter",
        description: "An all-in-one color format converter and palette tool.",
      },
      editor: {
        eyebrow: "Coding toolkit",
        title: "Fluent Code Editor",
        description: "A lightweight, focused online code editor.",
      },
      readerCard: {
        eyebrow: "Reading toolkit",
        title: "Reader card generator",
        description: "Record a passage and the echo it leaves in your heart.",
      },
    },
    navigation: {
      home: "Home",
      about: "About",
      projects: "Projects",
      github: "GitHub",
      followX: "Follow me on X",
      openPanel: "Open navigation",
      closePanel: "Close navigation",
      panelTitle: "Navigation",
      openSettings: "Open language and theme settings",
      closeSettings: "Close language and theme settings",
      settingsPanelTitle: "Language and theme settings",
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
        deeperIntro: "More about me",
        fursona: "Fursona",
      },
      contentLinks: {
        editor: "Code editor",
        readerCard: "Reader card",
        captureScreen: "Screen capture",
        colorConverter: "Color converter",
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
    seo: {
      siteName: "Haley 的个人网站",
      default: {
        title: "Haley 的个人网站",
        description: "分享 Haley 的项目、笔记、工具与思考。",
      },
      home: {
        title: "关于我 - Haley",
        description: "Haley 的个人主页，了解他的项目、工具与学习笔记。",
      },
      deeperIntro: {
        title: "更深的自我解构 - Kitten Haley",
        description: "一份关于阅读、游戏、生活与自我的观测报告。",
      },
      fursona: {
        title: "渡昕的兽设档案 - Haley",
        description: "渡昕的外貌、性格、背景、爱好与信条。",
      },
      portfolio: {
        title: "学习笔记 - Haley",
        description: "每日一诗、读书笔记与写作练习。",
      },
      projects: {
        title: "我的项目 - Haley",
        description: "前端工具集与后端应用项目展示。",
      },
      software: {
        title: "软件推荐 - Kitten Haley",
        description: "开发、娱乐与日常生活中的实用软件推荐。",
      },
      captureScreen: {
        title: "网页快照生成器 - Haley",
        description: "加载网页并生成 PNG 快照。",
      },
      colorConverter: {
        title: "色彩转换器 - Haley",
        description: "转换颜色格式并创建易读的调色板。",
      },
      editor: {
        title: "Fluent Code Editor - Haley",
        description: "支持多种语言、文件读写与主题切换的在线代码编辑器。",
      },
      readerCard: {
        title: "读者卡片生成器 - Haley",
        description: "创建精美阅读卡片，记录阅读精华并导出高清图片。",
      },
    },
    pageHeaders: {
      deeperIntro: {
        eyebrow: "⚠️ 暂停一下 · 信号接入 ⚠️",
        title: "Haley · 更深的自我解构",
        description: "一份来自虎斑猫的观测报告。",
      },
      fursona: {
        eyebrow: "兽设档案 · 渡昕",
        title: "渡昕 · 理想与自我的交融",
        description: "虎斑猫毛茸茸的外表下，隐藏着更真实的内心。",
      },
      portfolio: {
        eyebrow: "个人笔记",
        title: "学习笔记",
        description: "记录我的学习过程和心得。",
      },
      projects: {
        eyebrow: "项目档案",
        title: "我的项目",
        description: "探索我构建的前端工具和后端应用。",
      },
      software: {
        eyebrow: "软件推荐合辑",
        title: "软件推荐",
        description: "这里是我推荐的一些实用软件。",
      },
      captureScreen: {
        eyebrow: "网页快照工具",
        title: "网页快照生成器",
        description: "加载网页、交互预览，并将页面保存为 PNG 图片。",
      },
      colorConverter: {
        eyebrow: "色彩工具",
        title: "色彩转换器",
        description: "全能颜色格式转换与调色工具。",
      },
      editor: {
        eyebrow: "代码工具",
        title: "Fluent Code Editor",
        description: "轻量、专注的在线代码编辑器。",
      },
      readerCard: {
        eyebrow: "阅读工具",
        title: "读者卡片生成器",
        description: "记录一段文字，也记录它在你心里留下的回声。",
      },
    },
    navigation: {
      home: "首页",
      about: "关于",
      projects: "项目",
      github: "GitHub",
      followX: "在 X 上关注我",
      openPanel: "打开导航",
      closePanel: "关闭导航",
      panelTitle: "导航",
      openSettings: "打开语言和主题设置",
      closeSettings: "关闭语言和主题设置",
      settingsPanelTitle: "语言和主题设置",
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
        deeperIntro: "深入介绍",
        fursona: "兽设",
      },
      contentLinks: {
        editor: "代码编辑器",
        readerCard: "阅读卡片",
        captureScreen: "网页快照",
        colorConverter: "色彩转换器",
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
