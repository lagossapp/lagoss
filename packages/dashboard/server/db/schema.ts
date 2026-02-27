import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel } from 'drizzle-orm';

export const userSchema = sqliteTable('users', {
  id: text().notNull().primaryKey(),
  name: text(),
  email: text().unique(),
  emailVerified: integer({ mode: 'timestamp_ms' }),
  image: text(),
});
export type User = InferSelectModel<typeof userSchema>;

export const deploymentSchema = sqliteTable('deployments', {
  id: text().notNull().primaryKey(),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),
  appId: text()
    .notNull()
    .references(() => appSchema.id),
  triggerer: text().default('Lagoss'),
  commit: text(),
  isProduction: integer({ mode: 'boolean' }).default(false).notNull(),
  assets: text().notNull(),
});
export type Deployment = InferSelectModel<typeof deploymentSchema>;

export const domainSchema = sqliteTable('domains', {
  id: text().notNull().primaryKey(),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),
  domain: text().notNull(),
  appId: text()
    .notNull()
    .references(() => appSchema.id),
});
export type Domain = InferSelectModel<typeof domainSchema>;

export const envVariableSchema = sqliteTable('env_variables', {
  id: text().notNull().primaryKey(),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),
  key: text().notNull(),
  value: text().notNull(),
  appId: text()
    .notNull()
    .references(() => appSchema.id),
});
export type EnvVariable = InferSelectModel<typeof envVariableSchema>;

export const appSchema = sqliteTable('apps', {
  id: text().notNull().primaryKey(),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),
  name: text().notNull().unique(),
  memory: integer().notNull(),
  tickTimeout: integer().notNull().default(1000),
  cron: text(),
  organizationId: text()
    .notNull()
    .references(() => organizationSchema.id),
  cronRegion: text(),
  totalTimeout: integer().notNull().default(5000),
  // playground: integer('playground').notNull().default(0),
});
export type App = InferSelectModel<typeof appSchema>;

export const organizationSchema = sqliteTable('organizations', {
  id: text().notNull().primaryKey(),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),
  name: text().notNull(),
  description: text(),
  ownerId: text().notNull(), // TODO: drop and use members list instead
  plan: text().$type<'personal' | 'pro'>().notNull().default('personal'),
  planPeriodEnd: integer({ mode: 'timestamp_ms' }),
});
export type Organization = InferSelectModel<typeof organizationSchema>;

export const organizationMemberSchema = sqliteTable('organization_members', {
  id: text().notNull().primaryKey(),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),
  organizationId: text()
    .notNull()
    .references(() => organizationSchema.id),
  userId: text()
    .notNull()
    .references(() => userSchema.id),
});
export type OrganizationMember = InferSelectModel<typeof organizationMemberSchema>;

export const tokenSchema = sqliteTable('tokens', {
  id: text().notNull().primaryKey(),
  createdAt: integer({ mode: 'timestamp_ms' }).notNull(),
  updatedAt: integer({ mode: 'timestamp_ms' }).notNull(),
  value: text().notNull(),
  userId: text()
    .notNull()
    .references(() => userSchema.id),
});
export type Token = InferSelectModel<typeof tokenSchema>;
