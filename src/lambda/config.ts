/**
 * Lambda Configuration
 *
 * Centralized configuration for the Lambda handler.
 */

export const config = {
  useReactComponents: process.env.USE_REACT_COMPONENTS === 'true',
  apiKey: process.env.API_KEY, // Optional - set via SST secrets
  logLevel: process.env.LOG_LEVEL || 'info',
  serverVersion: '0.2.0',
} as const;

export type Config = typeof config;
