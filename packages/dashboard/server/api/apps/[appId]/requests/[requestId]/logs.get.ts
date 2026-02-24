import { useClickHouse } from '~~/server/lib/clickhouse';

export default defineEventHandler(async event => {
  const app = await requireApp(event);
  const clickhouse = await useClickHouse();

  const requestId = getRouterParam(event, 'requestId');
  if (!requestId) {
    throw createError({
      status: 400,
      message: 'Missing requestId',
    });
  }

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
  request_id = {requestId:String}
ORDER BY timestamp ASC
`.trim(),
    format: 'JSONEachRow',
    query_params: {
      appId: app.id,
      requestId,
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
