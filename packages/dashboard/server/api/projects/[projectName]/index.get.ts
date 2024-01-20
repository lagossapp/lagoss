import { domainSchema, envVariableSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const project = await requireProject(event);

  const domains = (await db.select().from(domainSchema).where(eq(domainSchema.projectId, project.id)).execute()).map(
    ({ domain }) => domain,
  );
  const envVariables = (
    await db.select().from(envVariableSchema).where(eq(envVariableSchema.projectId, project.id)).execute()
  ).map(({ key, value }) => ({ key, value }));

  return { ...project, envVariables, domains };
});
