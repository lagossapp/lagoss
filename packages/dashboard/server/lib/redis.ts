import { createClient, type RedisClientType } from 'redis';

let redis: RedisClient;

type DeployPayload = {
  functionId: string;
  functionName: string;
  deploymentId: string;
  domains: string[];
  memory: number;
  tickTimeout: number;
  totalTimeout: number;
  cron: string | null;
  cronRegion: string | null;
  env: Record<string, string>;
  isProduction: boolean;
  assets: string[];
};

type UndeployPayload = DeployPayload;

type PromotePayload = DeployPayload & {
  previousDeploymentId: string;
};

type Payloads = {
  deploy: DeployPayload;
  undeploy: UndeployPayload;
  promote: PromotePayload;
};

type RedisClient = Omit<RedisClientType, 'publish'> & {
  publish: <K extends keyof Payloads>(channel: K, message: Payloads[K]) => Promise<number>;
};

export async function useRedis(): Promise<RedisClient> {
  if (redis) {
    return redis;
  }

  const config = useRuntimeConfig();

  const redisClient = createClient({
    url: config.redis.url,
    pingInterval: 1000,
  });

  await redisClient.connect();

  const originalPublish = redisClient.publish.bind(redisClient);

  Object.assign(redisClient, {
    publish: async (channel: string, payload: unknown) => {
      const message = typeof payload === 'string' ? payload : JSON.stringify(payload);
      return originalPublish(channel, message);
    },
  });

  redis = redisClient as RedisClient;

  return redis;
}
