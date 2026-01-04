/**
 * Session Management Service
 *
 * Handles MCP session state using DynamoDB.
 * Sessions are identified by Mcp-Session-Id header and store:
 * - API key association
 * - Session metadata
 * - Expiration (24 hours default)
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const SESSIONS_TABLE_NAME = process.env.SESSIONS_TABLE_NAME || 'SessionsTable';
const SESSION_TTL_HOURS = 24; // Sessions expire after 24 hours

export interface Session {
  sessionId: string;
  apiKey: string;
  email: string;
  createdAt: string;
  lastAccessedAt: string;
  expiresAt: number; // Unix timestamp for DynamoDB TTL
  metadata?: Record<string, any>; // Optional session-specific data
}

/**
 * Create a new session
 */
export async function createSession(apiKey: string, email: string): Promise<Session> {
  const sessionId = randomUUID();
  const now = new Date().toISOString();
  const expiresAt = Math.floor(Date.now() / 1000) + (SESSION_TTL_HOURS * 60 * 60);

  const session: Session = {
    sessionId,
    apiKey,
    email,
    createdAt: now,
    lastAccessedAt: now,
    expiresAt,
  };

  await docClient.send(new PutCommand({
    TableName: SESSIONS_TABLE_NAME,
    Item: session,
  }));

  return session;
}

/**
 * Get session by ID
 */
export async function getSession(sessionId: string): Promise<Session | null> {
  const result = await docClient.send(new GetCommand({
    TableName: SESSIONS_TABLE_NAME,
    Key: { sessionId },
  }));

  if (!result.Item) {
    return null;
  }

  // Check if session is expired
  const now = Math.floor(Date.now() / 1000);
  if (result.Item.expiresAt < now) {
    // Session expired, delete it
    await deleteSession(sessionId);
    return null;
  }

  return result.Item as Session;
}

/**
 * Update session last accessed time
 */
export async function touchSession(sessionId: string): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) {
    return; // Session doesn't exist or expired
  }

  const now = new Date().toISOString();
  const expiresAt = Math.floor(Date.now() / 1000) + (SESSION_TTL_HOURS * 60 * 60);

  await docClient.send(new PutCommand({
    TableName: SESSIONS_TABLE_NAME,
    Item: {
      ...session,
      lastAccessedAt: now,
      expiresAt, // Extend expiration
    },
  }));
}

/**
 * Delete session
 */
export async function deleteSession(sessionId: string): Promise<void> {
  await docClient.send(new DeleteCommand({
    TableName: SESSIONS_TABLE_NAME,
    Key: { sessionId },
  }));
}

/**
 * Get all sessions for an API key
 */
export async function getSessionsByApiKey(apiKey: string): Promise<Session[]> {
  const result = await docClient.send(new QueryCommand({
    TableName: SESSIONS_TABLE_NAME,
    IndexName: 'apiKeyIndex',
    KeyConditionExpression: 'apiKey = :apiKey',
    ExpressionAttributeValues: {
      ':apiKey': apiKey,
    },
  }));

  if (!result.Items) {
    return [];
  }

  // Filter out expired sessions
  const now = Math.floor(Date.now() / 1000);
  return result.Items.filter(item => item.expiresAt >= now) as Session[];
}

/**
 * Update session metadata
 */
export async function updateSessionMetadata(
  sessionId: string,
  metadata: Record<string, any>
): Promise<void> {
  const session = await getSession(sessionId);
  if (!session) {
    throw new Error('Session not found');
  }

  await docClient.send(new PutCommand({
    TableName: SESSIONS_TABLE_NAME,
    Item: {
      ...session,
      metadata: {
        ...session.metadata,
        ...metadata,
      },
      lastAccessedAt: new Date().toISOString(),
    },
  }));
}

/**
 * Extract session ID from headers
 */
export function extractSessionId(headers: Record<string, string | undefined>): string | null {
  return headers['mcp-session-id'] || headers['Mcp-Session-Id'] || null;
}

/**
 * Generate a new session ID
 */
export function generateSessionId(): string {
  return randomUUID();
}
