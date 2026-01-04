/**
 * Origin Header Validation Middleware
 *
 * Validates the Origin header to prevent DNS rebinding attacks.
 * Required security measure for MCP servers per best practices.
 *
 * See: https://modelcontextprotocol.io/specification/2025-03-26/basic/transports
 */

export interface OriginValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Allowed origins for production and development
 */
const ALLOWED_ORIGINS = [
  // Production domains
  'https://uswdsmcp.com',
  'https://www.uswdsmcp.com',
  'https://api.uswdsmcp.com',

  // Development
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

/**
 * Check if origin is from a stage subdomain (e.g., dev-api.uswdsmcp.com)
 */
function isStageSubdomain(origin: string): boolean {
  try {
    const url = new URL(origin);
    return url.hostname.match(/^[a-z0-9-]+-api\.uswdsmcp\.com$/) !== null;
  } catch {
    return false;
  }
}

/**
 * Validate Origin header
 *
 * For requests with Origin header (browser-based), we validate against
 * allowed list to prevent DNS rebinding attacks.
 *
 * For requests without Origin header (server-to-server), we allow them
 * as they use API key authentication.
 */
export function validateOrigin(
  headers: Record<string, string | undefined>
): OriginValidationResult {
  const origin = headers['origin'] || headers['Origin'];

  // No Origin header = server-to-server request (allowed)
  // This is common for MCP clients like Claude Desktop
  if (!origin) {
    return { valid: true };
  }

  // Check against allowed list
  if (ALLOWED_ORIGINS.includes(origin)) {
    return { valid: true };
  }

  // Check if it's a valid stage subdomain (dev-api, staging-api, etc.)
  if (isStageSubdomain(origin)) {
    return { valid: true };
  }

  // Allow wildcard in development mode
  if (process.env.NODE_ENV === 'development') {
    return { valid: true };
  }

  // Reject invalid origin
  return {
    valid: false,
    error: `Origin '${origin}' is not allowed. This server only accepts requests from authorized domains.`,
  };
}
