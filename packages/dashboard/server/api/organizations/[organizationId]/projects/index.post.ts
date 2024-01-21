import { organizationSchema, projectSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { PROJECT_MEMORY } from '~/server/lib/constants';
import { getPlanOfOrganization } from '~/server/lib/plans';

export default defineEventHandler(async event => {
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

  const organization = await db
    .select()
    .from(organizationSchema)
    .where(eq(organizationSchema.id, organizationId))
    // TODO: where user is owner or member
    .get();

  if (!organization) {
    throw createError({
      message: 'Organization not found',
      statusCode: 404,
    });
  }

  const name = input.name || (await findUniqueProjectName());

  const plan = getPlanOfOrganization(organization);

  await checkCanCreateProject({
    projectName: name,
    organization,
    plan,
  });

  const result = await db
    .insert(projectSchema)
    .values({
      id: await generateId(),
      organizationId,
      playground: input.playground,
      name,
      cron: undefined,
      cronRegion: 'us-east-1', // TODO: set default region
      createdAt: new Date(),
      updatedAt: new Date(),
      memory: PROJECT_MEMORY,
      tickTimeout: plan.tickTimeout,
      totalTimeout: plan.totalTimeout,
    })
    .returning();

  // TODO: create first deployment (at least for playground projects) with default code

  return result[0];
});
