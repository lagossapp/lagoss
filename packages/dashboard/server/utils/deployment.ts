import type { H3Event } from 'h3';
import { type Deployment, deploymentSchema, domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { useRedis } from '~~/server/lib/redis';
import { envStringToObject } from '~~/app/composables/utils';
import { useS3 } from '~~/server/lib/s3';
import { DeleteObjectsCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

export async function deleteDeployment(deployment: Deployment, event: H3Event) {
  const db = await useDB();
  const app = await requireApp(event);
  const config = useRuntimeConfig(event);
  const s3 = await useS3();
  const redis = await useRedis();

  await db.delete(deploymentSchema).where(eq(deploymentSchema.id, deployment.id)).execute();

  const files = await s3.send(
    new ListObjectsV2Command({
      Bucket: config.s3.bucket,
      Prefix: `${deployment.id}/`,
    }),
  );

  const objectKeys = files.Contents?.map(({ Key }) => Key).filter(Boolean) as string[] | undefined;

  const deletePromises: Promise<unknown>[] = [];

  if (objectKeys && objectKeys.length > 0) {
    deletePromises.push(
      s3.send(
        new DeleteObjectsCommand({
          Bucket: config.s3.bucket,
          Delete: {
            Objects: objectKeys.map(Key => ({ Key })),
          },
        }),
      ),
    );
  }

  await Promise.all(deletePromises);

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id)).execute();
  const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.appId, app.id)).execute();

  await redis.publish('undeploy', {
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
}
