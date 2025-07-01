export default defineNuxtRouteMiddleware(async to => {
  const authStore = await useAuth();

  // 404
  if (to.matched.length === 0) {
    return;
  }

  await authStore.updateAuthSession(); // initial load of user

  if (!authStore.user.value && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }

  if (authStore.user.value && to.path === '/auth/login') {
    return navigateTo('/');
  }
});
