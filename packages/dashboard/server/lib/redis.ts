import { createClient, RedisClientType } from 'redis';

let redis: RedisClientType;

export async function useRedis(): Promise<RedisClientType> {
  if (redis) {
    return redis;
  }

  const config = useRuntimeConfig();

  const redisClient = createClient({
    url: config.redis.url,
    pingInterval: 1000,
  });

  await redisClient.connect();

  redis = redisClient as RedisClientType;

  return redis;
}
