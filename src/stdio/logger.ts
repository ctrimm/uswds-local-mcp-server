/**
 * Stdio Logger
 *
 * Logger for stdio transport. Logs to stderr to avoid interfering with stdout MCP protocol.
 */

import { config } from './config.js';

export const logger = {
  info: (...args: any[]) => console.error('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.error('[WARN]', ...args),
  debug: (...args: any[]) => config.logLevel === 'debug' ? console.error('[DEBUG]', ...args) : undefined,
};

export type Logger = typeof logger;
