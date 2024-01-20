import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    url: process.env.TURSO_DB_URL || '',
    authToken: process.env.TURSO_DB_TOKEN || '',
  },
  driver: 'turso',
} satisfies Config;
