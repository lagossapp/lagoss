<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-16 text-white">
    <!-- Grid overlay -->
    <div class="grid-overlay pointer-events-none absolute inset-0" aria-hidden="true" />

    <!-- Corner marks -->
    <span class="pointer-events-none absolute top-6 left-6 h-3 w-3 border-t border-l border-white/20" />
    <span class="pointer-events-none absolute top-6 right-6 h-3 w-3 border-t border-r border-white/20" />
    <span class="pointer-events-none absolute bottom-6 left-6 h-3 w-3 border-b border-l border-white/20" />
    <span class="pointer-events-none absolute bottom-6 right-6 h-3 w-3 border-b border-r border-white/20" />

    <!-- Centered slot -->
    <div class="relative z-10 w-full max-w-xs">
      <slot />
    </div>

    <!-- Footer -->
    <p
      class="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] tracking-widest text-white/15"
    >
      LAGOSS &mdash; {{ new Date().getFullYear() }}
    </p>
  </div>
</template>

<style scoped>
.grid-overlay {
  background-image:
    linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 255 255 / 0.03) 1px, transparent 1px);
  background-size: 48px 48px;
}
</style>
