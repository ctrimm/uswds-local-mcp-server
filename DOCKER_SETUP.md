# Docker Setup Guide

This guide covers running the USWDS MCP Server in Docker.

## ⚠️ Important: Docker vs Node.js

**We recommend using plain Node.js** for this server (see main README). Docker adds complexity and overhead with minimal benefit for this use case.

**Use Docker if:**
- You want consistency with other Docker-based MCP servers
- You don't want to install Node.js on your host
- You need strict environment isolation

**Use plain Node.js if:**
- You want fast startup times
- You're developing/extending this server
- You prefer simplicity

## Docker Setup Options

### Option 1: Persistent Container (Recommended if using Docker)

Like your `threads` and `points-yeah` servers - container stays running, Claude Desktop executes commands inside it.

#### Build and Start

```bash
# Build the image
npm run build  # Build dist/ first
docker-compose up -d

# Or manually:
docker build -t uswds-mcp-server .
docker run -d \
  --name uswds-mcp-persistent \
  -e USE_REACT_COMPONENTS=true \
  uswds-mcp-server tail -f /dev/null
```

#### Claude Desktop Config

```json
{
  "mcpServers": {
    "uswds": {
      "command": "docker",
      "args": ["exec", "-i", "uswds-mcp-persistent", "node", "dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

#### Management Commands

```bash
# Check if running
docker ps | grep uswds-mcp

# View logs
docker logs uswds-mcp-persistent

# Stop container
docker-compose down
# Or: docker stop uswds-mcp-persistent

# Restart after code changes
npm run build
docker-compose restart
# Or: docker restart uswds-mcp-persistent

# Remove container
docker-compose down -v
# Or: docker rm -f uswds-mcp-persistent
```

### Option 2: Ephemeral Container

Like your `github` server - new container spawned for each request (slower, but always fresh).

#### Build Image

```bash
npm run build
docker build -t uswds-mcp-server .
```

#### Claude Desktop Config

```json
{
  "mcpServers": {
    "uswds": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "USE_REACT_COMPONENTS=true",
        "uswds-mcp-server"
      ]
    }
  }
}
```

**Pros:**
- Always runs latest code
- No persistent container management

**Cons:**
- Slower startup (1-2 seconds per request)
- Higher resource usage

## Publishing to Docker Hub (Optional)

If you want to share this publicly:

```bash
# Build for multiple platforms
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t yourusername/uswds-mcp-server:latest \
  --push \
  .
```

Then users can use:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "USE_REACT_COMPONENTS=true",
        "yourusername/uswds-mcp-server:latest"
      ]
    }
  }
}
```

## Performance Comparison

Based on typical usage:

| Method | Startup Time | Memory Usage | Complexity |
|--------|--------------|--------------|------------|
| **Plain Node.js** | ~100ms | ~50MB | Low |
| **Docker (persistent)** | ~200ms | ~80MB | Medium |
| **Docker (ephemeral)** | ~1-2s | ~80MB per request | Medium |

## Rebuilding After Code Changes

### Plain Node.js
```bash
npm run build
# Restart Claude Desktop
```

### Docker (persistent)
```bash
npm run build
docker-compose build
docker-compose restart
# Restart Claude Desktop
```

### Docker (ephemeral)
```bash
npm run build
docker build -t uswds-mcp-server .
# Restart Claude Desktop
```

## Troubleshooting Docker

### Container not starting

```bash
# Check container logs
docker logs uswds-mcp-persistent

# Check if container exists
docker ps -a | grep uswds-mcp

# Remove and recreate
docker rm -f uswds-mcp-persistent
docker-compose up -d
```

### "Cannot connect to Docker daemon"

```bash
# Make sure Docker Desktop is running
# On macOS: Check if Docker Desktop app is open
# On Linux: sudo systemctl start docker
```

### "No such container"

```bash
# Recreate container
docker-compose up -d
```

### Slow performance

- Use persistent container instead of ephemeral
- Or switch to plain Node.js (recommended)

### Changes not reflected

```bash
# Rebuild image
npm run build
docker-compose build
docker-compose restart
```

## Recommendation

For this server specifically, **plain Node.js is better**:

```json
{
  "uswds": {
    "command": "node",
    "args": ["/absolute/path/to/uswds-local-mcp-server/dist/index.js"],
    "env": {
      "USE_REACT_COMPONENTS": "true"
    }
  }
}
```

It's simpler, faster, and easier to develop with. Docker is great for complex servers with external dependencies, but this server is self-contained and lightweight.
