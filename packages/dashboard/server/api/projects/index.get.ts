import { functionSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const user = await requireUser(event);

  if (!user.currentOrganizationId) {
    return [];
  }

  const projects = await db
    .select()
    .from(functionSchema)
    .where(eq(functionSchema.organizationId, user.currentOrganizationId))
    // .leftJoin(domainSchema, eq(domainSchema.functionId, functionSchema.id))
    .execute();

  // return projects.map(project => ({ ...project.Function, domains: [project.Domain] }));
  return projects;
});
