/**
 * MCP Tool Definitions
 *
 * Defines all available MCP tools and their input schemas.
 * Shared across Lambda and stdio transports.
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  {
    name: 'list_components',
    description: 'List all available USWDS components with descriptions. Supports React-USWDS, vanilla USWDS, and Tailwind USWDS.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (e.g., "forms", "navigation", "all")',
          enum: ['all', 'forms', 'navigation', 'layout', 'content', 'ui'],
        },
        framework: {
          type: 'string',
          description: 'Component framework: "react" for React-USWDS, "vanilla" for standard USWDS HTML, "tailwind" for Tailwind USWDS. Defaults to server configuration if not specified.',
          enum: ['react', 'vanilla', 'tailwind'],
        },
      },
    },
  },
  {
    name: 'get_component_info',
    description: 'Get detailed information about a specific USWDS component. Supports React-USWDS, vanilla USWDS, and Tailwind USWDS.',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: { type: 'string', description: 'Component name' },
        include_examples: { type: 'boolean', default: true },
        framework: {
          type: 'string',
          description: 'Component framework: "react" for React-USWDS, "vanilla" for standard USWDS HTML, "tailwind" for Tailwind USWDS. Defaults to server configuration if not specified.',
          enum: ['react', 'vanilla', 'tailwind'],
        },
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
        framework: {
          type: 'string',
          description: 'Framework/syntax: "react" for React, "vanilla" for HTML, "tailwind" for Tailwind. Defaults to server configuration if not specified.',
          enum: ['react', 'vanilla', 'tailwind']
        },
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
        framework: {
          type: 'string',
          description: 'Framework/syntax: "react" for React-USWDS, "vanilla" for vanilla USWDS, "tailwind" for Tailwind USWDS. Defaults to server configuration if not specified.',
          enum: ['react', 'vanilla', 'tailwind']
        },
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
        framework: {
          type: 'string',
          description: 'Framework/syntax: "react" for React-USWDS, "vanilla" for vanilla USWDS, "tailwind" for Tailwind USWDS. Defaults to server configuration if not specified.',
          enum: ['react', 'vanilla', 'tailwind']
        },
      },
      required: ['components'],
    },
  },
  {
    name: 'generate_component_code',
    description: 'Generate component code for USWDS components. Supports React, vanilla HTML, and Tailwind CSS.',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: { type: 'string', description: 'Name of the component to generate' },
        props: { type: 'object', description: 'Component properties/configuration' },
        framework: {
          type: 'string',
          description: 'Framework/syntax: "react" for React-USWDS, "html" for vanilla USWDS HTML, "tailwind" for Tailwind USWDS. Defaults to server configuration if not specified.',
          enum: ['html', 'react', 'tailwind'],
        },
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
