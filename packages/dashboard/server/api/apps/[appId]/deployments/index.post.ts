import { deploymentSchema, organizationSchema } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PRESIGNED_URL_EXPIRES_SECONDS } from '~~/server/lib/constants';
import { useS3 } from '~~/server/lib/s3';
import { z } from 'zod';
import { generateId } from '~~/server/utils/db';
import { getPlanOfOrganization } from '~~/server/lib/plans';

export default defineEventHandler(async event => {
  const db = await useDB();
  const user = await requireUser(event);
  const app = await requireApp(event);
  const s3 = await useS3();

  const input = await z
    .object({
      functionSize: z.number(),
      assets: z
        .object({
          name: z.string(),
          size: z.number(),
        })
        .array(),
    })
    .parseAsync(await readBody(event));

  const organization = await getFirst(
    db.select().from(organizationSchema).where(eq(organizationSchema.id, app.organizationId)).execute(),
  );
  if (!organization) {
    throw createError({
      status: 404,
      message: 'Organization not found',
    });
  }

  const plan = getPlanOfOrganization(organization);

  if (input.assets.length > plan.maxAssetsPerApp) {
    throw createError({
      status: 400,
      message: `You can only deploy up to ${plan.maxAssetsPerApp} assets.`,
    });
  }

  const deploymentId = await generateId();
  await db
    .insert(deploymentSchema)
    .values({
      id: deploymentId,
      appId: app.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      triggerer: user.email,
      isProduction: 0,
      assets: JSON.stringify(input.assets.map(({ name }) => name)),
    })
    .execute();

  const deployment = await getFirst(
    db.select().from(deploymentSchema).where(eq(deploymentSchema.id, deploymentId)).execute(),
  );
  if (!deployment) {
    throw createError({
      status: 500,
      message: 'Failed to create deployment',
    });
  }

  const config = useRuntimeConfig();
  const getPresignedUrl = async (key: string, size: number) => {
    const putCommand = new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      ContentLength: size,
    });

    return getSignedUrl(s3, putCommand, {
      expiresIn: PRESIGNED_URL_EXPIRES_SECONDS,
    });
  };

  const codeUrl = await getPresignedUrl(`${deployment.id}.js`, input.functionSize);
  const assetsUrls: Record<string, string> = {};

  await Promise.all(
    input.assets.map(async ({ name, size }) => {
      const url = await getPresignedUrl(`${deployment.id}/${name}`, size);
      assetsUrls[name] = url;
    }),
  );

  return {
    deploymentId: deployment.id,
    codeUrl,
    assetsUrls,
  };
});
