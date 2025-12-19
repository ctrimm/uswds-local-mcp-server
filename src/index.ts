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
import { ColorContrastService } from './services/color-contrast-service.js';
import { IconService } from './services/icon-service.js';
import { LayoutService } from './services/layout-service.js';
import { SuggestionService } from './services/suggestion-service.js';
import { ComparisonService } from './services/comparison-service.js';
import { CodeGeneratorService } from './services/code-generator-service.js';
import { TailwindUSWDSService } from './services/tailwind-uswds-service.js';

// Server configuration
const USE_REACT_COMPONENTS = process.env.USE_REACT_COMPONENTS === 'true';

// Initialize services
const componentService = new ComponentService(USE_REACT_COMPONENTS);
const designTokenService = new DesignTokenService();
const validationService = new ValidationService();
const colorContrastService = new ColorContrastService();
const iconService = new IconService();
const layoutService = new LayoutService(USE_REACT_COMPONENTS);
const suggestionService = new SuggestionService(USE_REACT_COMPONENTS);
const comparisonService = new ComparisonService(USE_REACT_COMPONENTS);
const codeGeneratorService = new CodeGeneratorService(USE_REACT_COMPONENTS);
const tailwindUSWDSService = new TailwindUSWDSService();

// Create MCP server
const server = new Server(
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
  {
    name: 'list_page_templates',
    description: `List available React-USWDS page templates for quick prototyping (only available in React mode)`,
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (e.g., "authentication", "forms", "all")',
          enum: ['all', 'authentication', 'marketing', 'content', 'forms', 'error'],
        },
      },
    },
  },
  {
    name: 'get_page_template',
    description: `Get full code and details for a specific React-USWDS page template (only available in React mode)`,
    inputSchema: {
      type: 'object',
      properties: {
        template_name: {
          type: 'string',
          description: 'Name or slug of the template (e.g., "Sign In", "sign-in", "Landing Page")',
        },
      },
      required: ['template_name'],
    },
  },
  {
    name: 'check_color_contrast',
    description: 'Check WCAG color contrast ratio between two colors for accessibility compliance',
    inputSchema: {
      type: 'object',
      properties: {
        foreground: {
          type: 'string',
          description: 'Foreground color (hex, rgb, or named color)',
        },
        background: {
          type: 'string',
          description: 'Background color (hex, rgb, or named color)',
        },
        font_size: {
          type: 'number',
          description: 'Font size in pixels (optional, for text size category)',
        },
        font_weight: {
          type: 'string',
          description: 'Font weight (e.g., "normal", "bold", "700")',
        },
      },
      required: ['foreground', 'background'],
    },
  },
  {
    name: 'get_icons',
    description: 'Browse and search USWDS icons with usage examples',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category',
          enum: ['all', 'alerts', 'navigation', 'actions', 'communication', 'content', 'user', 'location', 'datetime', 'display', 'status'],
        },
        search: {
          type: 'string',
          description: 'Search icons by name or keywords',
        },
      },
    },
  },
  {
    name: 'get_layout_patterns',
    description: 'Get common layout patterns and recipes using USWDS Grid system',
    inputSchema: {
      type: 'object',
      properties: {
        layout_key: {
          type: 'string',
          description: 'Specific layout to retrieve (e.g., "sidebar-content", "card-grid", "dashboard")',
        },
      },
    },
  },
  {
    name: 'suggest_components',
    description: 'Get AI-assisted component recommendations based on use case description',
    inputSchema: {
      type: 'object',
      properties: {
        use_case: {
          type: 'string',
          description: 'Describe what you want to build (e.g., "show a success message", "collect user email")',
        },
      },
      required: ['use_case'],
    },
  },
  {
    name: 'compare_components',
    description: 'Compare two components side-by-side to understand their differences',
    inputSchema: {
      type: 'object',
      properties: {
        component1: {
          type: 'string',
          description: 'First component name',
        },
        component2: {
          type: 'string',
          description: 'Second component name',
        },
      },
      required: ['component1', 'component2'],
    },
  },
  {
    name: 'generate_component_code',
    description: 'Generate working code for a component based on requirements',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Component to generate (e.g., "Button", "Alert")',
        },
        requirements: {
          type: 'object',
          description: 'Component requirements as key-value pairs (e.g., {"type": "submit", "disabled": true})',
        },
      },
      required: ['component_name'],
    },
  },
  {
    name: 'generate_form',
    description: 'Generate a complete form with validation based on field specifications',
    inputSchema: {
      type: 'object',
      properties: {
        form_spec: {
          type: 'object',
          description: 'Form specification including formName, fields array, submitLabel',
        },
      },
      required: ['form_spec'],
    },
  },
  {
    name: 'generate_multi_step_form',
    description: 'Generate a multi-step wizard form with navigation and validation',
    inputSchema: {
      type: 'object',
      properties: {
        form_spec: {
          type: 'object',
          description: 'Multi-step form specification with formName, steps array, showProgress',
        },
      },
      required: ['form_spec'],
    },
  },
  {
    name: 'generate_data_table',
    description: 'Generate a data table with sorting, filtering, and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        table_spec: {
          type: 'object',
          description: 'Table specification with tableName, columns, enableSorting, enableFiltering, enablePagination',
        },
      },
      required: ['table_spec'],
    },
  },
  {
    name: 'generate_modal_dialog',
    description: 'Generate a modal dialog with focus management and accessibility',
    inputSchema: {
      type: 'object',
      properties: {
        modal_spec: {
          type: 'object',
          description: 'Modal specification with modalName, title, type, hasForm, actions',
        },
      },
      required: ['modal_spec'],
    },
  },
  {
    name: 'scaffold_project',
    description: 'Generate a complete USWDS project structure (Next.js, CRA, or Vite)',
    inputSchema: {
      type: 'object',
      properties: {
        project_spec: {
          type: 'object',
          description: 'Project specification with projectName, framework, includeExamples, includeAuth, includeTesting',
        },
      },
      required: ['project_spec'],
    },
  },
  {
    name: 'convert_html_to_react',
    description: 'Convert vanilla USWDS HTML to React-USWDS components. Supports fetching from URLs or converting provided HTML.',
    inputSchema: {
      type: 'object',
      properties: {
        conversion_spec: {
          type: 'object',
          description: 'Conversion specification with url (optional), html (optional), and componentName (optional)',
          properties: {
            url: {
              type: 'string',
              description: 'URL to fetch HTML from'
            },
            html: {
              type: 'string',
              description: 'HTML string to convert'
            },
            componentName: {
              type: 'string',
              description: 'Name for the generated React component (default: ConvertedComponent)'
            }
          }
        },
      },
      required: ['conversion_spec'],
    },
  },
  {
    name: 'get_tailwind_uswds_getting_started',
    description: 'Get the Getting Started guide for USWDS with Tailwind CSS integration',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_tailwind_uswds_component',
    description: 'Get Tailwind USWDS component documentation, including usage examples and Tailwind classes',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Name of the component (e.g., "accordion", "alert", "button"). Leave empty to list all components.',
        },
      },
    },
  },
  {
    name: 'get_tailwind_uswds_javascript',
    description: 'Get JavaScript documentation for USWDS with Tailwind CSS',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_tailwind_uswds_colors',
    description: 'Get colors documentation for USWDS with Tailwind CSS, including color palettes and Tailwind classes',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_tailwind_uswds_icons',
    description: 'Get icons documentation for USWDS with Tailwind CSS',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_tailwind_uswds_typography',
    description: 'Get typography documentation for USWDS with Tailwind CSS, including font families, sizes, and Tailwind classes',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'search_tailwind_uswds_docs',
    description: 'Search USWDS + Tailwind CSS documentation for specific topics, components, or patterns',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
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

      case 'list_page_templates': {
        const category = (args?.category as string) || 'all';
        const result = await componentService.listPageTemplates(category);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_page_template': {
        const templateName = args?.template_name as string;
        const result = await componentService.getPageTemplate(templateName);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'check_color_contrast': {
        const foreground = args?.foreground as string;
        const background = args?.background as string;
        const fontSize = args?.font_size as number | undefined;
        const fontWeight = args?.font_weight as string | undefined;
        const result = await colorContrastService.checkContrast(foreground, background, fontSize, fontWeight);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_icons': {
        const category = args?.category as string | undefined;
        const search = args?.search as string | undefined;
        const result = await iconService.getIcons(category, search);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_layout_patterns': {
        const layoutKey = args?.layout_key as string | undefined;
        const result = layoutKey
          ? await layoutService.getLayout(layoutKey)
          : await layoutService.getLayouts();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'suggest_components': {
        const useCase = args?.use_case as string;
        const result = await suggestionService.suggestComponents(useCase);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'compare_components': {
        const component1 = args?.component1 as string;
        const component2 = args?.component2 as string;
        const result = await comparisonService.compareComponents(component1, component2);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_component_code': {
        const componentName = args?.component_name as string;
        const requirements = (args?.requirements as any) || {};
        const result = await codeGeneratorService.generateComponent(componentName, requirements);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_form': {
        const formSpec = args?.form_spec as any;
        const result = await codeGeneratorService.generateForm(formSpec);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_multi_step_form': {
        const formSpec = args?.form_spec as any;
        const result = await codeGeneratorService.generateMultiStepForm(formSpec);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_data_table': {
        const tableSpec = args?.table_spec as any;
        const result = await codeGeneratorService.generateDataTable(tableSpec);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'generate_modal_dialog': {
        const modalSpec = args?.modal_spec as any;
        const result = await codeGeneratorService.generateModalDialog(modalSpec);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'scaffold_project': {
        const projectSpec = args?.project_spec as any;
        const result = await codeGeneratorService.scaffoldProject(projectSpec);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'convert_html_to_react': {
        const conversionSpec = args?.conversion_spec as any;
        const result = await codeGeneratorService.convertHtmlToReact(conversionSpec);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tailwind_uswds_getting_started': {
        const result = await tailwindUSWDSService.getGettingStarted();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tailwind_uswds_component': {
        const componentName = args?.component_name as string | undefined;
        const result = await tailwindUSWDSService.getComponentDocs(componentName);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tailwind_uswds_javascript': {
        const result = await tailwindUSWDSService.getJavaScriptDocs();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tailwind_uswds_colors': {
        const result = await tailwindUSWDSService.getColorsDocs();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tailwind_uswds_icons': {
        const result = await tailwindUSWDSService.getIconsDocs();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_tailwind_uswds_typography': {
        const result = await tailwindUSWDSService.getTypographyDocs();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_tailwind_uswds_docs': {
        const query = args?.query as string;
        const result = await tailwindUSWDSService.searchDocs(query);
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
