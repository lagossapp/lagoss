import { useClickHouse } from '~~/server/lib/clickhouse';

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const { timeframe } = getQuery<{ level?: string; timeframe?: string }>(event);

  const groupBy = timeframe === 'Last 24 hours' ? 'toStartOfHour' : 'toStartOfDay';

  const result = (await clickhouse
    .query(
      `SELECT
  count(*) as requests,
  avg(cpu_time_micros) as cpuTime,
  sum(bytes_in) as bytesIn,
  sum(bytes_out) as bytesOut,
  ${groupBy}(timestamp) AS time
FROM serverless.requests
WHERE
  function_id = '${app.id}'
AND
  timestamp >= now() - INTERVAL  ${timeframe === 'Last 24 hours' ? 1 : timeframe === 'Last 7 days' ? 7 : 30} DAY
GROUP BY time`,
    )
    .toPromise()) as { requests: number; cpuTime: number; bytesIn: number; bytesOut: number; time: string }[];

  return result;
});
