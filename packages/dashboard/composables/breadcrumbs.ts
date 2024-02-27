import { defineStore } from 'pinia';

export const useBreadCrumbsStore = defineStore('bread-crumbs', () => {
  const projectName = ref<string>();
  const { data: selectedProject } = useAsyncData(
    '/api/projects/xxx',
    async () => {
      // console.log('fetching project', projectName.value);
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
      // console.log('fetching organization', organizationId.value);
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
        console.log('projectName changed', projectName.value);
        return;
      }

      if (/^\/organizations\//.test(route.path)) {
        organizationId.value = route.params.organizationId as string;
        projectName.value = undefined;
        // console.log('organizationId changed', organizationId.value);
        return;
      }

      console.log('route without breadcrumbs', route.path);
      projectName.value = undefined;
      organizationId.value = undefined;
    },
    { immediate: true },
  );

  watch(
    selectedProject,
    _selectedProject => {
      if (_selectedProject) {
        organizationId.value = _selectedProject.organizationId;
        // console.log('selectedProject changed', _selectedProject, _selectedProject.organizationId);
      }
    },
    { immediate: true },
  );

  return {
    selectedProject,
    selectedOrganization,
  };
});
