/**
 * AWS Lambda Handler for USWDS MCP Server
 *
 * This handler implements the MCP Streamable HTTP transport for serverless deployment.
 * It wraps the existing MCP server logic and exposes it via Lambda Function URL.
 *
 * Key Features:
 * - Streamable HTTP transport (MCP spec 2025-03-26)
 * - Multi-layer caching (memory + /tmp)
 * - API key authentication
 * - CloudWatch logging
 * - Response streaming
 *
 * Architecture:
 * Client → Lambda Function URL → This Handler → MCP Server → Services → Response
 *
 * Environment Variables:
 * - API_KEY: Optional API key for authentication (recommended for production)
 * - USE_REACT_COMPONENTS: Use React-USWDS components (default: false)
 * - LOG_LEVEL: Logging level (default: info)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ComponentService } from './services/component-service.js';
import { DesignTokenService } from './services/design-token-service.js';
import { ValidationService } from './services/validation-service.js';
import { ColorContrastService } from './services/color-contrast-service.js';
import { IconService } from './services/icon-service.js';
import { LayoutService } from './services/layout-service.js';
import { SuggestionService } from './services/suggestion-service.js';
import { ComparisonService } from './services/comparison-service.js';
import { CodeGeneratorService } from './services/code-generator-service.js';
import { TailwindUSWDSService } from './services/tailwind-uswds-service.js';
import { globalCache } from './services/lambda-cache-service.js';
import { rateLimiter } from './middleware/rate-limiter.js';

// Lambda types (simplified - add @types/aws-lambda for full types)
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
  functionVersion: string;
  memoryLimitInMB: string;
  getRemainingTimeInMillis: () => number;
}

interface LambdaResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}

// ===== Configuration =====

const USE_REACT_COMPONENTS = process.env.USE_REACT_COMPONENTS === 'true';
const API_KEY = process.env.API_KEY; // Optional - set via SST secrets
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// ===== Logger =====

const logger = {
  info: (...args: any[]) => console.log('[INFO]', ...args),
  error: (...args: any[]) => console.error('[ERROR]', ...args),
  warn: (...args: any[]) => console.warn('[WARN]', ...args),
  debug: (...args: any[]) => LOG_LEVEL === 'debug' ? console.log('[DEBUG]', ...args) : undefined,
};

// ===== Service Initialization (Global - persists across warm starts) =====

let servicesInitialized = false;
let componentService: ComponentService;
let designTokenService: DesignTokenService;
let validationService: ValidationService;
let colorContrastService: ColorContrastService;
let iconService: IconService;
let layoutService: LayoutService;
let suggestionService: SuggestionService;
let comparisonService: ComparisonService;
let codeGeneratorService: CodeGeneratorService;
let tailwindUSWDSService: TailwindUSWDSService;
let mcpServer: Server;

function initializeServices() {
  if (servicesInitialized) {
    logger.debug('Services already initialized (warm start)');
    return;
  }

  logger.info('Initializing services...');

  componentService = new ComponentService(USE_REACT_COMPONENTS);
  designTokenService = new DesignTokenService();
  validationService = new ValidationService();
  colorContrastService = new ColorContrastService();
  iconService = new IconService();
  layoutService = new LayoutService(USE_REACT_COMPONENTS);
  suggestionService = new SuggestionService(USE_REACT_COMPONENTS);
  comparisonService = new ComparisonService(USE_REACT_COMPONENTS);
  codeGeneratorService = new CodeGeneratorService(USE_REACT_COMPONENTS);
  tailwindUSWDSService = new TailwindUSWDSService();

  servicesInitialized = true;
  logger.info('Services initialized successfully');
}

// ===== MCP Server Setup =====

// Define tools (same as stdio version) - shared across all instances
const tools: Tool[] = [
    {
      name: 'list_components',
      description: `List all available ${USE_REACT_COMPONENTS ? 'React-USWDS' : 'USWDS'} components with descriptions`,
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Filter by category (e.g., "forms", "navigation", "all")',
            enum: ['all', 'forms', 'navigation', 'layout', 'content', 'ui'],
          },
        },
      },
    },
    {
      name: 'get_component_info',
      description: `Get detailed information about a specific ${USE_REACT_COMPONENTS ? 'React-USWDS' : 'USWDS'} component`,
      inputSchema: {
        type: 'object',
        properties: {
          component_name: { type: 'string', description: 'Component name' },
          include_examples: { type: 'boolean', default: true },
        },
        required: ['component_name'],
      },
    },
    {
      name: 'get_design_tokens',
      description: 'Get USWDS design tokens',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['all', 'color', 'spacing', 'typography', 'breakpoints'],
          },
        },
      },
    },
    {
      name: 'validate_uswds_code',
      description: 'Validate HTML/JSX code for USWDS patterns',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', description: 'HTML/JSX code' },
          framework: { type: 'string', enum: ['html', 'react'] },
        },
        required: ['code'],
      },
    },
    {
      name: 'check_color_contrast',
      description: 'Check WCAG color contrast ratios',
      inputSchema: {
        type: 'object',
        properties: {
          foreground: { type: 'string', description: 'Foreground color' },
          background: { type: 'string', description: 'Background color' },
        },
        required: ['foreground', 'background'],
      },
    },
    {
      name: 'search_icons',
      description: 'Search USWDS icons',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search query' },
        },
      },
    },
    {
      name: 'suggest_layout',
      description: 'Suggest USWDS layout patterns',
      inputSchema: {
        type: 'object',
        properties: {
          page_type: { type: 'string', description: 'Page type' },
        },
        required: ['page_type'],
      },
    },
    {
      name: 'suggest_components',
      description: 'Suggest components for a use case',
      inputSchema: {
        type: 'object',
        properties: {
          use_case: { type: 'string', description: 'Use case description' },
        },
        required: ['use_case'],
      },
    },
    {
      name: 'compare_components',
      description: 'Compare similar components',
      inputSchema: {
        type: 'object',
        properties: {
          components: { type: 'array', items: { type: 'string' } },
        },
        required: ['components'],
      },
    },
    {
      name: 'generate_component_code',
      description: 'Generate component code',
      inputSchema: {
        type: 'object',
        properties: {
          component_name: { type: 'string' },
          props: { type: 'object' },
          framework: { type: 'string', enum: ['html', 'react'] },
        },
        required: ['component_name'],
      },
    },
    // Tailwind USWDS tools
    {
      name: 'get_tailwind_uswds_getting_started',
      description: 'Get Tailwind + USWDS getting started guide',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_tailwind_uswds_component',
      description: 'Get Tailwind + USWDS component documentation',
      inputSchema: {
        type: 'object',
        properties: {
          component_name: { type: 'string' },
        },
      },
    },
    {
      name: 'get_tailwind_uswds_javascript',
      description: 'Get Tailwind + USWDS JavaScript documentation',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_tailwind_uswds_colors',
      description: 'Get Tailwind + USWDS color utilities',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_tailwind_uswds_icons',
      description: 'Get Tailwind + USWDS icon documentation',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_tailwind_uswds_typography',
      description: 'Get Tailwind + USWDS typography documentation',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'search_tailwind_uswds_docs',
      description: 'Search Tailwind + USWDS documentation',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
        },
        required: ['query'],
      },
    },
  ];

function getMCPServer(): Server {
  if (mcpServer) {
    return mcpServer;
  }

  initializeServices();

  mcpServer = new Server(
    {
      name: 'uswds-mcp-server',
      version: '0.2.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Register tool handlers
  mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    logger.info(`Tool called: ${name}`, args);

    try {
      let result;

      const toolArgs = args as any; // Type assertion for flexibility

      switch (name) {
        case 'list_components':
          result = await componentService.listComponents(toolArgs?.category || 'all');
          break;

        case 'get_component_info':
          result = await componentService.getComponentInfo(
            toolArgs?.component_name as string,
            toolArgs?.include_examples !== false
          );
          break;

        case 'get_design_tokens':
          result = await designTokenService.getTokens(toolArgs?.category || 'all');
          break;

        case 'validate_uswds_code':
          result = await validationService.validate(
            toolArgs?.code as string,
            toolArgs?.framework === 'react',
            true // checkAccessibility
          );
          break;

        case 'check_color_contrast':
          result = await colorContrastService.checkContrast(
            toolArgs?.foreground as string,
            toolArgs?.background as string
          );
          break;

        case 'search_icons':
          result = await iconService.getIcons(undefined, toolArgs?.query as string);
          break;

        case 'suggest_layout':
          result = await layoutService.suggestLayout(toolArgs?.page_type as string);
          break;

        case 'suggest_components':
          result = await suggestionService.suggestComponents(toolArgs?.use_case as string);
          break;

        case 'compare_components':
          const components = toolArgs?.components as string[];
          result = await comparisonService.compareComponents(
            components?.[0] || '',
            components?.[1] || ''
          );
          break;

        case 'generate_component_code':
          result = await codeGeneratorService.generateComponent(
            toolArgs?.component_name as string,
            {
              props: toolArgs?.props,
              framework: toolArgs?.framework as string,
            }
          );
          break;

        // Tailwind USWDS tools
        case 'get_tailwind_uswds_getting_started':
          result = await tailwindUSWDSService.getGettingStarted();
          break;

        case 'get_tailwind_uswds_component':
          result = await tailwindUSWDSService.getComponentDocs(toolArgs?.component_name as string);
          break;

        case 'get_tailwind_uswds_javascript':
          result = await tailwindUSWDSService.getJavaScriptDocs();
          break;

        case 'get_tailwind_uswds_colors':
          result = await tailwindUSWDSService.getColorsDocs();
          break;

        case 'get_tailwind_uswds_icons':
          result = await tailwindUSWDSService.getIconsDocs();
          break;

        case 'get_tailwind_uswds_typography':
          result = await tailwindUSWDSService.getTypographyDocs();
          break;

        case 'search_tailwind_uswds_docs':
          result = await tailwindUSWDSService.searchDocs(toolArgs?.query as string);
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

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

// ===== Authentication =====

function authenticate(event: LambdaEvent): { authenticated: boolean; apiKey?: string } {
  // If no API_KEY is configured, allow all requests
  if (!API_KEY) {
    logger.debug('No API key configured - allowing request');
    return { authenticated: true, apiKey: 'anonymous' };
  }

  // Check Authorization header
  const authHeader = event.headers['authorization'] || event.headers['Authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    if (token === API_KEY) {
      logger.debug('API key authentication successful');
      return { authenticated: true, apiKey: token };
    }
  }

  // Check x-api-key header
  const apiKeyHeader = event.headers['x-api-key'] || event.headers['X-Api-Key'];
  if (apiKeyHeader === API_KEY) {
    logger.debug('API key authentication successful');
    return { authenticated: true, apiKey: apiKeyHeader };
  }

  logger.warn('Authentication failed');
  return { authenticated: false };
}

// ===== Lambda Handler =====

export const handler = async (
  event: LambdaEvent,
  context: LambdaContext
): Promise<LambdaResponse> => {
  const startTime = Date.now();
  const requestId = context.requestId;

  logger.info(`Request: ${requestId}`, {
    method: event.requestContext.http.method,
    path: event.requestContext.http.path,
  });

  // Health check endpoint
  if (event.requestContext.http.path === '/health') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'healthy',
        version: '0.2.0',
        timestamp: new Date().toISOString(),
        cache: globalCache.getStats(),
        rateLimit: rateLimiter.getStats(),
      }),
    };
  }

  // Authentication
  const auth = authenticate(event);
  if (!auth.authenticated) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  const apiKey = auth.apiKey!;

  // Rate limiting
  const rateLimit = rateLimiter.check(apiKey);
  if (!rateLimit.allowed) {
    logger.warn(`Rate limit exceeded for API key: ${apiKey.substring(0, 8)}...`, {
      limitType: rateLimit.limitType,
      retryAfter: rateLimit.retryAfter,
    });

    return {
      statusCode: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': rateLimit.limitType === 'minute' ? '100' : '10000',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(rateLimit.retryAfter),
        'Retry-After': String(rateLimit.retryAfter),
      },
      body: JSON.stringify({
        error: 'Too Many Requests',
        message: `Rate limit exceeded. You can make ${rateLimit.limitType === 'minute' ? '100 requests per minute' : '10,000 requests per day'}. Try again in ${rateLimit.retryAfter} seconds.`,
        retryAfter: rateLimit.retryAfter,
      }),
    };
  }

  // Handle MCP request
  let body: any;
  try {
    body = event.body ? JSON.parse(event.body) : {};

    // Validate JSON-RPC request
    if (body.jsonrpc !== '2.0') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: body.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request: jsonrpc must be "2.0"',
          },
        }),
      };
    }

    if (!body.method || typeof body.method !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: body.id || null,
          error: {
            code: -32600,
            message: 'Invalid Request: method is required',
          },
        }),
      };
    }

    const server = getMCPServer();
    let result;

    // Route to appropriate MCP handler
    if (body.method === 'tools/list') {
      // List available tools
      const handler = (server as any)._requestHandlers?.get(ListToolsRequestSchema);
      if (handler) {
        result = await handler(body);
      } else {
        result = { tools };
      }
    } else if (body.method === 'tools/call') {
      // Call a specific tool
      const handler = (server as any)._requestHandlers?.get(CallToolRequestSchema);
      if (handler) {
        result = await handler(body);
      } else {
        throw new Error('Tool call handler not found');
      }
    } else {
      // Unsupported method
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: body.id,
          error: {
            code: -32601,
            message: `Method not found: ${body.method}`,
          },
        }),
      };
    }

    const duration = Date.now() - startTime;
    logger.info(`Response: ${requestId}`, {
      statusCode: 200,
      duration,
      method: body.method,
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': requestId,
        'X-Processing-Time': `${duration}ms`,
        'X-RateLimit-Limit': '100',
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-RateLimit-Reset': String(Math.ceil(rateLimit.resetIn / 1000)),
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: body.id,
        result: result,
      }),
    };
  } catch (error) {
    logger.error(`Request failed: ${requestId}`, error);

    // Distinguish between different error types
    let statusCode = 500;
    let errorCode = -32603; // Internal error
    let errorMessage = 'Internal Server Error';

    if (error instanceof SyntaxError) {
      statusCode = 400;
      errorCode = -32700;
      errorMessage = 'Parse error: Invalid JSON';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: body?.id || null,
        error: {
          code: errorCode,
          message: errorMessage,
          data: {
            requestId,
            stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined,
          },
        },
      }),
    };
  }
};
