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

# Restart the MCP server
# (Usually through Claude Desktop or your configured method)
```

#### Verification:
After upgrading and reinstalling, check your Claude Desktop logs. You should see:
```
[uswds] [info] Server started and connected successfully
```

Instead of the `ReferenceError: File is not defined` error.

---

## Other Common Issues

### Issue: Port Already in Use

**Error Message:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port
lsof -i :3000  # Replace 3000 with your port

# Kill process
kill -9 <PID>

# Or change port in .env file
nano .env
# Edit: MCP_PREVIEW_PORT=3001
```

### Issue: USWDS Repository Not Found

**Error Message:**
```
Error: USWDS repository not found at ./data/uswds-repo
```

**Solution:**
```bash
# Re-clone USWDS repository
rm -rf data/uswds-repo
mkdir -p data
git clone https://github.com/uswds/uswds.git data/uswds-repo

# Verify
ls data/uswds-repo/packages/
```

### Issue: Chrome/Chromium Not Found

**Error Message:**
```
Error: Could not find Chrome executable
```

**Solution:**
```bash
# Find Chrome installation
which google-chrome
which chromium-browser

# Update chrome_path in config/mcp-config.json
# Or install Chrome:
# Ubuntu: sudo apt install google-chrome-stable
# macOS: brew install --cask google-chrome
```

### Issue: Python Module Not Found

**Error Message:**
```
ModuleNotFoundError: No module named 'langgraph'
```

**Solution:**
```bash
# Ensure virtual environment is activated
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Reinstall requirements
pip install -r requirements.txt
pip install -r agent/requirements.txt
```

### Issue: Permission Denied Errors

**Error Message:**
```
Error: EACCES: permission denied
```

**Solution:**
```bash
# Fix workspace permissions
sudo chown -R $USER:$USER workspace
chmod -R 755 workspace

# Fix data directory permissions
sudo chown -R $USER:$USER data
chmod -R 755 data
```

### Issue: MCP Servers Won't Start

**Error Message:**
```
Server disconnected. For troubleshooting guidance...
```

**Solution:**
```bash
# Check server logs (in Claude Desktop logs or your configured log location)
# Look for specific error messages

# Test server individually
cd /path/to/uswds-local-mcp-server
node index.js  # or your main server file

# Check Node version
node --version  # Must be 20+

# Verify all dependencies are installed
npm install
```

### Issue: Agent Can't Connect to OLLAMA

**Error Message:**
```
Error: Could not connect to OLLAMA at http://localhost:11434
```

**Solution:**
```bash
# Verify OLLAMA is running
ollama list

# Check OLLAMA URL in .env
cat .env | grep OLLAMA_BASE_URL

# Test connection
curl http://localhost:11434/api/tags

# Start OLLAMA if not running
ollama serve
```

### Issue: Module 'undici' Not Found

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
```

---

## Debugging Tips

### Enable Verbose Logging

In your `.env` file:
```bash
LOG_LEVEL=debug
```

Or in Claude Desktop config:
```json
{
  "mcpServers": {
    "uswds": {
      "command": "/path/to/start-mcp-server.sh",
      "env": {
        "LOG_LEVEL": "debug"
      }
    }
  }
}
```

### Check MCP Server Configuration

For detailed Claude Desktop configuration instructions, see **[CLAUDE_DESKTOP_CONFIG.md](CLAUDE_DESKTOP_CONFIG.md)**.

Quick check of your configuration file:

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

Recommended configuration (using wrapper script):
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

### Check Claude Desktop Logs

**macOS:**
```bash
tail -f ~/Library/Logs/Claude/mcp*.log
```

**Linux:**
```bash
tail -f ~/.local/share/Claude/logs/mcp*.log
```

### Test Dependencies Manually

```bash
# Test Node.js
node --version

# Test npm
npm --version

# Test Python (if using agent)
python3 --version

# Test Chrome (if using browser server)
google-chrome --version
```

---

## Getting Help

If you encounter issues not covered here:

1. Check the [SETUP.md](SETUP.md) documentation
2. Review Claude Desktop logs for specific error messages
3. Search [GitHub Issues](https://github.com/yourusername/uswds-mcp-server/issues)
4. Create a new issue with:
   - Your operating system and version
   - Node.js version (`node --version`)
   - Complete error message
   - Steps to reproduce
   - Claude Desktop logs (if applicable)

---

**Last Updated:** 2025-11-18
