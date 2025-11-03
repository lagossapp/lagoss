<template>
  <div v-if="app" class="w-full">
    <AppHeader :app="app" />

    <div class="mx-auto flex w-full max-w-4xl">
      <AppLogs :app="app" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from '~/composables/useInjectProvide';

const app = inject('app');
</script>
