const LAST_ORG_KEY = 'lagoss:lastOrgId';

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Persist the org ID whenever the user is inside an org route
  const toOrgId = to.params.organizationId as string | undefined;
  if (toOrgId && import.meta.client) {
    localStorage.setItem(LAST_ORG_KEY, toOrgId);
  }

  const authStore = await useAuth();

  // Redirect from the root to the last-visited or first org
  if (to.path === '/' && authStore.isAuthenticated.value) {
    if (import.meta.client) {
      const lastId = localStorage.getItem(LAST_ORG_KEY);
      if (lastId) {
        return navigateTo(`/organizations/${lastId}`, { replace: true });
      }
    }

    const { data: organizations } = await useFetch('/api/organizations');
    if (organizations.value?.length ?? 0 > 0) {
      return navigateTo(`/organizations/${organizations.value![0]!.id}`, { replace: true });
    }
  }
});
