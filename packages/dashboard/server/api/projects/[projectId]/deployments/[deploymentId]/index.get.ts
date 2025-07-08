import { deploymentSchema, domainSchema, } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { getFullCurrentDomain, getFullDomain } from '~~/app/composables/utils';

export default defineEventHandler(async event => {
  const db = await useDB();
  const project = await requireProject(event);

  const deploymentId = getRouterParam(event, 'deploymentId');
  if (!deploymentId) {
    throw createError({
      status: 400,
      message: 'Missing deploymentId',
    });
  }

  const deployment = await getFirst(
    db
      .select()
      .from(deploymentSchema)
      .where(and(eq(deploymentSchema.id, deploymentId), eq(deploymentSchema.projectId, project.id)))
      .execute(),
  );
  if (!deployment) {
    throw createError({
      status: 404,
      message: 'Deployment not found',
    });
  }

  let urls: string[] = [];

  if (deployment.isProduction) {
    const _domains = await db.select().from(domainSchema).where(eq(domainSchema.projectId, project.id)).execute();
    _domains.forEach(({ domain }) => {
      urls.push(getFullDomain(domain));
    });

    const projectUrl = getFullCurrentDomain({ name: project.name });
    urls.push(projectUrl);
  }

  const deploymentUrl = getFullCurrentDomain({ name: deployment.id });
  urls.push(deploymentUrl);

  return {
    ...deployment,
    urls,
  };
});
