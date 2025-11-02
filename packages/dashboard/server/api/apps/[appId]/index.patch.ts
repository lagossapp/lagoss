import { domainSchema, envVariableSchema, appSchema } from '~~/server/db/schema';
import { eq, and, notInArray } from 'drizzle-orm';
import { z } from 'zod';

export default defineEventHandler(async event => {
  const db = await useDB();
  const app = await requireApp(event);

  const input = await z
    .object({
      name: z.string().optional(),
      domains: z.array(z.string()).optional(),
      envVariables: z
        .array(
          z.object({
            key: z.string(),
            value: z.string(),
          }),
        )
        .optional(),
      cron: z.string().optional(),
    })
    .parseAsync(await readBody(event));

  if (input.name || input.cron) {
    await db
      .update(appSchema)
      .set({
        name: input.name || app.name,
        cron: input.cron || app.cron,
      })
      .where(eq(appSchema.id, app.id))
      .execute();
  }

  if (input.domains && input.domains.length > 0) {
    await db
      .delete(domainSchema)
      .where(and(eq(domainSchema.appId, app.id), notInArray(domainSchema.domain, input.domains)))
      .execute();

    const domains = await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id)).execute();
    await Promise.all(
      input.domains
        .filter(domain => !domains.find(({ domain: existingDomain }) => existingDomain === domain))
        .map(async domain =>
          db
            .insert(domainSchema)
            .values({
              domain,
              appId: app.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .execute(),
        ),
    );

    // TODO: update deployments
  }

  if (input.envVariables && input.envVariables.length > 0) {
    await db
      .delete(envVariableSchema)
      .where(
        and(
          eq(envVariableSchema.appId, app.id),
          notInArray(
            envVariableSchema.key,
            input.envVariables.map(({ key }) => key.toLocaleUpperCase()),
          ),
        ),
      )
      .execute();

    const envVariables = await db.select().from(envVariableSchema).where(eq(envVariableSchema.appId, app.id)).execute();

    const changes: Promise<unknown>[] = [];
    for await (const { key, value } of input.envVariables) {
      const envVariable = envVariables.find(envVariable => envVariable.key === key.toLocaleUpperCase());

      if (envVariable) {
        changes.push(
          db
            .update(envVariableSchema)
            .set({ value, updatedAt: new Date() })
            .where(eq(envVariableSchema.id, envVariable.id))
            .execute(),
        );
      } else {
        changes.push(
          db
            .insert(envVariableSchema)
            .values({
              key: key.toLocaleUpperCase(),
              value,
              appId: app.id,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
            .execute(),
        );
      }
    }
    await Promise.all(changes);

    // TODO: update deployments
  }

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id)).execute();
  const envVariables = await db.select().from(envVariableSchema).where(eq(envVariableSchema.appId, app.id)).execute();

  return { ...app, envVariables, domains };
});
