/**
 * AWS Lambda Handler for USWDS MCP Server (v2.0)
 *
 * Main entry point for Lambda Function URL requests.
 * Supports:
 * - Streamable HTTP transport (JSON + SSE)
 * - Session management (Mcp-Session-Id header)
 * - /mcp endpoint convention
 * - Authentication, rate limiting, origin validation
 *
 * Spec: https://modelcontextprotocol.io/specification/2025-03-26/basic/transports
 */

import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { rateLimiter } from '../middleware/rate-limiter.js';
import { validateOrigin } from '../middleware/origin-validator.js';
import { updateUserStats, logUsage } from '../services/dynamodb-service.js';
import { globalCache } from '../services/lambda-cache-service.js';
import {
  createSession,
  getSession,
  touchSession,
  extractSessionId,
  generateSessionId,
} from '../services/session-service.js';
import { authenticate } from './auth/authenticate.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { getMCPServer } from './server.js';
import { tools } from './tools/definitions.js';
import {
  getResponseFormat,
  ResponseStream,
  getSSEHeaders,
  getJSONHeaders,
} from './streaming.js';
import { LambdaEvent, LambdaContext, LambdaResponse, MCPRequest } from './types.js';

/**
 * Lambda Handler
 */
export const handler = async (
  event: LambdaEvent,
  context: LambdaContext
): Promise<LambdaResponse> => {
  const startTime = Date.now();
  const requestId = context.requestId;

  logger.info(`Request: ${requestId}`, {
    method: event.requestContext.http.method,
    path: event.requestContext.http.path,
  });

  // Health check endpoint
  if (event.requestContext.http.path === '/health') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'healthy',
        version: config.serverVersion,
        timestamp: new Date().toISOString(),
        cache: globalCache.getStats(),
        rateLimit: rateLimiter.getStats(),
      }),
    };
  }

  // Origin validation (prevents DNS rebinding attacks)
  const originCheck = validateOrigin(event.headers);
  if (!originCheck.valid) {
    logger.warn(`Invalid origin rejected: ${event.headers['origin'] || event.headers['Origin']}`);
    return {
      statusCode: 403,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Forbidden',
        message: originCheck.error || 'Origin not allowed',
      }),
    };
  }

  // Authentication
  const auth = await authenticate(event);
  if (!auth.authenticated) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Unauthorized',
        message: auth.error || 'Authentication failed',
      }),
    };
  }

  const user = auth.user!;
  const apiKey = auth.apiKey!;

  // Session Management (Mcp-Session-Id header)
  let sessionId = extractSessionId(event.headers);
  let session = null;

  if (sessionId) {
    // Existing session - validate and refresh
    session = await getSession(sessionId);
    if (!session) {
      // Session expired or invalid
      logger.info(`Session expired or invalid: ${sessionId}`);
      sessionId = null;
    } else if (session.apiKey !== apiKey) {
      // Session belongs to different API key
      logger.warn(`Session API key mismatch: ${sessionId}`);
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Forbidden',
          message: 'Session belongs to different user',
        }),
      };
    } else {
      // Valid session - touch to update last access time
      await touchSession(sessionId);
      logger.info(`Session refreshed: ${sessionId}`);
    }
  }

  if (!sessionId) {
    // No session or expired - create new one
    session = await createSession(apiKey, user.email);
    sessionId = session.sessionId;
    logger.info(`New session created: ${sessionId}`);
  }

  // Rate limiting
  const rateLimit = rateLimiter.check(apiKey);
  if (!rateLimit.allowed) {
    logger.warn(`Rate limit exceeded for API key: ${apiKey.substring(0, 8)}...`, {
      limitType: rateLimit.limitType,
      retryAfter: rateLimit.retryAfter,
    });

    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': rateLimit.limitType === 'minute' ? '1' : '100',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(rateLimit.retryAfter),
        'Retry-After': String(rateLimit.retryAfter),
      },
      body: JSON.stringify({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. You can make ${rateLimit.limitType === 'minute' ? '1 request per minute' : '100 requests per day'}. Try again in ${rateLimit.retryAfter} seconds.`,
        retryAfter: rateLimit.retryAfter,
      }),
    };
  }

  // Handle MCP request
  let body: any;
  try {
    body = event.body ? JSON.parse(event.body) : {};

    // Validate JSON-RPC request
    if (body.jsonrpc !== '2.0') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: body.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request: jsonrpc must be "2.0"',
          },
        }),
      };
    }

    if (!body.method || typeof body.method !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: body.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request: method is required',
          },
        }),
      };
    }

    const server = getMCPServer();
    let result;

    // Route to appropriate MCP handler
    if (body.method === 'tools/list') {
      // List available tools
      const handler = (server as any)._requestHandlers?.get(ListToolsRequestSchema);
      if (handler) {
        result = await handler(body);
      } else {
        result = { tools };
      }
    } else if (body.method === 'tools/call') {
      // Call a specific tool
      const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema);
      if (handler) {
        result = await handler(body);
      } else {
        throw new Error('Tool call handler not found');
      }
    } else {
      // Unsupported method
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          error: {
            code: -32601,
            message: `Method not found: ${body.method}`,
          },
        }),
      };
    }

    const duration = Date.now() - startTime;
    const statusCode = 200;

    logger.info(`Response: ${requestId}`, {
      statusCode,
      duration,
      method: body.method,
      email: user.email,
    });

    // Update user stats and log usage to DynamoDB (fire and forget)
    updateUserStats(user.email, apiKey).catch(err =>
      logger.error('Failed to update user stats:', err)
    );

    logUsage({
      apiKey,
      timestamp: new Date().toISOString(),
      email: user.email,
      method: body.method,
      toolName: body.method === 'tools/call' ? body.params?.name : undefined,
      statusCode,
      duration,
    }).catch(err =>
      logger.error('Failed to log usage:', err)
    );

    return {
      statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': requestId,
        'X-Processing-Time': `${duration}ms`,
        'X-RateLimit-Limit': '1',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000)),
        'Mcp-Session-Id': sessionId!, // Return session ID to client
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: body.id,
        result: result,
      }),
    };
  } catch (error) {
    logger.error(`Request failed: ${requestId}`, error);

    // Distinguish between different error types
    let statusCode = 500;
    let errorCode = -32603; // Internal error
    let errorMessage = 'Internal Server Error';

    if (error instanceof SyntaxError) {
      statusCode = 400;
      errorCode = -32700;
      errorMessage = 'Parse error: Invalid JSON';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: body?.id || null,
        error: {
          code: errorCode,
          message: errorMessage,
          data: {
            requestId,
            stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
          },
        },
      }),
    };
  }
};
