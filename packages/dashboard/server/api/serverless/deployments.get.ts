import { deploymentSchema, domainSchema, envVariableSchema, projectSchema } from '~~/server/db/schema';
import { eq, isNull, or } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const db = await useDB();

  if (!config.serverless.apiToken) {
    console.error('Serverless api token not configured');
    throw createError({
      status: 401,
      message: 'Unauthorized',
    });
  }

  if (event.headers.get('authorization') !== `Bearer ${config.serverless.apiToken}`) {
    throw createError({
      status: 401,
      message: 'Unauthorized',
    });
  }

  const cronRegion = event.headers.get('x-lagoss-region');

  const deployments = await db
    .select()
    .from(deploymentSchema)
    .leftJoin(projectSchema, eq(deploymentSchema.projectId, projectSchema.id))
    .where(cronRegion ? or(isNull(projectSchema.cron), eq(projectSchema.cronRegion, cronRegion)) : undefined);

  return Promise.all(
    deployments.map(async ({ Deployment: deployment, Function: project }) => {
      if (!project) {
        throw new Error(`Project ${deployment.projectId} not found`);
      }

      const domains = await db.select().from(domainSchema).where(eq(domainSchema.projectId, project.id));
      const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.projectId, project.id));

      return {
        id: deployment.id,
        isProduction: deployment.isProduction === 1,
        assets: parseAssets(deployment.assets),
        functionId: project.id,
        functionName: project.name,
        memory: project.memory,
        tickTimeout: project.tickTimeout,
        totalTimeout: project.totalTimeout,
        cron: project.cron,
        domains: domains.map(d => d.domain),
        env: env.reduce(
          (acc, e) => {
            return { ...acc, [e.key]: e.value };
          },
          {} as Record<string, string>,
        ),
      };
    }),
  );
});
