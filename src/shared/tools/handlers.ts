/**
 * Shared MCP Tool Handlers
 *
 * Tool execution logic shared across all transports (Lambda, stdio, WebSocket, etc.)
 * Re-exported from lambda/tools/handlers.ts for consistency.
 */

export { handleToolCall, type Services } from '../../lambda/tools/handlers.js';
