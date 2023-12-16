import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'node:stream';

import { deploymentSchema, functionSchema } from '~/server/db/schema';
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
  const user = await requireUser(event);

  if (!user.currentOrganizationId) {
    return null;
  }

  const projectName = getRouterParam(event, 'projectName');
  if (!projectName) {
    throw createError({
      message: 'Missing projectName',
      status: 400,
    });
  }

  // TODO: Check if user can query function

  const project = (
    await db
      .select()
      .from(functionSchema)
      .where(and(eq(functionSchema.organizationId, user.currentOrganizationId), eq(functionSchema.name, projectName)))
      .execute()
  )?.[0];

  const deployment = (
    await db
      .select()
      .from(deploymentSchema)
      .where(and(eq(deploymentSchema.functionId, project.id), eq(deploymentSchema.isProduction, 1)))
      .execute()
  )?.[0];

  const code = await getDeploymentCode(deployment.id);

  return { code };
});
