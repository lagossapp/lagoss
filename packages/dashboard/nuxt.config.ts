export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

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
      url: 'mysql://root:mysql@localhost:3306/lagoss',
    },
    projects: {
      blacklistedNames: process.env.BLACKLISTED_PROJECT_NAMES
        ? process.env.BLACKLISTED_PROJECT_NAMES.split(',')
        : ['lagoss', 'api', 'dash', 'www', 'docs', 'app', 's3', 'clickhouse'],
    },
    serverless: {
      apiToken: '',
    },
    public: {
      root: {
        schema: 'http',
        domain: 'localhost:4000',
      },
    },
  },

  app: {
    head: {
      title: 'Lagoss',
      link: [{ rel: 'alternate icon', type: 'image/png', href: '/icon-white.png' }],
    },
  },

  nitro: {
    preset: './preset',
  },

  devtools: { enabled: true },

  build: {
    transpile: ['trpc-nuxt'],
  },

  compatibilityDate: '2024-07-05',
});
