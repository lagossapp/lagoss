import { useClickHouse } from '~~/server/lib/clickhouse';

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const result = await clickhouse.query({
    query: `
SELECT
  count(*) as requests
FROM requests
WHERE
  app_id = '${app.id}'
AND
timestamp >= toStartOfMonth(now())
`.trim(),
    format: 'JSONEachRow',
  });

  const rows = await result.json<{ requests: number }>();

  const requests = rows[0]?.requests || 0;

  return { requests };
});
