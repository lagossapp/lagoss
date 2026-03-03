import { organizationMemberSchema, organizationSchema, appSchema } from '~~/server/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const db = await useDB();
  const user = await requireUser(event);

  const organizationId = getRouterParam(event, 'organizationId');
  if (!organizationId) {
    throw createError({
      message: 'organizationId is required',
      statusCode: 400,
    });
  }

  const apps = await db
    .select()
    .from(appSchema)
    .leftJoin(organizationSchema, eq(appSchema.organizationId, organizationSchema.id))
    .leftJoin(organizationMemberSchema, eq(appSchema.organizationId, organizationMemberSchema.organizationId))
    .where(
      and(
        eq(appSchema.organizationId, organizationId),
        or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id)),
      ),
    )
    .orderBy(desc(appSchema.updatedAt))
    .execute();

  return apps.map(app => app.apps);
});
