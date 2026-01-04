/**
 * Admin API Lambda Function
 *
 * Provides admin endpoints for managing the USWDS MCP Server:
 * - GET /admin/users - List all users
 * - POST /admin/users/:email/block - Block a user
 * - POST /admin/users/:email/unblock - Unblock a user
 * - POST /admin/users/:email/make-admin - Grant admin access
 * - POST /admin/users/:email/revoke-admin - Revoke admin access
 * - GET /admin/stats - Get system statistics
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { verifyAdminAccess } from '../middleware/admin-auth.js';

// Lambda types
interface LambdaEvent {
  headers: Record<string, string | undefined>;
  body: string | null;
  requestContext: {
    requestId: string;
    http: {
      method: string;
      path: string;
    };
  };
  pathParameters?: Record<string, string>;
}

interface LambdaContext {
  requestId: string;
}

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USERS_TABLE = process.env.USERS_TABLE_NAME!;

// Logger
const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
};

/**
 * CORS headers
 */
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
};

/**
 * List all users
 */
async function listUsers() {
  const result = await docClient.send(
    new ScanCommand({
      TableName: USERS_TABLE,
      // Don't return API keys in list
      ProjectionExpression: 'email, #status, tier, isAdmin, createdAt, updatedAt, requestCount, lastRequestAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    })
  );

  return {
    users: result.Items || [],
    count: result.Count || 0,
  };
}

/**
 * Update user status
 */
async function updateUserStatus(email: string, status: 'active' | 'blocked' | 'suspended') {
  await docClient.send(
    new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { email: email.toLowerCase() },
      UpdateExpression: 'SET #status = :status, updatedAt = :now',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':now': new Date().toISOString(),
      },
    })
  );
}

/**
 * Update user admin flag
 */
async function updateUserAdminFlag(email: string, isAdmin: boolean) {
  await docClient.send(
    new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { email: email.toLowerCase() },
      UpdateExpression: 'SET isAdmin = :isAdmin, updatedAt = :now',
      ExpressionAttributeValues: {
        ':isAdmin': isAdmin,
        ':now': new Date().toISOString(),
      },
    })
  );
}

/**
 * Get system statistics
 */
async function getSystemStats() {
  const result = await docClient.send(
    new ScanCommand({
      TableName: USERS_TABLE,
      ProjectionExpression: '#status, tier, isAdmin, requestCount',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
    })
  );

  const users = result.Items || [];

  return {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    blockedUsers: users.filter(u => u.status === 'blocked').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    adminUsers: users.filter(u => u.isAdmin).length,
    freeUsers: users.filter(u => u.tier === 'free').length,
    proUsers: users.filter(u => u.tier === 'pro').length,
    enterpriseUsers: users.filter(u => u.tier === 'enterprise').length,
    totalRequests: users.reduce((sum, u) => sum + (u.requestCount || 0), 0),
  };
}

/**
 * Lambda handler
 */
export const handler = async (
  event: LambdaEvent,
  context: LambdaContext
): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}> => {
  const requestId = context.requestId;

  logger.info(`Admin API request: ${event.requestContext.http.method} ${event.requestContext.http.path}`);

  // CORS preflight
  if (event.requestContext.http.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  try {
    // Verify admin access
    const authResult = await verifyAdminAccess(event.headers);

    if (!authResult.isAdmin) {
      return {
        statusCode: authResult.authenticated ? 403 : 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: authResult.error || 'Unauthorized',
        }),
      };
    }

    logger.info(`Admin access granted: ${authResult.user?.email}`);

    // Route handling
    const method = event.requestContext.http.method;
    const path = event.requestContext.http.path;

    // GET /admin/users
    if (method === 'GET' && path === '/admin/users') {
      const data = await listUsers();
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, ...data }),
      };
    }

    // GET /admin/stats
    if (method === 'GET' && path === '/admin/stats') {
      const stats = await getSystemStats();
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, stats }),
      };
    }

    // POST /admin/users/:email/block
    if (method === 'POST' && path.match(/^\/admin\/users\/[^/]+\/block$/)) {
      const email = path.split('/')[3];
      await updateUserStatus(email, 'blocked');
      logger.info(`User blocked: ${email} by ${authResult.user?.email}`);
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'User blocked successfully' }),
      };
    }

    // POST /admin/users/:email/unblock
    if (method === 'POST' && path.match(/^\/admin\/users\/[^/]+\/unblock$/)) {
      const email = path.split('/')[3];
      await updateUserStatus(email, 'active');
      logger.info(`User unblocked: ${email} by ${authResult.user?.email}`);
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'User unblocked successfully' }),
      };
    }

    // POST /admin/users/:email/make-admin
    if (method === 'POST' && path.match(/^\/admin\/users\/[^/]+\/make-admin$/)) {
      const email = path.split('/')[3];
      await updateUserAdminFlag(email, true);
      logger.info(`Admin access granted to: ${email} by ${authResult.user?.email}`);
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Admin access granted successfully' }),
      };
    }

    // POST /admin/users/:email/revoke-admin
    if (method === 'POST' && path.match(/^\/admin\/users\/[^/]+\/revoke-admin$/)) {
      const email = path.split('/')[3];
      await updateUserAdminFlag(email, false);
      logger.info(`Admin access revoked from: ${email} by ${authResult.user?.email}`);
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Admin access revoked successfully' }),
      };
    }

    // Route not found
    return {
      statusCode: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Route not found',
      }),
    };
  } catch (error) {
    logger.error('Admin API error:', error);

    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
    };
  }
};
