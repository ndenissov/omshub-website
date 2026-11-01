/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: process.env.BASE_PATH !== undefined ? process.env.BASE_PATH : '',

  // Disable source maps in production for better performance
  productionBrowserSourceMaps: false,

  env: {
    baseUrl: process.env.BASE_URL,
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  },

  compiler: {
    // Strip console.log/warn/info/debug in prod for performance and to avoid
    // leaking internal state, but KEEP console.error so real errors reach
    // Vercel's runtime logs. Set DEBUG_AUTH=1 to preserve all console.* for
    // local `pnpm build && pnpm start` repro of auth flows.
    removeConsole:
      process.env.NODE_ENV === 'production' && process.env.DEBUG_AUTH !== '1'
        ? { exclude: ['error'] }
        : false,
  },

  // Image optimization settings
  images: {
    unoptimized: true,
  },

  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/spotlight',
      '@mantine/notifications',
      '@tabler/icons-react',
      '@supabase/supabase-js',
    ],
    // Keep CSS in immutable shared chunks so navigating between course pages
    // does not resend the full stylesheet with every HTML response.
    inlineCss: false,
  },

  // Reduce unused JavaScript with tree shaking
  modularizeImports: {
    '@tabler/icons-react': {
      transform: '@tabler/icons-react/dist/esm/icons/{{member}}',
    },
  },
};
