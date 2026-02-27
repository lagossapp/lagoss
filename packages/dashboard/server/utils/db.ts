import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '~~/server/db/schema';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';

let _db: ReturnType<typeof drizzle> | undefined;

export function useDB() {
  if (!_db) {
    const config = useRuntimeConfig();

    if (!config.database.path) {
      throw new Error('NUXT_DATABASE_PATH is not configured');
    }

    const sqlite = new Database(resolve(config.database.path));
    sqlite.pragma('journal_mode = WAL');
    sqlite.pragma('foreign_keys = ON');
    _db = drizzle(sqlite, { schema });
  }

  return _db;
}

export async function getFirst<T>(query: Promise<T[]>): Promise<T | undefined> {
  return (await query)?.[0] ?? undefined;
}

export function generateId(length = 16) {
  return randomBytes(length).toString('hex');
}
