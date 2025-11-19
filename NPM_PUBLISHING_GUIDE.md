# NPM Publishing Guide

This guide covers how to publish the USWDS MCP Server to NPM for easy installation by users.

## Pre-Publishing Checklist

### 1. Package Name Decision

You have two options:

#### Option A: Unscoped Package (Simpler, if available)
```json
"name": "uswds-mcp-server"
```
- Shorter, cleaner name
- Check availability: `npm search uswds-mcp-server`
- May already be taken

#### Option B: Scoped Package (Recommended)
```json
"name": "@ctrimm/uswds-mcp-server"
```
- Guaranteed available under your namespace
- Clear ownership
- Professional standard

**Recommendation**: Use scoped package `@ctrimm/uswds-mcp-server` for clarity and availability.

### 2. Version Strategy

Follow [Semantic Versioning](https://semver.org/):
- `0.1.0` - Initial pre-release version (current)
- `1.0.0` - First stable release
- `1.1.0` - Minor feature additions
- `1.0.1` - Patch/bug fixes

### 3. Required Files ✅

All files are already in place:
- ✅ `package.json` - Updated with publish scripts
- ✅ `.npmignore` - Controls what gets published
- ✅ `README.md` - Installation and usage docs
- ✅ `LICENSE` - AGPL-3.0 license
- ✅ `dist/` - Built code (created by `npm run build`)

## Publishing Steps

### First Time Setup

1. **Create NPM Account** (if you don't have one)
   ```bash
   # Visit https://www.npmjs.com/signup
   ```

2. **Login to NPM**
   ```bash
   npm login
   # Enter your credentials
   ```

3. **Verify Login**
   ```bash
   npm whoami
   # Should show your username
   ```

### Pre-Publish Checks

1. **Run Tests**
   ```bash
   npm test
   ```
   - Should show: **335 tests passing**
   - **67.59% coverage**

2. **Build Package**
   ```bash
   npm run build
   ```
   - Creates `dist/` directory with compiled code

3. **Test Locally**
   ```bash
   npm pack
   ```
   - Creates `uswds-mcp-server-0.1.0.tgz`
   - Check file size (should be <1MB)
   - Verify contents: `tar -tzf uswds-mcp-server-0.1.0.tgz`

4. **Inspect Package Contents**
   ```bash
   npm pack --dry-run
   ```
   - Shows what will be published
   - Should only include: `dist/`, `README.md`, `LICENSE`, `package.json`

### Publishing

#### Option 1: Publish as Public Package (Recommended)

```bash
# For unscoped package
npm publish

# For scoped package
npm publish --access public
```

#### Option 2: Publish Beta/Alpha Version

```bash
# Update version to beta
npm version 0.1.0-beta.1

# Publish with beta tag
npm publish --tag beta --access public
```

### Post-Publishing

1. **Verify on NPM**
   ```bash
   # Visit: https://www.npmjs.com/package/uswds-mcp-server
   # Or: https://www.npmjs.com/package/@ctrimm/uswds-mcp-server
   ```

2. **Test Installation**
   ```bash
   # Global install
   npm install -g uswds-mcp-server

   # Or with npx
   npx uswds-mcp-server
   ```

3. **Create GitHub Release**
   - Tag the version: `git tag v0.1.0`
   - Push tag: `git push origin v0.1.0`
   - Create release on GitHub with changelog

## User Installation Methods

Once published, users can install your package in several ways:

### Method 1: Global Install (Recommended for MCP servers)

```bash
npm install -g uswds-mcp-server
```

Then configure in their MCP client config file:

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

### Method 2: npx (No installation required)

```json
{
  "mcpServers": {
    "uswds": {
      "command": "npx",
      "args": ["uswds-mcp-server"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

### Method 3: Local Project Install

```bash
cd my-project
npm install uswds-mcp-server
```

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["./node_modules/uswds-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

## Version Updates

### Patch Release (Bug fixes)
```bash
npm version patch  # 0.1.0 -> 0.1.1
git push && git push --tags
npm publish --access public
```

### Minor Release (New features)
```bash
npm version minor  # 0.1.0 -> 0.2.0
git push && git push --tags
npm publish --access public
```

### Major Release (Breaking changes)
```bash
npm version major  # 0.1.0 -> 1.0.0
git push && git push --tags
npm publish --access public
```

## Automation Options

### GitHub Actions for Auto-Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - run: npm ci
      - run: npm test
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

Then add `NPM_TOKEN` to your GitHub repository secrets.

## Package Statistics & Promotion

### After Publishing

1. **Add NPM badge to README**
   ```markdown
   [![npm version](https://badge.fury.io/js/uswds-mcp-server.svg)](https://www.npmjs.com/package/uswds-mcp-server)
   [![npm downloads](https://img.shields.io/npm/dm/uswds-mcp-server.svg)](https://www.npmjs.com/package/uswds-mcp-server)
   ```

2. **Submit to MCP Server Directory**
   - Add to: https://github.com/modelcontextprotocol/servers
   - Create PR with your server details

3. **Promote on Social Media**
   - Share on Twitter/X with hashtags: #MCP #USWDS #ClaudeAI
   - Post on Reddit: r/ClaudeAI, r/webdev
   - Share in USWDS Slack community

## Troubleshooting

### "Package name already exists"
- Use scoped package: `@ctrimm/uswds-mcp-server`
- Or choose a different name: `uswds-mcp`, `mcp-uswds-server`, etc.

### "You do not have permission to publish"
- Make sure you're logged in: `npm whoami`
- For scoped packages, add `--access public`

### "prepublishOnly script failed"
- Fix any test failures first
- Fix any TypeScript errors
- Ensure all builds pass

## Summary

**Quick Publish Checklist:**
- [ ] All tests passing (335 tests)
- [ ] Update version if needed (`npm version`)
- [ ] Run `npm pack --dry-run` to preview
- [ ] Run `npm publish --access public`
- [ ] Verify on npmjs.com
- [ ] Test installation: `npm install -g uswds-mcp-server`
- [ ] Create GitHub release
- [ ] Update README with installation instructions
- [ ] Submit to MCP servers directory

## Support

After publishing, users can:
- Report issues: https://github.com/ctrimm/uswds-local-mcp-server/issues
- View docs: https://github.com/ctrimm/uswds-local-mcp-server#readme
- Check NPM page: https://www.npmjs.com/package/uswds-mcp-server
