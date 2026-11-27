import type {
  HeroTransitionPayload,
  TransitionPhase,
  HeroRectSnapshot,
} from "~/types/transition";

/**
 * 跨组件共享的 hero 过渡状态。
 * DOM 清理/动画实例由 HeroTransitionLayer 持有。
 */
export function useHeroTransition() {
  const payload = useState<HeroTransitionPayload | null>(
    "hero-transition-payload",
    () => null,
  );
  const phase = useState<TransitionPhase>(
    "hero-transition-phase",
    () => "idle",
  );
  const isBusy = computed(() => phase.value !== "idle");

  return { payload, phase, isBusy };
}

/** 全文档查找第一个匹配的共享元素 */
export function findSharedElement(heroId: string): HTMLElement | undefined {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-shared-id]"),
  ).find((element) => element.dataset.sharedId === heroId);
}

/** 捕获元素相对视口的矩形快照 */
export function snapshotRect(element: HTMLElement): HeroRectSnapshot {
  const rect = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    borderRadius: style.borderRadius,
    boxShadow: style.boxShadow,
  };
}

/** 用户开启"减少动态效果"或设备核心数过低时跳过动画 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    (navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 2)
  );
}
