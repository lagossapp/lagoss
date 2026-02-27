<template>
  <div
    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
  >
    <img :src="`/api/apps/${app.id}/favicon`" :alt="`Favicon of ${app.name}`" class="h-6 w-6" />
  </div>
</template>

<script setup lang="ts">
import type { App } from '~/types';

defineProps<{
  app: App;
}>();
</script>
