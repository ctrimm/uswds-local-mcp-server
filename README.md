# USWDS Local MCP Server

MCP (Model Context Protocol) server for generating and validating USWDS components with AI assistance.

## Quick Start

### Prerequisites

- **Node.js 20+** (required for File API)
- **nvm** (recommended for managing Node versions)
- **Claude Desktop** (to run the MCP server)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ctrimm/uswds-local-mcp-server.git
cd uswds-local-mcp-server

# 2. Install Node 20 with nvm
nvm install 20
nvm use 20

# 3. Install dependencies
npm install

# 4. Test the server
./start-mcp-server.sh
```

### Configure Claude Desktop

Edit your Claude Desktop configuration file:

**macOS:**
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Add this configuration:**
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/absolute/path/to/uswds-local-mcp-server/start-mcp-server.sh",
      "args": []
    }
  }
}
```

Replace `/absolute/path/to/` with your actual project path (use `pwd` to get it).

**Restart Claude Desktop** and you're ready to go!

## Documentation

### Setup & Configuration

- **[SETUP.md](SETUP.md)** - Complete installation and setup guide
- **[NVM_SETUP.md](NVM_SETUP.md)** - Node version management with nvm
- **[CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md)** - Claude Desktop configuration

### Development & Usage

- **[USWDS_AGENT_IMPLEMENTATION.md](USWDS_AGENT_IMPLEMENTATION.md)** - Agent implementation details
- **[MCP_TOOLS_GUIDE.md](MCP_TOOLS_GUIDE.md)** - MCP tools reference

### Troubleshooting

- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions

## Common Issues

### ❌ ReferenceError: File is not defined

**Problem:** You're using Node.js 18 or earlier.

**Solution:** Upgrade to Node 20+ and use the wrapper script.

See: [TROUBLESHOOTING.md](TROUBLESHOOTING.md#referenceerror-file-is-not-defined)

### ❌ Server won't start in Claude Desktop

**Problem:** Incorrect configuration or wrong Node version.

**Solution:** Verify your Claude Desktop config uses the wrapper script.

See: [CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md)

## Features

- **USWDS Component Generation** - AI-powered component creation
- **Multi-layer Validation** - HTML, accessibility, and design token validation
- **Version Control Integration** - Automatic git operations
- **Live Preview** - Real-time component preview
- **Design Token Support** - Direct access to USWDS design tokens

## Requirements

- Node.js 20.0.0 or higher
- npm 9.0.0 or higher
- Claude Desktop (latest version)
- nvm (recommended)

## Project Structure

```
uswds-local-mcp-server/
├── .nvmrc                     # Node version specification
├── package.json               # Project dependencies & config
├── start-mcp-server.sh        # Wrapper script for Node version management
├── index.js                   # MCP server entry point (to be created)
│
├── README.md                  # This file
├── SETUP.md                   # Complete setup guide
├── NVM_SETUP.md              # nvm configuration guide
├── CLAUDE_DESKTOP_CONFIG.md  # Claude Desktop setup
├── TROUBLESHOOTING.md        # Common issues and solutions
├── MCP_TOOLS_GUIDE.md        # MCP tools documentation
└── USWDS_AGENT_IMPLEMENTATION.md  # Agent implementation details
```

## Contributing

Contributions are welcome! Please read the setup documentation before making changes.

## License

ISC

## Support

Having issues? Check the documentation:

1. [Setup Guide](SETUP.md)
2. [Troubleshooting](TROUBLESHOOTING.md)
3. [Claude Desktop Configuration](CLAUDE_DESKTOP_CONFIG.md)
4. [nvm Setup](NVM_SETUP.md)

---

**Last Updated:** 2025-11-18
