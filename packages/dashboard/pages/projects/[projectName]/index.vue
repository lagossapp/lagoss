<template>
  <div v-if="project" class="w-full">
    <ProjectHeader :project="project" />

    <div class="mx-auto flex w-full max-w-4xl flex-col gap-4 p-2">
      <ProjectAnalytics />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const { projectName } = route.params;

const { data: project } = useFetch(`/api/projects/${projectName}`);
</script>
