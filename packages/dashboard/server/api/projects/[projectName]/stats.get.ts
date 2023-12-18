import { clickhouse } from '~/server/lib/clickhouse';

export default defineEventHandler(async event => {
  const project = await requireProject(event);

  const result = (await clickhouse
    .query(
      `SELECT
count(*) as requests
FROM serverless.requests
WHERE
function_id = '${project.id}'
AND
timestamp >= toStartOfMonth(now())`,
    )
    .toPromise()) as { requests: number }[];

  return result[0]?.requests || 0;
});
