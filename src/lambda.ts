/**
 * AWS Lambda Handler for USWDS MCP Server
 *
 * This file maintains backward compatibility by re-exporting the modular handler.
 * The actual implementation is in src/lambda/ for better organization.
 *
 * For details, see:
 * - src/lambda/handler.ts - Main Lambda handler
 * - src/lambda/server.ts - MCP server initialization
 * - src/lambda/auth/ - Authentication logic
 * - src/lambda/tools/ - Tool definitions and handlers
 */

export { handler } from './lambda/handler.js';
