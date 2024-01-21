import { createClient as createLibSQLClient } from '@libsql/client/http';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { drizzle as drizzleLibSQL } from 'drizzle-orm/libsql';
import * as schema from '~/server/db/schema';
import { randomBytes } from 'crypto';
import path from 'path';

function getDB() {
  const config = useRuntimeConfig();

  if (config.db.turso.url && config.db.turso.authToken) {
    const connection = createLibSQLClient({
      url: config.db.turso.url,
      authToken: config.db.turso.authToken,
    });
    return drizzleLibSQL(connection, { schema });
  }

  if (process.dev) {
    const connection = new Database(config.db.file || path.join(process.cwd(), './db.sqlite'));
    return drizzle(connection, { schema });
  }

  throw new Error('Missing database configuration');
}

export const db = getDB();

export async function getFirst<T>(query: Promise<T[]>): Promise<T | undefined> {
  return (await query)?.[0] ?? undefined;
}

export async function generateId(length = 16) {
  return randomBytes(length).toString('hex');
}
