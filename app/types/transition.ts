export interface HeroRectSnapshot {
  top: number;
  left: number;
  width: number;
  height: number;
  borderRadius: string;
  boxShadow: string;
}

export type TransitionDirection = "forward" | "backward";

export type TransitionPhase = "idle" | "navigating" | "animating";

export interface HeroTransitionPayload {
  heroId: string;
  direction: TransitionDirection;
  originRoute: string;
  destinationRoute: string;
  savedScrollY: number;
  sourceRect: HeroRectSnapshot;
  /** 从目标页捕获的起点 rect */
  startRect?: HeroRectSnapshot;
}

export interface HeroTransitionConfig {
  /** 内容淡入延迟（ms） */
  fadeDelay: number;
  /** 全屏保持的两个关键帧 offset */
  fullscreenOffsets: [number, number];
}