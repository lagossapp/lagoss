import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '~~/server/db/schema';
import { randomBytes } from 'node:crypto';

async function getDB() {
  const config = useRuntimeConfig();

  if (!config.database.url) {
    throw new Error('NUXT_DATABASE_URL is not configured');
  }

  const pool = mysql.createPool({
    uri: config.database.url,
  });

  return pool;

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

let _connection: mysql.Pool | undefined;

export async function useDB() {
  if (!_connection) {
    _connection = await getDB();
  }

  return drizzle(_connection, { schema, mode: 'default' });
}

export async function getFirst<T>(query: Promise<T[]>): Promise<T | undefined> {
  return (await query)?.[0] ?? undefined;
}

export function generateId(length = 16) {
  return randomBytes(length).toString('hex');
}
