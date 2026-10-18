<script setup lang="ts">
import PlaneLink from "@/components/components/PlaneLink.vue";
import SiteFooter from "@/components/components/SiteFooter.vue";
import SiteHeader from "@/components/components/SiteHeader.vue";

interface Software {
  name: string;
  description: string;
  href: string;
  icon: string;
  action?: string;
}

interface SoftwareSection {
  id: string;
  title: string;
  subtitle: string;
  items: Software[];
}

const sections: SoftwareSection[] = [
  {
    id: "development",
    title: "开发",
    subtitle: "Development",
    items: [
      {
        name: "RVNC Viewer",
        description: "一款开源的远程控制软件，功能强大且高效实用，工作原理和 Windows 远程控制软件类似。",
        href: "https://www.realvnc.com/en/connect/download/viewer/",
        icon: "https://www.realvnc.com/wp-content/uploads/2023/05/cropped-realvnc-favicon-192x192.png",
      },
      {
        name: "Python",
        description: "一种多功能且易于学习的语言，让你能够快速工作并更有效地整合系统。",
        href: "https://www.python.org/downloads/",
        icon: "https://www.python.org/static/favicon.ico",
      },
      {
        name: "VSCode",
        description: "通过 GitHub Copilot 重新定义 AI 驱动的编码，用于构建和调试现代 Web 与云应用程序。",
        href: "https://code.visualstudio.com/download",
        icon: "https://code.visualstudio.com/favicon.ico",
      },
      {
        name: "PyCharm",
        description: "用于数据科学和网页开发的 Python 集成开发环境，兼容 Windows、macOS 和 Linux。",
        href: "https://www.jetbrains.com/pycharm/download/",
        icon: "https://www.jetbrains.com.cn/pycharm/img/logo-with-shadow.jpg",
      },
      {
        name: "Rust",
        description: "具有高性能、高可靠性和高生产力的编程语言，适用于各个领域的应用开发。",
        href: "https://www.rust-lang.org/tools/install",
        icon: "https://www.rust-lang.org/static/images/rust-logo-blk.svg",
      },
      {
        name: "ZeroTermux",
        description: "基于 Termux 的终端模拟器，提供丰富的功能和良好的用户体验，适合在移动设备上开发和管理任务。",
        href: "https://get.zerotermux.dev/",
        icon: "https://ts2.tc.mm.bing.net/th/id/ODF.o1DTTzHRAxq98GD1aAVqUg",
      },
      {
        name: "Git",
        description: "一个分布式版本控制系统，帮助开发者高效地管理代码和协作开发。",
        href: "https://git-scm.com/downloads",
        icon: "https://git-scm.com/favicon.ico",
      },
      {
        name: "Node.js",
        description: "基于 Chrome V8 引擎的 JavaScript 运行时，允许开发者在服务器端运行 JavaScript。",
        href: "https://nodejs.org/en/download/",
        icon: "https://nodejs.org/static/images/favicons/favicon.png",
      },
      {
        name: "Docker",
        description: "开源的容器化平台，帮助开发者打包、分发和运行应用程序。",
        href: "https://www.docker.com/get-started",
        icon: "https://cdn-icons-png.flaticon.com/512/919/919853.png",
      },
    ],
  },
  {
    id: "entertainment",
    title: "娱乐",
    subtitle: "Entertainment",
    items: [
      {
        name: "VLC Media Player",
        description: "免费且开源的跨平台多媒体播放器，支持几乎所有的音频和视频格式。",
        href: "https://www.videolan.org/vlc/",
        icon: "https://images.videolan.org/images/favicon.ico",
      },
      {
        name: "PotPlayer",
        description: "支持多种音频和视频格式的数字多媒体播放器，提供丰富的功能和良好的用户体验。",
        href: "https://potplayer.tv/",
        icon: "https://t1.daumcdn.net/potplayer/main/img/favicon.ico",
      },
      {
        name: "HMCL Launcher",
        description: "Minecraft 启动器，提供便捷的游戏管理和启动功能，支持多种版本和模组。",
        href: "https://hmcl.huangyuhui.net/",
        icon: "https://hmcl.huangyuhui.net/favicon.ico",
      },
      {
        name: "Plain Craft Launcher",
        description: "Minecraft 启动器，提供便捷的游戏管理和启动功能，支持多种版本和模组。",
        href: "https://pcl.ruanmao.net/",
        icon: "https://pcl.ruanmao.net/pcl.webp",
      },
      {
        name: "Plain Craft Launcher CE",
        description: "Plain Craft Launcher 的社区版本，提供便捷的 Minecraft 版本和模组管理功能。",
        href: "https://pclce-web.demo.fis.ink/",
        icon: "https://pclce-web.demo.fis.ink/img/logo.ico",
      },
      {
        name: "Fold Craft Launcher",
        description: "专为 Android 平台开发的 Minecraft: Java Edition 启动器，支持多种版本和模组。",
        href: "https://next.foldcraftlauncher.cn/",
        icon: "https://fcl.tslcyh.cn/fcl.jpg",
      },
      {
        name: "klpbbs.com",
        description: "提供 Minecraft 模组下载和资讯的网站，拥有丰富的模组资源和活跃的社区。",
        href: "https://klpbbs.com/",
        icon: "https://klpwiki.com/favicon.ico",
      },
      {
        name: "Steam",
        description: "数字游戏分发平台，提供丰富的游戏资源和社区功能。",
        href: "https://store.steamchina.com/",
        icon: "https://store.steamchina.com/favicon.ico",
      },
      {
        name: "MyFreeMP3",
        description: "免费的音乐下载平台，提供丰富的音乐资源和便捷的下载服务。",
        href: "https://www.myfreemp3.com.cn/",
        icon: "https://www.myfreemp3.com.cn/favicon.ico",
      },
    ],
  },
  {
    id: "practical-tools",
    title: "实用工具",
    subtitle: "Practical Tools",
    items: [
      {
        name: "7-Zip",
        description: "开源的文件压缩和解压工具，支持多种压缩格式，提供高压缩比和强大的功能。",
        href: "https://www.7-zip.org/download.html",
        icon: "https://www.7-zip.org/favicon.ico",
      },
      {
        name: "Windows Memory Cleaner",
        description: "内存优化工具，帮助用户释放和管理系统内存，提高计算机性能。",
        href: "https://winmemorycleaner.com/",
        icon: "https://winmemorycleaner.com/assets/images/win-memory-cleaner.png",
      },
      {
        name: "Geek Uninstaller",
        description: "强大的卸载工具，帮助用户彻底删除不需要的软件和插件，释放系统空间。",
        href: "https://geekuninstaller.com/",
        icon: "https://geekuninstaller.com/favicon.ico",
      },
      {
        name: "HEU KMS Activator",
        description: "Windows 和 Office 激活工具，请仅在拥有合法授权的设备上使用。",
        href: "https://github.com/zbezj/HEU_KMS_Activator/releases",
        icon: "https://img.icons8.com/p1em/1200/github.jpg",
        action: "获取 (GitHub)",
      },
      {
        name: "Internet Download Manager",
        description: "下载管理工具，帮助用户加快下载速度并管理下载任务。",
        href: "https://www.internetdownloadmanager.com/",
        icon: "https://cdn2.iconfinder.com/data/icons/mixd/512/1-idm_internet_downloader_download_manage-128.png",
      },
      {
        name: "IDM Activation Script",
        description: "用于管理 Internet Download Manager 授权的脚本，请仅在拥有合法授权的设备上使用。",
        href: "https://github.com/lstprjct/IDM-Activation-Script",
        icon: "https://img.icons8.com/p1em/1200/github.jpg",
        action: "获取 (GitHub)",
      },
      {
        name: "Windows Optimizer",
        description: "一组免费的系统工具，帮助用户管理和优化计算机性能。",
        href: "https://github.com/hellzerg/optimizer",
        icon: "https://img.utdstc.com/icon/fc0/194/fc0194b57dcbfa96178fa337ef482e51975a575ec91c6b3bc0134c0f6269e375",
        action: "获取 (GitHub)",
      },
      {
        name: "Rufus",
        description: "开源的启动盘制作工具，帮助用户创建可启动的 USB 驱动器，用于安装操作系统。",
        href: "https://github.com/pbatard/rufus",
        icon: "https://rufus.ie/pics/rufus-256.png",
        action: "获取 (GitHub)",
      },
      {
        name: "Advance Download Manager",
        description: "Android 下载管理工具，帮助用户更有效地管理和加速下载任务。",
        href: "https://www.puresys.net/9111.html",
        icon: "https://image.winudf.com/v2/image1/Y29tLmR2LmFkbV9pY29uXzE1NjYwOTAxMjVfMDcz/icon.png?w=120&fakeurl=1",
      },
      {
        name: "PixPin",
        description: "功能强大的截图工具，支持截图、录屏、贴图和 OCR 文字识别等功能。",
        href: "https://pixpin.cn/",
        icon: "https://pixpin.cn/favicon.ico",
      },
      {
        name: "V2RayN",
        description: "基于 V2Ray 核心的 Windows 平台客户端，提供网络代理功能。",
        href: "https://github.com/2dust/v2rayN",
        icon: "https://img.icons8.com/p1em/1200/github.jpg",
        action: "获取 (GitHub)",
      },
      {
        name: "V2RayNG",
        description: "基于 V2Ray 核心的 Android 平台客户端，提供网络代理功能。",
        href: "https://github.com/2dust/v2rayNG",
        icon: "https://img.icons8.com/p1em/1200/github.jpg",
        action: "获取 (GitHub)",
      },
      {
        name: "Everything",
        description: "快速文件搜索工具，帮助用户在 Windows 系统中迅速找到所需文件。",
        href: "https://www.voidtools.com/zh-cn/downloads/",
        icon: "https://www.voidtools.com/e2.png",
      },
      {
        name: "微信",
        description: "多功能的社交应用，提供消息发送、语音通话、视频通话等功能。",
        href: "https://weixin.qq.com/",
        icon: "https://res.wx.qq.com/a/wx_fed/assets/res/NTI4MWU5.ico",
      },
      {
        name: "QQ",
        description: "即时通讯软件，提供消息发送、语音通话、视频通话等功能。",
        href: "https://im.qq.com/",
        icon: "https://qq-web.cdn-go.cn//im.qq.com_new/7bce6d6d/asset/favicon.ico",
      },
    ],
  },
];

useSeoMeta({
  title: "软件推荐 - Kitten Haley",
  description: "Kitten Haley 推荐的开发、娱乐和实用工具软件列表。",
  ogTitle: "软件推荐 - Kitten Haley",
  ogDescription: "Kitten Haley 推荐的开发、娱乐和实用工具软件列表。",
});
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <SiteHeader />

    <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl flex-1 py-12 sm:py-16">
      <header class="mb-16 text-center">
        <p class="mb-3 text-sm font-semibold tracking-[0.12em] text-primary">Software Recommendations</p>
        <h1 class="text-4xl font-bold tracking-tight sm:text-6xl">软件推荐</h1>
        <p class="mx-auto mt-5 max-w-2xl text-lg text-muted">这里是我推荐的一些实用软件，希望对你有所帮助。</p>
      </header>

      <div class="flex flex-col gap-10">
        <section v-for="section in sections" :id="section.id" :key="section.id" class="flex flex-col">
          <div class="mb-10 flex items-baseline gap-3 border-b border-border pb-4">
            <h2 class="text-3xl font-bold">{{ section.title }}</h2>
            <span class="text-sm font-normal text-muted">{{ section.subtitle }}</span>
          </div>

          <div class="software-grid">
            <article v-for="software in section.items" :key="software.name"
              class="flex h-full flex-col rounded-2xl border border-border bg-background/60 p-6 shadow-sm backdrop-blur transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg">
              <div class="flex flex-1 flex-col">
                <div
                  class="mb-5 flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-border bg-background p-3">
                  <img :src="software.icon" :alt="`${software.name} 图标`" class="h-full w-full object-contain"
                    loading="lazy" />
                </div>
                <h3 class="text-xl font-semibold">{{ software.name }}</h3>
                <p class="mt-3 flex-1 text-sm leading-7 text-muted">{{ software.description }}</p>
              </div>
              <PlaneLink :href="software.href" class="mt-6 w-full bg-primary shadow-sm"
                :aria-label="`${software.action ?? '获取'} ${software.name}`">
                {{ software.action ?? "获取" }}
              </PlaneLink>
            </article>
          </div>
        </section>
      </div>
    </main>

    <SiteFooter />
  </div>
</template>

<style scoped>
.software-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
</style>