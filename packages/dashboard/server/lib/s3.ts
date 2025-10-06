import { S3Client } from '@aws-sdk/client-s3';

let s3: S3Client;

export async function useS3(): Promise<S3Client> {
  if (s3) {
    return s3;
  }

  const config = useRuntimeConfig();
  s3 = new S3Client({
    endpoint: config.s3.endpoint,
    region: config.s3.region,
    credentials: {
      accessKeyId: config.s3.credentials.accessKeyId,
      secretAccessKey: config.s3.credentials.secretAccessKey,
    },
    forcePathStyle: config.s3.forcePathStyle,
  });

  return s3;
}
