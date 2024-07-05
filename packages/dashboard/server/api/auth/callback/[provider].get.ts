import type { H3Event } from 'h3';
import { type User, organizationSchema, userSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { Github } from '~/server/oauth/github';
import { generateId } from '~/server/utils/db';

async function loginUser(event: H3Event, userId: User['id']) {
  const session = await useAuthSession(event);

  await session.update({
    userId: userId,
  });

  return sendRedirect(event, '/');
}

export default defineEventHandler(async event => {
  const db = await useDB();
  const { state, code } = getQuery(event);
  if (!state) {
    throw new Error('State is undefined');
  }

  if (!code) {
    throw new Error('No code provided');
  }

  const session = await useStorage().getItem<{ login: string }>(`oauth:${state}`);
  if (!session) {
    throw new Error('Session not found');
  }

  const config = useRuntimeConfig();
  const github = new Github({
    clientId: config.auth.oauth.github.clientId,
    clientSecret: config.auth.oauth.github.clientSecret,
  });

  const tokens = await github.oauthCallback(event);

  const oauthUser = await github.getUserInfo(tokens.accessToken);

  const dbUser = (await db.select().from(userSchema).where(eq(userSchema.email, oauthUser.email)))?.[0];

  // existing user
  if (dbUser) {
    await db
      .update(userSchema)
      .set({
        image: oauthUser.avatarUrl,
        name: oauthUser.name,
      })
      .where(eq(userSchema.email, oauthUser.email))
      .execute();
    return loginUser(event, dbUser.id);
  }

  // new user
  const result = await db
    .insert(userSchema)
    .values({
      id: await generateId(),
      image: oauthUser.avatarUrl,
      name: oauthUser.name,
      email: oauthUser.email,
      emailVerified: new Date(),
    })
    .execute();

  const userId = result.insertId;

  // create user organization
  await db
    .insert(organizationSchema)
    .values({
      id: await generateId(),
      name: oauthUser.name,
      description: `${oauthUser.name}'s default organization`,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .execute();

  return loginUser(event, userId);
});
