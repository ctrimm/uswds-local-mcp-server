/**
 * MCP Server Initialization
 *
 * Creates and configures the MCP server instance with tool handlers.
 * Server instance is cached across Lambda warm starts for performance.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ComponentService } from '../services/component-service.js';
import { DesignTokenService } from '../services/design-token-service.js';
import { ValidationService } from '../services/validation-service.js';
import { ColorContrastService } from '../services/color-contrast-service.js';
import { IconService } from '../services/icon-service.js';
import { LayoutService } from '../services/layout-service.js';
import { SuggestionService } from '../services/suggestion-service.js';
import { ComparisonService } from '../services/comparison-service.js';
import { CodeGeneratorService } from '../services/code-generator-service.js';
import { TailwindUSWDSService } from '../services/tailwind-uswds-service.js';
import { config } from './config.js';
import { logger } from './logger.js';
import { tools } from './tools/definitions.js';
import { handleToolCall, Services } from './tools/handlers.js';

// Global state (persists across Lambda warm starts)
let servicesInitialized = false;
let services: Services;
let mcpServer: Server;

/**
 * Initialize services (cached across warm starts)
 */
function initializeServices(): Services {
  if (servicesInitialized && services) {
    logger.debug('Services already initialized (warm start)');
    return services;
  }

  logger.info('Initializing services...');

  const useReact = config.useReactComponents;

  services = {
    componentService: new ComponentService(useReact),
    designTokenService: new DesignTokenService(),
    validationService: new ValidationService(),
    colorContrastService: new ColorContrastService(),
    iconService: new IconService(),
    layoutService: new LayoutService(useReact),
    suggestionService: new SuggestionService(useReact),
    comparisonService: new ComparisonService(useReact),
    codeGeneratorService: new CodeGeneratorService(useReact),
    tailwindUSWDSService: new TailwindUSWDSService(),
  };

  servicesInitialized = true;
  logger.info('Services initialized successfully');

  return services;
}

/**
 * Get or create MCP server instance (cached across warm starts)
 */
export function getMCPServer(): Server {
  if (mcpServer) {
    return mcpServer;
  }

  // Initialize services
  const svc = initializeServices();

  // Create MCP server
  mcpServer = new Server(
    {
      name: 'uswds-mcp-server',
      version: config.serverVersion,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register handlers
  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    logger.info(`Tool called: ${name}`, args);

    try {
      const result = await handleToolCall(name, args, svc);

      return {
        content: [
          {
            type: 'text',
            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logger.error(`Tool execution failed: ${name}`, error);
      return {
        content: [
          {
            type: 'text',
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });

  return mcpServer;
}
