# USWDS MCP Server

[![CI](https://github.com/ctrimm/uswds-local-mcp-server/workflows/CI/badge.svg)](https://github.com/ctrimm/uswds-local-mcp-server/actions)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

A Model Context Protocol (MCP) server that provides tools for working with the U.S. Web Design System (USWDS) and React-USWDS components. This server helps developers build accessible, compliant government websites faster by providing component information, design tokens, and validation tools.

**Supported Versions:**
- **React-USWDS**: v11.0.0 (December 2025)
- **USWDS**: 3.13.0
- **React**: 16.x, 17.x, 18.x, 19.x

> **⚠️ Important**: This server requires **Node.js 20+** due to the File API requirement in the MCP SDK. See [troubleshooting](#node-version-requirement) for details.

## What's New

### React-USWDS v11.0.0 Support (December 2025)

Updated to support the latest React-USWDS v11.0.0, which includes:

**USWDS 3.13.0 Features:**
- ✨ First Web Component in USWDS (banner variant)
- ♿ Enhanced accessibility with reduced motion preference support
- 🎨 Improved range slider with visible values
- 🔍 Better combo box search result ordering
- 📊 Enhanced character count visual cues

**Breaking Changes:**
- Visual updates from USWDS 3.9.0 - see [USWDS 3.9.0 release notes](https://github.com/uswds/uswds/releases/tag/v3.9.0)

**Additional Updates:**
- Node 24 LTS support (v10.1.0)
- React 19 support (v10.0.0)
- Improved TypeScript type exports
- Various accessibility and bug fixes

### Tailwind USWDS Integration (December 2025)

Added comprehensive support for USWDS components built with Tailwind CSS:

- 🎨 Access Tailwind USWDS component documentation
- 📖 Getting started guide with installation steps
- 🔧 JavaScript, colors, icons, and typography utilities
- 🔍 Search across all Tailwind USWDS documentation

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

### Tailwind CSS + USWDS Integration
- **Tailwind USWDS Components**: Access USWDS components built with Tailwind CSS from [v2.uswds-tailwind.com](https://v2.uswds-tailwind.com/)
- **Getting Started Guide**: Get installation and setup instructions for using USWDS with Tailwind
- **Component Documentation**: Fetch detailed documentation for Tailwind USWDS components with usage examples
- **Tailwind Utilities**: Access documentation for colors, icons, typography, and JavaScript integration
- **Search**: Search across all Tailwind USWDS documentation

#### Available Tailwind USWDS Tools:
- `get_tailwind_uswds_getting_started` - Get setup and installation guide
- `get_tailwind_uswds_component` - Get component documentation (or list all components)
- `get_tailwind_uswds_javascript` - Get JavaScript integration documentation
- `get_tailwind_uswds_colors` - Get Tailwind color palette and utilities
- `get_tailwind_uswds_icons` - Get icon documentation
- `get_tailwind_uswds_typography` - Get typography utilities and styles
- `search_tailwind_uswds_docs` - Search all Tailwind USWDS documentation

## Architecture & How It Works

### Dual-Mode Deployment

This MCP server supports two deployment modes:

1. **Local Mode** (stdio): For development and local use
2. **Remote Mode** (AWS Lambda): For production serverless deployment

### MCP Tool Call Flow

When a client (like Claude Desktop) requests component information, here's what happens:

```
┌─────────────┐
│   Client    │ (Claude Desktop, Cursor, etc.)
│  (MCP SDK)  │
└──────┬──────┘
       │ 1. HTTP POST to Lambda Function URL (or stdio locally)
       │    Content-Type: application/json
       │    Body: {"jsonrpc":"2.0","method":"tools/call",
       │           "params":{"name":"get_component_info","arguments":{"component_name":"Button"}}}
       │
┌──────▼───────────────────────────────────────────┐
│         AWS Lambda Function URL / stdio          │
│         (Streamable HTTP Transport)              │
└──────┬───────────────────────────────────────────┘
       │ 2. Lambda invokes handler / stdio processes request
       │
┌──────▼───────────────────────────────────────────┐
│         Lambda Execution Environment             │
│  ┌─────────────────────────────────────────┐    │
│  │  Container (Warm or Cold)               │    │
│  │  ┌───────────────────────────────────┐  │    │
│  │  │ L1: In-Memory Cache               │  │    │
│  │  │ - Component data: Map<>           │  │    │
│  │  │ - Tailwind docs: Map<>            │  │    │
│  │  │ - TTL: 1 hour                     │  │    │
│  │  └───────────────────────────────────┘  │    │
│  │  ┌───────────────────────────────────┐  │    │
│  │  │ L2: /tmp Directory Cache          │  │    │
│  │  │ - File system cache               │  │    │
│  │  │ - Survives warm starts            │  │    │
│  │  │ - Up to 10GB available            │  │    │
│  │  └───────────────────────────────────┘  │    │
│  │                                          │    │
│  │  Handler receives MCP request           │    │
│  │  ↓                                       │    │
│  │  Parse: method="tools/call"             │    │
│  │         name="get_component_info"       │    │
│  │         args={component_name:"Button"}  │    │
│  │  ↓                                       │    │
│  │  Route to Tool Handler                  │    │
│  │  ↓                                       │    │
│  │  ┌─────────────────────────────┐        │    │
│  │  │ ComponentService            │        │    │
│  │  │ getComponentInfo("Button")  │        │    │
│  │  │   ↓                          │        │    │
│  │  │   Check L1 cache (memory)   │        │    │
│  │  │   ↓                          │        │    │
│  │  │   If HIT: return cached     │        │    │
│  │  │   If MISS:                  │        │    │
│  │  │     Check L2 cache (/tmp)   │        │    │
│  │  │     If HIT: return cached   │        │    │
│  │  │     If MISS:                │        │    │
│  │  │       Load from data file   │        │    │
│  │  │       Cache in L1 + L2      │        │    │
│  │  │       Return                │        │    │
│  │  └─────────────────────────────┘        │    │
│  │  ↓                                       │    │
│  │  Format MCP Response:                   │    │
│  │  {                                       │    │
│  │    "jsonrpc": "2.0",                    │    │
│  │    "id": 1,                             │    │
│  │    "result": {                          │    │
│  │      "content": [{                      │    │
│  │        "type": "text",                  │    │
│  │        "text": "Button component..."   │    │
│  │      }]                                 │    │
│  │    }                                    │    │
│  │  }                                      │    │
│  └──────────────────────────────────────────┘    │
└──────┬───────────────────────────────────────────┘
       │ 3. Stream response back
       │
┌──────▼───────────────────────────────────────────┐
│         Response Streaming                       │
│         (Lambda Function URL / stdio)            │
└──────┬───────────────────────────────────────────┘
       │ 4. HTTP 200 OK / stdio output
       │    Content-Type: application/json
       │    Body: {result with component data}
       │
┌──────▼──────┐
│   Client    │ Receives component data
│  (MCP SDK)  │ Displays to user
└─────────────┘
```

### Multi-Layer Caching Strategy

The server uses a sophisticated caching approach optimized for both local and Lambda deployments:

- **L1: Memory Cache** - In-process cache (<1ms latency), survives warm starts
- **L2: /tmp Directory** - File system cache (1-5ms latency), up to 10GB in Lambda
- **L3: Embedded Data** - Static JSON bundled with code, always available

This ensures fast responses even on Lambda cold starts while minimizing external dependencies.

### Serverless Deployment

For production use, deploy to AWS Lambda with SST V3:

- **Cost-effective**: ~$2-5/month for typical usage (vs ~$100/month for containers)
- **Auto-scaling**: Handles 1-10,000+ concurrent requests automatically
- **Zero maintenance**: No servers to manage
- **Global reach**: Deploy to multiple regions for low latency

See **[DEPLOY.md](DEPLOY.md)** for complete deployment instructions and **[ARCHITECTURE.md](ARCHITECTURE.md)** for detailed architecture documentation.

## Installation

### Prerequisites

- **Node.js 20.0.0 or higher** (required for File API)
- **nvm** (recommended for managing Node versions)

**Check your Node version:**
```bash
node --version  # Must show v20.x.x or higher
```

**If you have Node 18 or earlier, upgrade first:**
```bash
# Using nvm (recommended)
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
```

### Option 1: Install via NPM (Recommended)

**Best for:** Quick setup and easy updates.

```bash
# Install globally
npm install -g uswds-local-mcp-server

# Verify installation
uswds-mcp --version
```

**Configure your MCP client:**

For Claude Desktop, edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%/Claude/claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "uswds": {
      "command": "uswds-mcp",
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

**Updating:**
```bash
npm update -g uswds-local-mcp-server
```

---

### Option 2: From Source with Wrapper Script (For Development)

**Best for:** Users managing Node versions with nvm who want automatic version switching.

```bash
# 1. Clone the repository
git clone https://github.com/ctrimm/uswds-local-mcp-server.git
cd uswds-local-mcp-server

# 2. Install Node 20 (if not already installed)
nvm install 20
nvm use 20

# 3. Install dependencies
npm install

# 4. Build the TypeScript code
npm run build

# 5. Test the server
./start-mcp-server.sh
```

**Benefits:**
- ✅ Automatically loads correct Node version from `.nvmrc`
- ✅ Validates Node version before starting
- ✅ Auto-installs required Node version if missing
- ✅ Works even if you switch Node versions later

**Claude Desktop configuration:**
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/absolute/path/to/uswds-local-mcp-server/start-mcp-server.sh",
      "args": [],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

**To find your path:**
```bash
cd uswds-local-mcp-server
echo "$(pwd)/start-mcp-server.sh"
```

See **[CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md)** for detailed configuration instructions.

---

### Option 3: Direct Node Path (Alternative)

**If not using the wrapper script:**

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/absolute/path/to/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

**⚠️ Important:** This requires Node 20+ to be in your PATH. If using nvm, use the wrapper script instead.

### For React-USWDS Mode

Simply change `USE_REACT_COMPONENTS` to `"true"` in any of the above configurations:

```json
{
  "mcpServers": {
    "uswds-react": {
      "command": "/absolute/path/to/start-mcp-server.sh",
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

### Dynamic Framework Selection (New!)

**You no longer need to hardcode the framework in your environment configuration!**

All component tools now support an optional `framework` parameter that lets Claude choose the right framework based on your conversation context:

- **`framework: "react"`** - Get React-USWDS components
- **`framework: "vanilla"`** - Get vanilla USWDS (HTML/CSS)
- **`framework: "tailwind"`** - Get Tailwind USWDS components

**Example:** When you ask Claude "show me a button in React", it will automatically use `framework: "react"`. Ask for "a button in Tailwind" and it uses `framework: "tailwind"`.

The `USE_REACT_COMPONENTS` environment variable now serves as a **default fallback** when no framework is specified. This means:
- ✅ Full backward compatibility - existing configurations work unchanged
- ✅ No need to reconfigure when switching frameworks
- ✅ Mix frameworks in the same conversation
- ✅ Let Claude intelligently choose based on context

**Supported Tools with Framework Parameter:**
- `list_components`
- `get_component_info`
- `generate_component_code`

### Testing with MCP Inspector

```bash
npm run inspector
```

## Documentation

### Setup & Configuration

- **[SETUP.md](SETUP.md)** - Complete installation and setup guide
- **[NVM_SETUP.md](NVM_SETUP.md)** - Node version management with nvm (recommended!)
- **[CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md)** - Claude Desktop configuration guide

### Development & Usage

- **[USWDS_AGENT_IMPLEMENTATION.md](USWDS_AGENT_IMPLEMENTATION.md)** - Agent implementation details
- **[MCP_TOOLS_GUIDE.md](MCP_TOOLS_GUIDE.md)** - MCP tools reference
- **[TOOLS.md](TOOLS.md)** - Complete tool reference with all 18 tools documented ⭐

### Deployment

- **[DEPLOY.md](DEPLOY.md)** - AWS Lambda deployment guide
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
- **[VALIDATION.md](VALIDATION.md)** - Lambda implementation validation
- **[RATE_LIMITING.md](RATE_LIMITING.md)** - Rate limiting implementation guide

### Troubleshooting

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## Troubleshooting

### Node Version Requirement

#### ❌ ReferenceError: File is not defined

**Error in Claude Desktop logs:**
```
ReferenceError: File is not defined
    at Object.<anonymous> (/path/to/node_modules/undici/lib/web/webidl/index.js:531:48)
```

**Cause:** You're using Node.js 18 or earlier. The MCP SDK's `undici` dependency requires the `File` global API, which was added in Node.js 20.

**Solution:** Upgrade to Node 20+ and use the wrapper script.

**Quick fix:**
```bash
# Install Node 20
nvm install 20
nvm use 20

# Clear and reinstall dependencies
cd uswds-local-mcp-server
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build

# Update Claude Desktop config to use wrapper script
# See CLAUDE_DESKTOP_CONFIG.md for details
```

See **[TROUBLESHOOTING.md](TROUBLESHOOTING.md#referenceerror-file-is-not-defined)** for detailed instructions.

### Cannot Find Module Error

**Error Message:**
```
Error: Cannot find module '/path/to/dist/index.js'
```

**Solutions:**

1. **Build the project:**
```bash
npm run build
```

2. **Use absolute path in config:**
```bash
cd uswds-local-mcp-server
pwd
# Copy the output and use it in your Claude Desktop config
```

3. **Use the wrapper script** (recommended) - it handles paths automatically

### Server Won't Start in Claude Desktop

**Common causes:**
- Wrong Node version (< 20)
- Incorrect path in configuration
- Not using absolute paths
- Project not built (`npm run build`)

**Solutions:**

1. **Check Node version:**
```bash
node --version  # Must be v20.x.x or higher
```

2. **Use the wrapper script:**
```bash
./start-mcp-server.sh
```

3. **Check logs:**
```bash
# macOS
tail -f ~/Library/Logs/Claude/mcp*.log

# Linux
tail -f ~/.local/share/Claude/logs/mcp*.log
```

4. See **[CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md)** for detailed setup instructions.

### MCP Server Not Appearing in Claude Desktop

1. **Validate config file location:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Validate JSON syntax:** Use a JSON validator to check your config file

3. **Use absolute paths:** Paths must start with `/` (Unix) or `C:\` (Windows)

4. **Restart Claude Desktop completely:** Quit and relaunch (not just close the window)

5. **Check the logs** for specific error messages

### Permission Denied

**Error Message:**
```
bash: ./start-mcp-server.sh: Permission denied
```

**Solution:**
```bash
chmod +x start-mcp-server.sh
```

### For More Help

See **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for comprehensive troubleshooting guidance including:
- Detailed Node version management
- nvm configuration
- Claude Desktop setup
- Common error messages and solutions

## Project Structure

```
uswds-local-mcp-server/
├── .nvmrc                      # Node version specification (20)
├── package.json                # Project dependencies & config
├── tsconfig.json               # TypeScript configuration
├── start-mcp-server.sh         # Wrapper script for Node version management
│
├── src/                        # TypeScript source code
│   ├── index.ts               # MCP server entry point
│   └── ...                    # Additional source files
│
├── dist/                       # Compiled JavaScript (generated)
│   └── index.js               # Compiled entry point
│
├── README.md                   # This file
├── SETUP.md                    # Complete setup guide
├── NVM_SETUP.md               # nvm configuration guide
├── CLAUDE_DESKTOP_CONFIG.md   # Claude Desktop setup
├── TROUBLESHOOTING.md         # Common issues and solutions
├── MCP_TOOLS_GUIDE.md         # MCP tools documentation
└── USWDS_AGENT_IMPLEMENTATION.md  # Agent implementation details
```

## Development

### Running Tests

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Building

```bash
npm run build      # Compile TypeScript
npm run watch      # Watch mode for development
```

### Linting

```bash
npm run lint       # Type-check without emitting
```

## Requirements

- Node.js 20.0.0 or higher (required for File API)
- npm 9.0.0 or higher
- Claude Desktop (latest version)
- nvm (recommended for version management)

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

Please read the setup documentation before making changes:
- [SETUP.md](SETUP.md) - Setup guide
- [NVM_SETUP.md](NVM_SETUP.md) - Node version management
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common issues

## License

AGPL-3.0 - See [LICENSE](LICENSE) file for details

## Author

Cory Trimm

## Support

Having issues? Check the documentation:

1. [Setup Guide](SETUP.md)
2. [Troubleshooting](TROUBLESHOOTING.md)
3. [Claude Desktop Configuration](CLAUDE_DESKTOP_CONFIG.md)
4. [nvm Setup](NVM_SETUP.md)

For bugs and feature requests, please [open an issue](https://github.com/ctrimm/uswds-local-mcp-server/issues).

---

**Last Updated:** 2025-11-18
