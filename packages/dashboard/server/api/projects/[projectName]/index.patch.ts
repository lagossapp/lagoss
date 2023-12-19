import { domainSchema, envVariableSchema, projectSchema } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export default defineEventHandler(async event => {
  const project = await requireProject(event);

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
      .update(projectSchema)
      .set({
        name: input.name || project.name,
        cron: input.cron || project.cron,
      })
      .where(eq(projectSchema.id, project.id))
      .execute();
  }

  if (input.domains) {
    // TODO: update domains
    // TODO: update deployments
  }

  if (input.envVariables) {
    // TODO: update env variables
    // TODO: update deployments
  }

  const domains = await db.select().from(domainSchema).where(eq(domainSchema.functionId, project.id)).execute();
  const envVariables = await db
    .select()
    .from(envVariableSchema)
    .where(eq(envVariableSchema.functionId, project.id))
    .execute();

  return { ...project, envVariables, domains };
});
