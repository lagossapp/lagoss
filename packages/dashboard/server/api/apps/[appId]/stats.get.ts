import { useClickHouse } from '~~/server/lib/clickhouse';

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const result = (await clickhouse
    .query(
      `SELECT
count(*) as requests
FROM serverless.requests
WHERE
function_id = '${app.id}'
AND
timestamp >= toStartOfMonth(now())`,
    )
    .toPromise()) as { requests: number }[];

  return result[0]?.requests || 0;
});
