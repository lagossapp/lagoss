import { domainSchema, envVariableSchema, projectSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const project = await requireProject(event);

  await db.delete(domainSchema).where(eq(domainSchema.functionId, project.id)).execute();
  await db.delete(envVariableSchema).where(eq(envVariableSchema.functionId, project.id)).execute();
  await db.delete(projectSchema).where(eq(projectSchema.id, project.id)).execute();

  // TODO: delete deployments

  return { ok: true };
});
