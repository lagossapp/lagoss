import { deploymentSchema, domainSchema, envVariableSchema, appSchema } from '~~/server/db/schema';
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
    .leftJoin(appSchema, eq(deploymentSchema.appId, appSchema.id))
    .where(cronRegion ? or(isNull(appSchema.cron), eq(appSchema.cronRegion, cronRegion)) : undefined);

  return Promise.all(
    deployments.map(async ({ deployments: deployment, apps: app }) => {
      if (!app) {
        throw new Error(`App ${deployment.appId} not found`);
      }

      const domains = await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id));
      const env = await db.select().from(envVariableSchema).where(eq(envVariableSchema.appId, app.id));

      return {
        id: deployment.id,
        isProduction: deployment.isProduction,
        assets: parseAssets(deployment.assets),
        functionId: app.id,
        functionName: app.name,
        memory: app.memory,
        tickTimeout: app.tickTimeout,
        totalTimeout: app.totalTimeout,
        cron: app.cron,
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
