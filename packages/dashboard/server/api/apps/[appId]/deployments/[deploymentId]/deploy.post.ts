import { deploymentSchema, domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { useRedis } from '~~/server/lib/redis';
import { envStringToObject, getFullCurrentDomain } from '~~/app/composables/utils';

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

  const input = await z
    .object({
      isProduction: z.boolean(),
    })
    .parseAsync(await readBody(event));

  const hasProductionDeployment = await getFirst(
    db
      .select()
      .from(deploymentSchema)
      .where(and(eq(deploymentSchema.appId, app.id), eq(deploymentSchema.isProduction, 1)))
      .execute(),
  );

  if (input.isProduction && hasProductionDeployment) {
    await db
      .update(deploymentSchema)
      .set({ isProduction: 0 })
      .where(eq(deploymentSchema.appId, deployment.appId))
      .execute();
  }

  await db
    .update(deploymentSchema)
    .set({
      isProduction: !hasProductionDeployment || input.isProduction ? 1 : 0,
    })
    .where(eq(deploymentSchema.id, deploymentId))
    .execute();

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id)).execute();
  const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.appId, app.id)).execute();

  await redis.publish('deploy', {
    functionId: app.id, // TODO: rename to appId
    functionName: app.name, // TODO: rename to appName
    deploymentId: deployment.id,
    domains: domains.map(({ domain }) => domain),
    memory: app.memory,
    tickTimeout: app.tickTimeout,
    totalTimeout: app.totalTimeout,
    cron: app.cron,
    cronRegion: app.cronRegion,
    env: envStringToObject(env),
    isProduction: deployment.isProduction === 1,
    assets: parseAssets(deployment.assets),
  });

  return {
    url: getFullCurrentDomain({
      name: deployment.isProduction ? app.name : deployment.id,
    }),
  };
});
