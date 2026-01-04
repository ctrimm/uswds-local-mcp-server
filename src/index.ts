/**
 * USWDS MCP Server - Stdio Transport
 *
 * This file maintains backward compatibility by re-exporting the modular stdio server.
 * The actual implementation is in src/stdio/ for better organization.
 *
 * For details, see:
 * - src/stdio/index.ts - Main stdio entry point
 * - src/stdio/server.ts - MCP server initialization
 * - src/shared/tools/ - Shared tool definitions and handlers
 *
 * To run: node dist/index.js
 */

// Re-export from modular structure
import './stdio/index.js';
