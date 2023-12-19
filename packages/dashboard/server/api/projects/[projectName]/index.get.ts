import { domainSchema, envVariableSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const project = await requireProject(event);

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.functionId, project.id)).execute();
  const envVariables = await db
    .select()
    .from(envVariableSchema)
    .where(eq(envVariableSchema.functionId, project.id))
    .execute();

  return { ...project, envVariables, domains };
});
