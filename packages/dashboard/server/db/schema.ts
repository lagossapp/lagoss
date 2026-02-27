import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel } from 'drizzle-orm';
import { generateId } from '~~/server/utils/db';

export const userSchema = sqliteTable('User', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp' }),
  image: text('image'),
  verificationCode: text('verificationCode'), // TODO: needed?
  currentOrganizationId: text('currentOrganizationId').references(() => organizationSchema.id),
});
export type User = InferSelectModel<typeof userSchema>;

export const deploymentSchema = sqliteTable('Deployment', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  appId: text('functionId')
    .notNull()
    .references(() => appSchema.id),
  triggerer: text('triggerer').default('Lagoss'),
  commit: text('commit'),
  isProduction: integer('isProduction').default(0).notNull(),
  assets: text('assets').notNull(),
});
export type Deployment = InferSelectModel<typeof deploymentSchema>;

export const domainSchema = sqliteTable('Domain', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  domain: text('domain').notNull(),
  appId: text('functionId')
    .notNull()
    .references(() => appSchema.id),
});
export type Domain = InferSelectModel<typeof domainSchema>;

export const envVariableSchema = sqliteTable('EnvVariable', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  key: text('key').notNull(),
  value: text('value').notNull(),
  appId: text('functionId')
    .notNull()
    .references(() => appSchema.id),
});
export type EnvVariable = InferSelectModel<typeof envVariableSchema>;

// TODO: rename to app
export const appSchema = sqliteTable('Function', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  name: text('name').notNull().unique(),
  memory: integer('memory').notNull(),
  tickTimeout: integer('tickTimeout').notNull().default(500),
  cron: text('cron'),
  organizationId: text('organizationId')
    .notNull()
    .references(() => organizationSchema.id),
  cronRegion: text('cronRegion'),
  totalTimeout: integer('totalTimeout').notNull().default(5000),
  // playground: integer('playground').notNull().default(0),
});
export type App = InferSelectModel<typeof appSchema>;

export const organizationSchema = sqliteTable('Organization', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  ownerId: text('ownerId').notNull(), // TODO: drop and use members list instead
  plan: text('plan').$type<'personal' | 'pro'>().notNull().default('personal'),
  planPeriodEnd: integer('plan_period_end', { mode: 'timestamp' }),
});
export type Organization = InferSelectModel<typeof organizationSchema>;

export const organizationMemberSchema = sqliteTable('OrganizationMember', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  organizationId: text('organizationId')
    .notNull()
    .references(() => organizationSchema.id),
  userId: text('userId')
    .notNull()
    .references(() => userSchema.id),
});
export type OrganizationMember = InferSelectModel<typeof organizationMemberSchema>;

export const tokenSchema = sqliteTable('Token', {
  id: text('id').notNull().primaryKey().$defaultFn(generateId),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  value: text('value').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => userSchema.id),
});
export type Token = InferSelectModel<typeof tokenSchema>;
