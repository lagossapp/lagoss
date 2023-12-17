import type { H3Event } from 'h3';
import { projectSchema } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export async function requireProject(event: H3Event) {
  const user = await requireUser(event);

  if (!user.currentOrganizationId) {
    throw createError({
      message: 'Please select an organization first',
      status: 400,
    });
  }

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
      .where(and(eq(projectSchema.organizationId, user.currentOrganizationId), eq(projectSchema.name, projectName)))
      .execute(),
  );

  if (!project) {
    throw createError({
      message: 'Project not found',
      status: 404,
    });
  }

  return project;
}
