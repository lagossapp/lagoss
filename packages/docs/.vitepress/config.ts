import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Lagoss',
  description:
    'An open-source runtime and platform that allows developers to run TypeScript and JavaScript Serverless Functions.',

  srcDir: 'content',

  ignoreDeadLinks: [
    // ignore all localhost links
    /^https?:\/\/localhost/,
  ],

  themeConfig: {
    logo: '/icon-white.png',

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Docs', link: '/introduction' },
      { text: 'Dashboard', link: 'https://app.lagoss.com' },
    ],

    sidebar: [
      {
        text: 'Introduction',
        link: '/introduction',
      },
      {
        text: 'Getting Started',
        link: '/getting-started',
      },
      {
        text: 'Runtime APIs',
        link: '/runtime-apis',
      },
      {
        text: 'CLI',
        link: '/cli',
      },
      {
        text: 'Examples',
        link: '/examples',
      },
      {
        text: 'Usage',
        collapsed: false,
        items: [
          { text: 'Deployments', link: '/usage/deployments' },
          { text: 'Assets', link: '/usage/assets' },
          { text: 'Environment variables', link: '/usage/environment-variables' },
          { text: 'Domains', link: '/usage/domains' },
          { text: 'Logs', link: '/usage/logs' },
          { text: 'Cron', link: '/usage/cron' },
          // { text: 'Pricing', link: '/usage/pricing' },
          // { text: 'Regions', link: '/usage/regions' },
          { text: 'Limits', link: '/usage/limits' },
          { text: 'Security', link: '/usage/security' },
          {
            text: 'CI',
            collapsed: true,
            items: [
              { text: 'Github Actions', link: '/ci/github-actions' },
              { text: 'Gitlab CI', link: '/ci/gitlab-ci' },
              { text: 'Woodpecker', link: '/ci/woodpecker' },
            ],
          },
        ],
      },
      {
        text: 'Self hosting',
        collapsed: true,
        items: [
          { text: 'Installation', link: '/self-hosting/installation' },
          { text: 'Configuration', link: '/self-hosting/configuration' },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/lagossapp/lagoss' }],
  },
});
