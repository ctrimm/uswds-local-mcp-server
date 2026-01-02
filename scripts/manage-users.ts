#!/usr/bin/env node

/**
 * User Management CLI
 *
 * Manage USWDS MCP Server users via DynamoDB
 *
 * Usage:
 *   npm run manage-users block user@example.com
 *   npm run manage-users unblock user@example.com
 *   npm run manage-users get user@example.com
 *   npm run manage-users list-usage uswds_abc123...
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB client
const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const USERS_TABLE = process.env.USERS_TABLE_NAME || 'uswds-mcp-server-UsersTable';
const USAGE_TABLE = process.env.USAGE_TABLE_NAME || 'uswds-mcp-server-UsageTable';

interface User {
  email: string;
  apiKey: string;
  tier: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  requestCount: number;
  lastRequestAt: string | null;
}

/**
 * Get user by email
 */
async function getUser(email: string): Promise<User | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: { email: email.toLowerCase() },
    })
  );

  return (result.Item as User) || null;
}

/**
 * Block a user
 */
async function blockUser(email: string): Promise<void> {
  await docClient.send(
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
}

/**
 * Unblock a user
 */
async function unblockUser(email: string): Promise<void> {
  await docClient.send(
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
}

/**
 * Get usage logs for an API key
 */
async function getUsage(apiKey: string, limit: number = 100): Promise<any[]> {
  const result = await docClient.send(
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

  return result.Items || [];
}

/**
 * Main CLI handler
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const param = args[1];

  if (!command) {
    console.log(`
USWDS MCP Server - User Management CLI

Usage:
  npm run manage-users <command> <param>

Commands:
  get <email>           Get user details
  block <email>         Block a user
  unblock <email>       Unblock a user
  list-usage <apiKey>   List recent usage for an API key

Environment Variables:
  USERS_TABLE_NAME     DynamoDB users table name (default: uswds-mcp-server-UsersTable)
  USAGE_TABLE_NAME     DynamoDB usage table name (default: uswds-mcp-server-UsageTable)

Examples:
  npm run manage-users get user@example.com
  npm run manage-users block spammer@example.com
  npm run manage-users unblock user@example.com
  npm run manage-users list-usage uswds_abc123...
`);
    process.exit(0);
  }

  try {
    switch (command) {
      case 'get': {
        if (!param) {
          console.error('Error: Email required');
          process.exit(1);
        }

        const user = await getUser(param);
        if (!user) {
          console.log(`User not found: ${param}`);
          process.exit(1);
        }

        console.log('\nUser Details:');
        console.log('━'.repeat(60));
        console.log(`Email:        ${user.email}`);
        console.log(`API Key:      ${user.apiKey}`);
        console.log(`Tier:         ${user.tier}`);
        console.log(`Status:       ${user.status}`);
        console.log(`Created:      ${user.createdAt}`);
        console.log(`Updated:      ${user.updatedAt}`);
        console.log(`Requests:     ${user.requestCount}`);
        console.log(`Last Request: ${user.lastRequestAt || 'Never'}`);
        console.log('━'.repeat(60));
        break;
      }

      case 'block': {
        if (!param) {
          console.error('Error: Email required');
          process.exit(1);
        }

        const user = await getUser(param);
        if (!user) {
          console.log(`User not found: ${param}`);
          process.exit(1);
        }

        await blockUser(param);
        console.log(`✅ User blocked: ${param}`);
        console.log(`   API Key: ${user.apiKey}`);
        console.log(`   All requests from this user will be rejected.`);
        break;
      }

      case 'unblock': {
        if (!param) {
          console.error('Error: Email required');
          process.exit(1);
        }

        const user = await getUser(param);
        if (!user) {
          console.log(`User not found: ${param}`);
          process.exit(1);
        }

        await unblockUser(param);
        console.log(`✅ User unblocked: ${param}`);
        console.log(`   API Key: ${user.apiKey}`);
        console.log(`   User can now make requests again.`);
        break;
      }

      case 'list-usage': {
        if (!param) {
          console.error('Error: API key required');
          process.exit(1);
        }

        const usage = await getUsage(param, 20);
        if (usage.length === 0) {
          console.log(`No usage found for API key: ${param}`);
          process.exit(0);
        }

        console.log(`\nRecent Usage (${usage.length} requests):`);
        console.log('━'.repeat(80));
        console.log(
          'Timestamp                | Email                 | Method       | Tool             | Status | Duration'
        );
        console.log('━'.repeat(80));

        usage.forEach((log: any) => {
          const timestamp = log.timestamp.substring(0, 19).replace('T', ' ');
          const email = (log.email || '').padEnd(21);
          const method = (log.method || '').padEnd(12);
          const tool = (log.toolName || '-').padEnd(16);
          const status = String(log.statusCode || '-').padStart(6);
          const duration = String(log.duration || '-').padStart(6) + 'ms';

          console.log(`${timestamp} | ${email} | ${method} | ${tool} | ${status} | ${duration}`);
        });

        console.log('━'.repeat(80));
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        console.log('Run without arguments to see usage');
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
