import { drizzle, PlanetScalePreparedQuery } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { PreparedQueryConfig } from 'drizzle-orm/mysql-core/session';

const connection = connect({
  url: process.env['DATABASE_URL'],
});

export const db = drizzle(connection);

export async function getFirst<T extends PreparedQueryConfig>(query: PlanetScalePreparedQuery<T>): Promise<T | null> {
  const result = await query.execute();
  return result?.[0] ?? null;
}
