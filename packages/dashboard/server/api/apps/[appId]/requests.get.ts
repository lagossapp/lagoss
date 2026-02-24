import { useClickHouse } from '~~/server/lib/clickhouse';

const timeframes: Record<string, string> = {
  'Last hour': '1 HOUR',
  'Last 24 hours': '1 DAY',
  'Last week': '1 WEEK',
};

const statusFilters = ['all', '2xx', '3xx', '4xx', '5xx'] as const;

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const {
    timeframe: _timeframe,
    status: _status,
    method: _method,
  } = getQuery<{
    timeframe?: string;
    status?: string;
    method?: string;
  }>(event);

  const timeframe = _timeframe ? timeframes[_timeframe] : timeframes['Last hour'];
  const status = _status && statusFilters.includes(_status as (typeof statusFilters)[number]) ? _status : 'all';
  const method = _method && _method !== 'all' ? _method : null;

  let statusFilter = '';
  if (status === '2xx') statusFilter = 'AND response_status_code >= 200 AND response_status_code < 300';
  else if (status === '3xx') statusFilter = 'AND response_status_code >= 300 AND response_status_code < 400';
  else if (status === '4xx') statusFilter = 'AND response_status_code >= 400 AND response_status_code < 500';
  else if (status === '5xx') statusFilter = 'AND response_status_code >= 500';

  const methodFilter = method ? `AND http_method = '${method}'` : '';

  const result = await clickhouse.query({
    query: `
SELECT
  id,
  deployment_id,
  region,
  bytes_in,
  bytes_out,
  cpu_time_micros,
  timestamp,
  response_status_code,
  url,
  http_method
FROM requests
WHERE
  app_id = {appId:String}
AND
  timestamp >= toDateTime(now() - INTERVAL ${timeframe})
  ${statusFilter}
  ${methodFilter}
ORDER BY timestamp DESC
LIMIT 200
`.trim(),
    format: 'JSONEachRow',
    query_params: {
      appId: app.id,
    },
  });

  const rows = await result.json<{
    id: string;
    deployment_id: string;
    region: string;
    bytes_in: number;
    bytes_out: number;
    cpu_time_micros: number | null;
    timestamp: string;
    response_status_code: number;
    url: string;
    http_method: string;
  }>();

  return rows;
});
