import type { H3Event } from 'h3';
import { Organization, organizationMemberSchema, organizationSchema, projectSchema } from '~/server/db/schema';
import { and, eq, or } from 'drizzle-orm';
import type { Plan } from '~/server/lib/plans';
import { PROJECT_NAME_REGEX } from '~/server/lib/constants';
import { randomName } from '@scaleway/use-random-name';

export async function requireProject(event: H3Event) {
  const user = await requireUser(event);

  const projectName = getRouterParam(event, 'projectName');
  if (!projectName) {
    throw createError({
      message: 'Missing projectName',
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
        and(
          eq(projectSchema.name, projectName),
          or(eq(organizationSchema.ownerId, user.id), eq(organizationMemberSchema.userId, user.id)),
        ),
      )
      .execute(),
  );

  if (!project) {
    throw createError({
      message: 'Project not found',
      status: 404,
    });
  }

  return project.projects;
}

async function isProjectNameUnique(name: string): Promise<boolean> {
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
