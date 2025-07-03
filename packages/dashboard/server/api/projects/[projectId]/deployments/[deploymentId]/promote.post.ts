import { deploymentSchema, domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redis } from '~~/server/lib/redis';
import { envStringToObject } from '~~/app/composables/utils';

export default defineEventHandler(async event => {
  const db = await useDB();
  const project = await requireProject(event);

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
      .where(and(eq(deploymentSchema.id, deploymentId), eq(deploymentSchema.projectId, project.id)))
      .execute(),
  );
  if (!deployment) {
    throw createError({
      status: 500,
      message: 'Failed to create deployment',
    });
  }

  const previousProductionDeployment = await getFirst(
    db
      .select()
      .from(deploymentSchema)
      .where(and(eq(deploymentSchema.projectId, project.id), eq(deploymentSchema.isProduction, 1)))
      .execute(),
  );
  if (previousProductionDeployment) {
    await db
      .update(deploymentSchema)
      .set({ isProduction: 0 })
      .where(eq(deploymentSchema.id, previousProductionDeployment.id))
      .execute();
  }

  await db.update(deploymentSchema).set({ isProduction: 1 }).where(eq(deploymentSchema.id, deploymentId)).execute();

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.projectId, project.id)).execute();
  const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.projectId, project.id)).execute();

  // TODO: promote using deploy twice first with prod=false and then with prod=true
  await redis.publish(
    'promote',
    JSON.stringify({
      previousDeploymentId: previousProductionDeployment?.id || '',
      functionId: project.id,
      functionName: project.name,
      deploymentId: deploymentId,
      domains: domains.map(({ domain }) => domain),
      memory: project.memory,
      tickTimeout: project.totalTimeout,
      totalTimeout: project.totalTimeout,
      cron: project.cron,
      cronRegion: project.cronRegion,
      env: envStringToObject(env),
      isProduction: true,
      assets: deployment.assets,
    }),
  );
});
