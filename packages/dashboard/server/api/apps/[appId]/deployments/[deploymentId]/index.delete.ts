import { deploymentSchema } from '~~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { deleteDeployment } from '~~/server/utils/deployment';

export default defineEventHandler(async event => {
  const db = await useDB();
  const app = await requireApp(event);

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
      .where(and(eq(deploymentSchema.id, deploymentId), eq(deploymentSchema.appId, app.id)))
      .execute(),
  );
  if (!deployment) {
    throw createError({
      status: 404,
      message: 'Deployment not found',
    });
  }

  if (deployment.isProduction === 1) {
    throw createError({
      status: 400,
      message: 'Cannot delete a production deployment, promote another deployment first.',
    });
  }

  await deleteDeployment(deployment, event);

  return { ok: true };
});
