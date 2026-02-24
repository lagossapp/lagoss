import { useClickHouse } from '~~/server/lib/clickhouse';

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const { timeframe } = getQuery<{ level?: string; timeframe?: string }>(event);

  const groupBy = timeframe === 'Last 24 hours' ? 'toStartOfHour' : 'toStartOfDay';
  const intervalDays = timeframe === 'Last 24 hours' ? 1 : timeframe === 'Last 7 days' ? 7 : 30;

  const result = await clickhouse.query({
    query: `
SELECT
  count(*) as requests,
  avg(cpu_time_micros) as cpuTime,
  sum(bytes_in) as bytesIn,
  sum(bytes_out) as bytesOut,
  ${groupBy}(timestamp) AS time
FROM requests
WHERE
  app_id = {appId:String}
AND
  timestamp >= now() - INTERVAL ${intervalDays} DAY
GROUP BY time
`.trim(),
    format: 'JSONEachRow',
    query_params: {
      appId: app.id,
    },
  });

  const rows = await result.json<{
    requests: number;
    cpuTime: number;
    bytesIn: number;
    bytesOut: number;
    time: string;
  }>();

  return rows;
});
