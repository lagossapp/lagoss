import { randomBytes } from 'crypto';
import { Github } from '~~/server/oauth/github';

export default defineEventHandler(async event => {
  const state = randomBytes(64).toString('hex');

  await useStorage().setItem(`oauth:${state}`, {
    login: new Date().toISOString(),
  });

  const config = useRuntimeConfig();

  if (!config.public.appUrl) {
    throw new Error('NUXT_PUBLIC_APP_URL is not defined');
  }

  const redirectUri = `${config.public.appUrl}/api/auth/callback/github`;

  if (!config.auth?.oauth?.github?.clientId || !config.auth?.oauth?.github?.clientSecret) {
    throw new Error('NUXT_AUTH_OAUTH_GITHUB_CLIENT_ID and NUXT_AUTH_OAUTH_GITHUB_CLIENT_SECRET is not configured');
  }

  // TODO: support different providers
  const github = new Github({
    clientId: config.auth.oauth.github.clientId,
    clientSecret: config.auth.oauth.github.clientSecret,
  });

  const url = github.getOauthRedirectUrl({ state, redirectUri });

  return sendRedirect(event, url);
});
