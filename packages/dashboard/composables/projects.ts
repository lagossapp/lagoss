import type { Project } from '~/server/db/schema';

export function useProject() {
  const project = inject<Ref<Project>>('project');

  if (!project) {
    throw new Error('useProject() is called without provider.');
  }

  return project;
}