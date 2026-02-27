<template>
  <div
    class="w-full rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-transparent dark:bg-neutral-800 dark:shadow-xs"
    :class="{
      'cursor-pointer transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600/60':
        clickable,
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
