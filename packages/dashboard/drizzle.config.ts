import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dbCredentials: {
    uri: process.env.DATABASE_URL || 'mysql://root:root@localhost:3306/drizzle',
  },
  driver: 'mysql2',
} satisfies Config;
