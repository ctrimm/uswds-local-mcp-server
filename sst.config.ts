/// <reference path="./.sst/platform/config.d.ts" />

/**
 * SST V3 Configuration for USWDS MCP Server
 *
 * Deploys the MCP server as a serverless Lambda function with:
 * - Lambda Function URL (no API Gateway needed)
 * - Response streaming enabled
 * - Multi-stage support (dev, staging, production)
 * - Secrets management via AWS Secrets Manager
 * - CloudWatch logging
 * - Optional custom domain via CloudFront
 *
 * Deployment:
 *   npx sst deploy --stage production
 *
 * Development (local):
 *   npx sst dev
 *
 * Secrets:
 *   npx sst secret set API_KEY "your-secret-key" --stage production
 */

export default $config({
  app(input) {
    return {
      name: 'uswds-mcp-server',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },

  async run() {
    // ===== Secrets =====
    // Create secrets for sensitive data (set via `npx sst secret set`)
    const apiKey = new sst.Secret('API_KEY');

    // ===== Lambda Function =====
    const mcpServer = new sst.aws.Function('McpServer', {
      handler: 'src/lambda.handler',
      runtime: 'nodejs20.x',
      memory: '1024 MB', // Enough for caching + processing
      timeout: '5 minutes', // Max timeout for long-running operations

      // Lambda Function URL configuration
      url: {
        // Options:
        // - "none": Public access (use API key for auth)
        // - "iam": AWS IAM authentication (for AWS-native clients)
        authorization: 'none', // Using API key middleware instead

        // Enable response streaming for Streamable HTTP
        streaming: false, // Set to true when implementing full StreamableHTTP transport

        // CORS configuration for browser clients
        cors: {
          allowOrigins: ['*'], // Restrict in production
          allowMethods: ['GET', 'POST', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'mcp-session-id'],
          maxAge: '86400', // 24 hours
        },
      },

      // Link secrets
      link: [apiKey],

      // Environment variables
      environment: {
        NODE_ENV: $app.stage === 'production' ? 'production' : 'development',
        LOG_LEVEL: $app.stage === 'production' ? 'info' : 'debug',
        USE_REACT_COMPONENTS: 'true', // Use React-USWDS by default
      },

      // Node.js build configuration
      nodejs: {
        esbuild: {
          minify: $app.stage === 'production',
          sourcemap: true,
          format: 'esm',
          banner: {
            js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
          },
          // External packages (not bundled)
          external: [
            // AWS SDK is available in Lambda runtime
            '@aws-sdk/*',
          ],
        },
        // Install production dependencies
        install: ['axios', 'cheerio'],
      },

      // CloudWatch Logs retention
      logging: {
        retention: $app.stage === 'production' ? '30 days' : '7 days',
      },

      // Resource tags
      transform: {
        function: {
          tags: {
            Environment: $app.stage,
            Application: 'USWDS-MCP-Server',
            ManagedBy: 'SST',
          },
        },
      },
    });

    // ===== Optional: CloudFront CDN + Custom Domain =====
    // Uncomment to enable custom domain
    /*
    const cdn = new sst.aws.Router('McpRouter', {
      routes: {
        '/*': mcpServer.url,
      },
      domain: {
        name: $app.stage === 'production'
          ? 'mcp.yourdomain.com'
          : `${$app.stage}.mcp.yourdomain.com`,
        // Choose DNS provider:
        dns: sst.cloudflare.dns(), // For Cloudflare
        // dns: sst.aws.dns(),       // For Route53
      },
    });
    */

    // ===== Outputs =====
    return {
      // Lambda Function URL (primary endpoint)
      url: mcpServer.url,

      // Function ARN
      functionArn: mcpServer.arn,

      // Function name
      functionName: mcpServer.name,

      // CloudWatch Logs
      logGroup: `/aws/lambda/${mcpServer.name}`,

      // CDN URL (if enabled)
      // cdnUrl: cdn?.url,
    };
  },
});
