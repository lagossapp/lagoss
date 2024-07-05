import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

import { deploymentSchema } from '~/server/db/schema';
import { s3 } from '~/server/lib/s3';
import { and, eq } from 'drizzle-orm';

async function streamToString(stream: Readable): Promise<string> {
  return await new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

async function getDeploymentCode(deploymentId: string) {
  const config = useRuntimeConfig();

  const content = await s3.send(
    new GetObjectCommand({
      Bucket: config.s3.bucket,
      Key: `${deploymentId}.js`,
    }),
  );

  if (content.Body instanceof Readable) {
    return streamToString(content.Body);
  }

  return '';
}

export default defineEventHandler(async event => {
  const db = await useDB();
  const project = await requireProject(event);

  const deployment = await getFirst(
    db
      .select()
      .from(deploymentSchema)
      .where(and(eq(deploymentSchema.projectId, project.id), eq(deploymentSchema.isProduction, 1)))
      .execute(),
  );

  if (!deployment) {
    throw createError({
      statusCode: 404,
      message: 'No production deployment found',
    });
  }

  const code = await getDeploymentCode(deployment.id);

  return { code };
});
