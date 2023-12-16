import clickhouse from '~/server/lib/clickhouse';
import { functionSchema } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export default defineEventHandler(async event => {
  const user = await requireUser(event);

  if (!user.currentOrganizationId) {
    return null;
  }

  const projectName = getRouterParam(event, 'projectName');
  if (!projectName) {
    throw createError({
      message: 'Missing projectName',
      status: 400,
    });
  }

  const project = (
    await db
      .select()
      .from(functionSchema)
      .where(and(eq(functionSchema.organizationId, user.currentOrganizationId), eq(functionSchema.name, projectName)))
      .execute()
  )?.[0];

  const { level, timeframe } = getQuery<{ level?: string; timeframe?: string }>(event);

  // TODO: Check if user can query function

  console.log('project.id', project.id, level, timeframe);

  const result = (await clickhouse
    .query(
      `SELECT
level,
message,
timestamp
FROM serverless.logs
WHERE
function_id = '${project.id}'
AND
timestamp >= toDateTime(now() - INTERVAL ${
        timeframe === 'Last hour' ? '1 HOUR' : timeframe === 'Last 24 hours' ? '1 DAY' : '1 WEEK'
      })
${level !== 'all' ? `AND level = '${level}'` : ''}
ORDER BY timestamp DESC
LIMIT 100`,
    )
    .toPromise()) as { level: string; message: string; timestamp: string }[];

  return result;
});
