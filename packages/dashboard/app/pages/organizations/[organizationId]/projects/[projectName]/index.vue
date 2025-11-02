<template>
  <div v-if="app" class="w-full">
    <AppHeader :app="app" />

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 p-2">
      <AppAnalytics :app="app" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { app } = useApp();
</script>
