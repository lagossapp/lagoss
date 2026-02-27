import { z } from 'zod';
import { organizationMemberSchema, organizationSchema } from '~~/server/db/schema';
import { generateId } from '~~/server/utils/db';
import { eq } from 'drizzle-orm';

const bodySchema = z.object({
  name: z.string().min(1).max(64),
  description: z.string().max(256).optional(),
});

export default defineEventHandler(async event => {
  const db = await useDB();
  const user = await requireUser(event);

  // TODO: check org limit for user plan

  const { name, description } = await readValidatedBody(event, bodySchema.parseAsync);

  const orgId = generateId();
  await db
    .insert(organizationSchema)
    .values({
      id: orgId,
      name,
      description: description ?? null,
      ownerId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      plan: 'personal',
    })
    .execute();

  await db.insert(organizationMemberSchema).values({
    id: generateId(),
    organizationId: orgId,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // TODO: directly get returned org
  const org = (await db.select().from(organizationSchema).where(eq(organizationSchema.id, orgId)))[0]!;

  return org;
});
