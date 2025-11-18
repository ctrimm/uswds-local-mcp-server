# Claude Desktop Configuration Guide

Complete guide for configuring the USWDS MCP Server with Claude Desktop.

## Quick Start

### Step 1: Find Your Configuration File

Claude Desktop stores its configuration in different locations depending on your OS:

#### macOS:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

#### Linux:
```bash
~/.config/Claude/claude_desktop_config.json
```

#### Windows (WSL):
```bash
~/.config/Claude/claude_desktop_config.json
```

### Step 2: Get the Absolute Path to Your MCP Server

```bash
cd /path/to/uswds-local-mcp-server
pwd
# Copy the output - you'll need this absolute path
```

### Step 3: Configure Claude Desktop

Edit your configuration file:

#### macOS:
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### Linux/WSL:
```bash
nano ~/.config/Claude/claude_desktop_config.json
```

## Configuration Options

### Option 1: Using the Wrapper Script (Recommended for nvm users)

**Best for:** Users managing Node versions with nvm

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

**Example on macOS:**
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/Users/corytrimm/Documents/GitHub/uswds-local-mcp-server/start-mcp-server.sh",
      "args": []
    }
  }
}
```

**Benefits:**
- ✅ Automatically loads correct Node version from `.nvmrc`
- ✅ Validates Node version before starting
- ✅ Auto-installs required Node version if missing
- ✅ Works even if you switch Node versions later

### Option 2: Direct Node Path (For specific nvm version)

**Best for:** When you want to pin to a specific Node installation

First, find your Node 20 path:
```bash
nvm which 20
# Example output: /Users/corytrimm/.nvm/versions/node/v20.10.0/bin/node
```

Then configure:
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/Users/corytrimm/.nvm/versions/node/v20.10.0/bin/node",
      "args": [
        "/Users/corytrimm/Documents/GitHub/uswds-local-mcp-server/index.js"
      ]
    }
  }
}
```

**Benefits:**
- ✅ Direct path - very explicit
- ✅ No dependency on shell configuration

**Drawbacks:**
- ⚠️ Path breaks if you update Node 20 to a newer patch version
- ⚠️ Requires manual update if Node version changes

### Option 3: System Node (Not recommended if using nvm)

**Only if:** Node 20+ is your system default and you're not using nvm

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": [
        "/absolute/path/to/uswds-local-mcp-server/index.js"
      ]
    }
  }
}
```

**Risks:**
- ⚠️ Will use whatever Node version is first in PATH
- ⚠️ May use wrong version if you have multiple Node installations

## Complete Configuration Example

Here's a complete configuration with multiple MCP servers:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "/Users/corytrimm/Documents/GitHub/uswds-local-mcp-server/start-mcp-server.sh",
      "args": [],
      "env": {
        "LOG_LEVEL": "info"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/corytrimm/Documents/workspace"
      ]
    }
  },
  "globalShortcut": "Ctrl+Space"
}
```

## Adding Environment Variables

You can pass environment variables to your MCP server:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "/absolute/path/to/start-mcp-server.sh",
      "args": [],
      "env": {
        "NODE_ENV": "production",
        "LOG_LEVEL": "debug",
        "WORKSPACE_PATH": "/Users/corytrimm/Documents/workspace"
      }
    }
  }
}
```

## Testing Your Configuration

### Step 1: Restart Claude Desktop

After editing the configuration:
1. **Quit** Claude Desktop completely (not just close the window)
2. **Reopen** Claude Desktop

### Step 2: Check the Logs

#### macOS:
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

Or use Console.app:
1. Open Console.app
2. Search for "Claude"
3. Look for messages from your MCP server

#### Linux/WSL:
```bash
# Check system journal
journalctl -f | grep -i claude

# Or check .local/share/Claude/logs if it exists
tail -f ~/.local/share/Claude/logs/mcp*.log
```

### Step 3: Look for Success Messages

**Good output (working):**
```
[uswds] [info] Loading Node.js version from .nvmrc...
[uswds] [info] Now using node v20.10.0
[uswds] [info] Using Node.js v20.10.0
[uswds] [info] MCP Server starting...
[uswds] [info] Server started and connected successfully
```

**Bad output (Node version issue):**
```
[uswds] [error] ReferenceError: File is not defined
[uswds] [error] Server disconnected
```

**Bad output (path issue):**
```
[uswds] [error] spawn /wrong/path ENOENT
[uswds] [error] Failed to start server
```

## Troubleshooting

### "Server disconnected" Error

**Check:** Is the path in your config correct?

```bash
# Test the path from your config
/absolute/path/to/start-mcp-server.sh

# Should show:
# Loading Node.js version from .nvmrc...
# Using Node.js v20.x.x
# MCP Server starting...
```

### "ReferenceError: File is not defined"

**Check:** Is the wrapper script being used?

The wrapper script ensures Node 20+ is used. If you see this error, you're likely using Option 2 or 3 with Node 18.

**Fix:** Switch to Option 1 (wrapper script) or update your Node path to point to Node 20.

### "Permission denied" Error

**Check:** Is the wrapper script executable?

```bash
chmod +x /path/to/start-mcp-server.sh
```

### "nvm: command not found" in Wrapper Script

**Check:** Is nvm installed?

```bash
nvm --version
```

If nvm isn't found, the wrapper script will fall back to system Node. Make sure system Node is v20+:

```bash
node --version  # Must be v20+
```

Or install nvm:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # or ~/.zshrc
```

### Configuration Not Taking Effect

1. **Completely quit** Claude Desktop (check Activity Monitor/Task Manager to ensure it's not running)
2. **Delete** the logs to start fresh:
   ```bash
   # macOS
   rm ~/Library/Logs/Claude/mcp*.log

   # Linux
   rm ~/.local/share/Claude/logs/mcp*.log
   ```
3. **Reopen** Claude Desktop
4. **Check** the new logs

## Verification Checklist

Use this checklist to verify your setup:

- [ ] Claude Desktop config file exists and is valid JSON
- [ ] The `command` path is absolute (starts with `/`)
- [ ] The `command` path points to `start-mcp-server.sh`
- [ ] The wrapper script is executable (`chmod +x`)
- [ ] Node 20+ is installed (`nvm list` shows v20)
- [ ] The `.nvmrc` file exists in the project root
- [ ] Claude Desktop has been completely restarted
- [ ] Logs show "Using Node.js v20.x.x"
- [ ] Logs show "Server started and connected successfully"

## Common Configuration Mistakes

### ❌ Using Relative Paths
```json
{
  "command": "./start-mcp-server.sh"  // WRONG - must be absolute
}
```

### ✅ Using Absolute Paths
```json
{
  "command": "/Users/corytrimm/Documents/GitHub/uswds-local-mcp-server/start-mcp-server.sh"
}
```

### ❌ Using Tilde (~) for Home Directory
```json
{
  "command": "~/Documents/GitHub/uswds-local-mcp-server/start-mcp-server.sh"  // WRONG
}
```

### ✅ Using Full Path
```json
{
  "command": "/Users/corytrimm/Documents/GitHub/uswds-local-mcp-server/start-mcp-server.sh"
}
```

### ❌ Forgetting to Escape Spaces (in JSON strings, not needed)
```json
{
  "command": "/Users/cory trimm/Documents/GitHub/uswds-local-mcp-server/start-mcp-server.sh"
}
```
This is actually fine in JSON! Spaces in strings don't need escaping.

## Getting Your Absolute Path

### macOS/Linux:
```bash
cd /path/to/uswds-local-mcp-server
pwd
# Copy the output
```

Or in one command:
```bash
cd /path/to/uswds-local-mcp-server && echo "$(pwd)/start-mcp-server.sh"
# This gives you the full path to the script
```

### Example Output:
```
/Users/corytrimm/Documents/GitHub/uswds-local-mcp-server/start-mcp-server.sh
```

Copy this path directly into your Claude Desktop config!

## Next Steps

After configuring Claude Desktop:

1. ✅ Test the connection (see [Testing Your Configuration](#testing-your-configuration))
2. ✅ Review [NVM_SETUP.md](NVM_SETUP.md) for nvm-specific instructions
3. ✅ See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if issues persist
4. ✅ Start using the MCP server with Claude!

---

**Having Issues?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or open an issue on GitHub.
