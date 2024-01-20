import { deploymentSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PRESIGNED_URL_EXPIRES_SECONDS } from '~/server/lib/constants';
import { s3 } from '~/server/lib/s3';
import { z } from 'zod';

export default defineEventHandler(async event => {
  const user = await requireUser(event);
  const project = await requireProject(event);

  const input = await z
    .object({
      projectId: z.string(),
      functionSize: z.number(),
      assets: z
        .object({
          name: z.string(),
          size: z.number(),
        })
        .array(),
    })
    .parseAsync(await readBody(event));

  // TODO: check plan
  // const plan = getPlanFromPriceId({
  //   priceId: ctx.session.organization.stripePriceId,
  //   currentPeriodEnd: ctx.session.organization.stripeCurrentPeriodEnd,
  // });

  // await checkCanCreateDeployment({
  //   assets: input.assets.length,
  //   projectId: input.projectId,
  //   userId: ctx.session.user.id,
  //   plan,
  // });

  const id = await generateId();
  await db
    .insert(deploymentSchema)
    .values({
      id,
      projectId: project.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      triggerer: user.email,
      isProduction: false,
      assets: input.assets.map(({ name }) => name),
    })
    .execute();

  const deployment = await getFirst(db.select().from(deploymentSchema).where(eq(deploymentSchema.id, id)).execute());
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
