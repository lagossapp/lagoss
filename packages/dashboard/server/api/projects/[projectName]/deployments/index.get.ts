import { eq } from 'drizzle-orm';
import { deploymentSchema } from '~/server/db/schema';

export default defineEventHandler(async event => {
  const db = await useDB();
  const project = await requireProject(event);

  const deployments = await db
    .select()
    .from(deploymentSchema)
    .where(eq(deploymentSchema.projectId, project.id))
    .execute();

  return deployments;
});
