import type { H3Event } from 'h3';
import { Organization, organizationMemberSchema, organizationSchema, projectSchema } from '~~/server/db/schema';
import { and, eq, or, SQL } from 'drizzle-orm';
import type { Plan } from '~~/server/lib/plans';
import { PROJECT_NAME_REGEX } from '~~/server/lib/constants';
import { randomName } from '@scaleway/use-random-name';

export async function requireProject(event: H3Event) {
  const db = await useDB();
  const user = await requireUser(event);

  let projectIdSql: SQL | undefined = undefined;

  const projectId = getRouterParam(event, 'projectId');
  if (projectId) {
    projectIdSql = eq(projectSchema.id, projectId);
  }

  const projectName = getRouterParam(event, 'projectName');
  if (projectName) {
    projectIdSql = eq(projectSchema.name, projectName);
  }

  if (!projectIdSql) {
    throw createError({
      message: 'Missing projectId parameter',
      status: 400,
    });
  }

  const project = await getFirst(
    db
      .select()
      .from(projectSchema)
      .leftJoin(organizationSchema, eq(projectSchema.organizationId, organizationSchema.id))
      .leftJoin(organizationMemberSchema, eq(projectSchema.organizationId, organizationMemberSchema.organizationId))
      .where(
        and(projectIdSql, or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id))),
      )
      .execute(),
  );

  if (!project) {
    throw createError({
      message: 'Project not found',
      status: 404,
    });
  }

  return project.Function;
}

async function isProjectNameUnique(name: string): Promise<boolean> {
  const db = await useDB();
  const result = await getFirst(db.select().from(projectSchema).where(eq(projectSchema.name, name)).execute());

  return result === undefined;
}

function isProjectNameAllowed(name: string): boolean {
  return PROJECT_NAME_REGEX.test(name);
}

function isProjectNameBlacklisted(name: string): boolean {
  const config = useRuntimeConfig();
  return config.projects.blacklistedNames.includes(name.toLowerCase());
}

export async function findUniqueProjectName() {
  const name = randomName();

  if (!(await isProjectNameUnique(name))) {
    return findUniqueProjectName();
  }

  return name;
}

export async function checkCanCreateProject({
  projectName,
  organization,
  plan,
}: {
  projectName: string;
  organization: Organization;
  plan: Plan;
}) {
  const db = await useDB();

  if (!(await isProjectNameUnique(projectName))) {
    throw createError({
      statusCode: 400,
      message: 'A project with the same name already exists',
    });
  }

  if (!isProjectNameAllowed(projectName)) {
    throw createError({
      statusCode: 400,
      message: 'Project name must only contain lowercase alphanumeric characters and dashes',
    });
  }

  if (isProjectNameBlacklisted(projectName)) {
    throw createError({
      statusCode: 400,
      message: `Project name "${projectName}" is not allowed`,
    });
  }

  const projects = await db
    .select()
    .from(projectSchema)
    .where(eq(projectSchema.organizationId, organization.id))
    .execute();

  if (projects.length >= plan.maxProjects) {
    throw createError({
      statusCode: 400,
      message: `You have reached the maximum number of projects allowed for your plan`,
    });
  }
}
