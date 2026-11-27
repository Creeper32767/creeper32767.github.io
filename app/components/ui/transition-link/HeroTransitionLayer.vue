<script setup lang="ts">
import { useHeroTransition, findSharedElement, prefersReducedMotion, snapshotRect } from "~/composables/useHeroTransition";
import type { HeroRectSnapshot, HeroTransitionPayload } from "~/types/transition";

const route = useRoute();
const router = useRouter();
const { payload, phase } = useHeroTransition();
defineOptions({ name: "HeroTransitionLayer" });

const overlay = ref<HTMLElement>();
const overlayContent = ref<HTMLElement>();

let activeAnimation: Animation | undefined;
/** 递增 token：让在途 runTransition 的 finally 失效，避免竞态覆盖新状态 */
let transitionToken = 0;
/** 保存的根元素样式 */
let savedRootStyles: { overflow: string; paddingRight: string } | undefined;
let pendingClone: HTMLElement | undefined;

const hiddenElements = new Map<HTMLElement, { opacity: string; transition: string }>();
const staticShellStyles = new Map<HTMLElement, { position: string; zIndex: string }>();

// 滚动锁定 / 静态外壳提升                                              */
function lockScroll() {
  if (savedRootStyles) return;

  const root = document.documentElement;
  savedRootStyles = {
    overflow: root.style.overflow,
    paddingRight: root.style.paddingRight,
  };

  const scrollbarWidth = window.innerWidth - root.clientWidth;
  root.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    root.style.paddingRight = `${scrollbarWidth}px`;
  }

  for (const element of document.querySelectorAll<HTMLElement>("[data-transition-static]")) {
    staticShellStyles.set(element, {
      position: element.style.position,
      zIndex: element.style.zIndex,
    });
    element.style.position = "relative";
    element.style.zIndex = "70";
  }
}

function unlockScroll() {
  if (savedRootStyles) {
    const root = document.documentElement;
    root.style.overflow = savedRootStyles.overflow;
    root.style.paddingRight = savedRootStyles.paddingRight;
    savedRootStyles = undefined;
  }

  for (const [element, styles] of staticShellStyles) {
    element.style.position = styles.position;
    element.style.zIndex = styles.zIndex;
  }
  staticShellStyles.clear();
}

// 隐藏 / 恢复元素                                                      //
function setHidden(element: HTMLElement, hidden: boolean, fadeDelay = 0) {
  if (hidden) {
    if (!hiddenElements.has(element)) {
      hiddenElements.set(element, {
        opacity: element.style.opacity,
        transition: element.style.transition,
      });
    }
    element.style.transition = fadeDelay ? `opacity 180ms ease ${fadeDelay}ms` : "";
    element.style.opacity = "0";
    return;
  }

  const previous = hiddenElements.get(element);
  if (!previous) return;
  element.style.opacity = previous.opacity;
  element.style.transition = previous.transition;
  hiddenElements.delete(element);
}

/** 淡入到"原始值"而非硬编码 1，避免原 opacity 非 1 时结束跳变 */
function revealElement(element: HTMLElement) {
  const previous = hiddenElements.get(element);
  element.style.opacity = previous?.opacity || "1";
}

function restoreHiddenElements() {
  for (const element of hiddenElements.keys()) {
    setHidden(element, false);
  }
}

// 覆盖层克隆                                                           //
function createClone(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement;
  clone.removeAttribute("id");
  clone.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
  clone.removeAttribute("data-shared-id");
  clone.setAttribute("aria-hidden", "true");
  clone.style.setProperty("position", "absolute", "important");
  clone.style.setProperty("inset", "0", "important");
  clone.style.setProperty("width", "100%", "important");
  clone.style.setProperty("height", "100%", "important");
  clone.style.setProperty("aspect-ratio", "auto", "important");
  clone.style.setProperty("margin", "0", "important");
  clone.querySelectorAll("img").forEach((image) => {
    image.style.setProperty("width", "100%", "important");
    image.style.setProperty("height", "100%", "important");
    image.style.setProperty("object-fit", "cover", "important");
  });
  return clone;
}

function prepareOverlay(source: HTMLElement) {
  const container = overlayContent.value;
  const clone = createClone(source);
  if (container) {
    container.replaceChildren(clone);
    pendingClone = undefined;
  } else {
    // backward 在 beforeEach 中调用时 overlay 尚未渲染，暂存等 payload watcher 插入
    pendingClone = clone;
  }
}

// 状态机                                                               //
/** 仅清理 DOM / 动画，不改 state */
function teardownDom() {
  activeAnimation?.cancel();
  activeAnimation = undefined;
  restoreHiddenElements();
  unlockScroll();
}

/** 统一中断入口：失效在途动画 + 清理 DOM + 重置状态 */
function resetTransition() {
  transitionToken++;
  teardownDom();
  phase.value = "idle";
  payload.value = null;
}

function finishTransition(current: HeroTransitionPayload) {
  restoreHiddenElements();
  unlockScroll();
  activeAnimation = undefined;
  phase.value = "idle";
  if (current.direction === "backward") {
    payload.value = null;
  } else {
    void nextTick().then(() => {
      const heading = document.querySelector<HTMLElement>("[data-transition-heading]");
      heading?.scrollIntoView({ block: "start", behavior: "instant" });
      heading?.focus({ preventScroll: true });
    });
  }
}

// 过渡动画                                                             //
const overlayStyle = computed(() => {
  const rect = payload.value?.startRect ?? payload.value?.sourceRect;
  if (!rect) return {};
  return {
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderRadius: rect.borderRadius,
    boxShadow: rect.boxShadow,
  };
});

async function waitForLayout() {
  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => {
    requestAnimationFrame(() => resolve());
  }));
}

type FrameRect = {
  top: string | number;
  left: string | number;
  width: string | number;
  height: string | number;
  borderRadius: string;
  boxShadow: string;
};

const toCssLength = (value: string | number) =>
  typeof value === "number" ? `${value}px` : value;

const frame = (rect: FrameRect | HeroRectSnapshot) => ({
  top: toCssLength(rect.top),
  left: toCssLength(rect.left),
  width: toCssLength(rect.width),
  height: toCssLength(rect.height),
  borderRadius: rect.borderRadius,
  boxShadow: rect.boxShadow,
});

/** 前进 / 后退共用同一套流程，差异参数化 */
async function runTransition(current: HeroTransitionPayload) {
  const token = ++transitionToken;
  let animation: Animation | undefined;

  const config = current.direction === "forward"
    ? { fadeDelay: 150, fullscreenOffsets: [0.7, 0.85] as [number, number] }
    : { fadeDelay: 50, fullscreenOffsets: [0.15, 0.3] as [number, number] };

  try {
    let target = findSharedElement(current.heroId);
    if (target) setHidden(target, true);

    const content = Array.from(document.querySelectorAll<HTMLElement>("[data-transition-content]"));
    content.forEach((element) => setHidden(element, true, config.fadeDelay));

    await waitForLayout();
    if (token !== transitionToken) return;
    if (payload.value?.heroId !== current.heroId || phase.value !== "navigating") return;

    if (current.direction === "backward") {
      // scrollTo 必须在解锁状态下执行，否则被 overflow:hidden 抑制
      const wasLocked = Boolean(savedRootStyles);
      if (wasLocked) unlockScroll();
      window.scrollTo(0, current.savedScrollY);
      await waitForLayout();
      if (token !== transitionToken) return;
      if (wasLocked) lockScroll();
    }

    target ??= findSharedElement(current.heroId);
    if (!target) return;
    setHidden(target, true);

    const targetRect = snapshotRect(target);
    if (current.direction === "backward" &&
      (targetRect.top + targetRect.height < 0 || targetRect.top > window.innerHeight)) {
      return;
    }

    const layer = overlay.value;
    const startRect = current.startRect ?? current.sourceRect;
    if (!layer || typeof layer.animate !== "function") return;

    phase.value = "animating";
    requestAnimationFrame(() => content.forEach(revealElement));

    const fullScreenRect: FrameRect = {
      top: "0px",
      left: "0px",
      width: "100vw",
      // 用 innerHeight 而非 100dvh，避免旧浏览器关键帧塌陷
      height: `${window.innerHeight}px`,
      borderRadius: "0px",
      boxShadow: "none",
    };

    const [firstOffset, secondOffset] = config.fullscreenOffsets;
    const keyframes = [
      frame(startRect),
      { ...frame(fullScreenRect), offset: firstOffset },
      { ...frame(fullScreenRect), offset: secondOffset },
      frame(targetRect),
    ];

    animation = layer.animate(keyframes, {
      duration: 350,
      easing: "cubic-bezier(0.2, 0, 0, 1)",
      fill: "both",
    });
    activeAnimation = animation;
    await animation.finished;
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "AbortError")) {
      throw error;
    }
  } finally {
    if (
      token === transitionToken &&
      payload.value?.heroId === current.heroId &&
      phase.value !== "idle"
    ) {
      finishTransition(current);
    }
  }
}

// Watchers                                                            //
watch(
  phase,
  (nextPhase) => {
    if (nextPhase === "navigating" || nextPhase === "animating") {
      lockScroll();
    } else {
      unlockScroll();
    }
  },
  { flush: "sync" },
);

watch(
  payload,
  async (current) => {
    if (!current || phase.value !== "navigating") return;

    await nextTick();

    // backward：beforeEach 已准备好克隆
    if (pendingClone) {
      overlayContent.value?.replaceChildren(pendingClone);
      pendingClone = undefined;
      return;
    }

    // forward：此时页面仍是旧页，克隆源元素
    const source = findSharedElement(current.heroId);
    if (source) {
      prepareOverlay(source);
      setHidden(source, true);
    }
  },
  { flush: "post" },
);

watch(
  () => route.fullPath,
  (path) => {
    const current = payload.value;
    if (!current || phase.value !== "navigating") return;
    if (path === current.destinationRoute) {
      void runTransition(current).catch((error: unknown) => {
        console.error("Hero transition failed", error);
      });
    } else if (path !== current.originRoute) {
      resetTransition();
    }
  },
  { flush: "post" },
);

// 路由守卫                                                            //
let removeBeforeEach: (() => void) | undefined;
let removeAfterEach: (() => void) | undefined;

onMounted(() => {
  removeBeforeEach = router.beforeEach((to, from) => {
    const current = payload.value;
    if (!current) return;

    // forward 直达目的地：放行
    if (
      phase.value === "navigating" &&
      current.direction === "forward" &&
      from.fullPath === current.originRoute &&
      to.fullPath === current.destinationRoute
    ) {
      return;
    }

    // 后退：从目的地回到出发地，启动 backward 过渡
    if (
      phase.value === "idle" &&
      current.direction === "forward" &&
      from.fullPath === current.destinationRoute &&
      to.fullPath === current.originRoute
    ) {
      if (prefersReducedMotion()) {
        payload.value = null;
        return;
      }

      const source = findSharedElement(current.heroId);
      if (!source) {
        payload.value = null;
        return;
      }

      prepareOverlay(source);
      setHidden(source, true);
      payload.value = {
        ...current,
        direction: "backward",
        destinationRoute: current.originRoute,
        startRect: snapshotRect(source),
      };
      phase.value = "navigating";
      return;
    }

    // 其它导航：中断过渡
    resetTransition();
  });

  removeAfterEach = router.afterEach((_to, _from, failure) => {
    if (failure && phase.value === "navigating") {
      resetTransition();
    }
  });
});

onBeforeUnmount(() => {
  removeBeforeEach?.();
  removeAfterEach?.();
  transitionToken++;
  teardownDom();
});
</script>

<template>
  <Teleport to="body">
    <div v-if="phase !== 'idle'" class="fixed inset-0 z-55 cursor-wait" aria-hidden="true" />
    <div v-if="phase !== 'idle'" ref="overlay"
      class="pointer-events-none fixed z-60 overflow-hidden will-change-[top,left,width,height,border-radius,box-shadow]"
      :style="overlayStyle" aria-hidden="true">
      <div ref="overlayContent" class="relative h-full w-full" />
    </div>
  </Teleport>
</template>