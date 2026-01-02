# User Management & Email-Gated API Keys

Complete guide for the USWDS MCP Server email-gated API key system with DynamoDB user tracking and analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [User Flow](#user-flow)
- [Managing Users](#managing-users)
- [Analytics & Monitoring](#analytics--monitoring)
- [Block-list Management](#block-list-management)
- [CloudWatch Dashboards](#cloudwatch-dashboards)

---

## Overview

This system implements email-gated API keys to:
- ✅ Capture email addresses before granting access
- ✅ Track usage per user (requests, tools, timestamps)
- ✅ Block abusive users
- ✅ Support tiered access (free, pro, enterprise)
- ✅ Enable CloudWatch analytics dashboards

**Key Features:**
- Sign-up at https://uswdsmcp.com/signup
- Instant API key generation
- No credit card required for free tier
- Self-service key reset
- Detailed usage logging

---

## Architecture

### Components

1. **DynamoDB Tables**
   - `UsersTable`: Stores email → API key mappings
   - `UsageTable`: Stores detailed request logs

2. **Lambda Functions**
   - `SignupFunction`: Handles user registration
   - `ResetFunction`: Handles API key resets
   - `McpServer`: Main MCP server (validates against DynamoDB)

3. **Website**
   - `/signup`: Email collection form
   - `/getting-started`: Setup instructions

### Data Flow

```
User visits /signup
     ↓
Enters email
     ↓
SignupFunction → DynamoDB UsersTable
     ↓
Receives API key: uswds_abc123...
     ↓
Configures MCP client with API key
     ↓
Makes request → McpServer
     ↓
McpServer → DynamoDB (validate API key, check status)
     ↓
If valid → Process request
          → Update stats (UsersTable)
          → Log usage (UsageTable)
          → CloudWatch Logs
```

---

## Deployment

### 1. Deploy Infrastructure

```bash
# Deploy all components (DynamoDB + Lambdas)
npx sst deploy --stage production
```

**Output includes:**
```
✓  Complete
   signupUrl: https://abc123.lambda-url.us-east-1.on.aws
   resetUrl: https://def456.lambda-url.us-east-1.on.aws
   mcpUrl: https://ghi789.lambda-url.us-east-1.on.aws
   usersTableName: uswds-mcp-server-prod-UsersTable
   usageTableName: uswds-mcp-server-prod-UsageTable
```

### 2. Update Website

Edit `website/src/pages/signup.astro`:

```javascript
// Replace placeholder with actual signup URL
const SIGNUP_URL = 'https://abc123.lambda-url.us-east-1.on.aws';
```

### 3. Deploy Website

```bash
cd website
npm install
npm run build
npx sst deploy --stage production
```

---

## User Flow

### Sign-up Process

1. **User visits:** https://uswdsmcp.com/signup
2. **Enters email:** user@example.com
3. **Receives API key:** `uswds_x7k9m2p4a8c1d5e9f2b3h6j7k8l9m0n1`
4. **Saves securely** (shown only once)

### Configuration

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "uswds": {
      "url": "https://uswdsmcp.com",
      "headers": {
        "x-api-key": "uswds_x7k9m2p4a8c1d5e9f2b3h6j7k8l9m0n1"
      }
    }
  }
}
```

### API Key Reset

If user loses their API key:

1. **Visit:** https://uswdsmcp.com/signup
2. **Enter same email:** user@example.com
3. **Receive new API key** (old key invalidated)

---

## Managing Users

### CLI Tool

```bash
npm run manage-users <command> <param>
```

### Commands

#### Get User Details

```bash
npm run manage-users get user@example.com
```

**Output:**
```
User Details:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email:        user@example.com
API Key:      uswds_x7k9m2p4...
Tier:         free
Status:       active
Created:      2026-01-02T10:30:00.000Z
Updated:      2026-01-02T15:45:00.000Z
Requests:     245
Last Request: 2026-01-02T15:45:23.456Z
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Block User

```bash
npm run manage-users block spammer@example.com
```

**Output:**
```
✅ User blocked: spammer@example.com
   API Key: uswds_abc123...
   All requests from this user will be rejected.
```

**User sees (on next request):**
```json
{
  "error": "Unauthorized",
  "message": "Your account has been blocked. Contact support for assistance."
}
```

#### Unblock User

```bash
npm run manage-users unblock user@example.com
```

**Output:**
```
✅ User unblocked: user@example.com
   API Key: uswds_abc123...
   User can now make requests again.
```

#### View Usage History

```bash
npm run manage-users list-usage uswds_abc123...
```

**Output:**
```
Recent Usage (20 requests):
────────────────────────────────────────────────────────────────────────────────
Timestamp           | Email                 | Method       | Tool             | Status | Duration
────────────────────────────────────────────────────────────────────────────────
2026-01-02 15:45:23 | user@example.com      | tools/call   | list_components  |    200 |    45ms
2026-01-02 15:44:12 | user@example.com      | tools/call   | get_component... |    200 |   123ms
2026-01-02 15:43:05 | user@example.com      | tools/list   | -                |    200 |    12ms
────────────────────────────────────────────────────────────────────────────────
```

---

## Analytics & Monitoring

### DynamoDB Tables

#### UsersTable

```typescript
{
  email: "user@example.com",      // Partition Key
  apiKey: "uswds_abc123...",      // GSI Key
  tier: "free",                   // free | pro | enterprise
  status: "active",               // active | blocked | suspended
  createdAt: "2026-01-02T...",
  updatedAt: "2026-01-02T...",
  requestCount: 245,
  lastRequestAt: "2026-01-02T..."
}
```

#### UsageTable

```typescript
{
  apiKey: "uswds_abc123...",      // Partition Key
  timestamp: "2026-01-02T...",    // Sort Key
  email: "user@example.com",
  method: "tools/call",
  toolName: "list_components",
  statusCode: 200,
  duration: 45,
  ttl: 1734567890               // Auto-delete after 90 days
}
```

### CloudWatch Logs

Every request logs to CloudWatch:

```json
{
  "level": "INFO",
  "message": "Response: abc-123",
  "statusCode": 200,
  "duration": 45,
  "method": "tools/call",
  "email": "user@example.com",
  "requestId": "abc-123"
}
```

---

## Block-list Management

### Identifying Abusers

**Query DynamoDB for high-volume users:**

```bash
aws dynamodb scan \
  --table-name uswds-mcp-server-prod-UsersTable \
  --projection-expression "email,requestCount,status" \
  --filter-expression "requestCount > :threshold" \
  --expression-attribute-values '{":threshold":{"N":"50000"}}' \
  --region us-east-1
```

### Block Workflow

1. **Identify:** High request count or suspicious pattern
2. **Investigate:** `npm run manage-users list-usage <apiKey>`
3. **Block:** `npm run manage-users block email@example.com`
4. **Monitor:** Check CloudWatch for 401 errors

### Unblock Workflow

1. **User contacts support**
2. **Verify legitimate use**
3. **Unblock:** `npm run manage-users unblock email@example.com`
4. **Notify user**

---

## CloudWatch Dashboards

### Option 1: Log Insights Queries

**Total requests by email:**
```
fields @timestamp, email, method, toolName, statusCode, duration
| filter email = "user@example.com"
| stats count() by bin(5m)
```

**Most active users:**
```
fields email
| stats count() as requests by email
| sort requests desc
| limit 10
```

**Tool usage breakdown:**
```
fields toolName
| filter method = "tools/call"
| stats count() by toolName
| sort count desc
```

**Error rate:**
```
fields statusCode
| filter statusCode >= 400
| stats count() by statusCode, bin(5m)
```

### Option 2: Metric Filters

Create custom CloudWatch metrics from logs:

**1. Request count metric:**
```bash
aws logs put-metric-filter \
  --log-group-name /aws/lambda/uswds-mcp-server-prod-McpServer \
  --filter-name RequestCount \
  --filter-pattern '[timestamp, requestId, level, msg, statusCode, duration, method, email]' \
  --metric-transformations \
    metricName=RequestCount,metricNamespace=USWDS-MCP,metricValue=1,unit=Count
```

**2. Error rate metric:**
```bash
aws logs put-metric-filter \
  --log-group-name /aws/lambda/uswds-mcp-server-prod-McpServer \
  --filter-name ErrorRate \
  --filter-pattern '[timestamp, requestId, level = ERROR, ...]' \
  --metric-transformations \
    metricName=Errors,metricNamespace=USWDS-MCP,metricValue=1,unit=Count
```

**3. Average duration metric:**
```bash
aws logs put-metric-filter \
  --log-group-name /aws/lambda/uswds-mcp-server-prod-McpServer \
  --filter-name AvgDuration \
  --filter-pattern '[timestamp, requestId, level, msg, statusCode, duration, ...]' \
  --metric-transformations \
    metricName=Duration,metricNamespace=USWDS-MCP,metricValue=$duration,unit=Milliseconds
```

### Option 3: DynamoDB Analytics

**Query usage table for email:**

```bash
aws dynamodb query \
  --table-name uswds-mcp-server-prod-UsageTable \
  --key-condition-expression "apiKey = :key" \
  --expression-attribute-values '{":key":{"S":"uswds_abc123..."}}' \
  --scan-index-forward false \
  --limit 100 \
  --region us-east-1
```

**Aggregate statistics:**

```python
import boto3
from collections import Counter
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('uswds-mcp-server-prod-UsageTable')

# Get usage for the last 24 hours
since = (datetime.now() - timedelta(days=1)).isoformat()

response = table.scan(
    FilterExpression='#ts > :since',
    ExpressionAttributeNames={'#ts': 'timestamp'},
    ExpressionAttributeValues={':since': since}
)

# Count by email
by_email = Counter(item['email'] for item in response['Items'])
print("Top 10 users (last 24h):")
for email, count in by_email.most_common(10):
    print(f"  {email}: {count} requests")

# Count by tool
by_tool = Counter(item.get('toolName', 'unknown') for item in response['Items'])
print("\nMost used tools:")
for tool, count in by_tool.most_common(5):
    print(f"  {tool}: {count} uses")
```

---

## Rate Limiting

**Current limits (in-memory):**
- Free tier: 100 requests/minute, 10,000 requests/day
- Pro tier: 1,000 requests/minute, 1,000,000 requests/month
- Enterprise: Custom limits

**Upgrade to DynamoDB-based rate limiting:**

See [RATE_LIMITING.md](./RATE_LIMITING.md) for advanced implementation with per-tier quotas.

---

## Cost Estimates

**Monthly costs (10,000 active users, 1M requests/day):**

| Service | Usage | Cost |
|---------|-------|------|
| DynamoDB (Users) | 10K items, 1M reads | $0.30 |
| DynamoDB (Usage) | 30M items (30 days), 1M writes | $3.50 |
| Lambda (Signup) | 1K invocations/month | $0.00 |
| Lambda (MCP) | 1M invocations/day | $45.00 |
| CloudWatch Logs | 30GB/month | $15.00 |
| **Total** | | **~$65/month** |

**Note:** Usage table uses TTL (90 days) to auto-delete old records and control costs.

---

## Support & Troubleshooting

### Common Issues

**Q: User can't find their API key**
- **A:** They can reset it by signing up again with the same email

**Q: User getting 401 Unauthorized**
- **A:** Check if blocked: `npm run manage-users get email@example.com`

**Q: How to upgrade a user to Pro tier?**
- **A:** Update DynamoDB directly or create upgrade Lambda

**Q: Can I export all user emails?**
- **A:** Yes, scan UsersTable:
  ```bash
  aws dynamodb scan \
    --table-name uswds-mcp-server-prod-UsersTable \
    --projection-expression "email" \
    --region us-east-1
  ```

---

## Next Steps

- [ ] Add email sending for API key delivery (instead of showing on page)
- [ ] Create admin dashboard (React app + DynamoDB API)
- [ ] Implement Stripe billing for Pro/Enterprise tiers
- [ ] Add usage quotas per tier
- [ ] Create CloudWatch dashboard template
- [ ] Add DynamoDB Streams → Lambda → Real-time metrics

---

## Resources

- **AWS SDK Docs:** https://docs.aws.amazon.com/sdk-for-javascript/v3/
- **DynamoDB Best Practices:** https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html
- **CloudWatch Logs Insights:** https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html
- **SST Documentation:** https://sst.dev/docs
