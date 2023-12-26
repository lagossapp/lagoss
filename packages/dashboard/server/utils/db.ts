import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from '~/server/db/schema';
import { randomBytes } from 'crypto';

const connection = connect({
  url: process.env['DATABASE_URL'],
});

export const db = drizzle(connection, { schema });

export async function getFirst<T>(query: Promise<T[]>): Promise<T | undefined> {
  return (await query)?.[0] ?? undefined;
}

export async function generateId(length = 64) {
  return randomBytes(length).toString('hex');
}
