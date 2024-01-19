import { defineStore } from 'pinia';

export const useBreadCrumbsStore = defineStore('bread-crumbs', () => {
  const projectName = ref<string>();
  const { data: selectedProject } = useAsyncData(
    '/api/organizations/xxx',
    async () => {
      if (projectName.value) {
        return $fetch(`/api/projects/${projectName.value}`);
      }

      return null;
    },
    {
      watch: [projectName],
    },
  );
  const organizationId = ref<string>();
  const { data: selectedOrganization } = useAsyncData(
    '/api/organizations/xxx',
    async () => {
      if (organizationId.value) {
        return $fetch(`/api/organizations/${organizationId.value}`);
      }

      return null;
    },
    {
      watch: [organizationId],
    },
  );

  const route = useRoute();
  watch(
    () => route.fullPath,
    () => {
      if (/^\/projects\//.test(route.path)) {
        projectName.value = route.params.projectName as string;
        return;
      }

      if (/^\/organizations\//.test(route.path)) {
        projectName.value = undefined;
        organizationId.value = route.params.organizationId as string;
        return;
      }

      projectName.value = undefined;
      organizationId.value = undefined;
    },
    { immediate: true },
  );

  watch(selectedProject, _selectedProject => {
    if (_selectedProject) {
      organizationId.value = _selectedProject.organizationId;
    }
  });

  return {
    selectedProject,
    selectedOrganization,
  };
});
