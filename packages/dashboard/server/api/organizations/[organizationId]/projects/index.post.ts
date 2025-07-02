import { organizationMemberSchema, organizationSchema, projectSchema } from '~/server/db/schema';
import { and, eq, or } from 'drizzle-orm';
import { z } from 'zod';
import { PROJECT_MEMORY } from '~/server/lib/constants';
import { getPlanOfOrganization } from '~/server/lib/plans';

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

  const name = input.name || (await findUniqueProjectName());

  const plan = getPlanOfOrganization(organization);

  await checkCanCreateProject({
    projectName: name,
    organization,
    plan,
  });

  const res = await db
    .insert(projectSchema)
    .values({
      organizationId,
      // playground: input.playground, // TODO: set playground
      name,
      cron: undefined,
      cronRegion: 'us-east-1', // TODO: set default region
      createdAt: new Date(),
      updatedAt: new Date(),
      memory: PROJECT_MEMORY,
      tickTimeout: plan.tickTimeout,
      totalTimeout: plan.totalTimeout,
    })
    .$returningId();

  const projectId = res.at(0)?.id;
  if (!projectId) {
    throw createError({
      message: 'Failed to create project',
      statusCode: 500,
    });
  }

  const project = await getFirst(db.select().from(projectSchema).where(eq(projectSchema.id, projectId)).execute());

  // TODO: create first deployment (at least for playground projects) with default code

  return project;
});
