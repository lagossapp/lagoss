import { eq } from 'drizzle-orm';
import { deploymentSchema } from '~~/server/db/schema';

export default defineEventHandler(async event => {
  const db = await useDB();
  const app = await requireApp(event);

  const deployments = await db.select().from(deploymentSchema).where(eq(deploymentSchema.appId, app.id)).execute();

  return deployments;
});
