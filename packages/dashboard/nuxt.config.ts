import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  modules: ['@nuxt/ui'],

  runtimeConfig: {
    auth: {
      name: 'nuxt-session',
      password: '',
    },
    oauth: {
      github: {
        clientId: '',
        clientSecret: '',
      },
    },
    s3: {
      endpoint: '',
      bucket: '',
      region: 'unknown',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
      forcePathStyle: true,
    },
    database: {
      url: '',
    },
    redis: {
      url: '',
    },
    clickhouse: {
      url: '',
      user: '',
      password: '',
      database: 'lagoss',
    },
    apps: {
      blacklistedNames: process.env.BLACKLISTED_APP_NAMES
        ? process.env.BLACKLISTED_APP_NAMES.split(',')
        : ['lagoss', 'api', 'app', 'console', 'dash', 'www', 'docs', 'status', 's3', 'clickhouse'],
    },
    serverless: {
      apiToken: '',
    },
    public: {
      appUrl: '',
      root: {
        schema: 'https',
        domain: '',
      },
    },
  },

  $development: {
    runtimeConfig: {
      auth: {
        password: 'my-super-secret-password-is-minimum-32-characters-long',
      },
      s3: {
        endpoint: 'http://localhost:9002',
        bucket: 'lagoss',
        region: 'unknown',
        credentials: {
          accessKeyId: 'lagoss',
          secretAccessKey: '',
        },
        forcePathStyle: true,
      },
      database: {
        url: 'mysql://root:lagoss@localhost:3306/lagoss',
      },
      redis: {
        url: 'redis://localhost:6379',
      },
      clickhouse: {
        url: 'http://localhost:8123',
        user: 'lagoss',
        password: 'lagoss',
        database: 'serverless',
      },
      apps: {
        blacklistedNames: [],
      },
      serverless: {
        apiToken: '123456789',
      },
      public: {
        appUrl: 'http://localhost:3000',
        root: {
          schema: 'http',
          domain: 'localhost:4000',
        },
      },
    },
  },

  app: {
    head: {
      title: 'Lagoss',
      link: [{ rel: 'alternate icon', type: 'image/png', href: '/icon-white.png' }],
    },
  },

  icon: {
    serverBundle: {
      collections: ['heroicons', 'ion'],
      externalizeIconsJson: true,
    },
  },

  compatibilityDate: '2025-05-15',
});
