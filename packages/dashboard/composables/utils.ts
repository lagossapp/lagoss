import cronstrue from 'cronstrue';
import { getEnv } from 'lib/env/env';

/**
 * Example:
 *
 * NUXT_PUBLIC_ROOT_SCHEMA=https
 * NUXT_PUBLIC_ROOT_DOMAIN=lagoss.com
 * name=hello-world
 *
 * -> https://hello-world.lagoss.com
 */

export function getCurrentDomain({ name }: { name: string }): string {
  const config = useRuntimeConfig();
  return `${name}.${config.public.root.domain}`;
}

export function getFullDomain(domain: string): string {
  const config = useRuntimeConfig();
  return `${config.public.root.schema}://${domain}`;
}

export function getFullCurrentDomain({ name }: { name: string }): string {
  return getFullDomain(getCurrentDomain({ name }));
}

export function reloadSession() {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
}

export function envStringToObject(env: { key: string; value: string }[]): Record<string, string> {
  return env.reduce((acc, { key, value }) => {
    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

export function getHumanFriendlyCron(cron?: string | null) {
  if (!cron) return cron;

  try {
    return cronstrue.toString(cron);
  } catch {
    return cron;
  }
}
