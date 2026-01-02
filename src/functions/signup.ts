/**
 * Sign-up Lambda Function
 *
 * Handles user registration and API key generation:
 * - Validates email format
 * - Generates unique API key
 * - Stores user in DynamoDB
 * - Returns API key to user
 * - If email exists, regenerates API key (invalidates old one)
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { randomBytes } from 'crypto';

// Lambda types
interface LambdaEvent {
  headers: Record<string, string | undefined>;
  body: string | null;
  requestContext: {
    requestId: string;
    http: {
      method: string;
      path: string;
    };
  };
}

interface LambdaContext {
  requestId: string;
  functionName: string;
}

interface SignupRequest {
  email: string;
}

interface SignupResponse {
  success: boolean;
  apiKey?: string;
  email?: string;
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
 * Format: uswds_<32 random hex characters>
 */
function generateApiKey(): string {
  const randomString = randomBytes(16).toString('hex'); // 32 hex characters
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
 * Create or update user in DynamoDB
 */
async function createUser(email: string): Promise<{ apiKey: string; isNew: boolean }> {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existing = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { email: normalizedEmail },
    })
  );

  const apiKey = generateApiKey();
  const now = new Date().toISOString();

  const user = {
    email: normalizedEmail,
    apiKey: apiKey,
    tier: 'free',
    status: 'active',
    createdAt: existing.Item?.createdAt || now,
    updatedAt: now,
    requestCount: 0,
    lastRequestAt: null,
  };

  await docClient.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: user,
    })
  );

  return {
    apiKey,
    isNew: !existing.Item,
  };
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

  logger.info(`Signup request: ${requestId}`);

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
        } as SignupResponse),
      };
    }

    const request: SignupRequest = JSON.parse(event.body);

    // Validate email
    if (!request.email || !isValidEmail(request.email)) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          success: false,
          error: 'Invalid email address',
        } as SignupResponse),
      };
    }

    // Create/update user
    const { apiKey, isNew } = await createUser(request.email);

    logger.info(`User ${isNew ? 'created' : 'updated'}: ${request.email}`);

    // Return success
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        apiKey: apiKey,
        email: request.email.toLowerCase(),
        message: isNew
          ? 'API key generated successfully! Save it securely - you won\'t be able to see it again.'
          : 'New API key generated! Your previous key has been invalidated.',
      } as SignupResponse),
    };
  } catch (error) {
    logger.error('Signup error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Internal server error. Please try again later.',
      } as SignupResponse),
    };
  }
};
