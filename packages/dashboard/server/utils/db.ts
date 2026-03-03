import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '~~/server/db/schema';
import { randomBytes } from 'node:crypto';

let _db: ReturnType<typeof drizzle> | undefined;

export async function useDB() {
  if (!_db) {
    const config = useRuntimeConfig();

    const dbUrl = config.database.url;
    if (!dbUrl) {
      throw new Error('NUXT_DATABASE_URL is not configured');
    }

    _db = drizzle(dbUrl, {
      schema,
    });
  }

  return _db;
}

export function generateId(length = 16) {
  return randomBytes(length).toString('hex');
}
