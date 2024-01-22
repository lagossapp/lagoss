<template>
  <div class="flex h-full w-full">
    <NuxtPage v-if="projectStore.project" />
    <span v-else>loading ...</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const projectName = computed(() => route.params.projectName as string);

const projectStore = useProjectsStore();
await projectStore.fetchProject(projectName.value);
</script>
