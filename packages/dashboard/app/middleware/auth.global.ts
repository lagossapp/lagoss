export default defineNuxtRouteMiddleware(async to => {
  // fail fast on 404s
  if (to.matched.length === 0) {
    return;
  }

  const authStore = await useAuth();

  const isAuthenticated = authStore.isAuthenticated.value;

  await authStore.updateAuthSession(); // initial load of user

  if (!isAuthenticated && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }

  if (isAuthenticated && to.path === '/auth/login') {
    return navigateTo('/');
  }
});
