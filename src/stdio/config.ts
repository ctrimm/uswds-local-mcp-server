/**
 * Stdio Configuration
 *
 * Configuration for the stdio transport MCP server.
 */

export const config = {
  useReactComponents: process.env.USE_REACT_COMPONENTS === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
  serverVersion: '0.2.0',
} as const;

export type Config = typeof config;
