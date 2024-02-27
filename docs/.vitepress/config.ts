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
          { text: 'Deployments', link: '/cloud/deployments' },
          { text: 'Assets', link: '/cloud/assets' },
          { text: 'Environment variables', link: '/cloud/environment-variables' },
          { text: 'Domains', link: '/cloud/domains' },
          { text: 'Logs', link: '/cloud/logs' },
          { text: 'Cron', link: '/cloud/cron' },
          // { text: 'Pricing', link: '/cloud/pricing' },
          // { text: 'Regions', link: '/cloud/regions' },
          { text: 'Limits', link: '/cloud/limits' },
          { text: 'Security', link: '/cloud/security' },
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
