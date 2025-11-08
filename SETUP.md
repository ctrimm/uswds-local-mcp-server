# Setup Guide

Complete setup instructions for the USWDS MCP Server & Agent Toolkit.

## System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04+, macOS 11+, or Windows 10+ with WSL2
- **Node.js**: 18.0.0 or higher
- **Python**: 3.10 or higher
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 5GB free space
- **Browser**: Chrome/Chromium 90+ (for browser server)

### Optional Requirements
- **GPU**: Not required (inference uses OLLAMA on CPU/GPU)
- **Git**: 2.30+ for version control features

## Installation Steps

### Step 1: System Dependencies

#### Ubuntu/Debian
```bash
# Update package list
sudo apt update

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Python 3.10
sudo apt install -y python3.10 python3.10-venv python3-pip

# Install Chrome for browser server
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y ./google-chrome-stable_current_amd64.deb

# Install build tools
sudo apt install -y build-essential git
```

#### macOS
```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Install Python
brew install python@3.10

# Install Chrome
brew install --cask google-chrome

# Install Git
brew install git
```

#### Windows (WSL2)
```powershell
# Install WSL2 with Ubuntu
wsl --install -d Ubuntu-22.04

# Then follow Ubuntu instructions above
```

### Step 2: Clone Repository

```bash
# Clone the repository
git clone https://github.com/yourusername/uswds-mcp-server.git
cd uswds-mcp-server

# Verify structure
ls -la
```

### Step 3: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
python3 -m pip install --upgrade pip
pip install -r requirements.txt

# Verify installations
node --version  # Should be 18+
npm --version
python3 --version  # Should be 3.10+
```

### Step 4: Download USWDS Repository

```bash
# Create data directory
mkdir -p data

# Clone USWDS repository for reference
git clone https://github.com/uswds/uswds.git data/uswds-repo

# Verify USWDS components are available
ls data/uswds-repo/packages/
```

### Step 5: Configuration

#### Create Environment File
```bash
# Copy example environment file
cp .env.example .env

# Edit configuration
nano .env
```

Example `.env`:
```bash
# MCP Server Configuration
MCP_FILESYSTEM_PORT=3001
MCP_DOCS_PORT=3002
MCP_VALIDATOR_PORT=3003
MCP_ACCESSIBILITY_PORT=3004
MCP_TOKENS_PORT=3005
MCP_BROWSER_PORT=3006
MCP_GIT_PORT=3007
MCP_PREVIEW_PORT=3000

# Paths
WORKSPACE_PATH=./workspace
USWDS_REPO_PATH=./data/uswds-repo
CACHE_PATH=./data/cache

# Agent Configuration
AGENT_MODEL_PROVIDER=ollama
AGENT_MODEL_NAME=uswds-coder
AGENT_MAX_ITERATIONS=10
AGENT_TEMPERATURE=0.7

# OLLAMA Configuration (if using)
OLLAMA_BASE_URL=http://localhost:11434

# OpenAI Configuration (if using)
# OPENAI_API_KEY=your-key-here

# Anthropic Configuration (if using)
# ANTHROPIC_API_KEY=your-key-here

# Feature Flags
ENABLE_AUTO_COMMIT=true
ENABLE_PREVIEW_GENERATION=true
ENABLE_CACHE=true

# Validation Configuration
WCAG_LEVEL=AA
MIN_ACCESSIBILITY_SCORE=8.0
VALIDATE_DESIGN_TOKENS=true

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/uswds-agent.log
```

#### Configure MCP Servers
```bash
# Edit MCP server configuration
nano config/mcp-config.json
```

Example `config/mcp-config.json`:
```json
{
  "servers": {
    "filesystem": {
      "enabled": true,
      "port": 3001,
      "workspace": "./workspace",
      "uswds_repo": "./data/uswds-repo",
      "allowed_extensions": [".html", ".css", ".js", ".json", ".md"]
    },
    "uswds-docs": {
      "enabled": true,
      "port": 3002,
      "cache_ttl": 3600,
      "base_url": "https://designsystem.digital.gov",
      "cache_dir": "./data/cache/docs"
    },
    "validator": {
      "enabled": true,
      "port": 3003,
      "rules_file": "./config/validation-rules.json",
      "strict_mode": false
    },
    "accessibility": {
      "enabled": true,
      "port": 3004,
      "wcag_level": "AA",
      "runners": ["axe-core", "pa11y"],
      "timeout": 30000
    },
    "design-tokens": {
      "enabled": true,
      "port": 3005,
      "tokens_file": "./data/uswds-repo/dist/json/uswds-tokens.json"
    },
    "browser": {
      "enabled": true,
      "port": 3006,
      "headless": true,
      "chrome_path": "/usr/bin/google-chrome",
      "default_viewport": {
        "width": 1280,
        "height": 720
      }
    },
    "git": {
      "enabled": true,
      "port": 3007,
      "default_branch": "main",
      "auto_commit": true,
      "commit_message_template": "feat: Add {component_name}"
    },
    "preview": {
      "enabled": true,
      "port": 3000,
      "hot_reload": true,
      "watch_patterns": ["workspace/**/*.html", "workspace/**/*.css"]
    }
  },
  "global": {
    "timeout": 30000,
    "retry_attempts": 3,
    "retry_delay": 1000
  }
}
```

#### Configure Validation Rules
```bash
# Edit validation rules
nano config/validation-rules.json
```

Example `config/validation-rules.json`:
```json
{
  "html": {
    "doctype-first": true,
    "attr-lowercase": true,
    "attr-value-double-quotes": true,
    "tag-pair": true,
    "spec-char-escape": true,
    "id-unique": true,
    "src-not-empty": true,
    "alt-require": true
  },
  "uswds": {
    "require_usa_prefix": true,
    "check_bem_modifiers": true,
    "validate_component_structure": true,
    "require_design_tokens": true,
    "max_nesting_depth": 10
  },
  "accessibility": {
    "wcag_level": "AA",
    "color_contrast_ratio": 4.5,
    "require_aria_labels": true,
    "require_semantic_html": true,
    "check_keyboard_navigation": true,
    "check_focus_indicators": true
  },
  "design_tokens": {
    "forbid_hex_colors": true,
    "forbid_px_values": false,
    "require_token_usage": true,
    "validate_contrast": true
  }
}
```

### Step 6: Create Directory Structure

```bash
# Create required directories
mkdir -p workspace
mkdir -p data/cache
mkdir -p logs
mkdir -p tests/fixtures

# Set permissions
chmod -R 755 workspace
chmod -R 755 data
chmod -R 755 logs
```

### Step 7: Install MCP Servers

```bash
# Install each server's dependencies
cd servers/filesystem && npm install && cd ../..
cd servers/uswds-docs && npm install && cd ../..
cd servers/validator && npm install && cd ../..
cd servers/accessibility && npm install && cd ../..
cd servers/design-tokens && npm install && cd ../..
cd servers/browser && npm install && cd ../..
cd servers/git && npm install && cd ../..
cd servers/preview && npm install && cd ../..

# Or use the setup script
npm run setup:servers
```

### Step 8: Install Agent Dependencies

```bash
# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install agent dependencies
pip install -r agent/requirements.txt

# Install LangGraph and MCP client
pip install langgraph langchain-core langchain-community
pip install mcp-client anthropic openai
```

### Step 9: Initialize Database (Optional)

If using component library database:

```bash
# Initialize SQLite database
npm run db:init

# Or manually
sqlite3 data/components.db < scripts/init-db.sql
```

### Step 10: Verify Installation

```bash
# Run health check script
npm run health-check

# Or manually check each component
node scripts/health-check.js
```

Expected output:
```
✓ Node.js: v18.17.0
✓ Python: 3.10.12
✓ Chrome: 119.0.6045.105
✓ USWDS Repository: Found (packages: 47)
✓ Workspace Directory: Ready
✓ Cache Directory: Ready
✓ Configuration Files: Valid
✓ MCP Servers: Ready to start
✓ Agent Dependencies: Installed

All systems ready!
```

## Starting the System

### Option 1: Start All Services

```bash
# Start all MCP servers and agent
npm start

# This will:
# 1. Start all enabled MCP servers
# 2. Start the preview server
# 3. Start the agent API server
# 4. Open browser to http://localhost:3000
```

### Option 2: Start Services Individually

```bash
# Terminal 1: Start MCP servers
npm run start:servers

# Terminal 2: Start agent
npm run start:agent

# Terminal 3: Start preview server (optional)
npm run start:preview
```

### Option 3: Development Mode

```bash
# Start with hot reload and verbose logging
npm run dev
```

## Verification Tests

### Test 1: MCP Server Connectivity

```bash
# Test each server endpoint
npm run test:connectivity

# Or manually
curl http://localhost:3001/health  # Filesystem
curl http://localhost:3002/health  # Docs
curl http://localhost:3003/health  # Validator
curl http://localhost:3004/health  # Accessibility
```

### Test 2: Generate Test Component

```bash
# Run simple generation test
npm run test:generate

# Or use Python
python agent/test_generation.py
```

Expected output:
```
Testing USWDS Agent...
✓ Agent initialized
✓ Connected to MCP servers
✓ Generated button component
✓ Validation passed (score: 10.0)
✓ File saved: workspace/test-button.html
✓ Preview generated

Test completed successfully!
```

### Test 3: Full Integration Test

```bash
# Run complete integration test
npm run test:integration

# This tests:
# - Component generation
# - Multi-layer validation
# - Git operations
# - Preview generation
# - Error handling
```

## Troubleshooting

### Issue: Port Already in Use

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

```bash
# Re-clone USWDS repository
rm -rf data/uswds-repo
git clone https://github.com/uswds/uswds.git data/uswds-repo

# Verify
ls data/uswds-repo/packages/
```

### Issue: Chrome/Chromium Not Found

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

```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall requirements
pip install -r requirements.txt
pip install -r agent/requirements.txt
```

### Issue: Permission Denied Errors

```bash
# Fix workspace permissions
sudo chown -R $USER:$USER workspace
chmod -R 755 workspace

# Fix data directory permissions
sudo chown -R $USER:$USER data
chmod -R 755 data
```

### Issue: MCP Servers Won't Start

```bash
# Check server logs
cat logs/mcp-servers.log

# Test server individually
node servers/filesystem/index.js

# Check Node version
node --version  # Must be 18+
```

### Issue: Agent Can't Connect to OLLAMA

```bash
# Verify OLLAMA is running
ollama list

# Check OLLAMA URL in .env
cat .env | grep OLLAMA_BASE_URL

# Test connection
curl http://localhost:11434/api/tags
```

## Advanced Configuration

### Using OpenAI Instead of OLLAMA

```bash
# Edit .env
AGENT_MODEL_PROVIDER=openai
AGENT_MODEL_NAME=gpt-4
OPENAI_API_KEY=your-api-key-here

# Remove OLLAMA configuration
# OLLAMA_BASE_URL=...
```

### Using Anthropic Claude

```bash
# Edit .env
AGENT_MODEL_PROVIDER=anthropic
AGENT_MODEL_NAME=claude-3-sonnet-20240229
ANTHROPIC_API_KEY=your-api-key-here
```

### Custom Validation Rules

```bash
# Add custom rules to config/validation-rules.json
{
  "custom_rules": {
    "require_custom_attribute": {
      "enabled": true,
      "attribute": "data-component-id",
      "message": "All components must have data-component-id"
    }
  }
}
```

### Multiple Workspaces

```bash
# Create additional workspaces
mkdir -p workspace-dev
mkdir -p workspace-prod

# Use environment variable to switch
WORKSPACE_PATH=./workspace-dev npm start
```

## Performance Tuning

### Optimize Cache Settings

```bash
# Edit config/mcp-config.json
{
  "uswds-docs": {
    "cache_ttl": 7200,  # Increase cache time
    "enable_memory_cache": true
  }
}
```

### Reduce Validation Strictness

```bash
# Edit config/validation-rules.json
{
  "uswds": {
    "require_usa_prefix": false,  # More lenient
    "check_bem_modifiers": false
  }
}
```

### Optimize Browser Server

```bash
# Edit config/mcp-config.json
{
  "browser": {
    "pool_size": 3,  # Reuse browser instances
    "cache_screenshots": true
  }
}
```

## Docker Setup (Alternative)

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Example `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mcp-servers:
    build: .
    ports:
      - "3000-3007:3000-3007"
    volumes:
      - ./workspace:/app/workspace
      - ./data:/app/data
    environment:
      - NODE_ENV=production

  agent:
    build: ./agent
    depends_on:
      - mcp-servers
    volumes:
      - ./workspace:/app/workspace
```

## Next Steps

1. ✅ Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand system design
2. ✅ Read [MCP_SERVERS.md](MCP_SERVERS.md) for server specifications
3. ✅ Check [DEVELOPMENT.md](DEVELOPMENT.md) for development workflow
4. ✅ See [TESTING.md](TESTING.md) for testing guidelines
5. ✅ Start building with [docs/tutorials/](docs/tutorials/)

## Support

If you encounter issues not covered here:

1. Check [Troubleshooting](#troubleshooting) section above
2. Search [GitHub Issues](https://github.com/yourusername/uswds-mcp-server/issues)
3. Review [Documentation](docs/)
4. Ask in [GitHub Discussions](https://github.com/yourusername/uswds-mcp-server/discussions)

---

**Setup Complete!** You're ready to generate USWDS components with AI assistance.
