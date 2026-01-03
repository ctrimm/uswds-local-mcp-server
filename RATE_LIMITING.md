# Rate Limiting & Abuse Protection

## Overview

This document outlines strategies to protect the USWDS MCP Server from abuse, including rate limiting, request throttling, and monitoring.

---

## 🎯 Goals

1. **Prevent abuse** - Stop malicious actors from overwhelming the server
2. **Fair usage** - Ensure all legitimate users get access
3. **Cost control** - Prevent runaway AWS bills from abuse
4. **Service quality** - Maintain fast response times for everyone

---

## 🛡️ Defense Layers

```
┌────────────────────────────────────────────┐
│         Layer 1: CloudFront WAF            │
│  - DDoS protection                         │
│  - Geographic blocking                     │
│  - IP reputation filtering                 │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│    Layer 2: API Gateway (Optional)         │
│  - Built-in throttling                     │
│  - API key management                      │
│  - Usage plans & quotas                    │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│      Layer 3: Lambda Code (Current)        │
│  - API key validation                      │
│  - Request counting                        │
│  - Custom rate limiting logic              │
└────────────────┬───────────────────────────┘
                 │
┌────────────────▼───────────────────────────┐
│    Layer 4: DynamoDB Rate Limiting         │
│  - Per-API-key quotas                      │
│  - Time-windowed limits                    │
│  - Distributed counter                     │
└────────────────────────────────────────────┘
```

---

## 🚀 Implementation Options

### Option 1: Lambda-Only Rate Limiting (Recommended for MVP)

**Pros:**
- ✅ No additional AWS services needed
- ✅ Simple to implement
- ✅ Low cost
- ✅ Works with current architecture

**Cons:**
- ⚠️ Not distributed (each Lambda instance has its own counter)
- ⚠️ Resets on cold starts
- ⚠️ Can be bypassed with multiple API keys

**Implementation:**

```typescript
// src/middleware/rate-limiter.ts
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class InMemoryRateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private windowMs = 60000; // 1 minute
  private maxRequests = 100; // 100 requests per minute per API key

  check(apiKey: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = this.limits.get(apiKey);

    // No entry or window expired - reset
    if (!entry || now > entry.resetTime) {
      this.limits.set(apiKey, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetIn: this.windowMs,
      };
    }

    // Within window - check limit
    if (entry.count < this.maxRequests) {
      entry.count++;
      return {
        allowed: true,
        remaining: this.maxRequests - entry.count,
        resetIn: entry.resetTime - now,
      };
    }

    // Limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

export const rateLimiter = new InMemoryRateLimiter();

// Cleanup every 5 minutes
setInterval(() => rateLimiter.cleanup(), 300000);
```

**Usage in Lambda handler:**

```typescript
// In lambda.ts handler
const { allowed, remaining, resetIn } = rateLimiter.check(apiKey);

if (!allowed) {
  return {
    statusCode: 429,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Limit': '100',
      'X-RateLimit-Remaining': '0',
      'X-RateLimit-Reset': String(Math.ceil(resetIn / 1000)),
      'Retry-After': String(Math.ceil(resetIn / 1000)),
    },
    body: JSON.stringify({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${Math.ceil(resetIn / 1000)} seconds.`,
    }),
  };
}

// Add rate limit headers to successful responses
headers['X-RateLimit-Limit'] = '100';
headers['X-RateLimit-Remaining'] = String(remaining);
headers['X-RateLimit-Reset'] = String(Math.ceil(resetIn / 1000));
```

**Suggested Limits:**
- **Free tier**: 1 request/minute, 100 requests/day
- **Paid tier**: 1,000 requests/minute, 1,000,000 requests/day

---

### Option 2: DynamoDB-Based Rate Limiting (Production Recommended)

**Pros:**
- ✅ Distributed across all Lambda instances
- ✅ Survives cold starts
- ✅ Accurate counting
- ✅ Supports complex quota rules

**Cons:**
- ⚠️ Additional cost (~$1-5/month)
- ⚠️ Slightly higher latency (5-20ms)
- ⚠️ More complex implementation

**Implementation:**

```typescript
// src/services/dynamodb-rate-limiter.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
}

export class DynamoDBRateLimiter {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    const ddbClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(ddbClient);
  }

  async check(
    apiKey: string,
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = now - config.windowSeconds;

    try {
      // Atomic increment with condition
      const result = await this.client.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { apiKey, window: String(windowStart) },
          UpdateExpression: 'ADD requestCount :inc SET expiresAt = :expiry',
          ExpressionAttributeValues: {
            ':inc': 1,
            ':expiry': now + config.windowSeconds,
            ':max': config.maxRequests,
          },
          ConditionExpression: 'attribute_not_exists(requestCount) OR requestCount < :max',
          ReturnValues: 'ALL_NEW',
        })
      );

      const count = result.Attributes?.requestCount || 1;
      return {
        allowed: true,
        remaining: config.maxRequests - count,
        resetAt: result.Attributes?.expiresAt || now + config.windowSeconds,
      };
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        // Limit exceeded - get current state
        const result = await this.client.send(
          new GetCommand({
            TableName: this.tableName,
            Key: { apiKey, window: String(windowStart) },
          })
        );

        return {
          allowed: false,
          remaining: 0,
          resetAt: result.Item?.expiresAt || now + config.windowSeconds,
        };
      }
      throw error;
    }
  }
}
```

**DynamoDB Table Schema:**

```typescript
// In sst.config.ts
const rateLimitTable = new sst.aws.Dynamo('RateLimitTable', {
  fields: {
    apiKey: 'string',
    window: 'string', // Timestamp bucket
  },
  primaryIndex: { hashKey: 'apiKey', rangeKey: 'window' },
  ttl: 'expiresAt', // Auto-delete old entries
});
```

**Cost Estimate:**
- 1M requests/month: ~$1.25 (read/write capacity)
- Storage: ~$0.25/GB (minimal - TTL auto-deletes)

---

### Option 3: API Gateway with Usage Plans (Easiest, Most Expensive)

**Pros:**
- ✅ No code needed - all configuration
- ✅ Built-in API key management
- ✅ Per-client usage plans
- ✅ CloudWatch metrics included

**Cons:**
- ⚠️ Additional cost (~$3.50 per million requests)
- ⚠️ Adds latency (~10-50ms)
- ⚠️ More complex architecture

**Implementation:**

```typescript
// In sst.config.ts (replace Function URL with API Gateway)
const api = new sst.aws.ApiGatewayV2('McpApi');

api.route('POST /', {
  handler: 'src/lambda.handler',
  throttle: {
    burstLimit: 1000,
    rateLimit: 500, // requests per second
  },
});

// Usage plan
const usagePlan = new aws.apigateway.UsagePlan('McpUsagePlan', {
  apiStages: [{
    apiId: api.id,
    stage: api.stage,
  }],
  throttleSettings: {
    burstLimit: 1000,
    rateLimit: 500,
  },
  quotaSettings: {
    limit: 1000000, // 1M requests
    period: 'MONTH',
  },
});
```

**Cost:**
- 1M requests: ~$3.50
- 10M requests: ~$35.00

---

### Option 4: CloudFront + WAF (Best for DDoS Protection)

**Pros:**
- ✅ Protects against DDoS attacks
- ✅ Geographic restrictions
- ✅ IP reputation filtering
- ✅ Custom rules (e.g., block IPs making >X requests/min)

**Cons:**
- ⚠️ Additional cost (~$1/month + $1 per million requests)
- ⚠️ More complex setup

**Implementation:**

```typescript
// In sst.config.ts
const waf = new aws.wafv2.WebAcl('McpWaf', {
  scope: 'CLOUDFRONT',
  defaultAction: { allow: {} },
  rules: [
    {
      name: 'RateLimitRule',
      priority: 1,
      statement: {
        rateBasedStatement: {
          limit: 2000, // 2000 requests per 5 minutes per IP
          aggregateKeyType: 'IP',
        },
      },
      action: { block: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'RateLimitRule',
      },
    },
    {
      name: 'GeoBlockRule',
      priority: 2,
      statement: {
        geoMatchStatement: {
          countryCodes: ['CN', 'RU'], // Example: block certain countries
        },
      },
      action: { block: {} },
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'GeoBlockRule',
      },
    },
  ],
  visibilityConfig: {
    cloudWatchMetricsEnabled: true,
    metricName: 'McpWaf',
    sampledRequestsEnabled: true,
  },
});

// Attach to CloudFront
const cdn = new sst.aws.Router('McpRouter', {
  routes: { '/*': mcpServer.url },
  transform: {
    distribution: {
      webAclId: waf.arn,
    },
  },
});
```

**Cost:**
- WAF: $5/month base + $1 per rule
- Rate limit rule: ~$0.60 per million requests
- **Total**: ~$6-7/month + per-request charges

---

## 🎯 Recommended Strategy

### Phase 1: MVP (Launch)
- ✅ **Option 1: In-memory rate limiting** in Lambda
- ✅ Simple API key authentication
- ✅ CloudWatch alarms for high request rates
- **Cost**: ~$2-5/month
- **Time**: 2-3 hours to implement

### Phase 2: Growth (100K+ requests/month)
- ✅ **Option 2: DynamoDB rate limiting**
- ✅ Per-API-key quotas
- ✅ Multiple tier support (free/paid)
- **Cost**: ~$5-10/month
- **Time**: 4-6 hours to implement

### Phase 3: Scale (1M+ requests/month)
- ✅ **Option 4: CloudFront + WAF**
- ✅ DDoS protection
- ✅ Geographic controls
- ✅ Keep DynamoDB for quota management
- **Cost**: ~$20-50/month
- **Time**: 1 day to implement

---

## 📊 Monitoring & Alerts

### CloudWatch Alarms

```typescript
// In sst.config.ts
new aws.cloudwatch.MetricAlarm('HighRequestRate', {
  metricName: 'Invocations',
  namespace: 'AWS/Lambda',
  statistic: 'Sum',
  period: 60, // 1 minute
  evaluationPeriods: 2,
  threshold: 10000, // 10K requests per minute
  comparisonOperator: 'GreaterThanThreshold',
  alarmActions: [snsTopicArn], // Send notification
  dimensions: {
    FunctionName: mcpServer.name,
  },
});

new aws.cloudwatch.MetricAlarm('HighErrorRate', {
  metricName: 'Errors',
  namespace: 'AWS/Lambda',
  statistic: 'Sum',
  period: 300, // 5 minutes
  evaluationPeriods: 1,
  threshold: 100,
  comparisonOperator: 'GreaterThanThreshold',
  alarmActions: [snsTopicArn],
  dimensions: {
    FunctionName: mcpServer.name,
  },
});

new aws.cloudwatch.MetricAlarm('HighThrottles', {
  metricName: 'Throttles',
  namespace: 'AWS/Lambda',
  statistic: 'Sum',
  period: 60,
  evaluationPeriods: 2,
  threshold: 10,
  comparisonOperator: 'GreaterThanThreshold',
  alarmActions: [snsTopicArn],
  dimensions: {
    FunctionName: mcpServer.name,
  },
});
```

### Custom Metrics

```typescript
// In lambda.ts
import { CloudWatch } from '@aws-sdk/client-cloudwatch';

const cw = new CloudWatch({});

async function trackRateLimitHit(apiKey: string) {
  await cw.putMetricData({
    Namespace: 'USWDS-MCP',
    MetricData: [
      {
        MetricName: 'RateLimitHits',
        Value: 1,
        Unit: 'Count',
        Dimensions: [
          { Name: 'ApiKey', Value: apiKey.substring(0, 8) + '...' },
        ],
      },
    ],
  });
}
```

---

## 🔐 Additional Protection Strategies

### 1. Request Validation

```typescript
function validateMCPRequest(body: any): boolean {
  if (body.jsonrpc !== '2.0') return false;
  if (!body.method || typeof body.method !== 'string') return false;
  if (body.id === undefined) return false;
  return true;
}
```

### 2. Payload Size Limits

```typescript
const MAX_PAYLOAD_SIZE = 1024 * 1024; // 1MB

if (event.body && event.body.length > MAX_PAYLOAD_SIZE) {
  return {
    statusCode: 413,
    body: JSON.stringify({ error: 'Payload Too Large' }),
  };
}
```

### 3. Timeout Protection

```typescript
// Reject requests that take too long
const timeoutMs = 30000; // 30 seconds

const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
);

const result = await Promise.race([
  processRequest(body),
  timeoutPromise,
]);
```

### 4. IP Blocking (Manual)

```typescript
const BLOCKED_IPS = new Set([
  '1.2.3.4',
  '5.6.7.8',
]);

const clientIp = event.requestContext.http.sourceIp;
if (BLOCKED_IPS.has(clientIp)) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Forbidden' }),
  };
}
```

### 5. User-Agent Filtering

```typescript
const userAgent = event.headers['user-agent'] || '';

// Block known bots/scrapers
const BLOCKED_AGENTS = [
  'curl', // Optional: block command-line tools
  'wget',
  'python-requests',
  'scrapy',
];

if (BLOCKED_AGENTS.some(agent => userAgent.toLowerCase().includes(agent))) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: 'Forbidden' }),
  };
}
```

---

## 📋 Implementation Checklist

### Phase 1: MVP (Recommended Start)
- [ ] Implement in-memory rate limiter
- [ ] Add rate limit headers to responses
- [ ] Return 429 status code when limited
- [ ] Log rate limit hits to CloudWatch
- [ ] Set up CloudWatch alarms
- [ ] Document rate limits in API docs
- [ ] Test with load testing tool

### Phase 2: Production Hardening
- [ ] Implement DynamoDB rate limiting
- [ ] Add per-API-key quotas
- [ ] Create usage tiers (free/paid)
- [ ] Add quota monitoring dashboard
- [ ] Implement graceful degradation
- [ ] Add automated abuse detection
- [ ] Set up alerting for abuse patterns

### Phase 3: Enterprise Scale
- [ ] Add CloudFront + WAF
- [ ] Configure geographic restrictions
- [ ] Set up DDoS protection
- [ ] Implement IP reputation filtering
- [ ] Add request signature validation
- [ ] Set up distributed tracing
- [ ] Create abuse response playbook

---

## 💰 Cost Comparison

| Solution | Setup Cost | Monthly Cost (1M req) | Monthly Cost (10M req) |
|----------|------------|----------------------|----------------------|
| **Lambda Only** | $0 | ~$2-5 | ~$20-50 |
| **Lambda + DynamoDB** | $0 | ~$5-10 | ~$30-60 |
| **API Gateway** | $0 | ~$8-12 | ~$50-80 |
| **CloudFront + WAF** | $0 | ~$10-15 | ~$60-100 |

**Recommendation**: Start with Lambda-only, upgrade to DynamoDB when you hit 100K requests/month.

---

## 📚 Resources

- [AWS Lambda Rate Limiting Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [DynamoDB Atomic Counters](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.AtomicCounters)
- [API Gateway Throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)
- [AWS WAF Rate-Based Rules](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html)
