import { S3Client } from '@aws-sdk/client-s3';

declare const global: typeof globalThis & {
  s3: S3Client;
};

const config = useRuntimeConfig();
const s3 =
  global.s3 ||
  new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
      accessKeyId: config.s3.credentials.accessKeyId,
      secretAccessKey: config.s3.credentials.secretAccessKey,
    },
    forcePathStyle: config.s3.forcePathStyle,
  });

if (process.env.NODE_ENV === 'development') global.s3 = s3;

export { s3 };
