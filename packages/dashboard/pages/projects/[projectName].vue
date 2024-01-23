<template>
  <div class="flex h-full w-full">
    <span v-if="pending">loading ...</span>
    <NuxtPage v-else-if="project" />
    <span v-else>Project not found!</span>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const projectName = computed(() => route.params.projectName as string);
const { data: project, pending, refresh: refreshProject } = await useFetch(`/api/projects/${projectName.value}`);

provide('project', project);
</script>
