import { useClickHouse } from '~~/server/lib/clickhouse';

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const { level, timeframe } = getQuery<{ level?: string; timeframe?: string }>(event);

  const result = (await clickhouse
    .query(
      `SELECT
level,
message,
timestamp
FROM serverless.logs
WHERE
function_id = '${app.id}'
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
