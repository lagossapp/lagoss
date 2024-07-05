export default defineNuxtRouteMiddleware(async to => {
  const authStore = useAuth();

  await authStore.updateAuthSession(); // initial load of user

  // 404
  if (to.matched.length === 0) {
    return;
  }

  if (!authStore.user && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }

  if (authStore.user && to.path === '/auth/login') {
    return navigateTo('/');
  }
});
