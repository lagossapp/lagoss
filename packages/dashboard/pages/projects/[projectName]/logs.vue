<template>
  <div v-if="project" class="w-full">
    <ProjectHeader :project="project" />

    <div class="mx-auto flex w-full max-w-4xl">
      <ProjectLogs :project="project" class="w-full" />
    </div>
  </div>
</template>

<script setup lang="ts">
const project = useProject();
</script>
