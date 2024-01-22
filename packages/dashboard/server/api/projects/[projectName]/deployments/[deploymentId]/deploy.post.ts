import { deploymentSchema, domainSchema, envVariableSchema } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { redis } from '~/server/lib/redis';
import { envStringToObject, getFullCurrentDomain } from '~/composables/utils';

export default defineEventHandler(async event => {
  const db = useDB();
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
      .where(and(eq(deploymentSchema.functionId, project.id), eq(deploymentSchema.isProduction, 1)))
      .execute(),
  );

  if (input.isProduction && hasProductionDeployment) {
    await db
      .update(deploymentSchema)
      .set({ isProduction: 0 })
      .where(eq(deploymentSchema.functionId, deployment.functionId))
      .execute();
  }

  await db
    .update(deploymentSchema)
    .set({
      isProduction: !hasProductionDeployment || input.isProduction ? 1 : 0,
    })
    .where(eq(deploymentSchema.id, deploymentId))
    .execute();

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.functionId, project.id)).execute();
  const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.functionId, project.id)).execute();

  await redis.publish(
    'deploy',
    JSON.stringify({
      functionId: project.id,
      functionName: project.name,
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
