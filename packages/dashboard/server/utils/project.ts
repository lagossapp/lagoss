import type { H3Event } from 'h3';
import { type Organization, organizationMemberSchema, organizationSchema, appSchema } from '~~/server/db/schema';
import { and, eq, or, SQL } from 'drizzle-orm';
import type { Plan } from '~~/server/lib/plans';
import { APP_NAME_REGEX } from '~~/server/lib/constants';
import { randomName } from '@scaleway/use-random-name';

export async function requireApp(event: H3Event) {
  const db = await useDB();
  const user = await requireUser(event);

  let appIdSql: SQL | undefined = undefined;

  const appId = getRouterParam(event, 'appId');
  if (appId) {
    appIdSql = eq(appSchema.id, appId);
  }

  const appName = getRouterParam(event, 'appName');
  if (appName) {
    appIdSql = eq(appSchema.name, appName);
  }

  if (!appIdSql) {
    throw createError({
      message: 'Missing appId parameter',
      status: 400,
    });
  }

  const app = await db
    .select()
    .from(appSchema)
    .leftJoin(organizationSchema, eq(appSchema.organizationId, organizationSchema.id))
    .leftJoin(organizationMemberSchema, eq(appSchema.organizationId, organizationMemberSchema.organizationId))
    .where(and(appIdSql, or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id))))
    .get();
  if (!app) {
    throw createError({
      message: 'App not found',
      status: 404,
    });
  }

  return app.apps;
}

async function isAppNameUnique(name: string): Promise<boolean> {
  const db = await useDB();
  const result = await db.select().from(appSchema).where(eq(appSchema.name, name)).get();
  return result === undefined;
}

function isAppNameAllowed(name: string): boolean {
  return APP_NAME_REGEX.test(name);
}

function isAppNameBlacklisted(name: string): boolean {
  const config = useRuntimeConfig();
  return config.apps.blacklistedNames.includes(name.toLowerCase());
}

export async function findUniqueAppName() {
  const name = randomName();

  if (!(await isAppNameUnique(name))) {
    return findUniqueAppName();
  }

  return name;
}

export async function checkCanCreateApp({
  appName,
  organization,
  plan,
}: {
  appName: string;
  organization: Organization;
  plan: Plan;
}) {
  const db = await useDB();

  if (!(await isAppNameUnique(appName))) {
    throw createError({
      statusCode: 400,
      message: 'An app with the same name already exists',
    });
  }

  if (!isAppNameAllowed(appName)) {
    throw createError({
      statusCode: 400,
      message: 'App name must only contain lowercase alphanumeric characters and dashes',
    });
  }

  if (isAppNameBlacklisted(appName)) {
    throw createError({
      statusCode: 400,
      message: `App name "${appName}" is not allowed`,
    });
  }

  const apps = await db.select().from(appSchema).where(eq(appSchema.organizationId, organization.id)).execute();

  if (apps.length >= plan.maxApps) {
    throw createError({
      statusCode: 400,
      message: `You have reached the maximum number of apps allowed for your plan`,
    });
  }
}

export function getDeploymentDomain({ name }: { name: string }): string {
  const config = useRuntimeConfig();
  return `${config.public.root.schema}://${name}.${config.public.root.domain}`;
}
