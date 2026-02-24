<template>
  <div v-if="app" class="flex h-full w-full flex-col">
    <AppHeader :app="app" />

    <div class="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden">
      <AppRequests :app="app" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
const app = typedInject('app');
</script>
