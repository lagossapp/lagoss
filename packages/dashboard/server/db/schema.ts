import { mysqlTable, tinyint, varchar, datetime, json, int } from 'drizzle-orm/mysql-core';
import { InferSelectModel } from 'drizzle-orm';

// export const accountSchema = mysqlTable('Account', {
//   id: varchar('id', { length: 191 }).notNull().primaryKey(),
//   userId: varchar('name', { length: 191 }),
//   email: varchar('email', { length: 191 }).unique(),
//   emailVerified: datetime('email'),
//   image: varchar('image', { length: 191 }),
//   verificationCode: varchar('image', { length: 191 }),
//   currentOrganizationId: varchar('image', { length: 191 }),
// });
// export type Account = InferSelectModel<typeof accountSchema>;

export const userSchema = mysqlTable('User', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  name: varchar('name', { length: 191 }),
  email: varchar('email', { length: 191 }).unique(),
  emailVerified: datetime('email'),
  image: varchar('image', { length: 191 }),
  verificationCode: varchar('verificationCode', { length: 191 }), // TODO: needed?
  currentOrganizationId: varchar('currentOrganizationId', { length: 191 }),
});
export type User = InferSelectModel<typeof userSchema>;

export const deploymentSchema = mysqlTable('Deployment', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  functionId: varchar('functionId', { length: 191 }).notNull(),
  triggerer: varchar('triggerer', { length: 191 }).default('Lagon'),
  commit: varchar('name', { length: 191 }),
  isProduction: tinyint('isProduction').default(0).notNull(),
  assets: json('assests').notNull(),
});
export type Deployment = InferSelectModel<typeof deploymentSchema>;

export const domainSchema = mysqlTable('Domain', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  domain: varchar('domain', { length: 191 }).notNull(),
  functionId: varchar('functionId', { length: 191 }).notNull(),
});
export type Domain = InferSelectModel<typeof domainSchema>;

export const envVariableSchema = mysqlTable('EnvVariable', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  key: varchar('key', { length: 64 }).notNull(),
  value: varchar('value', { length: 5120 }).notNull(),
  functionId: varchar('functionId', { length: 191 }).notNull(),
});
export type EnvVariable = InferSelectModel<typeof envVariableSchema>;

export const functionSchema = mysqlTable('Function', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  name: varchar('name', { length: 64 }).notNull().unique(),
  memory: int('memory').notNull(),
  tickTimeout: int('tickTimeout').notNull().default(500),
  cron: varchar('cron', { length: 191 }),
  organizationId: varchar('organizationId', { length: 191 }).notNull(),
  cronRegion: varchar('cronRegion', { length: 191 }),
  totalTimeout: int('totalTimeout').notNull().default(5000),
});
export type Function = InferSelectModel<typeof functionSchema>;

export const organizationSchema = mysqlTable('Organization', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  name: varchar('name', { length: 64 }).notNull(),
  description: varchar('description', { length: 256 }),
  ownerId: varchar('userId', { length: 191 }).notNull(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 191 }).unique(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 191 }).unique(),
  stripePriceId: varchar('stripe_price_id', { length: 191 }),
  stripeCurrentPeriodEnd: datetime('stripe_current_period_end'),
});
export type Organization = InferSelectModel<typeof organizationSchema>;

export const organizationMemberSchema = mysqlTable('OrganizationMember', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  organizationId: varchar('organizationId', { length: 191 }).notNull(),
  userId: varchar('userId', { length: 191 }).notNull(),
});
export type OrganizationMember = InferSelectModel<typeof organizationMemberSchema>;

export const tokenSchema = mysqlTable('Token', {
  id: varchar('id', { length: 191 }).notNull().primaryKey(),
  createdAt: datetime('createdAt').notNull(),
  updatedAt: datetime('updatedAt').notNull(),
  value: varchar('value', { length: 191 }).notNull(),
  userId: varchar('userId', { length: 191 }).notNull(),
});
export type Token = InferSelectModel<typeof tokenSchema>;
