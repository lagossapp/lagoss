import type { App } from '~~/server/db/schema';

export function useApp() {
  const app = inject<Ref<App>>('app');
  if (!app) {
    throw new Error('useApp() is called without provider.');
  }

  const refreshApp = inject<() => Promise<void>>('refreshApp');
  if (!refreshApp) {
    throw new Error('useApp() is called without provider.');
  }

  return {
    app,
    refreshApp,
  };
}
