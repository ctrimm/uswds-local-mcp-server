# USWDS MCP Server

[![CI](https://github.com/ctrimm/uswds-local-mcp-server/workflows/CI/badge.svg)](https://github.com/ctrimm/uswds-local-mcp-server/actions)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

A Model Context Protocol (MCP) server that provides tools for working with the U.S. Web Design System (USWDS) and React-USWDS components. This server helps developers build accessible, compliant government websites faster by providing component information, design tokens, and validation tools.

## Features

### Core Features
- **Component Information**: Get detailed info about USWDS or React-USWDS components
- **Page Templates**: Access full-page React templates for quick prototyping (React mode only)
- **Design Tokens**: Access USWDS design tokens for colors, spacing, typography, and breakpoints
- **Code Validation**: Validate HTML/JSX for USWDS patterns and accessibility
- **React Support**: Toggle between vanilla USWDS and React-USWDS modes
- **Accessibility Guidance**: Get WCAG compliance guidance for components

### AI-Powered Tools
- **Component Suggestions**: Get AI-assisted recommendations based on your use case
- **Component Comparison**: Compare two components side-by-side to understand differences
- **Code Generation**: Generate working component code from requirements
- **Form Generation**: Scaffold complete forms with validation
- **Multi-Step Forms**: Generate wizard forms with navigation and progress indicators
- **Data Tables**: Generate tables with sorting, filtering, and pagination
- **Modal Dialogs**: Generate accessible modals with focus management
- **Project Scaffolding**: Generate complete Next.js/CRA/Vite project structure
- **HTML to React Conversion**: Convert vanilla USWDS HTML to React-USWDS components (from URLs or code)

### Developer Tools
- **Color Contrast Checker**: Validate WCAG color contrast ratios
- **Icon Browser**: Search and browse 90+ USWDS icons
- **Layout Patterns**: Access common layout recipes with USWDS Grid

## Installation

### Option 1: NPM Install (Recommended for Users)

Once published to NPM, users can install globally:

```bash
# Global installation
npm install -g uswds-mcp-server

# Or use npx (no installation required)
npx uswds-mcp-server
```

### Option 2: From Source (For Development)

**Prerequisites:**
- Node.js >=18.0.0 (check with `node --version`)

```bash
git clone https://github.com/ctrimm/uswds-local-mcp-server.git
cd uswds-local-mcp-server
npm install
npm run build
```

## Quick Start

### Using with Claude Desktop

Add to your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

#### If Installed via NPM (Recommended):

```json
{
  "mcpServers": {
    "uswds": {
      "command": "uswds-mcp",
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

#### If Using npx (No installation):

```json
{
  "mcpServers": {
    "uswds": {
      "command": "npx",
      "args": ["uswds-mcp-server"],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

#### If Installed from Source:

**⚠️ Important**: Replace `/ABSOLUTE/PATH/TO` with your actual project path!

**To find your path:**
```bash
cd uswds-local-mcp-server
pwd
# Copy the output and use it below
```

**Configuration:**
```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

**Example (macOS/Linux):**
```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/Users/yourusername/projects/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

**Example (Windows):**
```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["C:\\Users\\YourUsername\\projects\\uswds-local-mcp-server\\dist\\index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

### For React-USWDS Mode:

Simply change `USE_REACT_COMPONENTS` to `"true"` in any of the above configurations:

```json
{
  "mcpServers": {
    "uswds-react": {
      "command": "uswds-mcp",
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

### Testing with MCP Inspector

```bash
npm run inspector
```

## Troubleshooting

### "Cannot find module" Error

**Error Message:**
```
Error: Cannot find module '/path/to/dist/index.js'
```

**Solution:** You're using the placeholder path. Replace it with your actual absolute path:

1. Find your actual path:
```bash
cd uswds-local-mcp-server
pwd
```

2. Copy the output and update your Claude Desktop config with the full path:
```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/Users/yourusername/actual/path/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

### Node Version Error

**Error Message:**
```
SyntaxError: Unexpected token ...
```
or errors about ES modules

**Solution:** Upgrade to Node.js >=18.0.0

If using nvm:
```bash
nvm install 22
nvm use 22
nvm alias default 22

# Rebuild the project
cd uswds-local-mcp-server
npm run build
```

If not using nvm, download Node.js 22 from [nodejs.org](https://nodejs.org/)

### Server Crashes on Startup

**Check Node version:**
```bash
node --version
# Should show v18.x.x or higher
```

**Rebuild the project:**
```bash
cd uswds-local-mcp-server
rm -rf dist/
npm run build
```

**Check for build errors:**
```bash
npm run lint
```

### MCP Server Not Appearing in Claude Desktop

1. **Check config file location:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Validate JSON syntax:** Use a JSON validator to check your config file

3. **Restart Claude Desktop completely:** Quit and relaunch (not just close the window)

4. **Check logs:**
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`
   - Linux: `~/.config/Claude/logs/`

### Permission Denied

**On macOS/Linux, if you get permission errors:**

```bash
chmod +x dist/index.js
```

### Still Having Issues?

1. Check that `dist/` folder exists: `ls dist/`
2. Run tests to verify build: `npm test`
3. Try the MCP Inspector: `npm run inspector`
4. [Open an issue](https://github.com/ctrimm/uswds-local-mcp-server/issues) with:
   - Node version (`node --version`)
   - Operating system
   - Error logs from Claude Desktop
   - Your config (with paths redacted)

## Available Tools

### 1. `list_components`

List all available USWDS or React-USWDS components.

**Parameters:**
- `category` (optional): Filter by category - "all", "forms", "navigation", "layout", "content", "ui"

**Example:**
```json
{
  "category": "forms"
}
```

### 2. `get_component_info`

Get detailed information about a specific component including props, examples, and accessibility guidance.

**Parameters:**
- `component_name` (required): Name of the component (e.g., "Button", "Alert", "TextInput")
- `include_examples` (optional): Include code examples (default: true)

**Example:**
```json
{
  "component_name": "Button",
  "include_examples": true
}
```

### 3. `get_design_tokens`

Get USWDS design tokens for colors, spacing, typography, etc.

**Parameters:**
- `category` (optional): "all", "color", "spacing", "typography", "breakpoints"

**Example:**
```json
{
  "category": "color"
}
```

### 4. `validate_uswds_code`

Validate HTML/JSX code for USWDS patterns, accessibility, and best practices.

**Parameters:**
- `code` (required): HTML or JSX code to validate
- `check_accessibility` (optional): Include accessibility checks (default: true)

**Example:**
```json
{
  "code": "<button className=\"usa-button\">Click me</button>",
  "check_accessibility": true
}
```

### 5. `search_docs`

Search USWDS documentation for components, patterns, and guidance.

**Parameters:**
- `query` (required): Search query
- `doc_type` (optional): "all", "components", "patterns", "utilities", "design-tokens"

**Example:**
```json
{
  "query": "form validation",
  "doc_type": "components"
}
```

### 6. `get_accessibility_guidance`

Get accessibility guidance for a specific component or pattern.

**Parameters:**
- `component_or_pattern` (required): Component or pattern name

**Example:**
```json
{
  "component_or_pattern": "Button"
}
```

### 7. `list_page_templates`

List available React-USWDS page templates for quick prototyping (React mode only).

**Parameters:**
- `category` (optional): Filter by category - "all", "authentication", "marketing", "content", "forms", "error"

**Example:**
```json
{
  "category": "authentication"
}
```

### 8. `get_page_template`

Get full code and details for a specific React-USWDS page template (React mode only).

**Parameters:**
- `template_name` (required): Name or slug of the template (e.g., "Sign In", "Landing Page")

**Example:**
```json
{
  "template_name": "Sign In"
}
```

### 9. `check_color_contrast`

Check WCAG color contrast ratio between two colors for accessibility compliance.

**Parameters:**
- `foreground` (required): Foreground color (hex, rgb, or named color)
- `background` (required): Background color (hex, rgb, or named color)
- `font_size` (optional): Font size in pixels
- `font_weight` (optional): Font weight (e.g., "normal", "bold", "700")

**Example:**
```json
{
  "foreground": "#005ea2",
  "background": "#ffffff",
  "font_size": 16,
  "font_weight": "normal"
}
```

### 10. `get_icons`

Browse and search USWDS icons with usage examples.

**Parameters:**
- `category` (optional): Filter by category - "all", "alerts", "navigation", "actions", etc.
- `search` (optional): Search icons by name or keywords

**Example:**
```json
{
  "category": "navigation",
  "search": "arrow"
}
```

### 11. `get_layout_patterns`

Get common layout patterns and recipes using USWDS Grid system.

**Parameters:**
- `layout_key` (optional): Specific layout to retrieve (e.g., "sidebar-content", "card-grid")

**Example:**
```json
{
  "layout_key": "sidebar-content"
}
```

### 12. `suggest_components`

Get AI-assisted component recommendations based on use case description.

**Parameters:**
- `use_case` (required): Describe what you want to build

**Example:**
```json
{
  "use_case": "I need to show a success message after form submission"
}
```

### 13. `compare_components`

Compare two components side-by-side to understand their differences.

**Parameters:**
- `component1` (required): First component name
- `component2` (required): Second component name

**Example:**
```json
{
  "component1": "Alert",
  "component2": "SiteAlert"
}
```

### 14. `generate_component_code`

Generate working code for a component based on requirements.

**Parameters:**
- `component_name` (required): Component to generate (e.g., "Button", "Alert")
- `requirements` (optional): Component requirements as key-value pairs

**Example:**
```json
{
  "component_name": "Button",
  "requirements": {
    "type": "submit",
    "disabled": false,
    "size": "big"
  }
}
```

### 15. `generate_form`

Generate a complete form with validation based on field specifications.

**Parameters:**
- `form_spec` (required): Form specification including formName, fields array, submitLabel

**Example:**
```json
{
  "form_spec": {
    "formName": "ContactForm",
    "fields": [
      {"name": "name", "label": "Full Name", "type": "text", "required": true},
      {"name": "email", "label": "Email", "type": "email", "required": true},
      {"name": "message", "label": "Message", "type": "textarea", "required": false}
    ],
    "submitLabel": "Send Message"
  }
}
```

### 16. `generate_multi_step_form`

Generate a multi-step wizard form with navigation, progress indicator, and validation.

**Parameters:**
- `form_spec` (required): Multi-step form specification

**Example:**
```json
{
  "form_spec": {
    "formName": "RegistrationWizard",
    "steps": [
      {
        "title": "Personal Information",
        "fields": [
          {"name": "firstName", "label": "First Name", "type": "text", "required": true},
          {"name": "lastName", "label": "Last Name", "type": "text", "required": true}
        ]
      },
      {
        "title": "Contact Information",
        "fields": [
          {"name": "email", "label": "Email", "type": "email", "required": true},
          {"name": "phone", "label": "Phone", "type": "tel", "required": false}
        ]
      }
    ],
    "showProgress": true
  }
}
```

### 17. `generate_data_table`

Generate a data table with sorting, filtering, and pagination functionality.

**Parameters:**
- `table_spec` (required): Table specification

**Example:**
```json
{
  "table_spec": {
    "tableName": "UsersTable",
    "columns": [
      {"key": "name", "label": "Name", "sortable": true},
      {"key": "email", "label": "Email", "sortable": true},
      {"key": "role", "label": "Role", "sortable": false},
      {"key": "status", "label": "Status", "sortable": true}
    ],
    "enableSorting": true,
    "enableFiltering": true,
    "enablePagination": true,
    "pageSize": 10
  }
}
```

### 18. `generate_modal_dialog`

Generate a modal dialog with focus management, ARIA labels, and keyboard accessibility.

**Parameters:**
- `modal_spec` (required): Modal specification

**Example:**
```json
{
  "modal_spec": {
    "modalName": "ConfirmDialog",
    "title": "Confirm Action",
    "type": "warning",
    "hasForm": false,
    "actions": ["cancel", "confirm"]
  }
}
```

### 19. `scaffold_project`

Generate a complete USWDS project structure with Next.js, Create React App, or Vite.

**Parameters:**
- `project_spec` (required): Project specification

**Example:**
```json
{
  "project_spec": {
    "projectName": "my-gov-website",
    "framework": "next",
    "includeExamples": true,
    "includeAuth": false,
    "includeTesting": true
  }
}
```

### 20. `convert_html_to_react`

Convert vanilla USWDS HTML to React-USWDS components. Automatically identifies USWDS patterns and converts them to the appropriate React components. Supports both fetching from URLs and converting provided HTML strings.

**Parameters:**
- `conversion_spec` (required): Conversion specification
  - `url` (optional): URL to fetch HTML from
  - `html` (optional): HTML string to convert
  - `componentName` (optional): Name for the generated React component (default: "ConvertedComponent")

**Features:**
- Fetches HTML from live URLs or processes provided HTML
- Automatically detects and converts USWDS components:
  - Buttons (`usa-button` → `<Button>`)
  - Alerts (`usa-alert` → `<Alert>`)
  - Forms (inputs, textareas, checkboxes, radios)
  - Cards, Accordions, Tables
  - Grid containers and layouts
  - Header, Footer, Banner components
  - And many more...
- Preserves utility classes for spacing, layout, and typography
- Generates proper React imports
- Converts HTML attributes to JSX (e.g., `for` → `htmlFor`, `class` → `className`)

**Example (from URL):**
```json
{
  "conversion_spec": {
    "url": "https://designsystem.digital.gov/components/alert/",
    "componentName": "AlertExample"
  }
}
```

**Example (from HTML string):**
```json
{
  "conversion_spec": {
    "html": "<div class=\"usa-alert usa-alert--success\"><div class=\"usa-alert__body\"><h4 class=\"usa-alert__heading\">Success</h4><p class=\"usa-alert__text\">Your action was completed successfully.</p></div></div>",
    "componentName": "SuccessAlert"
  }
}
```

**Output:**
```json
{
  "success": true,
  "componentName": "SuccessAlert",
  "code": "import { Alert } from '@trussworks/react-uswds'\n\nexport default function SuccessAlert() {\n  return (\n    <Alert type=\"success\" heading=\"Success\">\n      Your action was completed successfully.\n    </Alert>\n  )\n}",
  "usedComponents": ["Alert"],
  "source": "provided HTML",
  "notes": [
    "This is a generated conversion - review and adjust as needed",
    "Add state management (useState) for interactive elements",
    "Add event handlers for buttons and forms",
    "Test accessibility with screen readers",
    "Some HTML may be preserved as utility classes - customize as needed"
  ]
}
```

## Usage Examples

### Example 1: Get Button Component Info (React mode)

```
Tool: get_component_info
Input: {"component_name": "Button", "include_examples": true}

Output:
{
  "mode": "react-uswds",
  "name": "Button",
  "description": "The Button component renders a clickable button element with USWDS styling",
  "category": "forms",
  "importPath": "@trussworks/react-uswds",
  "props": [
    {
      "name": "type",
      "type": "'button' | 'submit' | 'reset'",
      "required": false,
      "default": "button",
      "description": "Button type attribute"
    },
    ...
  ],
  "examples": [
    {
      "title": "Primary Button",
      "code": "import { Button } from '@trussworks/react-uswds'\n\nexport function Example() {\n  return <Button type=\"button\">Click me</Button>\n}"
    }
  ],
  "accessibility": {
    "guidelines": [...],
    "ariaAttributes": [...]
  }
}
```

### Example 2: Validate Code

```
Tool: validate_uswds_code
Input: {
  "code": "<button>Click</button>",
  "check_accessibility": true
}

Output:
{
  "valid": false,
  "mode": "vanilla",
  "score": 6.0,
  "issues": [
    {
      "severity": "warning",
      "message": "Button missing type attribute",
      "rule": "wcag-button-type",
      "suggestion": "Add type=\"button\", type=\"submit\", or type=\"reset\""
    },
    {
      "severity": "warning",
      "message": "No USWDS classes (usa- prefix) found",
      "rule": "uswds-classes",
      "suggestion": "Use USWDS utility classes like usa-button, usa-input, etc."
    }
  ],
  "summary": "Found 0 error(s) and 2 warning(s) (Score: 6.0/10)",
  "suggestions": [...]
}
```

### Example 3: Get Design Tokens

```
Tool: get_design_tokens
Input: {"category": "color"}

Output:
{
  "category": "color",
  "description": "USWDS color design tokens",
  "tokens": {
    "primary": {
      "value": "#005ea2",
      "description": "Primary brand color",
      "wcagContrast": {"onWhite": "7.59:1"}
    },
    ...
  },
  "usage": {
    "classes": "Use utility classes like \"bg-primary\", \"text-primary\", \"border-primary\"",
    "tokens": "In CSS: use var(--color-primary)",
    "accessibility": "Ensure 4.5:1 contrast for normal text, 3:1 for large text (18pt+)"
  }
}
```

## Configuration

### Environment Variables

- `USE_REACT_COMPONENTS`: Set to "true" for React-USWDS mode, "false" for vanilla USWDS (default: "false")

## Development

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Run server

```bash
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# TypeScript type checking (lint)
npm run lint
```

### Testing with MCP Inspector

```bash
npm run inspector
```

This opens a web interface for testing tools interactively.

## Resources

- [USWDS Official Documentation](https://designsystem.digital.gov/)
- [React-USWDS Documentation](https://github.com/trussworks/react-uswds)
- [React-USWDS Storybook](https://trussworks.github.io/react-uswds/)
- [MCP Protocol](https://modelcontextprotocol.io/)

## Use Cases

### For Developers

- Quickly look up component props and examples
- Validate code for USWDS compliance
- Check accessibility requirements
- Find the right design tokens
- Compare vanilla USWDS vs React-USWDS implementations

### For AI Assistants

- Provide accurate USWDS component information
- Generate compliant, accessible code
- Validate and improve existing code
- Suggest design tokens instead of hard-coded values
- Ensure WCAG 2.1 AA compliance

## License

MIT

## Contributing

Contributions are welcome! We appreciate bug fixes, new tools, documentation improvements, and more.

**Please read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:**
- Setting up your development environment
- Adding new tools
- Writing tests
- Code style and conventions
- Pull request process

**Quick Start for Contributors:**

```bash
# Fork and clone the repo
git clone https://github.com/YOUR-USERNAME/uswds-local-mcp-server.git
cd uswds-local-mcp-server

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

See [FUTURE_TOOLS.md](FUTURE_TOOLS.md) for a roadmap of planned features and tools.
