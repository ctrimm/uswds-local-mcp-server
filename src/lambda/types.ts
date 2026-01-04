/**
 * Lambda TypeScript Interfaces
 *
 * Shared types for the Lambda handler.
 */

// ===== AWS Lambda Types =====

export interface LambdaEvent {
  headers: Record<string, string | undefined>;
  body: string | null;
  requestContext: {
    requestId: string;
    http: {
      method: string;
      path: string;
      sourceIp: string;
    };
  };
}

export interface LambdaContext {
  requestId: string;
  functionName: string;
  functionVersion: string;
  memoryLimitInMB: string;
  getRemainingTimeInMillis: () => number;
}

export interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

/**
 * Lambda Streaming Response Handler
 * Used with awslambda.streamifyResponse() for SSE streaming
 */
export type StreamingResponseHandler = (
  event: LambdaEvent,
  responseStream: NodeJS.WritableStream,
  context: LambdaContext
) => Promise<void>;

// ===== MCP Types =====

export interface MCPRequest {
  jsonrpc: string;
  id?: string | number | null;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: string;
  id: string | number | null;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

// ===== Rate Limit Types =====

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  retryAfter?: number;
  limitType?: 'minute' | 'day';
}
