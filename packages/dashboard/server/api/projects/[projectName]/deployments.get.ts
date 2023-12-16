import { deploymentSchema, functionSchema } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';

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

  const project = (
    await db
      .select()
      .from(functionSchema)
      .where(and(eq(functionSchema.organizationId, user.currentOrganizationId), eq(functionSchema.name, projectName)))
      .execute()
  )?.[0];

  const deployments = await db
    .select()
    .from(deploymentSchema)
    .where(eq(deploymentSchema.functionId, project.id))
    .execute();

  return deployments;
});
