<script setup lang="ts">
import { useHeroTransition, findSharedElement, prefersReducedMotion, snapshotRect } from "~/composables/useHeroTransition";

defineOptions({ name: "TransitionLink", inheritAttrs: false });

const props = withDefaults(defineProps<{
  href: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  sharedId?: string;
  unstyled?: boolean;
}>(), {
  target: "_blank",
  disabled: false,
  unstyled: false,
});

const route = useRoute();
const router = useRouter();
const { payload, phase } = useHeroTransition();

function startTransition(): boolean {
  if (!import.meta.client || !props.sharedId || phase.value !== "idle") return false;
  if (prefersReducedMotion()) return false;

  const source = findSharedElement(props.sharedId);
  if (!source) return false;

  const sourceRect = snapshotRect(source);
  if (sourceRect.width <= 0 || sourceRect.height <= 0) return false;

  payload.value = {
    heroId: props.sharedId,
    direction: "forward",
    originRoute: route.fullPath,
    destinationRoute: router.resolve(props.href).fullPath,
    savedScrollY: window.scrollY,
    sourceRect,
  };
  phase.value = "navigating";
  return true;
}

function isModifiedClick(event: MouseEvent): boolean {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function handleInternalClick(
  event: MouseEvent,
  navigate: (event?: MouseEvent) => unknown,
) {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  if (props.sharedId && phase.value !== "idle") {
    event.preventDefault();
    return;
  }

  if (!props.sharedId || isModifiedClick(event)) {
    navigate(event);
    return;
  }

  event.preventDefault();
  if (!startTransition()) {
    navigate();
    return;
  }

  void nextTick().then(() => navigate());
}

function handleExternalClick(event: MouseEvent) {
  if (props.disabled) event.preventDefault();
}
</script>

<template>
  <NuxtLink v-if="target === '_self'" v-slot="{ href: resolvedHref, navigate }" :to="href" custom>
    <a v-bind="$attrs" :href="resolvedHref ?? undefined" :target="target" :rel="rel"
      :aria-disabled="disabled || undefined" :tabindex="disabled ? -1 : undefined"
      class="outline-none focus-visible:ring-2 focus-visible:ring-primary/50" :class="[
        unstyled
          ? 'active:scale-[0.99]'
          : 'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white transition-[color,background-color,transform] hover:bg-primary-hover active:scale-[0.97]',
        { 'pointer-events-none cursor-not-allowed opacity-50': disabled },
      ]" @click="handleInternalClick($event, navigate)">
      <slot />
    </a>
  </NuxtLink>
  <a v-else v-bind="$attrs" :href="disabled ? undefined : href" :target="target"
    :rel="rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)" :aria-disabled="disabled || undefined"
    :tabindex="disabled ? -1 : undefined" class="outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    :class="[
      unstyled
        ? 'active:scale-[0.99]'
        : 'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white transition-[color,background-color,transform] hover:bg-primary-hover active:scale-[0.97]',
      { 'pointer-events-none cursor-not-allowed opacity-50': disabled },
    ]" @click="handleExternalClick">
    <slot />
  </a>
</template>