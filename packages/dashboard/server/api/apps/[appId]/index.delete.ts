import { domainSchema, envVariableSchema, appSchema, deploymentSchema } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';
import { deleteDeployment } from '~~/server/utils/deployment';

export default defineEventHandler(async event => {
  const db = await useDB();
  const app = await requireApp(event);

  // delete all deployments and their files
  const deployments = await db.select().from(deploymentSchema).where(eq(deploymentSchema.appId, app.id)).execute();
  await Promise.all(deployments.map(deployment => deleteDeployment(deployment, event)));

  await db.delete(domainSchema).where(eq(domainSchema.appId, app.id)).execute();
  await db.delete(envVariableSchema).where(eq(envVariableSchema.appId, app.id)).execute();
  await db.delete(appSchema).where(eq(appSchema.id, app.id)).execute();

  return { ok: true };
});
