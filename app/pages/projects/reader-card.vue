<script setup lang="ts">
import { CalendarLtr16Regular, ChevronDown20Regular } from "@ntkrnl64/fluentui-vue-icons";
import { parseDate } from "@internationalized/date";
import { computed, ref, watch } from "vue";
import { toast } from "vue-sonner";

const { t, locale } = useI18n();

useHead({
  link: [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "anonymous" },
  ],
});

const googleFontFamilies: Record<string, string> = {
  "Long Cang": "Long Cang",
  "LXGW WenKai TC": "LXGW WenKai TC:wght@400;700",
  "Ma Shan Zheng": "Ma Shan Zheng",
  "Noto Sans SC": "Noto Sans SC:wght@400;700",
  "Noto Serif SC": "Noto Serif SC:wght@400;700",
  "ZCOOL KuaiLe": "ZCOOL KuaiLe",
  "ZCOOL XiaoWei": "ZCOOL XiaoWei",
};
const fontStylesheets = new Map<string, Promise<void>>();

interface ReaderCardState {
  title: string;
  name: string;
  book: string;
  author: string;
  date: string;
  quote: string;
  insight: string;
  titleFont: string;
  textFont: string;
  titleColor: string;
  textColor: string;
  background: string;
  accent: string;
}

const today = new Date();
const state = ref<ReaderCardState>({
  title: "致所有不甘平凡的你",
  name: "一位读者",
  book: "我生来就是高山",
  author: "佚名",
  date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
  quote: "我生来就是高山而非溪流，我欲于群峰之巅俯视平庸的沟壑；我生来就是人杰而非草芥，我站在伟人之肩俯视卑微的懦夫。",
  insight: "真正的成长，是不再用别人的尺度衡量自己，勇敢地走向想去的地方。",
  titleFont: "'Noto Serif SC', serif",
  textFont: "'Noto Serif SC', serif",
  titleColor: "#1d4ed8",
  textColor: "#1f2937",
  background: "#ffffff",
  accent: "#2563eb",
});

const imageData = ref("");
const outputData = ref("");
const showExamples = ref(false);
const fileInput = ref<HTMLInputElement>();
const cardRef = ref<HTMLElement>();

// 导出状态
const exporting = ref(false);
const exportError = ref("");
const exportScale = ref(2);
const exportFileName = ref("reader-card.png");

watch(
  () => [state.value.titleFont, state.value.textFont],
  ([titleFont, textFont]) => {
    if (typeof document === "undefined") return;
    void waitForFonts([titleFont, textFont].filter((font): font is string => Boolean(font))).catch((error) => {
      console.error("Reader card font loading failed:", error);
      toast.error("字体加载失败，预览将使用备用字体。");
    });
  },
  { immediate: true },
);

const formattedDate = computed(() => {
  if (!state.value.date) return "未设置日期";
  const [year, month, day] = state.value.date.split("-");
  return `${year}/${Number(month)}/${Number(day)}`;
});

const cardDate = computed({
  get: () => {
    try {
      return parseDate(state.value.date);
    } catch {
      return undefined;
    }
  },
  set: (value) => {
    if (value) state.value.date = value.toString();
  },
});

const examples = [
  {
    quote: "满地都是六便士，他却抬头看见了月亮。",
    insight: "理想与现实的冲突永恒存在，精神的追求同样值得被认真对待。",
    book: "月亮与六便士",
    author: "毛姆",
  },
  {
    quote: "生活不可能像你想象的那么好，但也不会像你想象的那么糟。",
    insight: "以平和的心态面对生活的起伏，也允许自己慢慢成为更好的人。",
    book: "一生",
    author: "莫泊桑",
  },
  {
    quote: "我们终此一生，就是要摆脱他人的期待，找到真正的自己。",
    insight: "愿我们都能听见自己的声音，把人生的选择权交还给自己。",
    book: "无声告白",
    author: "伍绮诗",
  },
  {
    quote: "一个人知道自己为什么而活，就能忍受任何一种生活。",
    insight: "找到值得坚持的目标，便能在困境中保有继续前行的力量。",
    book: "尼采语录",
    author: "弗里德里希·尼采",
  },
  {
    quote: "独立之思想，自由之精神——陈寅恪",
    insight: "保持独立思考与精神自由，不因外界声音轻易放弃自己的判断。",
    book: "王国维纪念碑铭",
    author: "陈寅恪",
  },
  {
    quote: "请你务必一而再、再而三、三而不竭，千次万次，毫不犹豫地救自己于水火之中。",
    insight: "照顾自己不是自私；每一次重新站起来，都值得被认真对待。",
    book: "写给自己的话",
    author: "佚名",
  },
];

function loadExample(example: (typeof examples)[number]) {
  Object.assign(state.value, example);
}

function loadRandomExample() {
  const example = examples[Math.floor(Math.random() * examples.length)];
  if (example) loadExample(example);
}

function openFilePicker() {
  fileInput.value?.click();
}

function handleImage(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    imageData.value = typeof reader.result === "string" ? reader.result : "";
  };
  reader.readAsDataURL(file);
}

// 导出相关工具

const CARD_WIDTH = 1200;
const CARD_HEIGHT = 900;

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// 单行文字超宽时截断并补省略号
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  const chars = Array.from(text);
  while (chars.length > 0 && ctx.measureText(`${chars.join("")}…`).width > maxWidth) {
    chars.pop();
  }
  return `${chars.join("")}…`;
}

// 按实际像素宽度换行，最多 maxLines 行，超出补省略号
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const lines: string[] = [];
  if (!text.trim()) return lines;

  for (const paragraph of text.split("\n")) {
    const chars = Array.from(paragraph);
    if (chars.length === 0) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const ch of chars) {
      const candidate = line + ch;
      if (line && ctx.measureText(candidate).width > maxWidth) {
        lines.push(line);
        line = ch;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
  }

  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1] ?? "";
    while (last && ctx.measureText(`${last}…`).width > maxWidth) {
      last = Array.from(last).slice(0, -1).join("");
    }
    kept[maxLines - 1] = `${last}…`;
    return kept;
  }
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("头像图片加载失败"));
    img.src = src;
  });
}

function loadFontStylesheet(fontFamily: string): Promise<void> {
  const googleFamily = googleFontFamilies[fontFamily];
  if (!googleFamily) return Promise.resolve();

  const existing = fontStylesheets.get(fontFamily);
  if (existing) return existing;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?${new URLSearchParams({
    family: googleFamily,
    display: "swap",
  })}`;

  const loading = new Promise<void>((resolve, reject) => {
    link.onload = () => resolve();
    link.onerror = () => {
      link.remove();
      fontStylesheets.delete(fontFamily);
      reject(new Error(`无法加载字体「${fontFamily}」，请检查网络连接。`));
    };
  });
  fontStylesheets.set(fontFamily, loading);
  document.head.append(link);
  return loading;
}

function getFontFamily(fontStack: string): string {
  return fontStack.split(",")[0]?.trim().replace(/^['"]|['"]$/g, "") ?? fontStack;
}

// Load the selected families and weights before drawing text to canvas.
async function waitForFonts(fontStacks: string[]) {
  if (typeof document === "undefined" || !document.fonts) {
    throw new Error("当前环境无法加载字体。");
  }
  const unique = Array.from(new Set(fontStacks));
  await Promise.all(
    unique.map(async (fontStack) => {
      await loadFontStylesheet(getFontFamily(fontStack));
      await Promise.all(
        [400, 700].map((weight) =>
          document.fonts.load(`${weight} 16px ${fontStack}`, "汉字AaBb123"),
        ),
      );
    }),
  );
  await document.fonts.ready;
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// 导出主流程
async function exportCard() {
  if (exporting.value) return;
  exporting.value = true;
  exportError.value = "";

  try {
    const scale = Math.min(4, Math.max(1, Number(exportScale.value) || 2));
    const width = CARD_WIDTH;
    const height = CARD_HEIGHT;
    const titleFont = state.value.titleFont;
    const textFont = state.value.textFont;

    // 确保字体与头像就绪
    await waitForFonts([titleFont, textFont]);

    const avatar = imageData.value
      ? await loadImage(imageData.value).catch(() => null)
      : null;

    // 建画布，按 scale 放大保证清晰度
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("当前浏览器不支持 Canvas，无法导出图片。");
    ctx.scale(scale, scale);
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";

    // 圆角裁剪，让导出图四角透明
    roundRectPath(ctx, 0, 0, width, height, 34);
    ctx.save();
    ctx.clip();

    // 背景
    ctx.fillStyle = state.value.background;
    ctx.fillRect(0, 0, width, height);

    // 左侧色条
    ctx.fillStyle = state.value.accent;
    ctx.fillRect(0, 0, 16, height);

    // 标题
    ctx.fillStyle = state.value.titleColor;
    ctx.font = `700 46px ${titleFont}`;
    ctx.fillText(fitText(ctx, state.value.title.trim() || "卡片标题", 1048), 76, 105);

    // 摘录者 + 日期
    ctx.fillStyle = state.value.textColor;
    ctx.globalAlpha = 0.62;
    ctx.font = `400 20px ${titleFont}`;
    ctx.fillText(
      `${state.value.name.trim() || "摘录者"}　摘录于 ${formattedDate.value}`,
      76,
      148,
    );
    ctx.globalAlpha = 1;

    // 分隔线
    ctx.strokeStyle = state.value.accent;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(76, 190);
    ctx.lineTo(width - 76, 190);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // 引号
    ctx.fillStyle = state.value.accent;
    ctx.font = `68px Georgia, "Songti SC", serif`;
    ctx.fillText("“", 76, 300);

    // 正文（最多 5 行，自动省略）
    ctx.fillStyle = state.value.textColor;
    ctx.font = `400 30px ${textFont}`;
    const quoteLines = wrapText(ctx, state.value.quote, 998, 5);
    quoteLines.forEach((line, index) => {
      ctx.fillText(line, 126, 270 + index * 48);
    });

    // 读书感悟（最多 3 行，框高随行数变化）
    const insight = state.value.insight.trim();
    if (insight) {
      ctx.font = `400 21px ${textFont}`;
      const insightLines = wrapText(ctx, insight, 1048 - 56, 3);
      if (insightLines.length > 0) {
        const boxX = 76;
        const boxY = 535;
        const boxW = 1048;
        const lineHeight = 33;
        const paddingY = 26;
        const boxH = paddingY * 2 + insightLines.length * lineHeight;

        ctx.globalAlpha = 0.08;
        ctx.fillStyle = state.value.accent;
        roundRectPath(ctx, boxX, boxY, boxW, boxH, 16);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = state.value.textColor;
        insightLines.forEach((line, index) => {
          ctx.fillText(line, boxX + 28, boxY + paddingY + 18 + index * lineHeight);
        });
      }
    }

    // 头像（圆形裁剪 + cover）
    const avatarCx = 122;
    const avatarCy = 781;
    const avatarR = 46;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avatarCx, avatarCy, avatarR, 0, Math.PI * 2);
    ctx.clip();
    if (avatar) {
      const size = avatarR * 2;
      const ratio = Math.max(size / avatar.width, size / avatar.height);
      const drawW = avatar.width * ratio;
      const drawH = avatar.height * ratio;
      ctx.drawImage(avatar, avatarCx - drawW / 2, avatarCy - drawH / 2, drawW, drawH);
    } else {
      ctx.fillStyle = state.value.accent;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(avatarCx - avatarR, avatarCy - avatarR, avatarR * 2, avatarR * 2);
      ctx.globalAlpha = 1;
      ctx.fillStyle = state.value.accent;
      ctx.font = `400 18px ${textFont}`;
      ctx.textAlign = "center";
      ctx.fillText("阅读", avatarCx, avatarCy + 6);
      ctx.textAlign = "left";
    }
    ctx.restore();

    // 书籍信息
    ctx.fillStyle = state.value.textColor;
    ctx.globalAlpha = 0.62;
    ctx.font = `400 19px ${titleFont}`;
    ctx.fillText("—— 摘自", 200, 765);
    ctx.globalAlpha = 1;

    ctx.font = `400 25px ${titleFont}`;
    const bookText = `${state.value.book.trim() || "书籍标题"} · ${state.value.author.trim() || "作者姓名"}`;
    ctx.fillText(fitText(ctx, bookText, 900), 200, 802);

    // 右下角 READ 水印
    ctx.fillStyle = state.value.accent;
    ctx.globalAlpha = 0.14;
    ctx.font = `700 82px ${textFont}`;
    ctx.textAlign = "right";
    ctx.fillText("READ", width - 76, 840);
    ctx.textAlign = "left";
    ctx.globalAlpha = 1;

    ctx.restore(); // 解除圆角裁剪

    // 4. 输出并下载
    const dataUrl = canvas.toDataURL("image/png");
    outputData.value = dataUrl;

    const stamp =
      state.value.date.replace(/\D/g, "") ||
      new Date().toISOString().slice(0, 10).replace(/-/g, "");
    exportFileName.value = `reader-card-${stamp}.png`;
    downloadDataUrl(dataUrl, exportFileName.value);
    toast.success("读书卡片已成功导出。");
  } catch (error) {
    exportError.value =
      error instanceof Error ? error.message : "导出失败，请稍后重试。";
    console.error(error);
    toast.error(exportError.value);
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <div>
    <main class="mx-auto w-[calc(100%-2rem)] max-w-6xl py-12 sm:py-16">
      <header class="page-header">
        <p class="page-eyebrow">{{ t("pageHeaders.readerCard.eyebrow") }}</p>
        <h1 class="page-title">{{ t("pageHeaders.readerCard.title") }}</h1>
        <p class="page-description">{{ t("pageHeaders.readerCard.description") }}</p>
      </header>

      <div class="grid gap-8 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section class="space-y-6 rounded-2xl border border-border bg-background/70 p-6 shadow-sm">
          <div>
            <h2 class="text-xl font-semibold">卡片内容</h2>
            <p class="mt-1 text-sm text-muted">编辑内容后，右侧预览会即时更新。</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel for="card-title">卡片标题</FieldLabel>
              <Input id="card-title" v-model="state.title" placeholder="例如：致所有不甘平凡的你" />
            </Field>
            <Field>
              <FieldLabel for="card-name">摘录者</FieldLabel>
              <Input id="card-name" v-model="state.name" placeholder="输入您的名字" />
            </Field>
            <Field>
              <FieldLabel for="card-book">书籍标题</FieldLabel>
              <Input id="card-book" v-model="state.book" placeholder="输入书籍名称" />
            </Field>
            <Field>
              <FieldLabel for="card-author">书籍作者</FieldLabel>
              <Input id="card-author" v-model="state.author" placeholder="输入作者姓名" />
            </Field>
            <Field>
              <FieldLabel for="card-date">摘录日期</FieldLabel>
              <Popover>
                <PopoverTrigger as-child>
                  <Button id="card-date" variant="outline" class="w-full justify-start font-normal">
                    <CalendarLtr16Regular class="size-4 text-muted" aria-hidden="true" />
                    {{ formattedDate }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="cardDate" :locale="locale" />
                </PopoverContent>
              </Popover>
            </Field>
            <Field>
              <FieldLabel>个人照片</FieldLabel>
              <div class="flex items-center gap-3">
                <Avatar class="size-12 shrink-0">
                  <AvatarImage v-if="imageData" :src="imageData" alt="个人照片预览" />
                  <AvatarFallback class="text-xs"
                    :style="{ backgroundColor: `${state.accent}14`, color: state.accent }">头像</AvatarFallback>
                </Avatar>
                <Button variant="outline" class="justify-start font-normal" @click="openFilePicker">
                  {{ imageData ? "更换图片" : "选择图片" }}
                </Button>
              </div>
              <input ref="fileInput" class="hidden" type="file" accept="image/*" @change="handleImage">
            </Field>
          </div>

          <div class="border-t border-border pt-6">
            <div class="mb-3 flex items-center justify-between gap-3">
              <h2 class="text-xl font-semibold">阅读内容</h2>
              <Button variant="ghost" size="sm" class="text-primary hover:text-primary" @click="loadRandomExample">
                加载随机示例
              </Button>
            </div>
            <Field>
              <FieldLabel for="card-quote">摘抄内容</FieldLabel>
              <Textarea id="card-quote" v-model="state.quote" rows="5" class="resize-y leading-relaxed" />
            </Field>
            <div class="mt-4 rounded-lg border border-border">
              <button type="button" class="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium"
                :aria-expanded="showExamples" aria-controls="recommended-examples"
                @click="showExamples = !showExamples">
                推荐示例（{{ examples.length }}）
                <ChevronDown20Regular aria-hidden="true"
                  class="size-4 shrink-0 text-muted transition-transform duration-200 motion-reduce:transition-none"
                  :class="{ 'rotate-180': showExamples }" />
              </button>
              <Transition name="recommendations">
                <div v-if="showExamples" id="recommended-examples" class="recommendations-panel">
                  <div class="min-h-0 overflow-hidden px-3 pb-3">
                    <p class="mb-2 text-xs text-muted">选择一个示例，填充摘抄、感悟和书籍信息</p>
                    <div class="grid gap-2 sm:grid-cols-2">
                      <Button v-for="example in examples" :key="example.quote" variant="outline"
                        class="h-auto min-h-24 flex-col items-start justify-start gap-2 whitespace-normal px-3 py-3 text-left"
                        type="button" @click="loadExample(example)">
                        <span class="line-clamp-3 text-xs leading-relaxed">{{ example.quote }}</span>
                        <span class="text-[11px] font-normal text-muted">{{ example.book }} · {{ example.author }}</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
            <Field class="mt-4">
              <FieldLabel for="card-insight">读书感悟（可选）</FieldLabel>
              <Textarea id="card-insight" v-model="state.insight" rows="3" placeholder="输入您的读书感悟..."
                class="resize-y leading-relaxed" />
            </Field>
          </div>

          <div class="border-t border-border pt-6">
            <h2 class="mb-4 text-xl font-semibold">自定义样式</h2>
            <div class="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel for="title-font">标题字体</FieldLabel>
                <Select v-model="state.titleFont">
                  <SelectTrigger id="title-font" class="w-full">
                    <SelectValue placeholder="选择标题字体" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="'Noto Serif SC', serif">思源宋体</SelectItem>
                    <SelectItem value="'Ma Shan Zheng', cursive">马善政体</SelectItem>
                    <SelectItem value="'ZCOOL XiaoWei', serif">站酷小薇体</SelectItem>
                    <SelectItem value="'LXGW WenKai TC', serif">霞鹜文楷</SelectItem>
                    <SelectItem value="'Long Cang', cursive">龙藏体</SelectItem>
                    <SelectItem value="'ZCOOL KuaiLe', cursive">站酷快乐体</SelectItem>
                    <SelectItem value="system-ui, sans-serif">系统无衬线</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel for="text-font">正文字体</FieldLabel>
                <Select v-model="state.textFont">
                  <SelectTrigger id="text-font" class="w-full">
                    <SelectValue placeholder="选择正文字体" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="'Noto Serif SC', serif">思源宋体</SelectItem>
                    <SelectItem value="'Noto Sans SC', sans-serif">思源黑体</SelectItem>
                    <SelectItem value="'ZCOOL XiaoWei', serif">站酷小薇体</SelectItem>
                    <SelectItem value="'LXGW WenKai TC', serif">霞鹜文楷</SelectItem>
                    <SelectItem value="'Long Cang', cursive">龙藏体</SelectItem>
                    <SelectItem value="'ZCOOL KuaiLe', cursive">站酷快乐体</SelectItem>
                    <SelectItem value="system-ui, sans-serif">系统无衬线</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <div class="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
                <Label for="title-color" class="cursor-pointer">标题颜色</Label>
                <Input id="title-color" v-model="state.titleColor" type="color"
                  class="h-8 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1" />
              </div>
              <div class="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
                <Label for="text-color" class="cursor-pointer">正文颜色</Label>
                <Input id="text-color" v-model="state.textColor" type="color"
                  class="h-8 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1" />
              </div>
              <div class="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
                <Label for="bg-color" class="cursor-pointer">背景颜色</Label>
                <Input id="bg-color" v-model="state.background" type="color"
                  class="h-8 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1" />
              </div>
              <div class="flex items-center justify-between gap-3 rounded-lg border border-input px-3 py-2">
                <Label for="accent-color" class="cursor-pointer">强调色</Label>
                <Input id="accent-color" v-model="state.accent" type="color"
                  class="h-8 w-12 cursor-pointer rounded-md border border-input bg-transparent p-1" />
              </div>
            </div>
          </div>

          <div class="space-y-3 border-t border-border pt-6">
            <Field>
              <FieldLabel>导出清晰度</FieldLabel>
              <Select :model-value="String(exportScale)" :disabled="exporting"
                @update:model-value="exportScale = Number($event)">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="选择导出清晰度" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1x（1200 × 900）</SelectItem>
                  <SelectItem value="2">2x（2400 × 1800，推荐）</SelectItem>
                  <SelectItem value="3">3x（3600 × 2700）</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Button class="w-full" type="button" :disabled="exporting" @click="exportCard">
              <Spinner v-if="exporting" class="size-4" />
              {{ exporting ? "正在生成图片…" : "导出为高清图片" }}
            </Button>
            <Alert v-if="exportError" variant="destructive">
              <AlertTitle>导出失败</AlertTitle>
              <AlertDescription>{{ exportError }}</AlertDescription>
            </Alert>
            <p class="text-xs text-muted">导出完成后会自动下载 PNG 文件，也可以在下方预览区再次下载。</p>
          </div>
        </section>

        <section class="md:sticky md:top-28 md:self-start">
          <div ref="cardRef"
            class="relative min-h-140 overflow-hidden rounded-4xl border border-border px-7 py-8 shadow-[0_20px_55px_rgba(15,23,42,0.1)] sm:min-h-155 sm:p-12"
            :style="{
              backgroundColor: state.background,
              color: state.textColor,
              fontFamily: state.textFont,
              '--accent': state.accent,
            }">
            <div class="absolute inset-y-0 left-0 w-2 rounded-l-4xl" :style="{ backgroundColor: state.accent }" />
            <div class="relative">
              <div class="flex items-start justify-between gap-4 border-b pb-5"
                :style="{ borderColor: `${state.accent}40` }">
                <div>
                  <h2 class="text-3xl font-bold leading-tight sm:text-4xl"
                    :style="{ color: state.titleColor, fontFamily: state.titleFont }">{{ state.title
                      || "卡片标题" }}</h2>
                  <p class="mt-3 text-sm opacity-60" :style="{ fontFamily: state.titleFont }">
                    {{ state.name || "摘录者" }}&#x3000;摘录于 {{ formattedDate }}
                  </p>
                </div>
                <span class="text-5xl leading-none opacity-15" :style="{ color: state.accent }">❝</span>
              </div>
              <p class="mt-8 whitespace-pre-line text-xl leading-[1.9] sm:text-2xl"
                :style="{ color: state.textColor, fontFamily: state.textFont }">{{ state.quote ||
                  "此处显示摘抄内容..." }}</p>
              <p v-if="state.insight" class="mt-8 rounded-xl p-5 text-sm leading-7 opacity-80"
                :style="{ backgroundColor: `${state.accent}12`, color: state.textColor }">{{
                  state.insight }}</p>
              <div class="mt-10 flex items-center gap-4 border-t pt-6"
                :style="{ borderColor: `${state.accent}25`, color: state.textColor }">
                <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full"
                  :style="{ backgroundColor: `${state.accent}14`, color: state.accent }">
                  <img v-if="imageData" :src="imageData" alt="个人照片" class="h-full w-full object-cover">
                  <span v-else>阅读</span>
                </div>
                <div class="min-w-0 text-sm" :style="{ fontFamily: state.titleFont }">
                  <p class="opacity-60">—— 摘自</p>
                  <p class="mt-1 truncate text-base font-medium">{{ state.book || "书籍标题" }} · {{
                    state.author || "作者姓名" }}</p>
                </div>
              </div>
              <div class="pointer-events-none absolute right-0 bottom-0 text-6xl font-bold opacity-[0.06]"
                :style="{ color: state.accent }">READ</div>
            </div>
          </div>
          <div v-if="outputData" class="mt-6 rounded-2xl border border-border bg-background p-5 shadow-sm">
            <h3 class="mb-3 font-semibold">导出的卡片图片</h3>
            <img :src="outputData" alt="导出的卡片" class="w-full rounded-xl">
            <Button as="a" class="mt-4 w-full" :href="outputData" :download="exportFileName">下载高清图片</Button>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<style scoped>
.recommendations-panel {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
}

.recommendations-enter-active,
.recommendations-leave-active {
  transition: grid-template-rows 180ms ease, opacity 180ms ease;
}

.recommendations-enter-from,
.recommendations-leave-to {
  grid-template-rows: 0fr;
  opacity: 0;
}

.recommendations-enter-to,
.recommendations-leave-from {
  grid-template-rows: 1fr;
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .recommendations-enter-active,
  .recommendations-leave-active {
    transition: none;
  }
}
</style>