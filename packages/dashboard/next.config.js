/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
  },
  transpilePackages: ['@lagoss/ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: process.env.NEXTJS_OUTPUT,
  publicRuntimeConfig: {
    STRIPE_PRO_PLAN_PRICE_ID: process.env.STRIPE_PRO_PLAN_PRICE_ID,
    STRIPE_PRO_PLAN_PRICE_ID_METERED: process.env.STRIPE_PRO_PLAN_PRICE_ID_METERED,
    LAGOSS_ROOT_SCHEM: process.env.LAGOSS_ROOT_SCHEM,
    LAGOSS_ROOT_DOMAIN: process.env.LAGOSS_ROOT_DOMAIN,
  },
};
