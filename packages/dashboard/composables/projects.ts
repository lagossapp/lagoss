import { defineStore } from 'pinia';
import type { Project } from '~/server/db/schema';

export const useProjectsStore = defineStore('projects', () => {
  const project = ref<Project>();

  async function fetchProject(projectName: string) {
    project.value = await $fetch(`/api/projects/${projectName}`);
  }

  async function refreshProject() {
    if (!project.value?.name) return;
    await fetchProject(project.value.name);
  }

  return {
    project,
    fetchProject,
    refreshProject,
  };
});
