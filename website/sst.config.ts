/// <reference path="./.sst/platform/config.d.ts" />

/**
 * SST V3 Configuration for USWDS MCP Marketing Website
 *
 * Deploys static Astro site to S3 + CloudFront
 *
 * Deployment:
 *   npm run build
 *   npx sst deploy --stage production
 */

export default $config({
  app(input) {
    return {
      name: 'uswdsmcp-website',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },

  async run() {
    // Static site with S3 + CloudFront
    const site = new sst.aws.StaticSite('UswdsMcpWebsite', {
      path: 'dist', // Astro builds to dist/
      build: {
        command: 'npm run build',
        output: 'dist',
      },
      domain: {
        // Uncomment when domain is ready
        // name: $app.stage === 'production' ? 'uswdsmcp.com' : `${$app.stage}.uswdsmcp.com`,
        // dns: sst.cloudflare.dns(), // or sst.aws.dns() for Route53
      },
      environment: {
        // Add any build-time env vars here
      },
    });

    return {
      url: site.url,
    };
  },
});
