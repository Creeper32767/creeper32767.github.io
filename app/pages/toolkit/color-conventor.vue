<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface ColorState {
  r: number;
  g: number;
  b: number;
  a: number;
  h: number;
  s: number;
  l: number;
}

interface ParsedColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

interface Variation {
  r: number;
  g: number;
  b: number;
  label: string;
}

const state = reactive<ColorState>({ r: 0, g: 120, b: 212, a: 1, h: 206, s: 100, l: 42 });
const pasteValue = ref("");
const pasteFeedback = ref("等待输入…");
const pasteStatus = ref("idle");
const copied = ref("");
const gradientStart = ref("#0078d4");
const gradientEnd = ref("#00bcf2");
const gradientAngle = ref(90);

const hex = computed(() => rgbToHex(state.r, state.g, state.b));
const rgba = computed(() => `rgba(${state.r}, ${state.g}, ${state.b}, ${state.a})`);
const gradientCss = computed(() => `linear-gradient(${gradientAngle.value}deg, ${gradientStart.value}, ${gradientEnd.value})`);
const variations = computed<Variation[]>(() => [
  ...[0.75, 0.5, 0.25].map((factor) => ({
    r: Math.round(state.r + (255 - state.r) * factor),
    g: Math.round(state.g + (255 - state.g) * factor),
    b: Math.round(state.b + (255 - state.b) * factor),
    label: `Tint ${Math.round(factor * 100)}%`,
  })),
  { r: state.r, g: state.g, b: state.b, label: "Current" },
  ...[0.25, 0.5, 0.75].map((factor) => ({
    r: Math.round(state.r * (1 - factor)),
    g: Math.round(state.g * (1 - factor)),
    b: Math.round(state.b * (1 - factor)),
    label: `Shade ${Math.round(factor * 100)}%`,
  })),
]);

const outputValues = computed(() => [
  { label: "HEX", key: "hex", value: hex.value.toUpperCase(), placeholder: "#RRGGBB" },
  { label: "RGB", key: "rgb", value: `rgb(${state.r}, ${state.g}, ${state.b})`, placeholder: "rgb(r, g, b)" },
  { label: "RGBA", key: "rgba", value: rgba.value, placeholder: "rgba(r, g, b, a)" },
  { label: "HSL", key: "hsl", value: `hsl(${state.h}, ${state.s}%, ${state.l}%)`, placeholder: "hsl(h, s%, l%)" },
  { label: "HSLA", key: "hsla", value: `hsla(${state.h}, ${state.s}%, ${state.l}%, ${state.a})`, placeholder: "hsla(h, s%, l%, a)" },
]);

function updateFromRgb() {
  const r = state.r / 255;
  const g = state.g / 255;
  const b = state.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const difference = max - min;
    saturation = lightness > 0.5 ? difference / (2 - max - min) : difference / (max + min);
    if (max === r) hue = (g - b) / difference + (g < b ? 6 : 0);
    else if (max === g) hue = (b - r) / difference + 2;
    else hue = (r - g) / difference + 4;
    hue /= 6;
  }
  state.h = Math.round(hue * 360);
  state.s = Math.round(saturation * 100);
  state.l = Math.round(lightness * 100);
}

function updateFromHsl() {
  const rgb = hslToRgb(state.h, state.s, state.l);
  state.r = rgb.r;
  state.g = rgb.g;
  state.b = rgb.b;
}

function hslToRgb(h: number, s: number, l: number): ParsedColor {
  const hue = (((h % 360) + 360) % 360) / 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return { r: value, g: value, b: value };
  }
  const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (t: number) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * (2 / 3 - value) * 6;
    return p;
  };
  return { r: Math.round(channel(hue + 1 / 3) * 255), g: Math.round(channel(hue) * 255), b: Math.round(channel(hue - 1 / 3) * 255) };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgb(value: string): ParsedColor | null {
  let normalized = value.trim().replace(/^#/, "");
  if (normalized.length === 3 || normalized.length === 4) normalized = normalized.split("").map((char) => char + char).join("");
  if (![6, 8].includes(normalized.length) || !/^[\da-f]+$/i.test(normalized)) return null;
  const result: ParsedColor = {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
  if (normalized.length === 8) result.a = Number((parseInt(normalized.slice(6, 8), 16) / 255).toFixed(3));
  return result;
}

function parseColor(value: string): ParsedColor | null {
  const input = value.trim();
  const fromHex = hexToRgb(input);
  if (fromHex) return fromHex;
  const rgbMatch = input.match(/^rgba?\(\s*([-\d.]+%?)\s*,\s*([-\d.]+%?)\s*,\s*([-\d.]+%?)(?:\s*,\s*([-\d.]+%?)\s*)?\)$/i);
  if (rgbMatch) {
    const channels = rgbMatch.slice(1, 4).map((token) => token.endsWith("%") ? parseFloat(token) * 2.55 : parseFloat(token));
    if (channels.some(Number.isNaN)) return null;
    const alpha = rgbMatch[4] ? (rgbMatch[4].endsWith("%") ? parseFloat(rgbMatch[4]) / 100 : parseFloat(rgbMatch[4])) : undefined;
    return { r: channels[0]!, g: channels[1]!, b: channels[2]!, ...(alpha === undefined ? {} : { a: alpha }) };
  }
  const hslMatch = input.match(/^hsla?\(\s*([-+\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%(?:\s*,\s*([-\d.]+%?)\s*)?\)$/i);
  if (hslMatch) {
    const result = hslToRgb(parseFloat(hslMatch[1]!), parseFloat(hslMatch[2]!), parseFloat(hslMatch[3]!));
    if (hslMatch[4]) result.a = hslMatch[4].endsWith("%") ? parseFloat(hslMatch[4]) / 100 : parseFloat(hslMatch[4]);
    return result;
  }
  if (import.meta.client) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "#000";
      context.fillStyle = input;
      const computedColor = context.fillStyle;
      if (computedColor !== "#000000" || /^(black|#?0{3,6})$/i.test(input)) return hexToRgb(computedColor);
    }
  }
  return null;
}

function applyColor(value: string) {
  const parsed = parseColor(value);
  if (!parsed) return false;
  state.r = clampChannel(parsed.r);
  state.g = clampChannel(parsed.g);
  state.b = clampChannel(parsed.b);
  if (parsed.a !== undefined) state.a = clamp(parsed.a, 0, 1);
  updateFromRgb();
  return true;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampChannel(value: number) {
  return Math.round(clamp(Number(value) || 0, 0, 255));
}

function applyPaste() {
  if (!pasteValue.value.trim()) {
    setPasteFeedback("请输入或粘贴颜色值", "error");
    return;
  }
  const applied = applyColor(pasteValue.value);
  setPasteFeedback(applied ? "已应用此颜色" : "无法解析该颜色", applied ? "success" : "error");
}

function setPasteFeedback(message: string, status: string) {
  pasteFeedback.value = message;
  pasteStatus.value = status;
}

async function copyValue(key: string, value: string) {
  try {
    await navigator.clipboard.writeText(value);
    copied.value = key;
    window.setTimeout(() => {
      if (copied.value === key) copied.value = "";
    }, 1500);
  } catch {
    setPasteFeedback("复制失败，请检查浏览器权限", "error");
  }
}

function selectVariation(variation: Variation) {
  state.r = variation.r;
  state.g = variation.g;
  state.b = variation.b;
  updateFromRgb();
}
</script>

<template>
  <div class="mx-auto grid w-[calc(100%-2rem)] max-w-6xl grid-rows-[auto_1fr] gap-8">
    <header class="page-header">
      <p class="page-eyebrow">{{ t("pageHeaders.colorConverter.eyebrow") }}</p>
      <h1 class="page-title">{{ t("pageHeaders.colorConverter.title") }}</h1>
      <p class="page-description">{{ t("pageHeaders.colorConverter.description") }}</p>
    </header>

    <main class="grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div class="grid min-w-0 content-start gap-6">
        <section class="grid gap-4 rounded-2xl border border-border bg-background/70 p-6 shadow-sm">
          <h2 class="text-lg font-semibold">视觉调色</h2>
          <label class="grid cursor-pointer grid-cols-[auto_1fr] items-center gap-4 rounded-xl border border-input p-4">
            <input :value="hex" type="color" class="h-14 w-20 cursor-pointer rounded-lg border-0 bg-transparent"
              @input="applyColor(($event.target as HTMLInputElement).value)" />
            <span class="text-sm text-muted">点击选择颜色</span>
          </label>
        </section>

        <section v-for="group in [
          { title: 'RGB 调节', items: [{ key: 'r', label: 'R (红)', max: 255, suffix: '' }, { key: 'g', label: 'G (绿)', max: 255, suffix: '' }, { key: 'b', label: 'B (蓝)', max: 255, suffix: '' }] },
          { title: 'HSL 调节', items: [{ key: 'h', label: 'H (色相)', max: 360, suffix: '°' }, { key: 's', label: 'S (饱和度)', max: 100, suffix: '%' }, { key: 'l', label: 'L (亮度)', max: 100, suffix: '%' }] },
          { title: '透明度 (Alpha)', items: [{ key: 'a', label: 'A', max: 100, suffix: '' }] },
        ]" :key="group.title" class="grid gap-5 rounded-2xl border border-border bg-background/70 p-6 shadow-sm">
          <h2 class="text-lg font-semibold">{{ group.title }}</h2>
          <label v-for="item in group.items" :key="item.key"
            class="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-sm">
            <span>{{ item.label }}</span>
            <input :value="item.key === 'a' ? state.a * 100 : state[item.key as keyof ColorState]" type="range" min="0"
              :max="item.max" class="accent-primary"
              @input="item.key === 'a' ? state.a = Number(($event.target as HTMLInputElement).value) / 100 : (state[item.key as 'r' | 'g' | 'b' | 'h' | 's' | 'l'] = Number(($event.target as HTMLInputElement).value), item.key === 'h' || item.key === 's' || item.key === 'l' ? updateFromHsl() : updateFromRgb())" />
            <span class="text-right font-mono text-muted">{{ item.key === "a" ? state.a.toFixed(2) :
              state[item.key as keyof ColorState] }}{{ item.suffix }}</span>
          </label>
        </section>

        <section class="grid gap-5 rounded-2xl border border-border bg-background/70 p-6 shadow-sm">
          <h2 class="text-lg font-semibold">线性渐变生成器</h2>
          <div class="h-24 rounded-xl border border-border" :style="{ background: gradientCss }" />
          <div class="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3">
            <input v-model="gradientStart" type="color" class="h-9 w-12 cursor-pointer rounded border border-input" />
            <input v-model.number="gradientAngle" type="range" min="0" max="360" class="accent-primary" />
            <span class="w-12 text-right text-sm text-muted">{{ gradientAngle }}°</span>
            <input v-model="gradientEnd" type="color" class="h-9 w-12 cursor-pointer rounded border border-input" />
          </div>
          <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
            <input :value="gradientCss" readonly
              class="min-w-0 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <button class="rounded-md border border-input px-3 py-2 text-sm transition hover:bg-foreground/5"
              @click="copyValue('gradient', gradientCss)">{{ copied === "gradient" ? "已复制" : "复制"
              }}</button>
          </div>
        </section>
      </div>

      <div class="grid min-w-0 content-start gap-6">
        <section class="overflow-hidden rounded-2xl border border-border bg-background/70 shadow-sm">
          <div class="h-48" :style="{ backgroundColor: rgba }" />
          <div class="grid grid-cols-2 border-t border-border justify-items-center p-5 text-sm" :style="{ backgroundColor: rgba }">
            <span class="text-white drop-shadow">White Text</span>
            <span class="text-black">Black Text</span>
          </div>
        </section>

        <section class="grid gap-4 rounded-2xl border border-border bg-background/70 p-6 shadow-sm">
          <h2 class="text-lg font-semibold">粘贴颜色代码并更新</h2>
          <p class="text-sm leading-6 text-muted">将任意 HEX、RGB、HSL、HSLA 或 CSS 颜色字符串粘贴到下方，点击“应用颜色”即可同步所有数值与预览。
          </p>
          <textarea v-model="pasteValue"
            class="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="#0078d4 或 rgb(0,120,212) 或 hsl(206,100%,42%)" @input="setPasteFeedback('输入待应用…', 'idle')"
            @keydown.meta.enter.prevent="applyPaste" @keydown.ctrl.enter.prevent="applyPaste" />
          <div class="grid grid-cols-[auto_auto_1fr] items-center gap-3">
            <button
              class="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-hover"
              @click="applyPaste">应用颜色</button>
            <button class="rounded-md border border-input px-4 py-2 text-sm transition hover:bg-foreground/5"
              @click="pasteValue = ''; setPasteFeedback('输入已清空', 'idle')">清空</button>
            <span class="text-sm"
              :class="{ 'text-green-600': pasteStatus === 'success', 'text-red-600': pasteStatus === 'error', 'text-muted': pasteStatus === 'idle' }">{{
                pasteFeedback }}</span>
          </div>
        </section>

        <section class="grid gap-4 rounded-2xl border border-border bg-background/70 p-6 shadow-sm">
          <h2 class="text-lg font-semibold">色调变化 (点击应用)</h2>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div v-for="variation in variations" :key="variation.label"
              class="group relative h-20 cursor-pointer rounded-lg p-2 text-xs text-white shadow-sm transition hover:-translate-y-0.5"
              :style="{ backgroundColor: `rgb(${variation.r}, ${variation.g}, ${variation.b})` }"
              :title="`点击应用：rgb(${variation.r}, ${variation.g}, ${variation.b})`" @click="selectVariation(variation)">
              <span class="drop-shadow">{{ variation.label }}</span>
              <button
                class="absolute right-1 bottom-1 rounded bg-black/20 px-1.5 py-0.5 opacity-0 transition group-hover:opacity-100"
                title="复制 HEX"
                @click.stop="copyValue(`variation-${variation.label}`, rgbToHex(variation.r, variation.g, variation.b).toUpperCase())">{{
                  copied === `variation-${variation.label}` ? "✓" : "❐" }}</button>
            </div>
          </div>
        </section>

        <section class="grid gap-4 rounded-2xl border border-border bg-background/70 p-6 shadow-sm">
          <h2 class="text-lg font-semibold">颜色代码</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div v-for="output in outputValues" :key="output.key" class="grid gap-2">
              <label class="text-sm font-medium">{{ output.label }}</label>
              <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
                <input :value="output.value" :placeholder="output.placeholder"
                  class="min-w-0 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
                  @change="applyColor(($event.target as HTMLInputElement).value)"
                  @keydown.ctrl.enter.prevent="applyColor(($event.target as HTMLInputElement).value)"
                  @keydown.meta.enter.prevent="applyColor(($event.target as HTMLInputElement).value)" />
                <button class="rounded-md border border-input px-3 py-2 text-sm transition hover:bg-foreground/5"
                  @click="copyValue(output.key, output.value)">{{ copied === output.key ? "已复制" : "复制"
                  }}</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>