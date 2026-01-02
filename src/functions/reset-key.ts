/**
 * Reset API Key Lambda Function
 *
 * Handles API key reset for existing users:
 * - Validates email exists
 * - Generates new API key
 * - Invalidates old API key
 * - Returns new API key
 *
 * Note: In production, this would send a reset email instead of
 * returning the key directly. For MVP, we return it immediately.
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes } from 'crypto';

// Lambda types
interface LambdaEvent {
  headers: Record<string, string | undefined>;
  body: string | null;
  requestContext: {
    requestId: string;
    http: {
      method: string;
    };
  };
}

interface LambdaContext {
  requestId: string;
}

interface ResetRequest {
  email: string;
}

interface ResetResponse {
  success: boolean;
  apiKey?: string;
  message?: string;
  error?: string;
}

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USERS_TABLE = process.env.USERS_TABLE_NAME!;

// Logger
const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
};

/**
 * Generate a unique API key
 */
function generateApiKey(): string {
  const randomString = randomBytes(16).toString('hex');
  return `uswds_${randomString}`;
}

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Reset user's API key
 */
async function resetApiKey(email: string): Promise<{ apiKey: string; found: boolean }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user exists
  const existing = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { email: normalizedEmail },
    })
  );

  if (!existing.Item) {
    return { apiKey: '', found: false };
  }

  // Generate new API key
  const newApiKey = generateApiKey();
  const now = new Date().toISOString();

  // Update user with new API key
  await docClient.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: {
        ...existing.Item,
        apiKey: newApiKey,
        updatedAt: now,
      },
    })
  );

  return { apiKey: newApiKey, found: true };
}

/**
 * Lambda handler
 */
export const handler = async (
  event: LambdaEvent,
  context: LambdaContext
): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}> => {
  const requestId = context.requestId;

  logger.info(`Reset request: ${requestId}`);

  // CORS preflight
  if (event.requestContext.http.method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  try {
    // Parse request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Missing request body',
        } as ResetResponse),
      };
    }

    const request: ResetRequest = JSON.parse(event.body);

    // Validate email
    if (!request.email || !isValidEmail(request.email)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Invalid email address',
        } as ResetResponse),
      };
    }

    // Reset API key
    const { apiKey, found } = await resetApiKey(request.email);

    if (!found) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Email not found. Please sign up first.',
        } as ResetResponse),
      };
    }

    logger.info(`API key reset for: ${request.email}`);

    // Return new API key
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        apiKey: apiKey,
        message: 'New API key generated! Your previous key has been invalidated. Save it securely.',
      } as ResetResponse),
    };
  } catch (error) {
    logger.error('Reset error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.',
      } as ResetResponse),
    };
  }
};
