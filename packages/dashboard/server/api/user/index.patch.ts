import { userSchema } from '~/server/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const db = useDB();
  const user = await requireUser(event);

  const input = await z
    .object({
      currentOrganizationId: z.string(),
    })
    .parseAsync(await readBody(event));

  await db
    .update(userSchema)
    .set({ currentOrganizationId: input.currentOrganizationId })
    .where(eq(userSchema.id, user.id))
    .execute();
});
