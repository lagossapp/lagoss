import { organizationMemberSchema, organizationSchema, projectSchema } from '~/server/db/schema';
import { eq, and, or } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const user = await requireUser(event);

  const organizationId = getRouterParam(event, 'organizationId');
  if (!organizationId) {
    throw createError({
      message: 'organizationId is required',
      statusCode: 400,
    });
  }

  const projects = await db
    .select()
    .from(projectSchema)
    .leftJoin(organizationSchema, eq(projectSchema.organizationId, organizationSchema.id))
    .leftJoin(organizationMemberSchema, eq(projectSchema.organizationId, organizationMemberSchema.organizationId))
    .where(
      and(
        eq(projectSchema.organizationId, organizationId),
        or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id)),
      ),
    )
    .execute();

  return projects.map(project => project.projects);
});
