/**
 * Streamable HTTP Transport Support
 *
 * Implements MCP Streamable HTTP transport (2025-03-26 spec):
 * - Single POST /mcp endpoint
 * - Supports both batch (JSON) and streaming (SSE) responses
 * - Uses Accept header to determine response format
 *
 * See: https://modelcontextprotocol.io/specification/2025-03-26/basic/transports
 */

import { Writable } from 'stream';

/**
 * SSE (Server-Sent Events) message format
 */
export interface SSEMessage {
  event?: string;
  data: any;
  id?: string;
}

/**
 * Format data as SSE message
 */
export function formatSSE(message: SSEMessage): string {
  const lines: string[] = [];

  if (message.id) {
    lines.push(`id: ${message.id}`);
  }

  if (message.event) {
    lines.push(`event: ${message.event}`);
  }

  // Data can be multi-line JSON
  const dataStr = typeof message.data === 'string'
    ? message.data
    : JSON.stringify(message.data);

  dataStr.split('\n').forEach(line => {
    lines.push(`data: ${line}`);
  });

  // SSE messages end with double newline
  return lines.join('\n') + '\n\n';
}

/**
 * Check if client accepts SSE responses
 */
export function acceptsSSE(headers: Record<string, string | undefined>): boolean {
  const accept = headers['accept'] || headers['Accept'] || '';
  return accept.includes('text/event-stream');
}

/**
 * Lambda Response Stream Handler
 *
 * AWS Lambda streaming uses pipeline() with a writable stream.
 * This helper manages the stream and formats SSE messages.
 */
export class ResponseStream {
  private stream: Writable;
  private messageCount = 0;

  constructor(stream: Writable) {
    this.stream = stream;
  }

  /**
   * Write SSE message to stream
   */
  write(message: SSEMessage): void {
    this.messageCount++;
    const formattedMessage = formatSSE({
      ...message,
      id: message.id || String(this.messageCount),
    });
    this.stream.write(formattedMessage);
  }

  /**
   * Write JSON-RPC response as SSE
   */
  writeJSONRPC(id: any, result: any, error?: any): void {
    const response = {
      jsonrpc: '2.0',
      id,
      ...(error ? { error } : { result }),
    };

    this.write({
      event: 'message',
      data: response,
    });
  }

  /**
   * End the stream
   */
  end(): void {
    this.stream.end();
  }

  /**
   * Get message count
   */
  getCount(): number {
    return this.messageCount;
  }
}

/**
 * Determine response format based on Accept header
 */
export function getResponseFormat(headers: Record<string, string | undefined>): 'sse' | 'json' {
  return acceptsSSE(headers) ? 'sse' : 'json';
}

/**
 * Create SSE response headers
 */
export function getSSEHeaders(): Record<string, string> {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no', // Disable nginx buffering
  };
}

/**
 * Create JSON response headers
 */
export function getJSONHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
  };
}
