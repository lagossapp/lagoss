import { createClient, type ClickHouseClient } from '@clickhouse/client';

let clickhouse: ClickHouseClient;

export async function useClickHouse(): Promise<ClickHouseClient> {
  if (clickhouse) {
    return clickhouse;
  }

  const config = useRuntimeConfig();

  clickhouse = createClient({
    url: config.clickhouse.url,
    database: config.clickhouse.database,
    username: config.clickhouse.user,
    password: config.clickhouse.password,
  });

  const ping = await clickhouse.ping();
  if (!ping.success) {
    throw new Error('Could not connect to ClickHouse');
  }

  return clickhouse;
}
