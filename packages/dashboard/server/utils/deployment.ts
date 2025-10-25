import type { H3Event } from 'h3';
import { Deployment, deploymentSchema, domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { useRedis } from '~~/server/lib/redis';
import { envStringToObject } from '~~/app/composables/utils';
import { useS3 } from '~~/server/lib/s3';
import { DeleteObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

export async function deleteDeployment(deployment: Deployment, event: H3Event) {
  const db = await useDB();
  const project = await requireProject(event);
  const config = useRuntimeConfig(event);
  const s3 = await useS3();
  const redis = await useRedis();

  await db.delete(deploymentSchema).where(eq(deploymentSchema.id, deployment.id)).execute();

  const deletePromises = [
    s3.send(
      new DeleteObjectCommand({
        Bucket: config.s3.bucket,
        Key: `${deployment.id}.js`,
      }),
    ),
  ];

  const assets = parseAssets(deployment.assets);

  if (Array.isArray(assets) && assets.length > 0) {
    deletePromises.push(
      s3.send(
        new DeleteObjectsCommand({
          Bucket: config.s3.bucket,
          Delete: {
            Objects: assets.map(asset => ({
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

  await redis.publish('undeploy', {
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
    isProduction: deployment.isProduction === 1,
    assets: parseAssets(deployment.assets),
  });
}
