/**
 * Stdio Transport Entry Point
 *
 * Main entry point for the stdio transport MCP server.
 * Starts the server and connects it to stdin/stdout.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMCPServer } from './server.js';
import { logger } from './logger.js';
import { config } from './config.js';

async function main() {
  logger.info('Starting USWDS MCP Server (stdio transport)');
  logger.info(`Version: ${config.serverVersion}`);
  logger.info(`React components: ${config.useReactComponents}`);

  const server = createMCPServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  logger.info('Server started successfully');
  logger.info('Ready to accept MCP requests via stdio');
}

main().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
