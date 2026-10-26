<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <LayoutSiteHeader />
    <div class="flex-1">
      <slot />
    </div>
    <LayoutSiteFooter />
  </div>
</template>