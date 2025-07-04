import { organizationMemberSchema, organizationSchema } from '~~/server/db/schema';
import { eq, or } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const db = await useDB();
  const user = await requireUser(event);

  const organizations = (
    await db
      .select()
      .from(organizationSchema)
      .leftJoin(organizationMemberSchema, eq(organizationSchema.id, organizationMemberSchema.organizationId))
      .where(or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id)))
      .execute()
  ).map(org => org.Organization);

  return organizations;
});
