<script setup lang="ts">
import { DocumentArrowUp20Regular, DocumentSave20Regular, Delete20Regular } from "@ntkrnl64/fluentui-vue-icons";
import { Codemirror } from "vue-codemirror";
import { basicSetup } from "codemirror";
import { EditorView } from "@codemirror/view";
import type { ViewUpdate } from "@codemirror/view";
import type { EditorState, Extension } from "@codemirror/state";
import { oneDark } from "@codemirror/theme-one-dark";

// 语言包导入
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { markdown } from "@codemirror/lang-markdown";

interface LanguageOption {
  value: string;
  label: string;
  extensions: string[];
}

const languages: LanguageOption[] = [
  { value: "text/plain", label: "Plain Text", extensions: [".txt"] },
  { value: "javascript", label: "JavaScript", extensions: [".js", ".mjs"] },
  { value: "python", label: "Python", extensions: [".py"] },
  { value: "html", label: "HTML", extensions: [".html", ".htm"] },
  { value: "css", label: "CSS", extensions: [".css"] },
  { value: "text/x-csrc", label: "C", extensions: [".c"] },
  { value: "text/x-c++src", label: "C++", extensions: [".cpp", ".cc", ".cxx"] },
  { value: "text/x-java", label: "Java", extensions: [".java"] },
  { value: "markdown", label: "Markdown", extensions: [".md"] },
];

const code = ref("");
const fileName = ref("myfile");
const language = ref("text/plain");
const status = ref("就绪 - 开始编写代码");
const showHelp = ref(false);
const showClearConfirm = ref(false);
const fileInput = ref<HTMLInputElement>();
const cursorPosition = ref({ line: 1, column: 1 });
const currentLanguage = computed(
  () => languages.find((item) => item.value === language.value)?.label ?? "Plain Text",
);

// 监听站点是否处于暗色模式
const isDark = ref(false);

// 自定义基础主题：保持背景透明以融入外部卡片容器，并统一些字体样式
const editorTheme = EditorView.theme({
  "&": {
    height: "100%",
    backgroundColor: "transparent",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
    lineHeight: "1.65",
    fontSize: "0.875rem",
  },
  ".cm-content": {
    padding: "14px 0",
  },
  // 让行号背景透明，颜色跟随外部主题的 muted-foreground
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "none",
    color: "hsl(var(--muted-foreground))",
  },
});

// 各语言对应的 CodeMirror 语言包实例（模块级缓存，避免重复创建）
const langExtensions: Record<string, Extension> = {
  javascript: javascript(),
  python: python(),
  html: html(),
  css: css(),
  "text/x-csrc": cpp(),
  "text/x-c++src": cpp(),
  "text/x-java": java(),
  markdown: markdown(),
};

// 动态计算扩展项
const extensions = computed<Extension[]>(() => {
  const langExt = langExtensions[language.value];

  // 拼装顺序：基础功能 -> 暗色主题(可选) -> 自定义透明样式 -> 语言包
  // 把 editorTheme 放在 oneDark 后面，确保背景透明的自定义样式能覆盖暗色主题的默认背景
  const baseExt = [basicSetup];

  if (isDark.value) {
    baseExt.push(oneDark);
  }

  baseExt.push(editorTheme);

  if (langExt) {
    baseExt.push(langExt);
  }

  return baseExt;
});

useSeoMeta({
  title: "Fluent Code Editor - Haley",
  description: "支持多种语言、文件读写与主题切换的在线代码编辑器。",
});

function updateCursorFromState(state: EditorState) {
  const pos = state.selection.main.head;
  const line = state.doc.lineAt(pos);
  cursorPosition.value = {
    line: line.number,
    column: pos - line.from + 1,
  };
}

function handleReady(payload: { state: EditorState }) {
  updateCursorFromState(payload.state);
}

function handleUpdate(viewUpdate: ViewUpdate) {
  updateCursorFromState(viewUpdate.state);
}

function updateStatus(message: string) {
  status.value = message;
}

function handleKeydown(event: KeyboardEvent) {
  const modifier = event.ctrlKey || event.metaKey;
  if (modifier && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveFile();
  } else if (modifier && event.key.toLowerCase() === "e") {
    event.preventDefault();
    requestClear();
  }
}

function saveFile() {
  if (!code.value.trim()) {
    updateStatus("提示：编辑器内容为空");
    return;
  }
  const name = fileName.value.trim() || "file";
  fileName.value = name;
  const blob = new Blob([code.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
  updateStatus(`文件已下载: ${name}`);
}

function openFilePicker() {
  fileInput.value?.click();
}

function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    updateStatus("错误：文件过大（最大支持 10MB）");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    code.value = typeof reader.result === "string" ? reader.result : "";
    fileName.value = file.name;
    const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const detected = languages.find((item) => item.extensions.includes(extension));
    language.value = detected?.value ?? "text/plain";
    updateStatus(`已加载文件: ${file.name}`);
  };
  reader.onerror = () => updateStatus("错误：无法读取文件");
  reader.readAsText(file);
}

function requestClear() {
  if (!code.value.trim()) {
    updateStatus("提示：编辑器内容已为空");
    return;
  }
  showClearConfirm.value = true;
}

function performClear() {
  code.value = "";
  fileName.value = "myfile";
  language.value = "text/plain";
  showClearConfirm.value = false;
  updateStatus("编辑器内容已清空");
}

function handleLanguageChange(value: unknown) {
  language.value = String(value ?? "text/plain");
  updateStatus(`已切换到: ${currentLanguage.value}`);
}

// 初始化时检查当前系统/站点是否为暗色模式，并监听变化
onMounted(() => {
  window.addEventListener("keydown", handleKeydown);

  // 检查暗色模式 (兼容 Tailwind 的 dark class 或系统的 prefers-color-scheme)
  const checkDarkMode = () => {
    isDark.value = document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  checkDarkMode();

  // 使用 MutationObserver 监听 HTML 标签上的 class 变化（应对用户手动切换主题）
  const observer = new MutationObserver(checkDarkMode);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

  onUnmounted(() => {
    observer.disconnect();
  });
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div>
    <main class="mx-auto flex min-h-[calc(100vh-5rem)] w-[calc(100%-2rem)] max-w-6xl flex-col py-8 sm:py-12">
      <header class="mb-8">
        <p class="mb-2 text-sm font-semibold tracking-[0.12em] text-primary uppercase">Toolkit</p>
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">Fluent Code Editor</h1>
        <p class="mt-3 text-muted-foreground">轻量、专注的在线代码编辑器。</p>
      </header>

      <section class="flex flex-1 flex-col overflow-hidden rounded-2xl border bg-card shadow-xl">
        <!-- 工具栏 -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
          <div class="flex flex-wrap gap-2">
            <Button variant="outline" @click="openFilePicker">
              <DocumentArrowUp20Regular /> 上传文件
            </Button>
            <Button @click="saveFile">
              <DocumentSave20Regular /> 下载文件
            </Button>
            <input ref="fileInput" class="hidden" type="file" @change="handleFileUpload" />
          </div>
          <Button @click="requestClear" class="flex ml-auto">
            <Delete20Regular /> 清空内容
          </Button>
        </div>

        <!-- 文件名 / 语言 -->
        <div class="grid gap-3 border-b p-4 sm:grid-cols-2">
          <label class="flex items-center gap-3 text-sm font-semibold">
            <span class="w-14 shrink-0">文件名</span>
            <Input v-model="fileName" placeholder="输入文件名" />
          </label>
          <div class="flex items-center gap-3 text-sm font-semibold">
            <span class="w-14 shrink-0">语言</span>
            <Select :model-value="language" @update:model-value="handleLanguageChange">
              <SelectTrigger class="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="item in languages" :key="item.value" :value="item.value">
                  {{ item.label }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <!-- 代码编辑区（CodeMirror 6） -->
        <div class="flex min-h-112 flex-1 flex-col overflow-hidden bg-muted/40">
          <!-- 建议使用 ClientOnly 防止 Nuxt SSR 报错 -->
          <ClientOnly>
            <Codemirror v-model="code" :extensions="extensions" placeholder="开始编写代码..." :indent-with-tab="true"
              :tab-size="4" :autofocus="true" class="flex-1" @ready="handleReady" @update="handleUpdate" />
          </ClientOnly>
        </div>

        <!-- 状态栏 -->
        <div class="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2 text-xs">
          <span>{{ status }}</span>
          <Button variant="link" size="sm" class="h-auto p-0 text-xs" @click="showHelp = true">
            使用说明
          </Button>
          <span>行数: {{ cursorPosition.line }} | 列数: {{ cursorPosition.column }}</span>
        </div>
      </section>
    </main>

    <!-- 使用说明 -->
    <Dialog v-model:open="showHelp">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>使用说明</DialogTitle>
          <DialogDescription>
            欢迎使用 Fluent 代码编辑器！在这里编写代码，完成后可以下载到本地。
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-5 text-sm">
          <section>
            <h3 class="mb-2 font-semibold">核心功能</h3>
            <ul class="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li>支持 JavaScript、Python、HTML、CSS、C/C++、Java 和 Markdown。</li>
              <li>支持本地文件上传、下载和根据扩展名自动识别语言。</li>
              <li>内置语法高亮、行号、括号匹配与自动缩进。</li>
              <li>实时显示光标位置，支持 Tab 缩进。</li>
            </ul>
          </section>

          <section>
            <h3 class="mb-2 font-semibold">快捷键</h3>
            <ul class="list-disc space-y-1.5 pl-5 text-muted-foreground">
              <li><strong class="text-foreground">Ctrl / ⌘ + S</strong>：下载当前文件。</li>
              <li><strong class="text-foreground">Ctrl / ⌘ + E</strong>：打开清空确认。</li>
              <li><strong class="text-foreground">Tab</strong>：插入四个空格。</li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 清空确认 -->
    <Dialog v-model:open="showClearConfirm">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>确认操作</DialogTitle>
          <DialogDescription>
            您确定要清空编辑器中的所有内容吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" @click="showClearConfirm = false">取消</Button>
          <Button @click="performClear">确认清空</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>

</template>