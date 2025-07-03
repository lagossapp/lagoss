import type { H3Event, SessionConfig } from 'h3';
import { tokenSchema, type User, userSchema } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';

const sessionConfig: SessionConfig = useRuntimeConfig().auth || {};

export type AuthSession = {
  userId: string;
};

export async function useAuthSession(event: H3Event) {
  const session = await useSession<AuthSession>(event, sessionConfig);
  return session;
}

export async function getUser(event: H3Event): Promise<User | undefined> {
  const db = await useDB();

  const token = getHeader(event, 'x-lagoss-token');
  if (token) {
    const user = await getFirst(
      db
        .select()
        .from(userSchema)
        .leftJoin(tokenSchema, eq(userSchema.id, tokenSchema.userId))
        .where(eq(tokenSchema.value, token))
        .execute(),
    );
    if (!user?.User) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token',
      });
    }

    return user.User;
  }

  const session = await useAuthSession(event);
  if (!session.data?.userId) {
    return undefined;
  }

  return await getFirst(db.select().from(userSchema).where(eq(userSchema.id, session.data.userId)).execute());
}

export async function requireUser(event: H3Event): Promise<User> {
  const user = await getUser(event);
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return user;
}
