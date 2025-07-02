import { deploymentSchema, domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { redis } from '~~/server/lib/redis';
import { envStringToObject, getFullCurrentDomain } from '~~/app/composables/utils';

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
    db.select().from(deploymentSchema).where(eq(deploymentSchema.id, deploymentId)).execute(),
  );
  if (!deployment) {
    throw createError({
      status: 500,
      message: 'Failed to create deployment',
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
      .where(and(eq(deploymentSchema.projectId, project.id), eq(deploymentSchema.isProduction, 1)))
      .execute(),
  );

  if (input.isProduction && hasProductionDeployment) {
    await db
      .update(deploymentSchema)
      .set({ isProduction: 0 })
      .where(eq(deploymentSchema.projectId, deployment.projectId))
      .execute();
  }

  await db
    .update(deploymentSchema)
    .set({
      isProduction: !hasProductionDeployment || input.isProduction ? 1 : 0,
    })
    .where(eq(deploymentSchema.id, deploymentId))
    .execute();

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.projectId, project.id)).execute();
  const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.projectId, project.id)).execute();

  await redis.publish(
    'deploy',
    JSON.stringify({
      functionId: project.id, // TODO: rename to projectId
      functionName: project.name, // TODO: rename to projectName
      deploymentId: deployment.id,
      domains: domains.map(({ domain }) => domain),
      memory: project.memory,
      tickTimeout: project.tickTimeout,
      totalTimeout: project.totalTimeout,
      cron: project.cron,
      cronRegion: project.cronRegion,
      env: envStringToObject(env),
      isProduction: deployment.isProduction,
      assets: deployment.assets,
    }),
  );

  return {
    url: getFullCurrentDomain({
      name: deployment.isProduction ? project.name : deployment.id,
    }),
  };
});
