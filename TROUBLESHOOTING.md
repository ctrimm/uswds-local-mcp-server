# Troubleshooting Guide

Common issues and solutions for the USWDS MCP Server.

## Critical Issues

### ReferenceError: File is not defined

**Error Message:**
```
ReferenceError: File is not defined
    at Object.<anonymous> (/path/to/node_modules/undici/lib/web/webidl/index.js:531:48)
```

**Cause:**
You are running Node.js version 18 or earlier. The MCP server dependencies (specifically the `undici` package) require the `File` global API, which was added in Node.js version 20.

**Solution:**
Upgrade to Node.js 20 or later.

#### macOS (using Homebrew):
```bash
# Uninstall old version
brew uninstall node@18

# Install Node.js 20 or later
brew install node@20
# OR install the latest LTS version
brew install node

# Verify installation
node --version  # Should show v20.x.x or higher
```

#### macOS (using nvm - Recommended):
```bash
# Install nvm if not already installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js 20
nvm install 20

# Use Node.js 20
nvm use 20

# Set as default
nvm alias default 20

# Verify installation
node --version  # Should show v20.x.x or higher
```

#### Ubuntu/Debian:
```bash
# Remove old Node.js
sudo apt remove nodejs

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x or higher
```

#### Windows (using nvm-windows):
```powershell
# Install nvm-windows from: https://github.com/coreybutler/nvm-windows/releases

# Install Node.js 20
nvm install 20

# Use Node.js 20
nvm use 20

# Verify installation
node --version  # Should show v20.x.x or higher
```

#### After Upgrading:
```bash
# Navigate to your project directory
cd /path/to/uswds-local-mcp-server

# Clear node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies with the new Node.js version
npm install

# Rebuild the project
npm run build

# Restart Claude Desktop
```

#### Verification:
After upgrading and reinstalling, check your Claude Desktop logs. You should see:
```
USWDS MCP Server running in Vanilla/React mode
Available tools: list_components, get_component_info, ...
```

Instead of the `ReferenceError: File is not defined` error.

---

## Configuration Issues

### Server Not Showing Up in Claude Desktop

**Possible Causes:**
1. Incorrect path in configuration
2. JSON syntax error
3. Project not built
4. Claude Desktop not restarted properly

**Solutions:**

#### 1. Verify Configuration File Location

**macOS:**
```bash
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Linux:**
```bash
cat ~/.config/Claude/claude_desktop_config.json
```

**Windows (WSL):**
```bash
cat ~/.config/Claude/claude_desktop_config.json
```

#### 2. Check Configuration Format

Recommended configuration (using wrapper script):
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

**Important:**
- ✅ Use absolute paths (starts with `/`)
- ✅ Use forward slashes even on Windows
- ✅ Verify JSON is valid (use a JSON validator)
- ✅ No trailing commas

#### 3. Ensure Project is Built

```bash
cd /path/to/uswds-local-mcp-server

# Check if dist/ exists
ls dist/

# If not, build the project
npm run build

# Verify dist/index.js exists
ls dist/index.js
```

#### 4. Restart Claude Desktop Completely

1. **Quit Claude Desktop** (don't just close the window)
   - macOS: Cmd+Q or Claude → Quit
   - Windows: File → Exit
   - Linux: File → Quit
2. Wait 5 seconds
3. Relaunch Claude Desktop
4. Look for the 🔌 icon

---

## Build & Installation Issues

### Cannot Find Module Error

**Error Message:**
```
Error: Cannot find module '/path/to/dist/index.js'
```

**Solutions:**

```bash
# Navigate to project directory
cd /path/to/uswds-local-mcp-server

# Build the project
npm run build

# Verify dist/index.js exists
ls dist/index.js

# If still failing, clean and rebuild
rm -rf dist/
npm run build
```

### Module 'undici' Not Found

**Error Message:**
```
Error: Cannot find module 'undici'
```

**Solution:**
```bash
# Navigate to project directory
cd /path/to/uswds-local-mcp-server

# Install dependencies
npm install

# If issue persists, clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Permission Denied Error

**Error Message:**
```bash
bash: ./start-mcp-server.sh: Permission denied
```

**Solution:**
```bash
chmod +x start-mcp-server.sh
```

---

## Runtime Issues

### Server Crashes Immediately

**Check Logs:**

**macOS:**
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

**Linux:**
```bash
tail -f ~/.local/share/Claude/logs/mcp*.log
```

**Common Causes:**

1. **Wrong Node version** - Upgrade to Node 20+
2. **Missing dependencies** - Run `npm install`
3. **Syntax error in config** - Validate JSON
4. **File not executable** - Run `chmod +x start-mcp-server.sh`

### Tools Not Working in Claude

**Symptom:** Server connects but tools don't work

**Verification:**
```bash
# Test the server directly
node dist/index.js

# Should output available tools
# Press Ctrl+C to exit
```

**Test with MCP Inspector:**
```bash
npm run inspector
```

This opens a web interface where you can test each tool individually.

---

## Environment Variable Issues

### Wrong Component Mode

**Problem:** Getting React components when you want vanilla USWDS (or vice versa)

**Solution:**

Check your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "/path/to/start-mcp-server.sh",
      "env": {
        "USE_REACT_COMPONENTS": "false"  // <- Check this value
      }
    }
  }
}
```

- `"false"` = Vanilla USWDS (HTML/CSS)
- `"true"` = React-USWDS (React components)

After changing, restart Claude Desktop.

---

## Path Issues

### Path Not Found

**Error:** Can't find the start script or dist/index.js

**Solution - Get Absolute Path:**
```bash
# Navigate to project directory
cd /path/to/uswds-local-mcp-server

# Get absolute path
pwd

# Copy this path and use it in your config
# Example output: /Users/yourname/projects/uswds-local-mcp-server
```

Use this path in your Claude Desktop config:
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/Users/yourname/projects/uswds-local-mcp-server/start-mcp-server.sh",
      "args": []
    }
  }
}
```

---

## Testing & Debugging

### Test Without Claude Desktop

```bash
# Test the server directly
cd /path/to/uswds-local-mcp-server
node dist/index.js

# Should show:
# USWDS MCP Server running in Vanilla/React mode
# Available tools: list_components, get_component_info, ...
```

### Use MCP Inspector

The MCP Inspector lets you test tools in your browser:

```bash
npm run inspector
```

Opens at `http://localhost:6274` (or similar) where you can:
- See all available tools
- Test each tool with custom inputs
- View request/response JSON
- Debug issues

### Verify Dependencies

```bash
# Check Node version (must be 20+)
node --version

# Check npm version
npm --version

# Check if dependencies are installed
ls node_modules/@modelcontextprotocol/sdk

# Check if project is built
ls dist/index.js
```

---

## Getting Help

If you encounter issues not covered here:

1. **Check the Documentation:**
   - [README.md](README.md) - Project overview
   - [SETUP.md](SETUP.md) - Installation guide
   - [QUICK_START.md](QUICK_START.md) - Quick start
   - [CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md) - Configuration details
   - [NVM_SETUP.md](NVM_SETUP.md) - Node version management

2. **Check Logs:**
   - Claude Desktop logs contain detailed error messages
   - Look for the specific error message in this guide

3. **Search GitHub Issues:**
   - [GitHub Issues](https://github.com/ctrimm/uswds-local-mcp-server/issues)
   - Search for your error message

4. **Create a New Issue:**
   Include:
   - Your operating system and version
   - Node.js version (`node --version`)
   - Complete error message
   - Steps to reproduce
   - Claude Desktop logs (relevant portions)
   - Your configuration (with sensitive paths redacted)

---

## Quick Checklist

When troubleshooting, verify:

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Project dependencies installed (`npm install`)
- [ ] Project built (`npm run build`)
- [ ] `dist/index.js` exists
- [ ] Absolute path used in config (not relative)
- [ ] JSON config is valid (no syntax errors)
- [ ] Script is executable (`chmod +x start-mcp-server.sh`)
- [ ] Claude Desktop completely restarted
- [ ] Logs checked for specific errors

---

**Last Updated:** 2025-12-12
