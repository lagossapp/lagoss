import type { T } from '~/server/api/trpc/[trpc]';
import { z } from 'zod';
import { userSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const accountsRouter = (t: T) =>
  t.router({
    accountUpdate: t.procedure
      .input(
        z.object({
          name: z.string(),
          email: z.string(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const db = useDB();

        if (!ctx.session?.user) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
          });
        }

        await db
          .update(userSchema)
          .set({
            name: input.name,
            email: input.email,
          })
          .where(eq(userSchema.id, ctx.session.user.id))
          .run();

        return { ok: true };
      }),
  });
