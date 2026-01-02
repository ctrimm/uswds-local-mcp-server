# Deployment Guide

This guide covers deploying the USWDS MCP Server to AWS Lambda using SST V3.

## Architecture Overview

```
┌─────────────────┐
│   MCP Client    │ (Claude Desktop, Cursor, etc.)
└────────┬────────┘
         │
    ┌────┴─────┐
    │          │
LOCAL │      REMOTE (AWS Lambda)
    │          │
    ▼          ▼
┌────────┐  ┌──────────────────┐
│ stdio  │  │ Lambda Fn URL    │
│ process│  │ (Streamable HTTP)│
└────────┘  └────────┬─────────┘
                     │
            ┌────────▼──────────┐
            │  Lambda Function  │
            │  - Memory: 1GB    │
            │  - Timeout: 5min  │
            │  - Node.js 20     │
            └────────┬──────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼────┐ ┌───▼────┐ ┌───▼────────┐
    │ /tmp    │ │CloudWatch│ │ Secrets  │
    │ cache   │ │   Logs   │ │ Manager  │
    └─────────┘ └──────────┘ └──────────┘
```

---

## Prerequisites

### 1. AWS Account Setup

- **AWS Account**: Active AWS account with billing enabled
- **AWS CLI**: Installed and configured
  ```bash
  aws --version  # Should be v2.x
  aws configure  # Set up credentials
  ```

- **IAM Permissions**: Your AWS user needs permissions for:
  - Lambda (create, update, invoke)
  - CloudFormation (create stacks)
  - IAM (create roles)
  - CloudWatch Logs (create log groups)
  - Secrets Manager (create/read secrets)
  - S3 (SST uses S3 for state)

### 2. Local Development Setup

- **Node.js**: v20 or higher
- **npm**: v9 or higher
- **TypeScript**: Installed globally or via project

### 3. Install Dependencies

```bash
# Clone repository
git clone https://github.com/ctrimm/uswds-local-mcp-server.git
cd uswds-local-mcp-server

# Install dependencies
npm install

# Install SST (if not already in devDependencies)
npm install -D sst@latest @types/aws-lambda
```

---

## Local Development (stdio mode)

The default mode uses stdio transport for local MCP clients:

```bash
# Build
npm run build

# Run locally
npm run dev

# Test with MCP Inspector
npm run inspector
```

### Configure MCP Client (Local)

Add to your MCP client config (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/absolute/path/to/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

---

## AWS Lambda Deployment

### Step 1: Initialize SST

```bash
# First-time setup (creates .sst directory)
npx sst init
```

### Step 2: Set Secrets

```bash
# Set API key for authentication
npx sst secret set API_KEY "your-secure-random-key-here" --stage production

# Optional: Set for dev/staging stages
npx sst secret set API_KEY "dev-key" --stage dev
```

**Generate a secure API key:**
```bash
# macOS/Linux
openssl rand -base64 32

# Or Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 3: Deploy to AWS

```bash
# Deploy to dev stage (default)
npm run sst:deploy

# Deploy to production
npm run sst:deploy:prod

# Deploy to custom stage
npx sst deploy --stage staging
```

**First deployment takes 2-5 minutes**. Subsequent deployments are faster (~30 seconds).

### Step 4: Get Your Lambda Function URL

After deployment, SST outputs your function URL:

```
✔  Complete
   url: https://abc123xyz.lambda-url.us-east-1.on.aws
   functionArn: arn:aws:lambda:us-east-1:123456789012:function:...
   functionName: uswds-mcp-server-McpServer-abc123
```

**Save this URL** - you'll use it to connect remotely.

### Step 5: Test the Deployment

```bash
# Health check
curl https://YOUR-FUNCTION-URL/health

# MCP request (replace YOUR_API_KEY)
curl -X POST https://YOUR-FUNCTION-URL \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

---

## Remote MCP Client Configuration

### Option 1: API Key Authentication (Recommended)

```json
{
  "mcpServers": {
    "uswds-remote": {
      "url": "https://YOUR-FUNCTION-URL.lambda-url.us-east-1.on.aws",
      "transport": "http",
      "headers": {
        "x-api-key": "your-api-key-here"
      }
    }
  }
}
```

### Option 2: IAM Authentication (AWS-native)

If using IAM auth (change `authorization: "iam"` in sst.config.ts):

```json
{
  "mcpServers": {
    "uswds-remote": {
      "url": "https://YOUR-FUNCTION-URL.lambda-url.us-east-1.on.aws",
      "transport": "http",
      "auth": {
        "type": "aws-sigv4",
        "region": "us-east-1"
      }
    }
  }
}
```

---

## Multi-Stage Deployments

SST supports multiple stages (dev, staging, production):

### Development Stage
```bash
npx sst deploy --stage dev
```
- Lower retention (7 days logs)
- Debug logging enabled
- Removal policy: destroy
- Lower cost

### Production Stage
```bash
npx sst deploy --stage production
```
- Longer retention (30 days logs)
- Info logging only
- Removal policy: retain
- Optimized builds (minified)

### Custom Domain (Optional)

Uncomment the CloudFront section in `sst.config.ts`:

```typescript
const cdn = new sst.aws.Router('McpRouter', {
  routes: {
    '/*': mcpServer.url,
  },
  domain: {
    name: 'mcp.yourdomain.com',
    dns: sst.cloudflare.dns(), // or sst.aws.dns() for Route53
  },
});
```

Then deploy:
```bash
npx sst deploy --stage production
```

---

## Monitoring & Logs

### View Logs

```bash
# Tail logs in real-time
npx sst logs --stage production

# Via AWS CLI
aws logs tail /aws/lambda/uswds-mcp-server-McpServer-XXX --follow

# In AWS Console
# https://console.aws.amazon.com/cloudwatch/home#logsV2:log-groups
```

### CloudWatch Metrics

Navigate to CloudWatch → Metrics → Lambda to view:
- Invocations
- Duration
- Errors
- Throttles
- ConcurrentExecutions

### Set Up Alarms (Optional)

```bash
# Example: Alert on high error rate
aws cloudwatch put-metric-alarm \
  --alarm-name uswds-mcp-errors \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=FunctionName,Value=uswds-mcp-server-McpServer-XXX
```

---

## Updating the Deployment

### Code Changes

```bash
# 1. Make your changes
# 2. Build locally
npm run build

# 3. Test locally
npm test

# 4. Deploy
npm run sst:deploy:prod
```

### Update Secrets

```bash
# Rotate API key
npx sst secret set API_KEY "new-secure-key" --stage production
```

### Update Configuration

Edit `sst.config.ts` and redeploy:

```bash
npx sst deploy --stage production
```

---

## Troubleshooting

### Issue: Deployment Fails

**Check AWS credentials:**
```bash
aws sts get-caller-identity
```

**Check SST version:**
```bash
npx sst version
# Should be 3.x
```

**Clear SST cache:**
```bash
rm -rf .sst
npx sst deploy --stage dev
```

### Issue: Lambda Timeout

**Increase timeout in sst.config.ts:**
```typescript
timeout: '10 minutes', // Increase from 5
```

### Issue: Cold Starts

**Increase memory (improves CPU):**
```typescript
memory: '2048 MB', // Increase from 1024
```

**Enable provisioned concurrency (costs more):**
```typescript
transform: {
  function: {
    reservedConcurrentExecutions: 1,
  }
}
```

### Issue: Authentication Fails

**Verify API key:**
```bash
# List secrets
npx sst secret list --stage production

# Update if needed
npx sst secret set API_KEY "correct-key" --stage production
```

### Issue: 403 Forbidden

**Check CORS settings in sst.config.ts:**
```typescript
cors: {
  allowOrigins: ['*'], // Or specific origins
  allowHeaders: ['x-api-key', 'authorization', 'content-type'],
}
```

---

## Cost Optimization

### Current Costs (Estimated)

**Low usage (10K requests/month):**
- Lambda: ~$2-3/month
- CloudWatch: ~$1-2/month
- Secrets: ~$0.40/month
- **Total: ~$3-5/month**

**Medium usage (1M requests/month):**
- Lambda: ~$20-30/month
- CloudWatch: ~$5-10/month
- Secrets: ~$0.40/month
- **Total: ~$25-40/month**

### Optimization Tips

1. **Use /tmp caching** (already implemented)
2. **Increase memory** (paradoxically reduces costs by reducing duration)
3. **Use Graviton2** (arm64 - 20% cheaper):
   ```typescript
   architecture: 'arm64',
   ```
4. **Monitor unused stages**:
   ```bash
   npx sst remove --stage old-stage
   ```

---

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Deploy
        run: npx sst deploy --stage production
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

**Set GitHub secrets:**
1. Go to repo → Settings → Secrets → Actions
2. Add `AWS_ACCESS_KEY_ID`
3. Add `AWS_SECRET_ACCESS_KEY`

---

## Removal & Cleanup

### Remove a Stage

```bash
# Remove dev stage
npx sst remove --stage dev

# Remove production (careful!)
npx sst remove --stage production
```

**Note**: Production stage uses `removal: "retain"` to prevent accidental deletion.

### Manual Cleanup

If `sst remove` fails, manually delete via AWS Console:
1. CloudFormation → Delete stack `uswds-mcp-server-production`
2. Lambda → Delete function
3. CloudWatch → Delete log groups
4. Secrets Manager → Delete secrets
5. S3 → Delete SST state bucket

---

## Security Best Practices

1. **Use Secrets Manager** (already implemented)
2. **Rotate API keys regularly** (quarterly recommended)
3. **Restrict CORS** in production:
   ```typescript
   allowOrigins: ['https://yourdomain.com'],
   ```
4. **Enable AWS WAF** (optional, for DDoS protection)
5. **Use least-privilege IAM roles** (SST handles this)
6. **Monitor CloudWatch Logs** for suspicious activity

---

## Support & Resources

- **SST Documentation**: https://sst.dev/docs
- **MCP Specification**: https://modelcontextprotocol.io
- **Issues**: https://github.com/ctrimm/uswds-local-mcp-server/issues

---

## Quick Reference

### Common Commands

```bash
# Local development
npm run dev                  # Run locally (stdio)
npm run inspector            # Test with MCP Inspector

# Deployment
npm run sst:deploy           # Deploy to default stage
npm run sst:deploy:prod      # Deploy to production
npx sst deploy --stage dev   # Deploy to dev

# Secrets
npx sst secret set KEY value --stage production
npx sst secret list --stage production

# Logs & Monitoring
npx sst logs --stage production  # Tail logs
npx sst shell --stage production # Access AWS resources

# Cleanup
npx sst remove --stage dev   # Remove deployment
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_KEY` | Authentication key (Secret) | None |
| `USE_REACT_COMPONENTS` | Use React-USWDS | `true` |
| `LOG_LEVEL` | Logging level | `info` |
| `NODE_ENV` | Environment | `production` |

---

**Ready to deploy?** Run `npm run sst:deploy:prod` and you're live in minutes! 🚀
