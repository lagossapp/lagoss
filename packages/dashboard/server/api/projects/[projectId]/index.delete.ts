import { domainSchema, envVariableSchema, projectSchema, deploymentSchema } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { deleteDeployment } from '~~/server/utils/deployment';

export default defineEventHandler(async event => {
  const db = await useDB();
  const project = await requireProject(event);

  await db.delete(domainSchema).where(eq(domainSchema.projectId, project.id)).execute();
  await db.delete(envVariableSchema).where(eq(envVariableSchema.projectId, project.id)).execute();
  await db.delete(projectSchema).where(eq(projectSchema.id, project.id)).execute();

  const deployments = await db
    .select()
    .from(deploymentSchema)
    .where(eq(deploymentSchema.projectId, project.id))
    .execute();

  // delete all deployments and their files
  await Promise.all(deployments.map(deployment => deleteDeployment(deployment, event)));

  return { ok: true };
});
