<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

type Html2Canvas = (
  element: HTMLElement,
  options: {
    width: number;
    height: number;
    useCORS: boolean;
    allowTaint: boolean;
    onprogress: (progress: number) => void;
  },
) => Promise<HTMLCanvasElement>;

const url = ref("");
const iframeSource = ref("about:blank");
const iframeRef = ref<HTMLIFrameElement>();
const statusMessage = ref("请在左侧输入网址以开始。");
const headers = ref("");
const progress = ref(0);
const isLoading = ref(false);
const isCapturing = ref(false);
const isReady = ref(false);
const downloadUrl = ref("");
const downloadName = ref("snapshot.png");

let loadTimeout: ReturnType<typeof setTimeout> | undefined;
let captureTimeout: ReturnType<typeof setTimeout> | undefined;
let html2CanvasPromise: Promise<Html2Canvas> | undefined;

if (import.meta.client) {
  headers.value = [
    `User-Agent: ${navigator.userAgent}`,
    `Platform: ${navigator.platform}`,
    `Language: ${navigator.language}`,
    `Vendor: ${navigator.vendor}`,
  ].join("\n");
}

async function handlePaste() {
  try {
    url.value = await navigator.clipboard.readText();
    statusMessage.value = "链接已成功粘贴！";
    await loadPage();
  } catch (error) {
    console.error("Clipboard read failed:", error);
    statusMessage.value = "无法读取剪贴板。请确保您已授予权限。";
  }
}

async function loadPage() {
  const target = url.value.trim();
  if (!/^https?:\/\//i.test(target)) {
    statusMessage.value = "错误：请输入一个有效的、以 http:// 或 https:// 开头的网址。";
    return;
  }

  clearTimeout(loadTimeout);
  isReady.value = false;
  isLoading.value = true;
  downloadUrl.value = "";
  statusMessage.value = "正在加载目标网页...";
  iframeSource.value = "about:blank";
  await nextTick();
  iframeSource.value = target;

  loadTimeout = setTimeout(() => {
    isLoading.value = false;
    statusMessage.value = `错误：加载超时。目标网站 (${target}) 可能禁止了嵌入。`;
  }, 20_000);
}

function handleFrameLoad() {
  if (!isLoading.value) return;
  clearTimeout(loadTimeout);
  isLoading.value = false;
  isReady.value = true;
  statusMessage.value = "网页加载成功！您现在可以与下方页面交互，并在合适的时机点击按钮生成快照。";
}

async function loadHtml2Canvas() {
  if (!import.meta.client) throw new Error("html2canvas 只能在浏览器中加载。");
  if (html2CanvasPromise) return html2CanvasPromise;

  html2CanvasPromise = new Promise<Html2Canvas>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-html2canvas="capture-screen"]',
    );
    if (existing) {
      if (window.html2canvas) {
        resolve(window.html2canvas);
        return;
      }
      existing.addEventListener("load", () => resolve(window.html2canvas));
      existing.addEventListener("error", () => reject(new Error("html2canvas 加载失败。")));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    script.dataset.html2canvas = "capture-screen";
    script.onload = () => resolve(window.html2canvas);
    script.onerror = () => reject(new Error("html2canvas 加载失败。"));
    document.head.appendChild(script);
  });

  return html2CanvasPromise;
}

async function capturePage() {
  const documentInFrame = iframeRef.value?.contentDocument;
  if (!documentInFrame?.body) {
    statusMessage.value = "错误：无法访问网页内容。目标网站可能禁止了跨域访问。";
    return;
  }

  clearTimeout(captureTimeout);
  isCapturing.value = true;
  progress.value = 0;
  statusMessage.value = "正在准备生成快照...";
  resetCaptureTimeout();

  try {
    const html2canvas = await loadHtml2Canvas();
    const canvas = await html2canvas(documentInFrame.body, {
      width: documentInFrame.documentElement.scrollWidth,
      height: documentInFrame.documentElement.scrollHeight,
      useCORS: true,
      allowTaint: true,
      onprogress: (value) => {
        progress.value = Math.round(value * 100);
        resetCaptureTimeout();
      },
    });

    downloadUrl.value = canvas.toDataURL("image/png");
    let hostname = "page";
    try {
      hostname = new URL(url.value).hostname || hostname;
    } catch {
      console.warn("Could not determine the download hostname.");
    }
    downloadName.value = `snapshot-${hostname}-${Date.now()}.png`;
    statusMessage.value = "快照生成成功！您可以下载图片了。";
  } catch (error) {
    console.error("Screenshot capture failed:", error);
    statusMessage.value = "错误：生成图片失败。可能是由于网站内容的安全限制。";
  } finally {
    clearTimeout(captureTimeout);
    isCapturing.value = false;
  }
}

function resetCaptureTimeout() {
  clearTimeout(captureTimeout);
  captureTimeout = setTimeout(() => {
    isCapturing.value = false;
    statusMessage.value = "错误：生成超时，页面可能过于复杂或存在兼容性问题。";
  }, 30_000);
}

function handleFrameError() {
  clearTimeout(loadTimeout);
  isLoading.value = false;
  isReady.value = false;
  statusMessage.value = `错误：加载失败。目标网站 (${url.value.trim()}) 明确拒绝了连接。`;
}

onBeforeUnmount(() => {
  clearTimeout(loadTimeout);
  clearTimeout(captureTimeout);
});

declare global {
  interface Window {
    html2canvas: Html2Canvas;
  }
}
</script>

<template>
  <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl py-12 sm:py-16">
    <header class="page-header">
      <p class="page-eyebrow">{{ t("pageHeaders.captureScreen.eyebrow") }}</p>
      <h1 class="page-title">{{ t("pageHeaders.captureScreen.title") }}</h1>
      <p class="page-description">{{ t("pageHeaders.captureScreen.description") }}</p>
    </header>

    <div class="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-12">
      <section class="flex flex-col gap-8">
        <div>
          <div class="flex items-center gap-3">
            <Input v-model="url" class="min-w-0 flex-1" placeholder="输入或粘贴一个完整的网址" @keyup.enter="loadPage" />
            <div class="flex shrink-0 gap-2">
              <Button variant="outline" type="button" @click="handlePaste">粘贴</Button>
              <Button type="button" @click="loadPage">加载网页</Button>
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div class="flex items-start justify-between gap-4">
            <p class="max-w-prose text-sm leading-6 text-muted-foreground">{{ statusMessage }}</p>
            <span v-if="isReady" class="shrink-0 text-xs font-medium text-primary">已就绪</span>
          </div>
          <div v-if="isCapturing" class="flex items-center gap-3">
            <progress class="h-2 w-full accent-primary" :value="progress" max="100"></progress>
            <span class="w-10 text-right text-sm tabular-nums text-muted-foreground">{{ progress }}%</span>
          </div>
          <div class="flex flex-wrap gap-3">
            <Button v-if="isReady && !isCapturing" type="button" @click="capturePage">手动捕获页面</Button>
            <a v-if="downloadUrl" :href="downloadUrl" :download="downloadName"
              class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover">
              下载 PNG 图片
            </a>
          </div>
        </div>

        <div class="space-y-6 border-t border-border pt-8 text-sm">
          <div>
            <h2 class="font-semibold">重要说明</h2>
            <p class="mt-2 leading-6 text-muted-foreground">
              由于浏览器安全策略，本工具无法捕获所有网站。若目标网站禁止被嵌入，则快照将失败或显示为空白。
            </p>
          </div>
          <div>
            <h2 class="font-semibold">浏览器信息</h2>
            <pre
              class="mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-6 text-muted-foreground">{{ headers }}</pre>
          </div>
        </div>
      </section>

      <section class="min-w-0">
        <div class="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div class="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 class="text-sm font-semibold">网页预览</h2>
            <span class="text-xs text-muted-foreground">{{ isReady ? "可交互" : "等待加载" }}</span>
          </div>
          <iframe ref="iframeRef" :src="iframeSource" title="网页预览" class="h-[min(70vh,800px)] w-full bg-background"
            sandbox="allow-same-origin allow-scripts allow-forms" @load="handleFrameLoad"
            @error="handleFrameError"></iframe>
        </div>
      </section>
    </div>
  </main>
</template>