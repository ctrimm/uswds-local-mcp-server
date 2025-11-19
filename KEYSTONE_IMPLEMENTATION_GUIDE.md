# Keystone Design System MCP Server - Implementation Guide for AI Agents

## Context

This document provides complete instructions for implementing a Keystone Design System MCP server alongside the existing USWDS MCP server in the `uswds-local-mcp-server` repository.

**What is Keystone?**
- Pennsylvania's official design system
- Government design system similar to USWDS but for Pennsylvania state government
- Components: https://components.pa.gov
- Documentation: https://wcmauthorguide.pa.gov/en/keystone-design-system/

**Goal:**
Create a standalone MCP server that provides 8 tools for working with Keystone Design System components, color tokens, accessibility guidelines, and validation.

## Repository Structure

Branch: `claude/keystone-design-system-mcp-tools` (or similar)

Files to create:
```
src/
├── keystone/
│   ├── index.ts                  # Main exports
│   ├── components.ts             # Component data structure
│   ├── color-tokens.ts          # Color token definitions
│   └── keystone-service.ts      # Service implementation
├── keystone-index.ts             # MCP server entry point
KEYSTONE_SETUP.md                 # Setup documentation
KEYSTONE_TODO.md                  # Data population guide
package.json                      # Update with Keystone scripts
```

## File 1: src/keystone/components.ts

**Purpose:** Component data structure and management functions

```typescript
// Keystone Design System Component Data
// Pennsylvania's official design system
// Source: https://components.pa.gov

export interface KeystoneComponent {
  name: string;
  category: string;
  description: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  props?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue?: string;
  }[];
  examples?: {
    title: string;
    code: string;
    description?: string;
  }[];
  accessibility?: {
    keyboardSupport?: string;
    ariaLabels?: string[];
    screenReaderNotes?: string;
  };
  relatedComponents?: string[];
  storybookUrl?: string;
}

// TODO: Populate with actual Keystone components from Storybook
// Categories typically include:
// - Forms
// - Navigation
// - Layout
// - Content
// - UI/Feedback
// - Data Display

export const keystoneComponents: KeystoneComponent[] = [
  // FORMS
  {
    name: 'Button',
    category: 'forms',
    description: 'Primary action button following Pennsylvania design standards',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-button--docs',
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'tertiary' | 'outline'",
        required: false,
        description: 'Button style variant',
        defaultValue: 'primary',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        required: false,
        description: 'Button size',
        defaultValue: 'medium',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Whether button is disabled',
        defaultValue: 'false',
      },
    ],
    examples: [
      {
        title: 'Primary Button',
        code: `<button class="pa-button pa-button--primary">
  Click me
</button>`,
      },
    ],
    accessibility: {
      keyboardSupport: 'Activates with Enter or Space keys',
      ariaLabels: ['Descriptive button text required'],
      screenReaderNotes: 'Button purpose should be clear from text alone',
    },
  },

  // Add more components here as we gather them
];

export function getKeystoneComponent(name: string): KeystoneComponent | undefined {
  return keystoneComponents.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function listKeystoneComponents(category?: string): KeystoneComponent[] {
  if (!category || category === 'all') {
    return keystoneComponents;
  }
  return keystoneComponents.filter((c) => c.category === category);
}

export function getKeystoneCategories(): string[] {
  const categories = new Set(keystoneComponents.map((c) => c.category));
  return Array.from(categories).sort();
}
```

## File 2: src/keystone/color-tokens.ts

**Purpose:** Color token definitions and management

```typescript
// Keystone Design System Color Tokens
// Source: https://wcmauthorguide.pa.gov/en/keystone-design-system/foundations/color.html

export interface ColorToken {
  name: string;
  value: string;
  category: string;
  usage: string;
  contrastRatio?: number;
  wcagCompliant?: boolean;
}

export const keystoneColorTokens: ColorToken[] = [
  // TODO: Populate with actual Keystone color tokens
  // These are typical categories for government design systems:

  // PRIMARY COLORS
  {
    name: 'pa-blue',
    value: '#003F87', // Pennsylvania blue (placeholder)
    category: 'primary',
    usage: 'Primary brand color, used for key UI elements',
    wcagCompliant: true,
  },

  // SECONDARY COLORS
  {
    name: 'pa-yellow',
    value: '#FFB81C', // Pennsylvania yellow/gold (placeholder)
    category: 'secondary',
    usage: 'Secondary brand color, used for accents',
    wcagCompliant: true,
  },

  // NEUTRAL COLORS
  {
    name: 'gray-900',
    value: '#1B1B1B',
    category: 'neutral',
    usage: 'Primary text color',
    wcagCompliant: true,
  },
  {
    name: 'gray-700',
    value: '#3D3D3D',
    category: 'neutral',
    usage: 'Secondary text color',
    wcagCompliant: true,
  },
  {
    name: 'gray-500',
    value: '#757575',
    category: 'neutral',
    usage: 'Disabled text, placeholders',
    wcagCompliant: false,
  },
  {
    name: 'gray-300',
    value: '#C4C4C4',
    category: 'neutral',
    usage: 'Borders, dividers',
    wcagCompliant: false,
  },
  {
    name: 'gray-100',
    value: '#F5F5F5',
    category: 'neutral',
    usage: 'Background, surfaces',
    wcagCompliant: false,
  },

  // SEMANTIC COLORS
  {
    name: 'success-green',
    value: '#2E7D32',
    category: 'semantic',
    usage: 'Success messages, positive actions',
    wcagCompliant: true,
  },
  {
    name: 'error-red',
    value: '#C62828',
    category: 'semantic',
    usage: 'Error messages, destructive actions',
    wcagCompliant: true,
  },
  {
    name: 'warning-orange',
    value: '#F57C00',
    category: 'semantic',
    usage: 'Warning messages',
    wcagCompliant: true,
  },
  {
    name: 'info-blue',
    value: '#0277BD',
    category: 'semantic',
    usage: 'Informational messages',
    wcagCompliant: true,
  },
];

export function getKeystoneColorToken(name: string): ColorToken | undefined {
  return keystoneColorTokens.find(
    (token) => token.name.toLowerCase() === name.toLowerCase()
  );
}

export function listKeystoneColorTokens(category?: string): ColorToken[] {
  if (!category || category === 'all') {
    return keystoneColorTokens;
  }
  return keystoneColorTokens.filter((token) => token.category === category);
}

export function getKeystoneColorCategories(): string[] {
  const categories = new Set(keystoneColorTokens.map((token) => token.category));
  return Array.from(categories).sort();
}
```

## File 3: src/keystone/keystone-service.ts

**Purpose:** Service layer implementing all business logic for MCP tools

```typescript
// Keystone Design System MCP Service
// Provides MCP tools for Pennsylvania's Keystone Design System

import {
  getKeystoneComponent,
  listKeystoneComponents,
  getKeystoneCategories,
  type KeystoneComponent,
} from './components.js';
import {
  getKeystoneColorToken,
  listKeystoneColorTokens,
  getKeystoneColorCategories,
  type ColorToken,
} from './color-tokens.js';

export class KeystoneService {
  /**
   * List all Keystone components
   */
  listComponents(category?: string): {
    components: KeystoneComponent[];
    categories: string[];
    total: number;
  } {
    const components = listKeystoneComponents(category);
    const categories = getKeystoneCategories();

    return {
      components,
      categories,
      total: components.length,
    };
  }

  /**
   * Get detailed information about a specific component
   */
  getComponentInfo(componentName: string, includeExamples: boolean = true): {
    component: KeystoneComponent | null;
    error?: string;
  } {
    const component = getKeystoneComponent(componentName);

    if (!component) {
      return {
        component: null,
        error: `Component "${componentName}" not found in Keystone Design System`,
      };
    }

    // Optionally remove examples if not requested
    if (!includeExamples && component.examples) {
      const { examples, ...componentWithoutExamples } = component;
      return { component: componentWithoutExamples as KeystoneComponent };
    }

    return { component };
  }

  /**
   * Get design tokens (colors, spacing, typography, etc.)
   */
  getDesignTokens(category?: string): {
    tokens: ColorToken[];
    categories: string[];
    total: number;
  } {
    const tokens = listKeystoneColorTokens(category);
    const categories = getKeystoneColorCategories();

    return {
      tokens,
      categories,
      total: tokens.length,
    };
  }

  /**
   * Get accessibility guidelines for Keystone components
   */
  getAccessibilityGuidelines(componentName?: string): {
    guidelines: any;
    wcagLevel: string;
  } {
    if (componentName) {
      const component = getKeystoneComponent(componentName);
      if (component) {
        return {
          guidelines: component.accessibility || {},
          wcagLevel: component.wcagLevel,
        };
      }
    }

    // General accessibility guidelines
    return {
      guidelines: {
        general: [
          'All components must meet WCAG 2.1 AA standards',
          'Color contrast ratios must be at least 4.5:1 for normal text',
          'Interactive elements must be keyboard accessible',
          'Form inputs must have associated labels',
          'Images must have alt text',
          'Page structure must use semantic HTML',
        ],
        resources: [
          'https://wcmauthorguide.pa.gov/en/accessibility-best-practices.html',
          'https://www.w3.org/WAI/WCAG21/quickref/',
        ],
      },
      wcagLevel: 'AA',
    };
  }

  /**
   * Search components by keyword
   */
  searchComponents(keyword: string): {
    results: KeystoneComponent[];
    query: string;
    total: number;
  } {
    const lowerKeyword = keyword.toLowerCase();
    const allComponents = listKeystoneComponents();

    const results = allComponents.filter(
      (component) =>
        component.name.toLowerCase().includes(lowerKeyword) ||
        component.description.toLowerCase().includes(lowerKeyword) ||
        component.category.toLowerCase().includes(lowerKeyword)
    );

    return {
      results,
      query: keyword,
      total: results.length,
    };
  }

  /**
   * Get component examples with code
   */
  getComponentExamples(componentName: string): {
    examples: any[];
    error?: string;
  } {
    const component = getKeystoneComponent(componentName);

    if (!component) {
      return {
        examples: [],
        error: `Component "${componentName}" not found`,
      };
    }

    return {
      examples: component.examples || [],
    };
  }

  /**
   * Get style guide information
   */
  getStyleGuide(): {
    principles: string[];
    resources: string[];
  } {
    return {
      principles: [
        'Use Pennsylvania brand colors consistently',
        'Maintain WCAG AA accessibility standards',
        'Use clear, concise language',
        'Ensure mobile-first responsive design',
        'Follow semantic HTML structure',
        'Provide clear error messages and validation',
      ],
      resources: [
        'https://wcmauthorguide.pa.gov/en/style-guide.html',
        'https://wcmauthorguide.pa.gov/en/keystone-design-system/getting-started.html',
        'https://components.pa.gov',
      ],
    };
  }

  /**
   * Validate Keystone component usage
   */
  validateComponent(code: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Basic validation checks
    // TODO: Implement more sophisticated validation

    // Check for Pennsylvania class prefixes
    if (!code.includes('pa-') && !code.includes('keystone-')) {
      warnings.push(
        'No Keystone Design System class prefixes found (pa- or keystone-)'
      );
    }

    // Check for accessibility attributes
    if (code.includes('<button') && !code.includes('aria-')) {
      suggestions.push('Consider adding ARIA labels for better accessibility');
    }

    if (code.includes('<img') && !code.includes('alt=')) {
      errors.push('Images must have alt attributes for accessibility');
    }

    const valid = errors.length === 0;

    return {
      valid,
      errors,
      warnings,
      suggestions,
    };
  }
}
```

## File 4: src/keystone/index.ts

**Purpose:** Main module exports

```typescript
// Keystone Design System - Main Export
export { KeystoneService } from './keystone-service.js';
export { keystoneComponents, getKeystoneComponent, listKeystoneComponents } from './components.js';
export { keystoneColorTokens, getKeystoneColorToken, listKeystoneColorTokens } from './color-tokens.js';
export type { KeystoneComponent } from './components.js';
export type { ColorToken } from './color-tokens.js';
```

## File 5: src/keystone-index.ts

**Purpose:** MCP server entry point with all 8 tools

```typescript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { KeystoneService } from './keystone/keystone-service.js';

// Initialize Keystone service
const keystoneService = new KeystoneService();

// Create MCP server
const server = new Server(
  {
    name: 'keystone-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools for Keystone Design System
const tools: Tool[] = [
  {
    name: 'list_keystone_components',
    description: 'List all available Keystone Design System components with descriptions',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (e.g., "forms", "navigation", "all")',
        },
      },
    },
  },
  {
    name: 'get_keystone_component',
    description: 'Get detailed information about a specific Keystone component including props, examples, and accessibility guidance',
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
    name: 'get_keystone_design_tokens',
    description: 'Get Keystone design tokens for colors, spacing, typography, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Token category to retrieve (all, primary, secondary, neutral, semantic)',
        },
      },
    },
  },
  {
    name: 'search_keystone_components',
    description: 'Search Keystone components by keyword',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: 'Keyword to search for in component names, descriptions, or categories',
        },
      },
      required: ['keyword'],
    },
  },
  {
    name: 'get_keystone_accessibility_guidelines',
    description: 'Get accessibility guidelines for Keystone components',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Optional: Get accessibility guidelines for a specific component',
        },
      },
    },
  },
  {
    name: 'validate_keystone_code',
    description: 'Validate HTML code for Keystone Design System patterns and accessibility',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'HTML code to validate',
        },
      },
      required: ['code'],
    },
  },
  {
    name: 'get_keystone_style_guide',
    description: 'Get Keystone Design System style guide and principles',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_keystone_component_examples',
    description: 'Get code examples for a specific Keystone component',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Name of the component',
        },
      },
      required: ['component_name'],
    },
  },
];

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_keystone_components': {
        const result = keystoneService.listComponents(args?.category as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_component': {
        const result = keystoneService.getComponentInfo(
          args?.component_name as string,
          args?.include_examples !== false
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_design_tokens': {
        const result = keystoneService.getDesignTokens(args?.category as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_keystone_components': {
        const result = keystoneService.searchComponents(args?.keyword as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_accessibility_guidelines': {
        const result = keystoneService.getAccessibilityGuidelines(
          args?.component_name as string
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate_keystone_code': {
        const result = keystoneService.validateComponent(args?.code as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_style_guide': {
        const result = keystoneService.getStyleGuide();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_component_examples': {
        const result = keystoneService.getComponentExamples(
          args?.component_name as string
        );
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
  } catch (error: unknown) {
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

// Start the server
async function main() {
  console.error('Keystone MCP Server starting...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Keystone MCP Server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

## File 6: package.json Updates

**Purpose:** Add Keystone scripts and bin entry

**Changes to make:**

1. Add to `bin` section:
```json
"bin": {
  "uswds-mcp": "./dist/index.js",
  "keystone-mcp": "./dist/keystone-index.js"
},
```

2. Add to `scripts` section:
```json
"dev:keystone": "tsc && node dist/keystone-index.js",
"inspector:keystone": "npx @modelcontextprotocol/inspector dist/keystone-index.js",
```

3. Add to `keywords`:
```json
"keystone",
"keystone-design-system",
"pennsylvania",
"state",
```

## Implementation Steps

1. **Create branch:**
   ```bash
   git checkout -b claude/keystone-design-system-mcp-tools
   ```

2. **Create directory structure:**
   ```bash
   mkdir -p src/keystone
   ```

3. **Create all files** listed above with the exact content

4. **Update package.json** with the changes listed

5. **Build to verify:**
   ```bash
   npm run build
   ```

6. **Test with inspector:**
   ```bash
   npm run inspector:keystone
   ```

7. **Commit:**
   ```bash
   git add .
   git commit -m "feat: Add Keystone Design System MCP server"
   ```

## Key Features Implemented

✅ 8 MCP Tools:
1. list_keystone_components
2. get_keystone_component
3. get_keystone_design_tokens
4. search_keystone_components
5. get_keystone_accessibility_guidelines
6. validate_keystone_code
7. get_keystone_style_guide
8. get_keystone_component_examples

✅ TypeScript with full type safety
✅ Service layer pattern
✅ Data structures ready for population
✅ Accessibility-first approach
✅ Pennsylvania-specific branding

## Data Population Needed

The structure is complete but needs real data from:
- https://components.pa.gov - Component details
- https://wcmauthorguide.pa.gov/en/keystone-design-system/foundations/color.html - Color tokens

See KEYSTONE_TODO.md for detailed population guide.

## Claude Desktop Configuration

```json
{
  "mcpServers": {
    "keystone": {
      "command": "/path/to/node20/bin/node",
      "args": ["/path/to/dist/keystone-index.js"]
    }
  }
}
```

## Success Criteria

- ✅ All 8 tools respond successfully
- ✅ TypeScript compiles without errors
- ✅ Server starts in MCP Inspector
- ✅ Can run alongside USWDS server
- ✅ Documentation is complete

---

**End of Implementation Guide**
