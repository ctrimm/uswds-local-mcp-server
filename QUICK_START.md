# Quick Start Guide

Get up and running with the USWDS MCP Server in 5 minutes!

## Installation

```bash
# 1. Clone or navigate to the repository
cd uswds-local-mcp-server

# 2. Install dependencies
npm install

# 3. Build the server
npm run build
```

## Configuration

### For Claude Desktop

1. Find your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **Linux**: `~/.config/Claude/claude_desktop_config.json`

2. Add this configuration (replace `/ABSOLUTE/PATH/TO/` with your actual path):

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

3. Restart Claude Desktop

4. Look for the 🔌 icon in Claude to confirm the server is connected

## Quick Test

Ask Claude:

> "Using the USWDS MCP server, list all form components and then show me how to create an accessible button with React-USWDS"

Claude will use the MCP tools to:
1. Call `list_components` with category "forms"
2. Call `get_component_info` for "Button"
3. Generate example code
4. Optionally validate the code

## Switching to React Mode

To use React-USWDS instead of vanilla USWDS, change the environment variable:

```json
{
  "mcpServers": {
    "uswds-react": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

## Using Both Modes

You can run both vanilla and React modes simultaneously:

```json
{
  "mcpServers": {
    "uswds-vanilla": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    },
    "uswds-react": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

## Available Tools

Once connected, Claude has access to these tools:

1. **list_components** - Browse USWDS components by category
2. **get_component_info** - Get detailed component documentation
3. **get_design_tokens** - Access color, spacing, typography tokens
4. **validate_uswds_code** - Check code for compliance and accessibility
5. **search_docs** - Search USWDS documentation
6. **get_accessibility_guidance** - Get WCAG compliance guidance

## Example Prompts

Try these with Claude:

### For React-USWDS:
- "Show me all form components in React-USWDS"
- "Create an accessible contact form with name, email, and message fields"
- "What are the props for the Alert component?"
- "Validate this code: [paste your JSX]"

### For Vanilla USWDS:
- "List all navigation components in USWDS"
- "Show me the HTML for a primary button"
- "What design tokens should I use for primary colors?"
- "Check if this HTML follows USWDS patterns: [paste HTML]"

## Troubleshooting

### Server not showing up in Claude

1. Check the path in your config is absolute (not relative)
2. Verify the build succeeded: `ls dist/index.js`
3. Check Claude Desktop logs:
   - macOS: `~/Library/Logs/Claude/`
   - Windows: `%APPDATA%\Claude\logs\`

### Build errors

```bash
# Clean and rebuild
rm -rf dist/
npm run build
```

### Check if server runs

```bash
# Test the server directly
node dist/index.js

# It should show:
# USWDS MCP Server running in Vanilla/React mode
# Available tools: list_components, get_component_info, ...
```

## Testing with MCP Inspector

For debugging and testing outside of Claude:

```bash
npm run inspector
```

This opens a web interface where you can:
- Test each tool individually
- See request/response JSON
- Debug issues

## Next Steps

1. Read [README.md](README.md) for full documentation
2. Check [examples/example-usage.md](examples/example-usage.md) for detailed scenarios
3. Review the other guides:
   - [SETUP.md](SETUP.md) - Comprehensive setup guide
   - [MCP_TOOLS_GUIDE.md](MCP_TOOLS_GUIDE.md) - Deep dive into MCP tools
   - [USWDS_AGENT_IMPLEMENTATION.md](USWDS_AGENT_IMPLEMENTATION.md) - Advanced agent setup

## Support

- **USWDS Documentation**: https://designsystem.digital.gov/
- **React-USWDS**: https://github.com/trussworks/react-uswds
- **MCP Protocol**: https://modelcontextprotocol.io/

Happy building! 🚀
