import { userSchema } from '~/server/db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const db = useDB();
  const user = await requireUser(event);

  const input = await z
    .object({
      // TODO:
    })
    .parseAsync(await readBody(event));

  const result = await db.update(userSchema).set({}).where(eq(userSchema.id, user.id)).returning();

  return result[0];
});
