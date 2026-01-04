/**
 * Admin Authentication Middleware
 *
 * Checks if a user has admin privileges (isAdmin: true) before allowing access
 * to admin routes and API endpoints.
 */

import { getUserByApiKey, type User } from '../services/dynamodb-service.js';

export interface AdminAuthResult {
  authenticated: boolean;
  isAdmin: boolean;
  user?: User;
  apiKey?: string;
  error?: string;
}

/**
 * Extract API key from Authorization header or x-api-key header
 */
function extractApiKey(headers: Record<string, string | undefined>): string | null {
  // Check Authorization header (Bearer token)
  const authHeader = headers['authorization'] || headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check x-api-key header
  const apiKeyHeader = headers['x-api-key'] || headers['X-Api-Key'];
  if (apiKeyHeader) {
    return apiKeyHeader;
  }

  return null;
}

/**
 * Verify admin access
 *
 * Returns authenticated: true and isAdmin: true only if:
 * 1. User provides valid API key
 * 2. User exists in database
 * 3. User has isAdmin: true flag
 * 4. User is not blocked/suspended
 */
export async function verifyAdminAccess(
  headers: Record<string, string | undefined>
): Promise<AdminAuthResult> {
  const apiKey = extractApiKey(headers);

  if (!apiKey) {
    return {
      authenticated: false,
      isAdmin: false,
      error: 'No API key provided. Admin access requires authentication.',
    };
  }

  try {
    // Look up user by API key
    const user = await getUserByApiKey(apiKey);

    if (!user) {
      return {
        authenticated: false,
        isAdmin: false,
        error: 'Invalid API key.',
      };
    }

    // Check if user is blocked/suspended
    if (user.status === 'blocked' || user.status === 'suspended') {
      return {
        authenticated: false,
        isAdmin: false,
        error: `Account ${user.status}. Contact support for assistance.`,
      };
    }

    // Check admin flag
    if (!user.isAdmin) {
      return {
        authenticated: true,
        isAdmin: false,
        user,
        apiKey,
        error: 'Insufficient permissions. Admin access required.',
      };
    }

    // Success - user is authenticated and is an admin
    return {
      authenticated: true,
      isAdmin: true,
      user,
      apiKey,
    };
  } catch (error) {
    console.error('Admin auth error:', error);
    return {
      authenticated: false,
      isAdmin: false,
      error: 'Authentication service temporarily unavailable.',
    };
  }
}
