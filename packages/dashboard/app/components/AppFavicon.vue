<template>
  <div
    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
    :class="{
      'bg-white dark:bg-white/5 shadow-sm border border-gray-200/80 dark:border-white/10': !faviconMissing,
      'bg-teal-100 dark:bg-teal-900/60': faviconMissing,
    }"
  >
    <img v-if="!faviconMissing" :src="`/api/apps/${app.id}/favicon`" :alt="`Favicon of ${app.name}`" class="h-6 w-6" />
    <span v-else class="select-none text-md font-bold uppercase text-teal-700 dark:text-white" aria-hidden="true">
      {{ app.name[0] }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { App } from '~/types';

const props = defineProps<{
  app: App;
}>();

// HEAD request: lightweight check — no image body transferred.
const { error: faviconMissing } = await useFetch(`/api/apps/${props.app.id}/favicon`, {
  method: 'HEAD' as 'GET', // workaround for useFetch not supporting HEAD method
  // ignoreResponseError: true,
});
</script>
