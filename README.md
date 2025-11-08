# USWDS MCP Server

A Model Context Protocol (MCP) server that provides tools for working with the U.S. Web Design System (USWDS) and React-USWDS components. This server helps developers build accessible, compliant government websites faster by providing component information, design tokens, and validation tools.

## Features

- **Component Information**: Get detailed info about USWDS or React-USWDS components
- **Page Templates**: Access full-page React templates for quick prototyping (React mode only)
- **Design Tokens**: Access USWDS design tokens for colors, spacing, typography, and breakpoints
- **Code Validation**: Validate HTML/JSX for USWDS patterns and accessibility
- **React Support**: Toggle between vanilla USWDS and React-USWDS modes
- **Accessibility Guidance**: Get WCAG compliance guidance for components

## Installation

```bash
npm install
npm run build
```

## Quick Start

### Using with Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/path/to/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

### For React-USWDS mode:

```json
{
  "mcpServers": {
    "uswds-react": {
      "command": "node",
      "args": ["/path/to/uswds-local-mcp-server/dist/index.js"],
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

Contributions are welcome! Please see the documentation guides in this repository for more information about the USWDS ecosystem.
