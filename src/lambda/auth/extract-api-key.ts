/**
 * Extract API Key from Request Headers
 *
 * Supports both Authorization header (Bearer token) and x-api-key header.
 */

import { LambdaEvent } from '../types.js';

/**
 * Extract API key from request headers
 */
export function extractApiKey(event: LambdaEvent): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = event.headers['authorization'] || event.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check x-api-key header
  const apiKeyHeader = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}
