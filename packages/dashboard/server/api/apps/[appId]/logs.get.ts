import { useClickHouse } from '~~/server/lib/clickhouse';

const timeframes: Record<string, string> = {
  'Last hour': '1 HOUR',
  'Last 24 hours': '1 DAY',
  'Last week': '1 WEEK',
};

const levels = ['all', 'info', 'warning', 'error'];

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const { level: _level, timeframe: _timeframe } = getQuery<{ level?: string; timeframe?: string }>(event);
  const level = _level && levels.includes(_level) ? _level : 'all';
  const timeframe = _timeframe ? timeframes[_timeframe] : undefined;

  const result = await clickhouse.query({
    query: `
SELECT
  request_id,
  deployment_id,
  level,
  region,
  message,
  timestamp
FROM logs
WHERE
  app_id = {appId:String}
AND
  timestamp >= toDateTime(now() - INTERVAL '${timeframe ?? timeframes['Last hour']}')
  ${level !== 'all' ? `AND level = '${level}'` : ''}
ORDER BY timestamp DESC
LIMIT 100
`.trim(),
    format: 'JSONEachRow',
    query_params: {
      appId: app.id,
    },
  });

  const rows = await result.json<{
    request_id: string;
    deployment_id: string;
    level: string;
    region: string;
    message: string;
    timestamp: string;
  }>();

  return rows;
});
