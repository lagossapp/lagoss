export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = await useAuth();

  // 404
  if (to.matched.length === 0) {
    return;
  }

  if (!user.value && to.path !== '/auth/login') {
    return navigateTo('/auth/login');
  }

  if (user.value && to.path === '/auth/login') {
    return navigateTo('/');
  }
});
