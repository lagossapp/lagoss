import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from '~/server/db/schema';
import { randomBytes } from 'crypto';

function getDB() {
  const connection = connect({
    url: process.env['DATABASE_URL'],
  });

  return drizzle(connection, { schema });

  // if (config.db.turso.url && config.db.turso.authToken) {
  //   const connection = createLibSQLClient({
  //     url: config.db.turso.url,
  //     authToken: config.db.turso.authToken,
  //   });
  //   return drizzleLibSQL(connection, { schema });
  // }

  // if (process.dev) {
  //   const connection = new Database(config.db.file || path.join(process.cwd(), './db.sqlite'));
  //   return drizzle(connection, { schema });
  // }

  // throw new Error('Missing database configuration');
}

let _db: ReturnType<typeof getDB>;

export function useDB() {
  if (!_db) {
    _db = getDB();
  }

  return _db;
}

export async function getFirst<T>(query: Promise<T[]>): Promise<T | undefined> {
  return (await query)?.[0] ?? undefined;
}

export async function generateId(length = 16) {
  return randomBytes(length).toString('hex');
}
