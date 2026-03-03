import { tokenSchema } from '~~/server/db/schema';
import { randomBytes } from 'node:crypto';

export default defineEventHandler(async event => {
  const user = await getUser(event);
  const db = await useDB();

  const tokenLength = 32; // 32 bytes = 64 hex characters
  const tokenValue = randomBytes(tokenLength).toString('hex');

  const res = await db
    .insert(tokenSchema)
    .values({
      id: generateId(),
      userId: user!.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      value: tokenValue,
    })
    .returning();
  const token = res?.[0];

  if (!token) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create token',
    });
  }

  return token;
});
