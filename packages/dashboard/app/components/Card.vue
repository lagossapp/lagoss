<template>
  <div
    class="w-full rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-white/8 dark:bg-neutral-900 dark:shadow-xs"
    :class="{
      'cursor-pointer transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5': clickable,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  clickable?: boolean;
}>();
</script>
