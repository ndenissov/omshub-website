/** @type {import('next-sitemap').IConfig} */

const defaultSiteUrl = 'https://omshub.xyz';
const siteUrl = process.env.SITE_URL || defaultSiteUrl;

module.exports = {
  siteUrl,
  outDir: 'out',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/api/*', '/user/*', '/opengraph-image*', '/_not-found*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/api/og/', '/user/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/api/og/', '/user/'],
      },
    ],
  },
  transform: async (config, path) => {
    // Course catalog page - high priority
    if (path === '/course' || path === '/course/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Schedule page - high priority
    if (path === '/schedule' || path === '/schedule/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Home page highest priority
    if (path === '/' || path === '') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // Default transform
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
