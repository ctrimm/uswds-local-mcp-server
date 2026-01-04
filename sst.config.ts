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
    const resendApiKey = new sst.Secret('RESEND_API_KEY'); // For sending emails
    const cloudflareApiToken = new sst.Secret('CLOUDFLARE_API_TOKEN'); // For DNS management

    // ===== DynamoDB Tables =====

    // Users table: stores email → API key mappings
    const usersTable = new sst.aws.Dynamo('UsersTable', {
      fields: {
        email: 'string',        // Partition key
        apiKey: 'string',       // GSI key for lookups
      },
      primaryIndex: { hashKey: 'email' },
      globalIndexes: {
        apiKeyIndex: { hashKey: 'apiKey' },
      },
      stream: 'new-and-old-images', // Enable streams for analytics
      transform: {
        table: {
          deletionProtection: $app.stage === 'production',
        },
      },
    });

    // Usage logs table: stores detailed request analytics
    const usageTable = new sst.aws.Dynamo('UsageTable', {
      fields: {
        apiKey: 'string',       // Partition key
        timestamp: 'string',    // Sort key (ISO8601 format)
      },
      primaryIndex: { hashKey: 'apiKey', rangeKey: 'timestamp' },
      stream: 'new-and-old-images', // Enable streams for real-time dashboards
      ttl: 'ttl', // Auto-delete old records (set to timestamp + 90 days)
      transform: {
        table: {
          deletionProtection: $app.stage === 'production',
        },
      },
    });

    // Sessions table: stores MCP session state (Mcp-Session-Id)
    const sessionsTable = new sst.aws.Dynamo('SessionsTable', {
      fields: {
        sessionId: 'string',    // Partition key (Mcp-Session-Id)
        apiKey: 'string',       // API key for the session
      },
      primaryIndex: { hashKey: 'sessionId' },
      globalIndexes: {
        apiKeyIndex: { hashKey: 'apiKey' }, // Lookup sessions by API key
      },
      ttl: 'expiresAt', // Auto-delete expired sessions (24 hours default)
      transform: {
        table: {
          deletionProtection: $app.stage === 'production',
        },
      },
    });

    // ===== Sign-up Lambda Function =====
    const signupFunction = new sst.aws.Function('SignupFunction', {
      handler: 'src/functions/signup.handler',
      runtime: 'nodejs20.x',
      memory: '512 MB',
      timeout: '30 seconds',

      url: {
        authorization: 'none', // Public signup
        cors: {
          allowOrigins: ['*'], // Restrict to your domain in production
          allowMethods: ['POST', 'OPTIONS'],
          allowHeaders: ['Content-Type'],
          maxAge: '86400',
        },
      },

      link: [usersTable, resendApiKey],

      environment: {
        NODE_ENV: $app.stage === 'production' ? 'production' : 'development',
        USERS_TABLE_NAME: usersTable.name,
        EMAIL_FROM: 'USWDS MCP <noreply@mail.uswdsmcp.com>', // Update with actual domain
        EMAIL_ENABLED: 'true', // Set to 'false' to disable email sending
      },

      logging: {
        retention: $app.stage === 'production' ? '30 days' : '7 days',
      },
    });

    // ===== Reset API Key Lambda Function =====
    const resetFunction = new sst.aws.Function('ResetFunction', {
      handler: 'src/functions/reset-key.handler',
      runtime: 'nodejs20.x',
      memory: '512 MB',
      timeout: '30 seconds',

      url: {
        authorization: 'none', // Public reset
        cors: {
          allowOrigins: ['*'],
          allowMethods: ['POST', 'OPTIONS'],
          allowHeaders: ['Content-Type'],
          maxAge: '86400',
        },
      },

      link: [usersTable, resendApiKey],

      environment: {
        NODE_ENV: $app.stage === 'production' ? 'production' : 'development',
        USERS_TABLE_NAME: usersTable.name,
        EMAIL_FROM: 'USWDS MCP <noreply@mail.uswdsmcp.com>',
        EMAIL_ENABLED: 'true',
      },

      logging: {
        retention: $app.stage === 'production' ? '30 days' : '7 days',
      },
    });

    // ===== Admin API Lambda Function =====
    const adminFunction = new sst.aws.Function('AdminFunction', {
      handler: 'src/functions/admin-api.handler',
      runtime: 'nodejs20.x',
      memory: '512 MB',
      timeout: '30 seconds',

      url: {
        authorization: 'none', // Uses custom admin auth middleware
        cors: {
          allowOrigins: ['*'], // Restrict to admin domain in production
          allowMethods: ['GET', 'POST', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
          maxAge: '86400',
        },
      },

      link: [usersTable],

      environment: {
        NODE_ENV: $app.stage === 'production' ? 'production' : 'development',
        USERS_TABLE_NAME: usersTable.name,
      },

      logging: {
        retention: $app.stage === 'production' ? '30 days' : '7 days',
      },
    });

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

        // Enable response streaming for Streamable HTTP transport
        streaming: true, // Support both JSON and SSE responses

        // CORS configuration for browser clients
        cors: {
          allowOrigins: ['*'], // Restrict in production
          allowMethods: ['GET', 'POST', 'OPTIONS'],
          allowHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Mcp-Session-Id'],
          maxAge: '86400', // 24 hours
        },
      },

      // Link secrets and tables
      link: [apiKey, usersTable, usageTable, sessionsTable],

      // Environment variables
      environment: {
        NODE_ENV: $app.stage === 'production' ? 'production' : 'development',
        LOG_LEVEL: $app.stage === 'production' ? 'info' : 'debug',
        USE_REACT_COMPONENTS: 'true', // Use React-USWDS by default
        USERS_TABLE_NAME: usersTable.name,
        USAGE_TABLE_NAME: usageTable.name,
        SESSIONS_TABLE_NAME: sessionsTable.name,
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

    // ===== CloudFront CDN + Custom Domain =====
    // Custom domain with path-based routing
    const cdn = new sst.aws.Router('McpRouter', {
      routes: {
        '/mcp': mcpServer.url,        // MCP endpoint (v2.0 convention)
        '/signup': signupFunction.url, // User signup
        '/reset': resetFunction.url,   // API key reset
        '/admin/*': adminFunction.url, // Admin panel
        '/*': mcpServer.url,           // Backward compatibility (root → MCP)
      },
      domain: {
        name: $app.stage === 'production'
          ? 'api.uswdsmcp.com'
          : `${$app.stage}-api.uswdsmcp.com`,
        // Using Cloudflare for DNS management
        dns: sst.cloudflare.dns({
          zone: process.env.CLOUDFLARE_ZONE_ID!,
        }),
      },
    });

    // ===== Outputs =====
    return {
      // MCP Server
      mcpUrl: mcpServer.url,
      mcpFunctionArn: mcpServer.arn,
      mcpFunctionName: mcpServer.name,
      mcpLogGroup: `/aws/lambda/${mcpServer.name}`,

      // Sign-up API
      signupUrl: signupFunction.url,
      signupFunctionName: signupFunction.name,

      // Reset API
      resetUrl: resetFunction.url,
      resetFunctionName: resetFunction.name,

      // Admin API
      adminUrl: adminFunction.url,
      adminFunctionName: adminFunction.name,

      // DynamoDB Tables
      usersTableName: usersTable.name,
      usageTableName: usageTable.name,
      sessionsTableName: sessionsTable.name,

      // Custom Domain (CDN)
      cdnUrl: cdn.url,
      cdnDomain: cdn.domain,

      // Endpoint URLs (v2.0)
      mcpEndpoint: `${cdn.url}/mcp`,
      signupEndpoint: `${cdn.url}/signup`,
      resetEndpoint: `${cdn.url}/reset`,
      adminEndpoint: `${cdn.url}/admin`,
    };
  },
});
