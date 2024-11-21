import { randomBytes } from 'crypto';
import { Github } from '~/server/oauth/github';

export default defineEventHandler(async event => {
  const state = randomBytes(64).toString('hex');

  await useStorage().setItem(`oauth:${state}`, {
    login: new Date().toISOString(),
  });

  const config = useRuntimeConfig();
  const redirectUri = `${config.public.APP_URL}/api/auth/callback`;

  // TODO: support different providers
  const github = new Github({
    clientId: config.auth.oauth.github.clientId,
    clientSecret: config.auth.oauth.github.clientSecret,
  });

  return sendRedirect(event, github.getOauthRedirectUrl({ state, redirectUri }));
});
