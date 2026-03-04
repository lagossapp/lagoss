import { useClickHouse } from '~~/server/lib/clickhouse';
import type { AnalyticsTimeframe } from '~~/server/lib/types';

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const { timeframe: _timeframe } = getQuery<{ timeframe?: string }>(event);

  const timeframeMap: Record<AnalyticsTimeframe, number> = {
    'Last 24 hours': 1,
    'Last 7 days': 7,
    'Last 30 days': 30,
  };

  const intervalDays = _timeframe ? (timeframeMap[_timeframe as AnalyticsTimeframe] ?? 1) : 1;

  const result = await clickhouse.query({
    query: `
SELECT
  count(*) AS total_requests,
  countIf(response_status_code >= 400) AS error_requests,
  if(count(*) > 0, countIf(response_status_code >= 400) / count(*) * 100, 0) AS error_rate,
  quantileExactIf(0.50)(cpu_time_micros, cpu_time_micros IS NOT NULL) AS p50,
  quantileExactIf(0.95)(cpu_time_micros, cpu_time_micros IS NOT NULL) AS p95,
  quantileExactIf(0.99)(cpu_time_micros, cpu_time_micros IS NOT NULL) AS p99
FROM requests
WHERE
  app_id = {appId:String}
AND
  timestamp >= now() - INTERVAL ${intervalDays} DAY
`.trim(),
    format: 'JSONEachRow',
    query_params: {
      appId: app.id,
    },
  });

  const rows = await result.json<{
    total_requests: number;
    error_requests: number;
    error_rate: number;
    p50: number | null;
    p95: number | null;
    p99: number | null;
  }>();

  return rows[0] ?? { total_requests: 0, error_requests: 0, error_rate: 0, p50: null, p95: null, p99: null };
});
