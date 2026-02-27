import { deploymentSchema, domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { useRedis } from '~~/server/lib/redis';
import { envStringToObject } from '~~/app/composables/utils';

export default defineEventHandler(async event => {
  const db = await useDB();
  const app = await requireApp(event);
  const redis = await useRedis();

  const deploymentId = getRouterParam(event, 'deploymentId');
  if (!deploymentId) {
    throw createError({
      status: 400,
      message: 'Missing deploymentId',
    });
  }

  const deployment = await db
    .select()
    .from(deploymentSchema)
    .where(and(eq(deploymentSchema.id, deploymentId), eq(deploymentSchema.appId, app.id)))
    .get();
  if (!deployment) {
    throw createError({
      status: 500,
      message: 'Failed to create deployment',
    });
  }

  const previousProductionDeployment = await db
    .select()
    .from(deploymentSchema)
    .where(and(eq(deploymentSchema.appId, app.id), eq(deploymentSchema.isProduction, true)))
    .get();
  if (previousProductionDeployment) {
    await db
      .update(deploymentSchema)
      .set({ isProduction: false })
      .where(eq(deploymentSchema.id, previousProductionDeployment.id))
      .execute();
  }

  await db.update(deploymentSchema).set({ isProduction: true }).where(eq(deploymentSchema.id, deploymentId)).execute();

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id)).execute();
  const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.appId, app.id)).execute();

  // TODO: promote using deploy twice first with prod=false and then with prod=true
  await redis.publish('promote', {
    previousDeploymentId: previousProductionDeployment?.id || '',
    functionId: app.id,
    functionName: app.name,
    deploymentId: deploymentId,
    domains: domains.map(({ domain }) => domain),
    memory: app.memory,
    tickTimeout: app.totalTimeout,
    totalTimeout: app.totalTimeout,
    cron: app.cron,
    cronRegion: app.cronRegion,
    env: envStringToObject(env),
    isProduction: true,
    assets: parseAssets(deployment.assets),
  });

  return { ok: true };
});
