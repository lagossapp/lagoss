import { deploymentSchema, domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { redis } from '~~/server/lib/redis';
import { envStringToObject } from '~~/app/composables/utils';
import { s3 } from '~~/server/lib/s3';
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

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
      status: 404,
      message: 'Deployment not found',
    });
  }

  const isCurrentProductionDeployment = await getFirst(
    db
      .select()
      .from(deploymentSchema)
      .where(
        and(
          eq(deploymentSchema.id, deploymentId),
          eq(deploymentSchema.projectId, project.id),
          eq(deploymentSchema.isProduction, 1),
        ),
      )
      .execute(),
  );

  if (isCurrentProductionDeployment) {
    throw createError({
      status: 400,
      message: 'Cannot delete a production deployment, promote another deployment first.',
    });
  }

  await db.delete(deploymentSchema).where(eq(deploymentSchema.id, deploymentId)).execute();

  const deletePromises = [
    s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: `${deployment.id}.js`,
      }),
    ),
  ];

  if (Array.isArray(deployment.assets) && deployment.assets.length > 0) {
    deletePromises.push(
      s3.send(
        new DeleteObjectsCommand({
          Bucket: process.env.S3_BUCKET,
          Delete: {
            Objects: deployment.assets.map(asset => ({
              Key: `${deployment.id}/${asset}`,
            })),
          },
        }),
      ),
    );
  }

  await Promise.all(deletePromises);

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.projectId, project.id)).execute();
  const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.projectId, project.id)).execute();

  await redis.publish(
    'undeploy',
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

  return { ok: true };
});
