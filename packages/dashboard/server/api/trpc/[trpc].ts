import { type inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
// import { functionsRouter } from '~/server/lib/trpc/functionsRouter';
// import { organizationsRouter } from '~/server/lib/trpc/organizationsRouter';
// import { tokensRouter } from '~/server/lib/trpc/tokensRouter';
// import { deploymentsRouter } from '~/server/lib/trpc/deploymentsRouter';
import { accountsRouter } from '~/server/lib/trpc/accountsRouter';
// import { statsRouter } from '~/server/lib/trpc/statsRouter';
import { createNuxtApiHandler } from 'trpc-nuxt';
import type { H3Event } from 'h3';
import { User, organizationSchema, tokenSchema, userSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

async function createContext(event: H3Event) {
  const db = await useDB();
  const tokenValue = getHeader(event, 'x-lagoss-token');
  const organizationId = getHeader(event, 'x-lagoss-organization-id');

  const query = getQuery<{ trpc: string }>(event);

  // tokensAuthenticate needs to skip authentication
  if (query.trpc === 'tokensAuthenticate') {
    return {
      event,
      session: null,
    };
  }

  let user: User | undefined;
  if (tokenValue) {
    const token = await getFirst(
      db
        .select()
        .from(tokenSchema)
        .leftJoin(userSchema, eq(userSchema.id, tokenSchema.userId))
        .where(eq(tokenSchema.value, tokenValue)),
    );

    if (!token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
      });
    }

    user = token.User || undefined;
  } else {
    user = await getUser(event);
  }

  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
    });
  }

  if (!organizationId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Missing organization id',
    });
  }

  const organization = await getFirst(
    db.select().from(organizationSchema).where(eq(organizationSchema.id, organizationId)).execute(),
  );

  return {
    event,
    session: {
      user,
      organization,
      expires: '',
    },
  };
}

const t = initTRPC.context<inferAsyncReturnType<typeof createContext>>().create();
export type T = typeof t;

const router = t.mergeRouters(
  // functionsRouter(t),
  // organizationsRouter(t),
  // tokensRouter(t),
  // deploymentsRouter(t),
  accountsRouter(t),
  // statsRouter(t),
);

export type AppRouter = typeof router;

// export API handler
export default createNuxtApiHandler({
  router,
  createContext,
  onError: ({ error }) => {
    console.error(error);
  },
});
