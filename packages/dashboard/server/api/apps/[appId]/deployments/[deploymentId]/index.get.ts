import { deploymentSchema, domainSchema } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { getFullCurrentDomain, getFullDomain } from '~~/app/composables/utils';

export default defineEventHandler(async event => {
  const db = await useDB();
  const app = await requireApp(event);

  const deploymentId = getRouterParam(event, 'deploymentId');
  if (!deploymentId) {
    throw createError({
      status: 400,
      message: 'Missing deploymentId',
    });
  }

  const deployment = await getFirst(
    db
      .select()
      .from(deploymentSchema)
      .where(and(eq(deploymentSchema.id, deploymentId), eq(deploymentSchema.appId, app.id)))
      .execute(),
  );
  if (!deployment) {
    throw createError({
      status: 404,
      message: 'Deployment not found',
    });
  }

  const urls: string[] = [];

  if (deployment.isProduction) {
    const _domains = await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id)).execute();
    _domains.forEach(({ domain }) => {
      urls.push(getFullDomain(domain));
    });

    const appUrl = getFullCurrentDomain({ name: app.name });
    urls.push(appUrl);
  }

  const deploymentUrl = getFullCurrentDomain({ name: deployment.id });
  urls.push(deploymentUrl);

  return {
    ...deployment,
    urls,
  };
});
