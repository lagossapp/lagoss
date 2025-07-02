<template>
  <div v-if="project" class="w-full">
    <ProjectHeader :project="project" />

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 p-2">
      <ProjectAnalytics :project="project" show-graphs />
    </div>
  </div>
</template>

<script setup lang="ts">
const { project } = useProject();
</script>
