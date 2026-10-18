<script setup lang="ts">
import { Airplane20Filled } from "@ntkrnl64/fluentui-vue-icons";
import { onBeforeUnmount, ref } from "vue";

interface Props {
  href: string;
  target?: string;
  planeColor?: string;
  planeSize?: string;
  initialSpeed?: number;
  acceleration?: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  target: "_blank",
  planeColor: "white",
  planeSize: "1.5rem",
  initialSpeed: 300,
  acceleration: 900,
  disabled: false,
});

const flyingPlane = ref({
  visible: false,
  key: 0,
  left: 0,
  top: 0,
  targetLeft: 0,
  targetTop: 0,
  duration: 1000,
  easing: "linear",
  trailLeft: 0,
  trailTop: 0,
  trailWidth: 0,
});

let planeTimer: ReturnType<typeof setTimeout> | undefined;
let planeKeySeed = 0;

function buildAcceleratingEasing(distance: number, steps = 48): string {
  if (distance <= 0) return "linear";

  const discriminant = props.initialSpeed ** 2 + 2 * props.acceleration * distance;
  const totalSeconds = (-props.initialSpeed + Math.sqrt(discriminant)) / props.acceleration;
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "linear";

  const points: string[] = ["0"];
  for (let index = 1; index <= steps; index += 1) {
    const progress = index / steps;
    const elapsed = progress * totalSeconds;
    const travelled = props.initialSpeed * elapsed + 0.5 * props.acceleration * elapsed ** 2;
    points.push(`${Math.min(travelled / distance, 1).toFixed(4)} ${(progress * 100).toFixed(2)}%`);
  }

  return `linear(${points.join(", ")})`;
}

function openLink() {
  window.open(props.href, props.target, props.target === "_blank" ? "noopener,noreferrer" : undefined);
}

function launch(event: MouseEvent) {
  if (props.disabled) return;

  const button = event.currentTarget;
  if (!(button instanceof HTMLElement)) return;

  const bounds = button.getBoundingClientRect();
  const startLeft = bounds.left;
  const centerY = bounds.top + bounds.height / 2;
  const targetLeft = bounds.right - bounds.width * 0.1;
  const distance = Math.max(targetLeft - startLeft, 1);
  const discriminant = props.initialSpeed ** 2 + 2 * props.acceleration * distance;
  const totalSeconds = (-props.initialSpeed + Math.sqrt(discriminant)) / props.acceleration;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reduced ? 0 : Math.max(totalSeconds * 1000, 0);

  if (planeTimer) clearTimeout(planeTimer);
  flyingPlane.value = {
    visible: true,
    key: ++planeKeySeed,
    left: startLeft,
    top: centerY,
    targetLeft,
    targetTop: centerY,
    duration,
    easing: reduced ? "linear" : buildAcceleratingEasing(distance),
    trailLeft: startLeft,
    trailTop: centerY,
    trailWidth: bounds.width,
  };

  planeTimer = setTimeout(() => {
    flyingPlane.value.visible = false;
    openLink();
  }, duration);
}

onBeforeUnmount(() => {
  if (planeTimer) clearTimeout(planeTimer);
});
</script>

<template>
  <button type="button" :disabled="disabled"
    class="plane-link inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap text-white rounded-md px-4 py-2 text-sm font-medium transition-colors outline-none hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"
    :class="$attrs.class" @click="launch">
    <slot />
  </button>

  <Teleport to="body">
    <div v-if="flyingPlane.visible" :key="`trail-${flyingPlane.key}`"
      class="air-trail-container pointer-events-none fixed z-99 flex h-3.5 -translate-y-1/2 flex-col justify-between"
      :style="{
        left: `${flyingPlane.trailLeft}px`,
        top: `${flyingPlane.trailTop}px`,
        width: `${flyingPlane.trailWidth}px`,
        '--trail-duration': `${flyingPlane.duration}ms`,
        '--trail-easing': flyingPlane.easing,
      }" aria-hidden="true">
      <span class="air-trail-line h-0.5 rounded-full opacity-50" />
      <span class="air-trail-line h-0.5 rounded-full" />
      <span class="air-trail-line h-0.5 rounded-full opacity-50" />
    </div>

    <Airplane20Filled v-if="flyingPlane.visible" :key="`plane-${flyingPlane.key}`"
      class="flying-plane pointer-events-none fixed z-100 h-(--plane-size) w-(--plane-size) text-(--plane-color)"
      :style="{
        left: `${flyingPlane.left}px`,
        top: `${flyingPlane.top}px`,
        '--plane-target-left': `${flyingPlane.targetLeft}px`,
        '--plane-target-top': `${flyingPlane.targetTop}px`,
        '--plane-duration': `${flyingPlane.duration}ms`,
        '--plane-easing': flyingPlane.easing,
        '--plane-color': planeColor,
        '--plane-size': planeSize,
      }" aria-hidden="true" />
  </Teleport>
</template>

<style scoped>
.plane-link {
  cursor: pointer;
}

.plane-link:disabled {
  cursor: not-allowed;
}

.flying-plane {
  filter: drop-shadow(0 0 0.2rem var(--app-primary)) drop-shadow(0 0 0.45rem rgb(15 23 42 / 0.65));
  transform: translate(-50%, -50%);
  animation-name: plane-flight;
  animation-duration: var(--plane-duration, 1000ms);
  animation-timing-function: var(--plane-easing, linear);
  animation-fill-mode: forwards;
}

@keyframes plane-flight {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  to {
    left: var(--plane-target-left);
    top: var(--plane-target-top);
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
}

.air-trail-container {
  clip-path: inset(0 100% 0 0);
  animation-name: air-trail;
  animation-duration: var(--trail-duration, 1000ms);
  animation-timing-function: var(--trail-easing, linear);
  animation-fill-mode: both;
}

.air-trail-line {
  background: linear-gradient(90deg,
      transparent 0%,
      color-mix(in srgb, var(--app-primary) 85%, white) 10%,
      var(--app-primary) 50%,
      color-mix(in srgb, var(--app-primary) 85%, white) 90%,
      transparent 100%);
}

@keyframes air-trail {
  from {
    clip-path: inset(0 100% 0 0);
    opacity: 0.85;
  }

  70% {
    opacity: 0.85;
  }

  to {
    clip-path: inset(0 0 0 0);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {

  .flying-plane,
  .air-trail-container {
    animation-duration: 1ms !important;
  }
}
</style>