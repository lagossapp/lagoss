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
  const orgs = await db
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
    .returning();

  const org = orgs[0];
  if (!org) {
    throw createError({
      message: 'Failed to create organization',
      statusCode: 500,
    });
  }

  await db
    .insert(organizationMemberSchema)
    .values({
      id: generateId(),
      organizationId: orgId,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return org;
});
