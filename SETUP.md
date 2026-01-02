# Setup Guide

Complete setup instructions for the USWDS MCP Server.

## What is this?

This is a simple MCP (Model Context Protocol) server that helps Claude Desktop work with USWDS (U.S. Web Design System) components. It provides information about components, generates code, validates accessibility, and more.

**No complex setup required!** Just Node.js and Claude Desktop.

---

## Prerequisites

### Required Software

1. **Node.js 20.0.0 or higher**
   - **Why?** The MCP SDK requires Node 20+ for the File API
   - Check your version: `node --version`
   - Should show `v20.x.x` or higher

2. **Claude Desktop**
   - Download from [claude.ai](https://claude.ai/download)
   - Latest version recommended

### Recommended Tool

- **nvm** (Node Version Manager)
  - Makes it easy to install and switch Node versions
  - See [NVM_SETUP.md](NVM_SETUP.md) for installation instructions

---

## Step-by-Step Installation

### Step 1: Check Your Node Version

```bash
node --version
```

**If you see v18.x.x or lower**, you need to upgrade:

```bash
# Install Node 20 with nvm (recommended)
nvm install 20
nvm use 20
nvm alias default 20

# Verify
node --version  # Should show v20.x.x or higher
```

### Step 2: Get the Project

**Option A: Clone from GitHub**
```bash
git clone https://github.com/ctrimm/uswds-local-mcp-server.git
cd uswds-local-mcp-server
```

**Option B: Download ZIP**
1. Go to https://github.com/ctrimm/uswds-local-mcp-server
2. Click "Code" → "Download ZIP"
3. Extract to a folder
4. Open terminal in that folder

### Step 3: Install Dependencies

```bash
npm install
```

This installs all the packages the server needs. Takes 1-2 minutes.

### Step 4: Build the Server

```bash
npm run build
```

This converts TypeScript to JavaScript. Takes 5-10 seconds.

**You should now see a `dist/` folder with `index.js` inside.**

### Step 5: Test the Server

```bash
node dist/index.js
```

You should see:
```
USWDS MCP Server running in Vanilla mode
Available tools: list_components, get_component_info, ...
```

Press `Ctrl+C` to stop the test.

---

## Configure Claude Desktop

### Step 1: Find Your Config File

**macOS:**
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Find Your Full Path

You need the **absolute path** to the project:

```bash
# In the project directory, run:
cd /path/to/uswds-local-mcp-server
pwd
```

Copy the output (e.g., `/Users/yourname/projects/uswds-local-mcp-server`)

### Step 3: Edit Claude Desktop Config

Open the config file in a text editor and add this:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "/FULL/PATH/TO/uswds-local-mcp-server/start-mcp-server.sh",
      "args": [],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

**Important:** Replace `/FULL/PATH/TO/` with your actual path from Step 2!

**Example:**
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/Users/jane/projects/uswds-local-mcp-server/start-mcp-server.sh",
      "args": [],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

### Step 4: Make the Script Executable

```bash
chmod +x start-mcp-server.sh
```

### Step 5: Restart Claude Desktop

1. **Completely quit** Claude Desktop (don't just close the window)
2. Reopen Claude Desktop
3. Look for the 🔌 icon in Claude to confirm the server connected

---

## Verify It Works

Ask Claude:

> "Using the USWDS MCP server, list all form components"

Claude should use the `list_components` tool and show you USWDS form components!

---

## Configuration Options

### Use React-USWDS Instead

To use React components instead of vanilla USWDS HTML:

```json
{
  "mcpServers": {
    "uswds-react": {
      "command": "/path/to/uswds-local-mcp-server/start-mcp-server.sh",
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

### Run Both Modes Simultaneously

You can have both vanilla and React modes:

```json
{
  "mcpServers": {
    "uswds-vanilla": {
      "command": "/path/to/uswds-local-mcp-server/start-mcp-server.sh",
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    },
    "uswds-react": {
      "command": "/path/to/uswds-local-mcp-server/start-mcp-server.sh",
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

### Alternative: Direct Node Path

If you don't want to use the wrapper script:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/FULL/PATH/TO/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "false"
      }
    }
  }
}
```

⚠️ **Warning:** This requires Node 20+ to be in your PATH. Use the wrapper script if you use nvm.

---

## Environment Variables

This server uses only **one** environment variable:

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| `USE_REACT_COMPONENTS` | `"true"` or `"false"` | `"false"` | Use React-USWDS components instead of vanilla USWDS HTML |

The variable is set in your Claude Desktop config file, **not** in a `.env` file.

---

## Troubleshooting

### "File is not defined" Error

**Problem:** You're using Node.js 18 or earlier.

**Solution:**
```bash
# Install Node 20
nvm install 20
nvm use 20

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### "Cannot find module" Error

**Problem:** Project not built or wrong path.

**Solution:**
```bash
# Rebuild the project
npm run build

# Verify dist/index.js exists
ls dist/index.js

# Use absolute path in config (not relative)
pwd  # Copy this path
```

### "Permission denied" Error

**Problem:** Script not executable.

**Solution:**
```bash
chmod +x start-mcp-server.sh
```

### Server Not Showing in Claude

1. **Check JSON syntax** - Use a JSON validator
2. **Use absolute paths** - Must start with `/` (Unix) or `C:\` (Windows)
3. **Restart Claude completely** - Quit and relaunch
4. **Check logs:**
   ```bash
   # macOS
   tail -f ~/Library/Logs/Claude/mcp*.log

   # Linux
   tail -f ~/.local/share/Claude/logs/mcp*.log
   ```

---

## Testing Without Claude Desktop

### Using MCP Inspector

The MCP Inspector lets you test tools in your browser:

```bash
npm run inspector
```

This opens a web interface where you can:
- Test each tool manually
- See request/response data
- Debug issues

### Running Directly

```bash
# Test the server
node dist/index.js

# Should show available tools
```

---

## Development Workflow

### Watch Mode (Auto-rebuild)

```bash
npm run watch
```

Automatically rebuilds when you edit TypeScript files.

### Running Tests

```bash
npm test                 # Run all tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
```

### Type Checking

```bash
npm run lint
```

Checks TypeScript types without building.

---

## Updating the Server

```bash
# Pull latest changes
git pull

# Reinstall dependencies (if package.json changed)
npm install

# Rebuild
npm run build

# Restart Claude Desktop
```

---

## Uninstalling

### Remove from Claude Desktop

1. Edit `claude_desktop_config.json`
2. Remove the `uswds` section
3. Restart Claude Desktop

### Delete the Server

```bash
cd /path/to/uswds-local-mcp-server
cd ..
rm -rf uswds-local-mcp-server
```

---

## Next Steps

- ✅ Read [QUICK_START.md](QUICK_START.md) for quick examples
- ✅ See [MCP_TOOLS_GUIDE.md](MCP_TOOLS_GUIDE.md) for tool documentation
- ✅ Check [CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md) for advanced config
- ✅ Review [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

---

## Getting Help

1. Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. Search [GitHub Issues](https://github.com/ctrimm/uswds-local-mcp-server/issues)
3. Open a new issue if needed

---

**Setup Complete!** 🎉

You're ready to use USWDS components with Claude!
