import cronstrue from 'cronstrue';
import { getEnv } from 'lib/env/env';

/**
 * Example:
 *
 * LAGOSS_ROOT_SCHEM=https
 * LAGOSS_ROOT_DOMAIN=lagoss.com
 * name=hello-world
 *
 * -> https://hello-world.lagoss.com
 */

export function getFullCurrentDomain({ name }: { name: string }): string {
  const { LAGOSS_ROOT_SCHEM } = getEnv();
  return `${LAGOSS_ROOT_SCHEM}://${getCurrentDomain({ name })}`;
}

export function getCurrentDomain({ name }: { name: string }): string {
  const { LAGOSS_ROOT_DOMAIN } = getEnv();
  return `${name}.${LAGOSS_ROOT_DOMAIN}`;
}

export function getFullDomain(domain: string): string {
  const { LAGOSS_ROOT_SCHEM } = getEnv();
  return `${LAGOSS_ROOT_SCHEM}://${domain}`;
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
