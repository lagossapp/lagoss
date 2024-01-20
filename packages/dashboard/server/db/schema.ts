import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { InferSelectModel, relations } from 'drizzle-orm';

export const userSchema = sqliteTable('users', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  name: text('name', { length: 191 }),
  email: text('email', { length: 191 }).unique(),
  image: text('image', { length: 191 }),
});
export type User = InferSelectModel<typeof userSchema>;

export const deploymentSchema = sqliteTable('deployments', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  projectId: text('projectId', { length: 191 })
    .notNull()
    .references(() => projectSchema.id),
  triggerer: text('triggerer', { length: 191 }).default('Lagon'),
  commit: text('commit', { length: 191 }),
  isProduction: integer('isProduction', { mode: 'boolean' }).default(false).notNull(),
  assets: text('assets', { mode: 'json' }).notNull(),
});
export type Deployment = InferSelectModel<typeof deploymentSchema>;

export const domainSchema = sqliteTable('domains', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  domain: text('domain', { length: 191 }).notNull(),
  projectId: text('projectId', { length: 191 })
    .notNull()
    .references(() => projectSchema.id),
});
export type Domain = InferSelectModel<typeof domainSchema>;

export const envVariableSchema = sqliteTable('env_variables', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  key: text('key', { length: 64 }).notNull(),
  value: text('value', { length: 5120 }).notNull(),
  projectId: text('projectId', { length: 191 })
    .notNull()
    .references(() => projectSchema.id),
});
export type EnvVariable = InferSelectModel<typeof envVariableSchema>;

// TODO: rename to project
export const projectSchema = sqliteTable('projects', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  name: text('name', { length: 64 }).notNull().unique(),
  memory: integer('memory').notNull(),
  tickTimeout: integer('tickTimeout').notNull().default(500),
  cron: text('cron', { length: 191 }),
  organizationId: text('organizationId', { length: 191 })
    .notNull()
    .references(() => organizationSchema.id),
  cronRegion: text('cronRegion', { length: 191 }),
  totalTimeout: integer('totalTimeout').notNull().default(5000),
});
export type Project = InferSelectModel<typeof projectSchema>;

export const projectRelations = relations(projectSchema, ({ many }) => ({
  domains: many(domainSchema),
  envVariables: many(envVariableSchema),
}));

export const organizationSchema = sqliteTable('organizations', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  name: text('name', { length: 64 }).notNull(),
  description: text('description', { length: 256 }),
  ownerId: text('ownerId', { length: 191 }).notNull(),
});
export type Organization = InferSelectModel<typeof organizationSchema>;

export const organizationMemberSchema = sqliteTable('organization_members', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  organizationId: text('organizationId', { length: 191 })
    .notNull()
    .references(() => organizationSchema.id),
  userId: text('userId', { length: 191 })
    .notNull()
    .references(() => userSchema.id),
});
export type OrganizationMember = InferSelectModel<typeof organizationMemberSchema>;

export const tokenSchema = sqliteTable('tokens', {
  id: text('id', { length: 191 }).notNull().primaryKey(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).notNull(),
  value: text('value', { length: 191 }).notNull(),
  userId: text('userId', { length: 191 })
    .notNull()
    .references(() => userSchema.id),
});
export type Token = InferSelectModel<typeof tokenSchema>;
