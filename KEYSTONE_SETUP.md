# Keystone Design System MCP Server - Setup Guide

This guide provides instructions for setting up and using the Keystone Design System MCP server once it has been implemented.

## About Keystone Design System

**Keystone** is Pennsylvania's official design system for state government websites and applications.

- **Components**: https://components.pa.gov
- **Documentation**: https://wcmauthorguide.pa.gov/en/keystone-design-system/
- **Standards**: WCAG 2.1 AA compliant
- **Branding**: Pennsylvania-specific colors, typography, and patterns

## Overview

The Keystone MCP server provides AI agents with 8 tools for working with Pennsylvania's design system:

1. **list_keystone_components** - List all available components
2. **get_keystone_component** - Get detailed component information
3. **get_keystone_design_tokens** - Access design tokens (colors, spacing, etc.)
4. **search_keystone_components** - Search components by keyword
5. **get_keystone_accessibility_guidelines** - Get WCAG compliance info
6. **validate_keystone_code** - Validate HTML for Keystone patterns
7. **get_keystone_style_guide** - Get style guide and principles
8. **get_keystone_component_examples** - Get code examples

## Implementation

To implement this server, follow the complete guide in **KEYSTONE_IMPLEMENTATION_GUIDE.md**.

### Quick Start for Implementation

1. Create the file structure described in KEYSTONE_IMPLEMENTATION_GUIDE.md
2. Copy all TypeScript code from the guide into appropriate files
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Test: `npm run inspector:keystone`

## Using the Keystone MCP Server

### Prerequisites

- Node.js 18+ installed
- MCP-compatible client (Claude Desktop, Continue, etc.)
- Keystone MCP server built and compiled

### Claude Desktop Configuration

Add to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**Linux**: `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "keystone": {
      "command": "node",
      "args": [
        "/absolute/path/to/uswds-local-mcp-server/dist/keystone-index.js"
      ]
    }
  }
}
```

Replace `/absolute/path/to/` with the actual path to your implementation.

### Finding Your Node Path

```bash
# macOS/Linux
which node

# Windows
where node
```

Use the absolute path in your configuration.

## Testing the Server

Once the server is running, test it in Claude Desktop:

### Example 1: List Components

**Prompt:**
```
Using the Keystone MCP server, list all available components.
```

**Expected Response:**
```json
{
  "components": [
    {
      "name": "Button",
      "category": "forms",
      "description": "Primary action button...",
      ...
    }
  ],
  "categories": ["forms", "navigation", ...],
  "total": 15
}
```

### Example 2: Get Component Details

**Prompt:**
```
Get details about the Keystone Button component including examples.
```

**Expected Response:**
- Component props (variant, size, disabled, etc.)
- Code examples (primary, secondary, disabled states)
- Accessibility guidelines (keyboard support, ARIA labels)
- Related components

### Example 3: Validate Code

**Prompt:**
```
Validate this HTML for Keystone compliance:
<button class="pa-button pa-button--primary">Submit</button>
```

**Expected Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "suggestions": []
}
```

### Example 4: Get Design Tokens

**Prompt:**
```
What color tokens are available in Keystone's primary palette?
```

**Expected Response:**
```json
{
  "tokens": [
    {
      "name": "pa-blue",
      "value": "#003F87",
      "category": "primary",
      "usage": "Primary brand color...",
      "wcagCompliant": true
    }
  ],
  "categories": ["primary", "secondary", "neutral", "semantic"],
  "total": 15
}
```

## Running Both USWDS and Keystone Servers

You can run both design system servers simultaneously in Claude Desktop:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/path/to/uswds-mcp/dist/index.js"]
    },
    "keystone": {
      "command": "node",
      "args": ["/path/to/uswds-mcp/dist/keystone-index.js"]
    }
  }
}
```

Claude will have access to tools from both design systems.

## Use Cases

### For AI Code Generation

The Keystone MCP server enables AI agents to:
- Generate Pennsylvania-compliant government website components
- Ensure WCAG 2.1 AA accessibility standards
- Use correct Pennsylvania brand colors and tokens
- Follow state government design patterns
- Validate code against Keystone guidelines

### Example Workflow

1. **Ask Claude to create a component:**
   ```
   Create a Keystone alert component for a success message
   ```

2. **Claude uses MCP tools:**
   - Calls `get_keystone_component` for "Alert" component
   - Reviews props and examples
   - Checks accessibility guidelines
   - Generates compliant code

3. **Validate the result:**
   ```
   Validate this code for Keystone compliance
   ```

4. **Claude validates:**
   - Calls `validate_keystone_code`
   - Checks for pa- class prefixes
   - Verifies accessibility attributes
   - Reports any issues

## Troubleshooting

### Server Won't Start

**Check Node.js version:**
```bash
node --version  # Must be 18+
```

**Verify build:**
```bash
ls -la dist/keystone-index.js  # File should exist
```

**Check for errors:**
```bash
node dist/keystone-index.js
```

### Tools Don't Appear in Claude

1. **Verify config JSON is valid** - Use a JSON validator
2. **Check absolute paths** - Paths must be complete, not relative
3. **Restart Claude Desktop** - Close completely and reopen
4. **Check Claude logs** - Help → Debug Info

### Permission Errors (macOS/Linux)

```bash
chmod +x dist/keystone-index.js
```

### TypeScript Build Errors

```bash
# Clean and rebuild
rm -rf dist
npm run build

# Check TypeScript version
npx tsc --version  # Should be 5.3+
```

## Data Population

**Current Status**: The server structure is complete but contains placeholder data.

**What Needs Population**:
- Additional component definitions
- Real Pennsylvania color values
- More code examples from Storybook
- Enhanced validation rules

See **KEYSTONE_TODO.md** for detailed data population guide.

## File Structure

```
src/
├── keystone/
│   ├── components.ts          # Component definitions
│   ├── color-tokens.ts        # Design tokens
│   ├── keystone-service.ts    # Business logic
│   └── index.ts               # Exports
├── keystone-index.ts           # MCP server entry
dist/
├── keystone/                   # Compiled JavaScript
└── keystone-index.js           # Server executable
```

## Development Workflow

### Watch Mode

For development with auto-rebuild:
```bash
npm run watch  # Terminal 1
npm run dev:keystone  # Terminal 2
```

### Testing with MCP Inspector

```bash
npm run inspector:keystone
```

This opens a UI for testing all 8 MCP tools without Claude Desktop.

### Adding Components

1. Edit `src/keystone/components.ts`
2. Add component to `keystoneComponents` array (see KEYSTONE_TODO.md)
3. Rebuild: `npm run build`
4. Test: `npm run inspector:keystone`

### Adding Color Tokens

1. Edit `src/keystone/color-tokens.ts`
2. Add tokens to `keystoneColorTokens` array
3. Rebuild: `npm run build`
4. Test with `get_keystone_design_tokens` tool

## Resources

- **Implementation Guide**: See KEYSTONE_IMPLEMENTATION_GUIDE.md
- **Data Population**: See KEYSTONE_TODO.md
- **Keystone Components**: https://components.pa.gov
- **Keystone Docs**: https://wcmauthorguide.pa.gov/en/keystone-design-system/
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **MCP Protocol**: https://modelcontextprotocol.io

## Next Steps

1. ✅ Review KEYSTONE_IMPLEMENTATION_GUIDE.md
2. ✅ Implement the server following the guide
3. ✅ Build and test with MCP Inspector
4. ✅ Configure Claude Desktop
5. 📝 Populate component data (see KEYSTONE_TODO.md)
6. 📝 Add more validation rules
7. 📝 Enhance accessibility checking

## Support

For implementation questions:
1. Review KEYSTONE_IMPLEMENTATION_GUIDE.md
2. Check KEYSTONE_TODO.md for data population
3. Test with MCP Inspector before Claude Desktop
4. Check build errors with `npm run build`

---

**Keystone MCP Server** - Pennsylvania Design System Tools for AI Agents
