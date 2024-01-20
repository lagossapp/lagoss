import type { H3Event } from 'h3';
import { organizationMemberSchema, organizationSchema, projectSchema } from '~/server/db/schema';
import { and, eq, or } from 'drizzle-orm';

export async function requireProject(event: H3Event) {
  const user = await requireUser(event);

  const projectName = getRouterParam(event, 'projectName');
  if (!projectName) {
    throw createError({
      message: 'Missing projectName',
      status: 400,
    });
  }

  const project = await getFirst(
    db
      .select()
      .from(projectSchema)
      .leftJoin(organizationSchema, eq(projectSchema.organizationId, organizationSchema.id))
      .leftJoin(organizationMemberSchema, eq(projectSchema.organizationId, organizationMemberSchema.organizationId))
      .where(
        and(
          eq(projectSchema.name, projectName),
          or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id)),
        ),
      )
      .execute(),
  );

  if (!project) {
    throw createError({
      message: 'Project not found',
      status: 404,
    });
  }

  return project.projects;
}
