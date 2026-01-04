/**
 * DynamoDB Service
 *
 * Handles all DynamoDB operations for the USWDS MCP Server:
 * - User authentication (email + API key lookups)
 * - Usage tracking and analytics
 * - Block-list management
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

// User record structure
export interface User {
  email: string;
  apiKey: string;
  tier: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'blocked' | 'suspended';
  isAdmin: boolean; // Admin flag for accessing /admin routes and API endpoints
  createdAt: string;
  updatedAt: string;
  requestCount: number;
  lastRequestAt: string | null;
}

// Usage log structure
export interface UsageLog {
  apiKey: string;
  timestamp: string; // ISO8601 format
  email: string;
  method: string; // e.g., "tools/call"
  toolName?: string; // e.g., "list_components"
  statusCode: number;
  duration: number; // milliseconds
  ttl: number; // Unix timestamp for auto-deletion (90 days)
}

// Initialize DynamoDB client (singleton)
let docClient: DynamoDBDocumentClient | null = null;

function getDocClient(): DynamoDBDocumentClient {
  if (!docClient) {
    const dynamoClient = new DynamoDBClient({});
    docClient = DynamoDBDocumentClient.from(dynamoClient);
  }
  return docClient;
}

const USERS_TABLE = process.env.USERS_TABLE_NAME!;
const USAGE_TABLE = process.env.USAGE_TABLE_NAME!;

/**
 * Get user by API key
 */
export async function getUserByApiKey(apiKey: string): Promise<User | null> {
  const client = getDocClient();

  try {
    // Query using GSI (apiKeyIndex)
    const result = await client.send(
      new QueryCommand({
        TableName: USERS_TABLE,
        IndexName: 'apiKeyIndex',
        KeyConditionExpression: 'apiKey = :apiKey',
        ExpressionAttributeValues: {
          ':apiKey': apiKey,
        },
        Limit: 1,
      })
    );

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    return result.Items[0] as User;
  } catch (error) {
    console.error('Error fetching user by API key:', error);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  const client = getDocClient();

  try {
    const result = await client.send(
      new GetCommand({
        TableName: USERS_TABLE,
        Key: { email: email.toLowerCase() },
      })
    );

    return (result.Item as User) || null;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

/**
 * Update user request count and last request time
 */
export async function updateUserStats(email: string, apiKey: string): Promise<void> {
  const client = getDocClient();

  try {
    await client.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { email },
        UpdateExpression: 'SET requestCount = if_not_exists(requestCount, :zero) + :inc, lastRequestAt = :now',
        ExpressionAttributeValues: {
          ':inc': 1,
          ':zero': 0,
          ':now': new Date().toISOString(),
        },
      })
    );
  } catch (error) {
    console.error('Error updating user stats:', error);
    // Don't throw - stats update failure shouldn't block the request
  }
}

/**
 * Log request usage to DynamoDB
 */
export async function logUsage(log: Omit<UsageLog, 'ttl'>): Promise<void> {
  const client = getDocClient();

  try {
    // Set TTL to 90 days from now
    const ttl = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60;

    await client.send(
      new PutCommand({
        TableName: USAGE_TABLE,
        Item: {
          ...log,
          ttl,
        },
      })
    );
  } catch (error) {
    console.error('Error logging usage:', error);
    // Don't throw - usage logging failure shouldn't block the request
  }
}

/**
 * Block a user (set status to 'blocked')
 */
export async function blockUser(email: string): Promise<void> {
  const client = getDocClient();

  try {
    await client.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { email: email.toLowerCase() },
        UpdateExpression: 'SET #status = :blocked, updatedAt = :now',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':blocked': 'blocked',
          ':now': new Date().toISOString(),
        },
      })
    );
  } catch (error) {
    console.error('Error blocking user:', error);
    throw error;
  }
}

/**
 * Unblock a user (set status to 'active')
 */
export async function unblockUser(email: string): Promise<void> {
  const client = getDocClient();

  try {
    await client.send(
      new UpdateCommand({
        TableName: USERS_TABLE,
        Key: { email: email.toLowerCase() },
        UpdateExpression: 'SET #status = :active, updatedAt = :now',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':active': 'active',
          ':now': new Date().toISOString(),
        },
      })
    );
  } catch (error) {
    console.error('Error unblocking user:', error);
    throw error;
  }
}

/**
 * Get usage stats for a user (last N requests)
 */
export async function getUserUsage(apiKey: string, limit: number = 100): Promise<UsageLog[]> {
  const client = getDocClient();

  try {
    const result = await client.send(
      new QueryCommand({
        TableName: USAGE_TABLE,
        KeyConditionExpression: 'apiKey = :apiKey',
        ExpressionAttributeValues: {
          ':apiKey': apiKey,
        },
        ScanIndexForward: false, // Most recent first
        Limit: limit,
      })
    );

    return (result.Items as UsageLog[]) || [];
  } catch (error) {
    console.error('Error fetching user usage:', error);
    throw error;
  }
}
