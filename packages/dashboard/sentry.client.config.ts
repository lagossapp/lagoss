import * as Sentry from '@sentry/nuxt';

Sentry.init({
  dsn: import.meta.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
