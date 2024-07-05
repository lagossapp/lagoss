import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', () => {
  const { data: user, refresh: updateAuthSession } = useFetch('/api/user');

  const isAuthenticated = computed(() => !!user.value?.id);

  function login() {
    window.location.href = '/api/auth/login';
  }

  function logout() {
    window.location.href = '/api/auth/logout';
  }

  async function selectOrganization(organizationId: string) {
    await $fetch(`/api/user/`, {
      method: 'PATCH',
      body: JSON.stringify({ currentOrganizationId: organizationId }),
    });
    await updateAuthSession();
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    selectOrganization,
    updateAuthSession,
  };
});
