# NVM Setup Guide for MCP Server

This guide explains how to ensure your MCP server always uses Node.js 20+ when using `nvm` (Node Version Manager).

## Why This Matters

When Claude Desktop launches your MCP server, it may not automatically use the correct Node.js version managed by `nvm`. This can cause the `ReferenceError: File is not defined` error if an older Node version (like v18) is used.

## Automatic Version Management

This repository includes three key files to ensure the correct Node version is always used:

### 1. `.nvmrc` File

Specifies Node.js version 20 for this project:
```
20
```

When you run `nvm use` in the project directory, nvm will automatically use this version.

### 2. `package.json` Engines Field

Enforces Node.js version requirements:
```json
{
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=9.0.0"
  }
}
```

### 3. `start-mcp-server.sh` Wrapper Script

Automatically loads nvm and uses the correct Node version before starting the server.

## Setup Instructions

### Step 1: Install nvm (if not already installed)

#### macOS/Linux:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart your terminal or run:
source ~/.bashrc  # or ~/.zshrc for zsh
```

#### Verify nvm installation:
```bash
nvm --version
```

### Step 2: Install Node.js 20

```bash
# Navigate to the project directory
cd /path/to/uswds-local-mcp-server

# Install Node.js 20 (or use the version from .nvmrc)
nvm install 20

# Use Node.js 20
nvm use 20

# Set as default (optional - ensures all new terminals use this version)
nvm alias default 20

# Verify
node --version  # Should show v20.x.x
```

### Step 3: Auto-switch Node Versions (Optional but Recommended)

Configure your shell to automatically switch Node versions when entering the project directory.

#### For Zsh (macOS default):

Add to `~/.zshrc`:
```bash
# Automatically use nvm version from .nvmrc
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

#### For Bash:

Add to `~/.bashrc`:
```bash
# Automatically use nvm version from .nvmrc
cdnvm() {
    command cd "$@" || return $?
    nvm_path="$(nvm_find_nvmrc)"

    if [ -n "$nvm_path" ]; then
        nvm_version=$(nvm version)
        nvmrc_version=$(cat "${nvm_path}/.nvmrc")

        if [ "$nvm_version" != "$nvmrc_version" ]; then
            nvm use
        fi
    fi
}
alias cd='cdnvm'
cdnvm .
```

#### Reload your shell:
```bash
# For Zsh
source ~/.zshrc

# For Bash
source ~/.bashrc
```

Now when you `cd` into the project directory, it will automatically switch to Node 20!

### Step 4: Configure Claude Desktop

Update your Claude Desktop configuration to use the wrapper script:

#### macOS:
```bash
nano ~/Library/Application\ Support/Claude/claude_desktop_config.json
```

#### Linux:
```bash
nano ~/.config/Claude/claude_desktop_config.json
```

#### Windows (WSL):
```bash
nano ~/.config/Claude/claude_desktop_config.json
```

**Configuration:**
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

**Important:** Replace `/absolute/path/to/` with the actual path to your project directory.

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

## Verification

### Test the Wrapper Script Manually

```bash
cd /path/to/uswds-local-mcp-server

# Run the wrapper script
./start-mcp-server.sh
```

You should see:
```
Loading Node.js version from .nvmrc...
Now using node v20.x.x (npm v10.x.x)
Using Node.js v20.x.x
MCP Server starting...
```

### Test in Claude Desktop

1. Restart Claude Desktop
2. Check the Claude Desktop logs
3. Look for the server startup messages

**Expected logs:**
```
[uswds] [info] Loading Node.js version from .nvmrc...
[uswds] [info] Now using node v20.x.x
[uswds] [info] Using Node.js v20.x.x
[uswds] [info] MCP Server starting...
[uswds] [info] Server started and connected successfully
```

**No more `File is not defined` errors!**

## Troubleshooting

### Issue: "nvm: command not found" in Claude Desktop logs

**Cause:** Claude Desktop can't find nvm in its PATH.

**Solution:** The wrapper script includes common nvm locations. If it still doesn't work, you can hardcode the path to your Node.js 20 installation:

Find your Node 20 path:
```bash
nvm which 20
# Output example: /Users/username/.nvm/versions/node/v20.10.0/bin/node
```

Update Claude Desktop config to use the direct path:
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/Users/username/.nvm/versions/node/v20.10.0/bin/node",
      "args": ["/absolute/path/to/uswds-local-mcp-server/index.js"]
    }
  }
}
```

### Issue: "Node.js version 20+ required (found v18)"

**Cause:** The wrapper script found Node, but it's the wrong version.

**Solution:**
```bash
# Install Node 20
nvm install 20

# Make it the default
nvm alias default 20

# Verify
node --version
```

### Issue: Auto-switching not working

**Cause:** Shell configuration not loaded or syntax error.

**Solution:**
```bash
# Check if nvm is loaded
nvm --version

# Re-source your shell config
source ~/.zshrc  # or ~/.bashrc

# Test by cd-ing into the project
cd /path/to/uswds-local-mcp-server
node --version  # Should show v20.x.x
```

## Alternative: Use Node 20 as System Default

If you primarily work with Node 20, you can set it as your default:

```bash
# Install Node 20
nvm install 20

# Set as default for all new terminals
nvm alias default 20

# Verify in a new terminal
node --version  # Should show v20.x.x
```

Then in Claude Desktop config, you can use the simpler configuration:
```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/absolute/path/to/uswds-local-mcp-server/index.js"]
    }
  }
}
```

However, **using the wrapper script is recommended** because it ensures the correct version even if you change your default later.

## Quick Reference

```bash
# Check current Node version
node --version

# List installed Node versions
nvm list

# Install Node 20
nvm install 20

# Use Node 20
nvm use 20

# Set Node 20 as default
nvm alias default 20

# Use version from .nvmrc
nvm use

# Find Node 20 binary path
nvm which 20

# Test the wrapper script
./start-mcp-server.sh
```

## Additional Resources

- [nvm GitHub Repository](https://github.com/nvm-sh/nvm)
- [nvm-windows (for Windows)](https://github.com/coreybutler/nvm-windows)
- [Node.js 20 Documentation](https://nodejs.org/docs/latest-v20.x/api/)
- [MCP Server Configuration](https://docs.anthropic.com/claude/docs/mcp)

---

**Need Help?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more assistance.
