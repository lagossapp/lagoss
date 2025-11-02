import { organizationMemberSchema, organizationSchema, appSchema } from '~~/server/db/schema';
import { and, eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { APP_MEMORY } from '~~/server/lib/constants';
import { getPlanOfOrganization } from '~~/server/lib/plans';

export default defineEventHandler(async event => {
  const db = await useDB();
  const user = await requireUser(event);

  const input = await readValidatedBody(event, body =>
    z
      .object({
        name: z.string().optional(),
        playground: z.boolean().optional().default(false),
      })
      .parse(body),
  );

  const organizationId = getRouterParam(event, 'organizationId');
  if (!organizationId) {
    throw createError({
      message: 'organizationId is required',
      statusCode: 400,
    });
  }

  const organization = (
    await getFirst(
      db
        .select()
        .from(organizationSchema)
        .leftJoin(organizationMemberSchema, eq(organizationMemberSchema.organizationId, organizationSchema.id))
        .where(
          and(
            eq(organizationSchema.id, organizationId),
            or(
              eq(organizationSchema.ownerId, user.id),
              and(
                eq(organizationMemberSchema.userId, user.id),
                eq(organizationMemberSchema.organizationId, organizationSchema.id),
              ),
            ),
          ),
        ),
    )
  )?.Organization;

  if (!organization) {
    throw createError({
      message: 'Organization not found',
      statusCode: 404,
    });
  }

  const name = input.name || (await findUniqueAppName());

  const plan = getPlanOfOrganization(organization);

  await checkCanCreateApp({
    appName: name,
    organization,
    plan,
  });

  const res = await db
    .insert(appSchema)
    .values({
      organizationId,
      // playground: input.playground, // TODO: set playground
      name,
      cron: undefined,
      cronRegion: 'us-east-1', // TODO: set default region
      createdAt: new Date(),
      updatedAt: new Date(),
      memory: APP_MEMORY,
      tickTimeout: plan.tickTimeout,
      totalTimeout: plan.totalTimeout,
    })
    .$returningId();

  const appId = res.at(0)?.id;
  if (!appId) {
    throw createError({
      message: 'Failed to create app',
      statusCode: 500,
    });
  }

  const app = await getFirst(db.select().from(appSchema).where(eq(appSchema.id, appId)).execute());

  // TODO: create first deployment (at least for playground apps) with default code

  return app;
});
