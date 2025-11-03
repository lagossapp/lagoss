<template>
  <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
    <img :src="`/api/apps/${app.id}/favicon`" :alt="`Favicon of ${app.name}`" class="h-6 w-6" />
  </div>
</template>

<script setup lang="ts">
import type { App } from '~~/server/db/schema';

defineProps<{
  app: App;
}>();
</script>
