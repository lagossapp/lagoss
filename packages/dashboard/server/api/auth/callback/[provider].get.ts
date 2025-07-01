import type { H3Event } from 'h3';
import { type User, organizationMemberSchema, organizationSchema, userSchema } from '~/server/db/schema';
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
    throw createError({
      statusCode: 400,
      statusMessage: 'No state provided',
    });
  }

  if (!code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No code provided',
    });
  }

  if (getRouterParam(event, 'provider') !== 'github') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid provider',
    });
  }

  const session = await useStorage().getItem<{ login: string }>(`oauth:${state}`);
  if (!session) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or expired session',
    });
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
  const userId = generateId();
  await db
    .insert(userSchema)
    .values({
      id: userId,
      image: oauthUser.avatarUrl,
      name: oauthUser.name,
      email: oauthUser.email,
      emailVerified: new Date(),
    })
    .execute();

  // create user organization
  const orgId = generateId();
  await db
    .insert(organizationSchema)
    .values({
      id: orgId,
      name: oauthUser.name,
      description: `${oauthUser.name}'s default organization`,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      plan: 'personal',
    })
    .execute();

  // create user organization member
  await db.insert(organizationMemberSchema).values({
    organizationId: orgId,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return loginUser(event, userId);
});
