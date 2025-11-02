import { mysqlTable, tinyint, varchar, datetime, int, text } from 'drizzle-orm/mysql-core';
import { InferSelectModel } from 'drizzle-orm';
import { generateId } from '~~/server/utils/db';

export const userSchema = mysqlTable('User', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  name: varchar('name', { length: 191 }),
  email: varchar('email', { length: 191 }).unique(),
  emailVerified: datetime('emailVerified'),
  image: varchar('image', { length: 191 }),
  verificationCode: varchar('verificationCode', { length: 191 }), // TODO: needed?
  currentOrganizationId: varchar('currentOrganizationId', { length: 191 }).references(() => organizationSchema.id),
});
export type User = InferSelectModel<typeof userSchema>;

export const deploymentSchema = mysqlTable('Deployment', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  appId: varchar('functionId', { length: 191 })
    .notNull()
    .references(() => appSchema.id),
  triggerer: varchar('triggerer', { length: 191 }).default('Lagoss'),
  commit: varchar('commit', { length: 191 }),
  isProduction: tinyint('isProduction').default(0).notNull(),
  assets: text('assets').notNull(),
});
export type Deployment = InferSelectModel<typeof deploymentSchema>;

export const domainSchema = mysqlTable('Domain', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  domain: varchar('domain', { length: 191 }).notNull(),
  appId: varchar('functionId', { length: 191 })
    .notNull()
    .references(() => appSchema.id),
});
export type Domain = InferSelectModel<typeof domainSchema>;

export const envVariableSchema = mysqlTable('EnvVariable', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  key: varchar('key', { length: 64 }).notNull(),
  value: varchar('value', { length: 5120 }).notNull(),
  appId: varchar('functionId', { length: 191 })
    .notNull()
    .references(() => appSchema.id),
});
export type EnvVariable = InferSelectModel<typeof envVariableSchema>;

// TODO: rename to app
export const appSchema = mysqlTable('Function', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  name: varchar('name', { length: 64 }).notNull().unique(),
  memory: int('memory').notNull(),
  tickTimeout: int('tickTimeout').notNull().default(500),
  cron: varchar('cron', { length: 191 }),
  organizationId: varchar('organizationId', { length: 191 })
    .notNull()
    .references(() => organizationSchema.id),
  cronRegion: varchar('cronRegion', { length: 191 }),
  totalTimeout: int('totalTimeout').notNull().default(5000),
  // playground: tinyint('playground').notNull().default(0),
});
export type App = InferSelectModel<typeof appSchema>;

export const organizationSchema = mysqlTable('Organization', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  name: varchar('name', { length: 64 }).notNull(),
  description: varchar('description', { length: 256 }),
  ownerId: varchar('ownerId', { length: 191 }).notNull(),
  // .references(() => userSchema.id),
  plan: varchar('plan', { length: 191 }).$type<'personal' | 'pro'>().notNull().default('personal'),
  planPeriodEnd: datetime('plan_period_end'),
});
export type Organization = InferSelectModel<typeof organizationSchema>;

export const organizationMemberSchema = mysqlTable('OrganizationMember', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  organizationId: varchar('organizationId', { length: 191 })
    .notNull()
    .references(() => organizationSchema.id),
  userId: varchar('userId', { length: 191 })
    .notNull()
    .references(() => userSchema.id),
});
export type OrganizationMember = InferSelectModel<typeof organizationMemberSchema>;

export const tokenSchema = mysqlTable('Token', {
  id: varchar('id', { length: 191 }).notNull().primaryKey().$defaultFn(generateId),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  value: varchar('value', { length: 191 }).notNull(),
  userId: varchar('userId', { length: 191 })
    .notNull()
    .references(() => userSchema.id),
});
export type Token = InferSelectModel<typeof tokenSchema>;
