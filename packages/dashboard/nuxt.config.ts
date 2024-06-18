export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  runtimeConfig: {
    auth: {
      name: 'nuxt-session',
      password: 'my-super-secret-password-is-minimum-32-characters-long',
      oauth: {
        github: {
          clientId: 'my-github-client-id',
          clientSecret: 'my-github-client-secret',
        },
      },
    },
    s3: {
      endpoint: process.env.S3_ENDPOINT,
      bucket: process.env.S3_BUCKET ?? 'lagoss',
      region: process.env.S3_REGION || 'unkown',
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
      },
      forcePathStyle: !!process.env.S3_ENDPOINT,
    },
    db: {
      turso: {
        url: process.env.TURSO_DB_URL,
        authToken: process.env.TURSO_DB_TOKEN,
      },
      file: process.env.DB_FILE_PATH,
    },
    projects: {
      blacklistedNames: process.env.BLACKLISTED_PROJECT_NAMES
        ? process.env.BLACKLISTED_PROJECT_NAMES.split(',')
        : ['lagoss', 'api', 'dash', 'www', 'docs', 'app', 's3', 'clickhouse'],
    },
    public: {
      root: {
        schema: 'http',
        domain: 'localhost:4000',
      },
    },
  },
  ui: {
    icons: ['mdi', 'simple-icons', 'heroicons', 'ion'],
  },
  app: {
    head: {
      title: 'Lagoss',
      // link: [
      //   { rel: 'alternate icon', type: 'image/png', href: '/logo.png' },
      //   { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
      // ],
    },
  },
  // nitro: {
  //   preset: 'node',
  // },
  devtools: { enabled: true },
  build: {
    transpile: ['trpc-nuxt'],
  },
});
