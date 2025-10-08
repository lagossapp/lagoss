import { ClickHouse } from 'clickhouse';

let clickhouse: ClickHouse;

export async function useClickHouse(): Promise<ClickHouse> {
  if (clickhouse) {
    return clickhouse;
  }

  const config = useRuntimeConfig();

  clickhouse = new ClickHouse({
    url: config.clickhouse.url,
    basicAuth: {
      username: config.clickhouse.user,
      password: config.clickhouse.password,
    },
  });

  return clickhouse;
}
