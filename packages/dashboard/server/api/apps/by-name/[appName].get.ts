import { domainSchema, envVariableSchema } from '~~/server/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const db = await useDB();

  const app = await requireApp(event);

  const domains = (await db.select().from(domainSchema).where(eq(domainSchema.appId, app.id)).execute()).map(
    ({ domain }) => domain,
  );
  const envVariables = (
    await db.select().from(envVariableSchema).where(eq(envVariableSchema.appId, app.id)).execute()
  ).map(({ key, value }) => ({ key, value }));

  return { ...app, envVariables, domains };
});
