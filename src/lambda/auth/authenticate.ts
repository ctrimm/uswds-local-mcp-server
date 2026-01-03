/**
 * Request Authentication
 *
 * Authenticates requests using API keys stored in DynamoDB.
 */

import { getUserByApiKey } from '../../services/dynamodb-service.js';
import { logger } from '../logger.js';
import { LambdaEvent } from '../types.js';
import { extractApiKey } from './extract-api-key.js';
import { AuthResult } from './types.js';

/**
 * Authenticate request using DynamoDB
 */
export async function authenticate(event: LambdaEvent): Promise<AuthResult> {
  const apiKey = extractApiKey(event);

  if (!apiKey) {
    return {
      authenticated: false,
      error: 'No API key provided. Include your API key in the Authorization header (Bearer token) or x-api-key header.',
    };
  }

  try {
    // Look up user by API key in DynamoDB
    const user = await getUserByApiKey(apiKey);

    if (!user) {
      logger.warn('Invalid API key:', apiKey.substring(0, 12) + '...');
      return {
        authenticated: false,
        error: 'Invalid API key. Sign up at https://uswdsmcp.com to get your API key.',
      };
    }

    // Check if user is blocked
    if (user.status === 'blocked') {
      logger.warn('Blocked user attempted access:', user.email);
      return {
        authenticated: false,
        error: 'Your account has been blocked. Contact support for assistance.',
      };
    }

    if (user.status === 'suspended') {
      logger.warn('Suspended user attempted access:', user.email);
      return {
        authenticated: false,
        error: 'Your account has been suspended. Contact support for assistance.',
      };
    }

    logger.debug('Authentication successful:', user.email);

    return {
      authenticated: true,
      user,
      apiKey,
    };
  } catch (error) {
    logger.error('Authentication error:', error);
    return {
      authenticated: false,
      error: 'Authentication service temporarily unavailable. Please try again.',
    };
  }
}
