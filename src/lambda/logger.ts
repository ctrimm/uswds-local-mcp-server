/**
 * Logger
 *
 * Simple CloudWatch-compatible logger with log level support.
 */

import { config } from './config.js';

export const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  debug: (...args: any[]) => config.logLevel === 'debug' ? console.log('[DEBUG]', ...args) : undefined,
};

export type Logger = typeof logger;
