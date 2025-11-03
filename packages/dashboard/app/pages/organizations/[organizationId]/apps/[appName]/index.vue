<template>
  <div v-if="app" class="w-full">
    <AppHeader :app="app" />

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 p-2">
      <AppAnalytics :app :org show-graphs />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from '~/composables/useInjectProvide';

const app = inject('app');
const org = inject('org');
</script>
