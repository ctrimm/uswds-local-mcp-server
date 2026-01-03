/**
 * Stdio MCP Server
 *
 * Creates and configures the MCP server for stdio transport.
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
import { CodeGeneratorService } from '../services/code-generator/index.js';
import { TailwindUSWDSService } from '../services/tailwind-uswds-service.js';
import { tools } from '../shared/tools/definitions.js';
import { handleToolCall, Services } from '../shared/tools/handlers.js';
import { config } from './config.js';
import { logger } from './logger.js';

/**
 * Initialize all services
 */
function initializeServices(): Services {
  logger.info('Initializing services...');

  const useReact = config.useReactComponents;

  const services: Services = {
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

  logger.info('Services initialized successfully');
  return services;
}

/**
 * Create MCP server for stdio transport
 */
export function createMCPServer(): Server {
  const services = initializeServices();

  const server = new Server(
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

  // Register tool handlers
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    logger.debug('Listing tools');
    return { tools };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    logger.info(`Tool called: ${name}`);
    logger.debug('Tool arguments:', args);

    try {
      const result = await handleToolCall(name, args, services);

      logger.debug(`Tool ${name} completed successfully`);

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

  return server;
}
