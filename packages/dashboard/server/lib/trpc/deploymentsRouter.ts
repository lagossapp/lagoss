import { PutObjectCommand } from '@aws-sdk/client-s3';
import { TRPCError } from '@trpc/server';
import {
  createDeployment,
  unpromoteProductionDeployment,
  removeDeployment,
  promoteProductionDeployment,
  checkCanCreateDeployment,
} from '~~/server/lib/api/deployments';
import type { T } from '~~/server/api/trpc/[trpc]';
import { z } from 'zod';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { redis } from '~~/server/lib/redis';
import { envStringToObject, getFullCurrentDomain } from '~~/server/lib/utils';
import { s3 } from '~~/server/lib/s3';
import { PRESIGNED_URL_EXPIRES_SECONDS } from '~~/server/lib/constants';
import { checkCanQueryFunction } from '~~/server/lib/api/functions';
import { getPlanOfOrganization } from '~~/server/lib/plans';
import { deploymentSchema } from '~~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const deploymentsRouter = (t: T) =>
  t.router({
    deploymentCreate: t.procedure
      .input(
        z.object({
          functionId: z.string(),
          functionSize: z.number(),
          assets: z
            .object({
              name: z.string(),
              size: z.number(),
            })
            .array(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        if (!ctx.session?.user || !ctx.session?.organization) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });
        }

        const plan = getPlanOfOrganization(ctx.session.organization);

        await checkCanCreateDeployment({
          assets: input.assets.length,
          functionId: input.functionId,
          userId: ctx.session.user.id,
          plan,
          {
            id: input.functionId,
          },
          input.assets.map(({ name }) => name),
          ctx.session.user.email,
        );

        const getPresignedUrl = async (key: string, size: number) => {
          const putCommand = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET,
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
      }),
    deploymentDeploy: t.procedure
      .input(
        z.object({
          functionId: z.string(),
          deploymentId: z.string(),
          isProduction: z.boolean(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });
        }

        await checkCanQueryFunction({
          functionId: input.functionId,
          userId: ctx.session.user.id,
        });

        const db = await useDB();
        const hasProductionDeployment = await db
          .select()
          .from(deploymentSchema)
          .where(and(eq(deploymentSchema.projectId, input.functionId), eq(deploymentSchema.isProduction, true)));

        if (input.isProduction) {
          await unpromoteProductionDeployment(input.functionId);
        }

        const [func, deployment] = await Promise.all([
          prisma.function.findFirst({
            where: {
              id: input.functionId,
            },
            select: {
              id: true,
              name: true,
              domains: true,
              memory: true,
              tickTimeout: true,
              totalTimeout: true,
              cron: true,
              cronRegion: true,
              env: true,
            },
          }),
          prisma.deployment.update({
            where: {
              id: input.deploymentId,
            },
            data: {
              isProduction: hasProductionDeployment ? input.isProduction : true,
            },
            select: {
              id: true,
              isProduction: true,
              assets: true,
            },
          }),
        ]);

        if (!func) {
          throw new TRPCError({
            code: 'NOT_FOUND',
          });
        }

        await redis.publish(
          'deploy',
          JSON.stringify({
            functionId: func.id,
            functionName: func.name,
            deploymentId: deployment.id,
            domains: func.domains.map(({ domain }) => domain),
            memory: func.memory,
            tickTimeout: func.tickTimeout,
            totalTimeout: func.totalTimeout,
            cron: func.cron,
            cronRegion: func.cronRegion,
            env: envStringToObject(func.env),
            isProduction: deployment.isProduction,
            assets: deployment.assets,
          }),
        );

        return {
          url: getFullCurrentDomain({
            name: deployment.isProduction ? func.name : deployment.id,
          }),
        };
      }),
    deploymentPromote: t.procedure
      .input(
        z.object({
          functionId: z.string(),
          deploymentId: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });
        }

        await checkCanQueryFunction({
          functionId: input.functionId,
          userId: ctx.session.user.id,
        });

        await promoteProductionDeployment(input.functionId, input.deploymentId);

        return { ok: true };
      }),
    deploymentUndeploy: t.procedure
      .input(
        z.object({
          functionId: z.string(),
          deploymentId: z.string(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.session?.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });
        }

        await checkCanQueryFunction({
          functionId: input.functionId,
          userId: ctx.session.user.id,
        });

        const func = await prisma.function.findFirst({
          where: {
            id: input.functionId,
          },
          select: {
            id: true,
            name: true,
            domains: {
              select: {
                domain: true,
              },
            },
            memory: true,
            tickTimeout: true,
            totalTimeout: true,
            cron: true,
            cronRegion: true,
            env: {
              select: {
                key: true,
                value: true,
              },
            },
          },
        });

        if (!func) {
          throw new TRPCError({
            code: 'NOT_FOUND',
          });
        }

        const isCurrentProductionDeployment = await prisma.deployment.findFirst({
          where: {
            functionId: input.functionId,
            isProduction: true,
            id: input.deploymentId,
          },
        });

        if (isCurrentProductionDeployment !== null) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot delete a production deployment, promote another deployment first.',
          });
        }

        await removeDeployment(
          {
            ...func,
            domains: func.domains.map(({ domain }) => domain),
          },
          input.deploymentId,
        );

        return { ok: true };
      }),
  });
