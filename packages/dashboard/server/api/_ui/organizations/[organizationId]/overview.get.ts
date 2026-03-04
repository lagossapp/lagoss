import { organizationMemberSchema, organizationSchema, appSchema, deploymentSchema } from '~~/server/db/schema';
import { eq, and, or, inArray, desc } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const db = await useDB();
  const user = await requireUser(event);

  const organizationId = getRouterParam(event, 'organizationId');
  if (!organizationId) {
    throw createError({ statusCode: 400, message: 'organizationId is required' });
  }

  // Verify the user is a member or owner of this org
  const orgRow = await db
    .select({ org: organizationSchema })
    .from(organizationSchema)
    .leftJoin(organizationMemberSchema, eq(organizationSchema.id, organizationMemberSchema.organizationId))
    .where(
      and(
        eq(organizationSchema.id, organizationId),
        or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id)),
      ),
    )
    .get();

  if (!orgRow?.org) {
    throw createError({ statusCode: 404, message: 'Organization not found' });
  }

  // Recent apps for this org, sorted by last updated
  const appRows = await db
    .select({ app: appSchema })
    .from(appSchema)
    .where(eq(appSchema.organizationId, organizationId))
    .orderBy(desc(appSchema.updatedAt));

  const apps = (appRows ?? []).map(r => r.app);
  const appIds = apps.map(a => a.id);

  // Recent deployments for this org's apps
  const recentDeploymentRows =
    appIds.length > 0
      ? await db
          .select()
          .from(deploymentSchema)
          .where(inArray(deploymentSchema.appId, appIds))
          .orderBy(desc(deploymentSchema.createdAt))
          .limit(8)
      : [];

  const appById = Object.fromEntries(apps.map(a => [a.id, a]));

  const recentDeployments = recentDeploymentRows.map(dep => ({
    ...dep,
    isProduction: dep.isProduction === true,
    appName: appById[dep.appId]?.name ?? '',
  }));

  return {
    recentApps: apps.slice(0, 6),
    recentDeployments,
  };
});
