import { organizationMemberSchema, organizationSchema } from '~/server/db/schema';
import { eq, and, or } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const user = await requireUser(event);

  const organizationId = getRouterParam(event, 'organizationId');
  if (!organizationId) {
    throw createError({
      message: 'organizationId is required',
      statusCode: 400,
    });
  }

  return (
    await getFirst(
      db
        .select()
        .from(organizationSchema)
        .leftJoin(organizationMemberSchema, eq(organizationSchema.id, organizationMemberSchema.organizationId))
        .where(
          and(
            eq(organizationSchema.id, organizationId),
            or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id)),
          ),
        )
        .execute(),
    )
  )?.Organization;
});
