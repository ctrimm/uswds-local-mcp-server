#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { ComponentService } from './services/component-service.js';
import { DesignTokenService } from './services/design-token-service.js';
import { ValidationService } from './services/validation-service.js';

// Server configuration
const USE_REACT_COMPONENTS = process.env.USE_REACT_COMPONENTS === 'true';

// Initialize services
const componentService = new ComponentService(USE_REACT_COMPONENTS);
const designTokenService = new DesignTokenService();
const validationService = new ValidationService();

// Create MCP server
const server = new Server(
  {
    name: 'uswds-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
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
    description: `Get detailed information about a specific ${USE_REACT_COMPONENTS ? 'React-USWDS' : 'USWDS'} component including props, examples, and accessibility guidance`,
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Name of the component (e.g., "Button", "Alert", "TextInput")',
        },
        include_examples: {
          type: 'boolean',
          description: 'Include code examples',
          default: true,
        },
      },
      required: ['component_name'],
    },
  },
  {
    name: 'get_design_tokens',
    description: 'Get USWDS design tokens for colors, spacing, typography, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Token category to retrieve',
          enum: ['all', 'color', 'spacing', 'typography', 'breakpoints'],
        },
      },
    },
  },
  {
    name: 'validate_uswds_code',
    description: 'Validate HTML/JSX code for USWDS patterns, accessibility, and best practices',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'HTML or JSX code to validate',
        },
        check_accessibility: {
          type: 'boolean',
          description: 'Include accessibility checks',
          default: true,
        },
      },
      required: ['code'],
    },
  },
  {
    name: 'search_docs',
    description: 'Search USWDS documentation for components, patterns, and guidance',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
        doc_type: {
          type: 'string',
          description: 'Type of documentation to search',
          enum: ['all', 'components', 'patterns', 'utilities', 'design-tokens'],
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_accessibility_guidance',
    description: 'Get accessibility guidance for a specific component or pattern',
    inputSchema: {
      type: 'object',
      properties: {
        component_or_pattern: {
          type: 'string',
          description: 'Component or pattern name',
        },
      },
      required: ['component_or_pattern'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_components': {
        const category = (args?.category as string) || 'all';
        const result = await componentService.listComponents(category);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_component_info': {
        const componentName = args?.component_name as string;
        const includeExamples = args?.include_examples !== false;
        const result = await componentService.getComponentInfo(componentName, includeExamples);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_design_tokens': {
        const category = (args?.category as string) || 'all';
        const result = await designTokenService.getTokens(category);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate_uswds_code': {
        const code = args?.code as string;
        const checkAccessibility = args?.check_accessibility !== false;
        const result = await validationService.validate(code, USE_REACT_COMPONENTS, checkAccessibility);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_docs': {
        const query = args?.query as string;
        const docType = (args?.doc_type as string) || 'all';
        const result = await componentService.searchDocs(query, docType);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_accessibility_guidance': {
        const componentOrPattern = args?.component_or_pattern as string;
        const result = await componentService.getAccessibilityGuidance(componentOrPattern);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error(`USWDS MCP Server running in ${USE_REACT_COMPONENTS ? 'React' : 'Vanilla'} mode`);
  console.error('Available tools:', tools.map(t => t.name).join(', '));
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
