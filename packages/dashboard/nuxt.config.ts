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
});
