export async function useAuth() {
  const { data, refresh: updateAuthSession } = await useFetch('/api/user');

  const user = computed(() => data.value?.user ?? null);

  const isAuthenticated = computed(() => !!user.value);

  function login() {
    window.location.href = '/api/auth/login';
  }

  function logout() {
    window.location.href = '/api/auth/logout';
  }

  return {
    isAuthenticated,
    user,
    login,
    logout,
    updateAuthSession,
  };
}
