# Architecture Documentation

## Overview

The USWDS MCP Server supports **dual-mode deployment**:
1. **Local Mode**: stdio transport for development
2. **Remote Mode**: AWS Lambda with HTTP transport for production

This document details the serverless architecture, caching strategy, and request flow.

---

## System Architecture

### High-Level Overview

```
┌────────────────────────────────────────────────────────────────┐
│                        MCP Clients                             │
│  (Claude Desktop, Cursor, Cline, Windsurf, etc.)              │
└───────────┬────────────────────────────────────┬───────────────┘
            │                                    │
      LOCAL MODE                            REMOTE MODE
            │                                    │
┌───────────▼───────────┐           ┌────────────▼──────────────┐
│  stdio Transport      │           │ HTTP Transport (Lambda)   │
│  - Development        │           │ - Production              │
│  - Fast iteration     │           │ - Scalable                │
│  - No cost            │           │ - Pay-per-use             │
└───────────┬───────────┘           └────────────┬──────────────┘
            │                                    │
            └────────────┬──────────────────────┘
                         │
            ┌────────────▼──────────────┐
            │      MCP Server Core      │
            │   - Tool Registry         │
            │   - Request Routing       │
            │   - Response Formatting   │
            └────────────┬──────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼───────┐ ┌─────▼──────┐ ┌──────▼────────┐
│  Services     │ │   Cache    │ │  Data Layer   │
│  - Component  │ │   Multi-   │ │  - Static     │
│  - Validation │ │   Layer    │ │  - Embedded   │
│  - Tokens     │ │            │ │               │
└───────────────┘ └────────────┘ └───────────────┘
```

---

## Lambda Architecture (Remote Mode)

### Request Flow

```
1. Client Request
   ↓
2. Lambda Function URL (HTTPS endpoint)
   - CORS handling
   - API key validation
   ↓
3. Lambda Handler (lambda.ts)
   - Authentication
   - Session management
   - Logging
   ↓
4. Service Layer
   - Check cache (L1/L2)
   - Execute business logic
   - Return results
   ↓
5. Response
   - Format as MCP protocol
   - Stream back to client
```

### Detailed Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                              │
│  POST https://xyz.lambda-url.us-east-1.on.aws                      │
│  Headers: x-api-key, Content-Type                                  │
│  Body: {"jsonrpc":"2.0", "method":"tools/call", ...}              │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                ┌────────────▼─────────────┐
                │  Lambda Function URL     │
                │  - Public HTTPS endpoint │
                │  - No API Gateway needed │
                │  - CORS configured       │
                └────────────┬─────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Cold Start Detection     │
                │  New container? Yes │ No  │
                │      ↓               ↓    │
                │  Initialize     Reuse      │
                │  services       cached     │
                └────────────┬──────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Authentication           │
                │  - Check x-api-key        │
                │  - Validate against secret│
                │  - Return 401 if invalid  │
                └────────────┬──────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Parse MCP Request        │
                │  - Extract method         │
                │  - Extract tool name      │
                │  - Extract arguments      │
                └────────────┬──────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Route to Service         │
                │  tools/call → handler     │
                │  tools/list → handler     │
                └────────────┬──────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Execute Tool             │
                │  ┌─────────────────────┐  │
                │  │ Check Cache (L1)    │  │
                │  │   ↓ HIT → Return    │  │
                │  │   ↓ MISS            │  │
                │  │ Check Cache (L2)    │  │
                │  │   ↓ HIT → Return    │  │
                │  │   ↓ MISS            │  │
                │  │ Execute Logic       │  │
                │  │   ↓                 │  │
                │  │ Cache Result (L1+L2)│  │
                │  └─────────────────────┘  │
                └────────────┬──────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Format MCP Response      │
                │  {                        │
                │    "jsonrpc": "2.0",     │
                │    "id": 1,              │
                │    "result": {...}       │
                │  }                        │
                └────────────┬──────────────┘
                             │
                ┌────────────▼──────────────┐
                │  Log Metrics              │
                │  - Request ID             │
                │  - Duration               │
                │  - Cache hits/misses      │
                │  - CloudWatch Logs        │
                └────────────┬──────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────────┐
│                         CLIENT RESPONSE                             │
│  Status: 200 OK                                                     │
│  Body: {"jsonrpc":"2.0", "id":1, "result":{...}}                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Multi-Layer Caching Strategy

### Why Caching Matters

Lambda is **stateless** by default, but containers are **reused for 15-45 minutes** after the first invocation. This "warm" period allows us to implement effective caching.

### Cache Layers

```
┌──────────────────────────────────────────────────────┐
│              REQUEST FOR "Button" COMPONENT          │
└─────────────────────────┬────────────────────────────┘
                          │
          ┌───────────────▼────────────────┐
          │  L1: Memory Cache              │
          │  - In-process Map<>            │
          │  - <1ms latency                │
          │  - Survives warm starts        │
          │  - Lost on cold starts         │
          └───────────────┬────────────────┘
                    HIT │ │ MISS
                        │ │
                  ┌─────┘ └─────┐
                  │              │
            ┌─────▼─────┐        │
            │  RETURN   │        │
            └───────────┘        │
                          ┌──────▼─────────────────────┐
                          │  L2: /tmp Cache            │
                          │  - File system             │
                          │  - 1-5ms latency           │
                          │  - Survives warm starts    │
                          │  - Up to 10GB available    │
                          │  - Lost on cold starts     │
                          └──────┬─────────────────────┘
                            HIT │ │ MISS
                                │ │
                          ┌─────┘ └─────┐
                          │              │
                    ┌─────▼─────┐  ┌────▼────────────────────┐
                    │  POPULATE │  │  L3: Embedded Data      │
                    │  L1 CACHE │  │  - Bundled JSON         │
                    │  RETURN   │  │  - <1ms latency         │
                    └───────────┘  │  - Always available     │
                                   │  - No external deps     │
                                   └────┬────────────────────┘
                                        │
                                  ┌─────▼─────┐
                                  │  POPULATE │
                                  │  L1 + L2  │
                                  │  RETURN   │
                                  └───────────┘
```

### Cache Performance

| Layer | Latency | Shared? | Survives Cold Start? | Max Size |
|-------|---------|---------|---------------------|----------|
| **L1: Memory** | <1ms | No | ❌ No | ~500MB |
| **L2: /tmp** | 1-5ms | No | ❌ No | 10GB |
| **L3: Embedded** | <1ms | Yes | ✅ Yes | ~50MB |

### Cache Implementation

#### L1: In-Memory Cache

```typescript
// Global singleton - persists across warm starts
const memoryCache = new Map<string, CacheEntry>();

async function get<T>(key: string): Promise<T | null> {
  const cached = memoryCache.get(key);
  if (cached && isValid(cached.timestamp)) {
    return cached.data;
  }
  return null;
}
```

#### L2: /tmp Directory Cache

```typescript
// Lambda /tmp directory - up to 10GB
const tmpDir = '/tmp/mcp-cache';

async function getFromTmp<T>(key: string): Promise<T | null> {
  const filePath = path.join(tmpDir, `${key}.json`);
  const stat = await fs.stat(filePath);

  if (Date.now() - stat.mtimeMs < TTL) {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }

  return null;
}
```

#### L3: Embedded Data

```typescript
// Bundled with Lambda deployment
import { REACT_COMPONENTS } from './data/react-components.js';

function getEmbedded(name: string) {
  return REACT_COMPONENTS[name];
}
```

---

## Cold Start Optimization

### What is a Cold Start?

When Lambda hasn't been invoked recently (~15-45 min), it must:
1. Provision a new execution environment (container)
2. Download your code package
3. Initialize Node.js runtime
4. Run global scope code

**Total time: 100-500ms**

### Optimization Strategies

#### 1. Container Reuse (Implemented)

Global variables persist across warm starts:

```typescript
// GOOD: Global singleton
let servicesInitialized = false;
let componentService: ComponentService;

export const handler = async (event) => {
  if (!servicesInitialized) {
    // Cold start - initialize once
    componentService = new ComponentService();
    servicesInitialized = true;
  }

  // Use cached service
  return componentService.handle(event);
};
```

```typescript
// BAD: Reinitializes every time
export const handler = async (event) => {
  const service = new ComponentService(); // ❌ Slow
  return service.handle(event);
};
```

#### 2. Increase Memory (Implemented)

More memory = more CPU = faster cold starts:
- 512MB: ~500ms cold start
- 1024MB: ~250ms cold start
- 2048MB: ~150ms cold start

**Our config: 1024MB** (good balance)

#### 3. Use Graviton2 (Optional)

ARM64 architecture is 20% cheaper and slightly faster:

```typescript
// In sst.config.ts
architecture: 'arm64', // vs 'x86_64'
```

#### 4. Provisioned Concurrency (Costs More)

Keep 1+ instances always warm:

```typescript
reservedConcurrentExecutions: 1, // Always 1 warm instance
```

**Trade-off**: ~$10-15/month per instance, but 0ms cold starts.

---

## Scaling & Concurrency

### Auto-Scaling

Lambda automatically scales:

| Concurrent Requests | Lambda Behavior |
|---------------------|-----------------|
| 1-10 | Reuses existing containers |
| 10-100 | Creates new containers (cold starts) |
| 100-1000 | Burst capacity (automatic) |
| 1000+ | Regional quota (can be increased) |

### Concurrency Limits

**Default account limits:**
- 1000 concurrent executions per region
- Can increase to 10,000+ via support ticket

**Our config: Unlimited** (uses account default)

---

## Data Sources

### Static Data (Embedded)

```typescript
// src/data/react-components.ts
export const REACT_COMPONENTS = {
  Button: { /* ... */ },
  Alert: { /* ... */ },
  // ... 40+ components
};
```

**Benefits:**
- Always available
- No network calls
- Fast access (<1ms)
- Versioned with code

**Size:** ~50KB compressed

### Dynamic Data (Fetched)

```typescript
// src/services/tailwind-uswds-service.ts
async getComponentDocs(name: string) {
  // Fetch from v2.uswds-tailwind.com
  // Cache for 1 hour
}
```

**Benefits:**
- Always up-to-date
- Smaller deployment package

**Trade-offs:**
- Network latency (10-100ms)
- External dependency
- Rate limiting concerns

---

## Security Model

### Authentication Flow

```
┌────────────┐
│   Client   │
└──────┬─────┘
       │ 1. Request with API key
       │ Header: x-api-key: abc123
       ▼
┌──────────────────┐
│  Lambda Handler  │
│                  │
│  2. Extract key  │
│     from header  │
│                  │
│  3. Get secret   │
│     from AWS     │
│     Secrets Mgr  │
│                  │
│  4. Compare keys │
│     Match? Y │ N │
│         ↓        ↓
│     Allow    401 Unauthorized
└──────────────────┘
```

### Secrets Management

**Storage:**
- AWS Secrets Manager (encrypted at rest)
- Auto-rotation support
- Audit logging via CloudTrail

**Access:**
- Lambda has IAM role with `secretsmanager:GetSecretValue`
- Secrets cached in Lambda memory for warm starts
- Never logged or exposed

---

## Monitoring & Observability

### CloudWatch Logs

Every request logs:
```
[INFO] Request: abc123 { method: 'POST', path: '/' }
[INFO] Tool called: get_component_info { component_name: 'Button' }
[Cache] L1 HIT: component:Button
[INFO] Response: abc123 { statusCode: 200, duration: 45 }
```

### CloudWatch Metrics (Automatic)

- **Invocations**: Total requests
- **Duration**: Execution time (ms)
- **Errors**: Failed requests
- **Throttles**: Concurrency limit hits
- **IteratorAge**: (N/A for our use case)

### Custom Metrics (Optional)

```typescript
import { CloudWatch } from '@aws-sdk/client-cloudwatch';

await cloudwatch.putMetricData({
  Namespace: 'USWDS-MCP',
  MetricData: [{
    MetricName: 'CacheHitRate',
    Value: cacheHits / totalRequests,
    Unit: 'Percent',
  }],
});
```

---

## Cost Model

### Lambda Pricing (us-east-1)

- **Requests**: $0.20 per 1M requests
- **Duration**: $0.0000166667 per GB-second

### Example Costs

**Scenario 1: Low Usage (10K requests/month)**
- Requests: 10,000 × $0.0000002 = **$0.002**
- Duration: 10,000 × 2s × 1GB × $0.0000166667 = **$0.33**
- CloudWatch: ~**$1.00**
- Secrets: **$0.40**
- **Total: ~$2/month**

**Scenario 2: Medium Usage (1M requests/month)**
- Requests: 1,000,000 × $0.0000002 = **$0.20**
- Duration: 1M × 2s × 1GB × $0.0000166667 = **$33**
- CloudWatch: ~**$5.00**
- Secrets: **$0.40**
- **Total: ~$38/month**

**Scenario 3: High Usage (10M requests/month)**
- Requests: **$2.00**
- Duration: **$333**
- CloudWatch: ~**$20**
- Secrets: **$0.40**
- **Total: ~$355/month**

---

## Limitations & Considerations

### Lambda Limits

| Limit | Value | Impact |
|-------|-------|--------|
| Max timeout | 15 minutes | Long operations may timeout |
| Max memory | 10GB | Large data processing limited |
| Max payload | 6MB request / 6MB response | Large responses need streaming |
| /tmp size | 10GB | Ample space for cache |

### Mitigation Strategies

**For large responses:**
- Use pagination
- Stream responses (future enhancement)
- Store in S3 and return URL

**For long operations:**
- Use Step Functions (if >15 min)
- Break into smaller operations
- Use SQS for async processing

---

## Future Enhancements

1. **Full Streamable HTTP Transport**
   - Implement MCP SDK's StreamableHTTPServerTransport
   - Enable proper session management
   - Support server-sent events (SSE)

2. **Distributed Caching**
   - Add ElastiCache Redis layer
   - Share cache across Lambda instances
   - Reduce cold start impact

3. **Monitoring Dashboard**
   - CloudWatch Dashboard
   - Real-time metrics
   - Alerting on errors

4. **API Gateway Integration**
   - Rate limiting
   - API keys management
   - Request throttling

5. **Multi-Region Deployment**
   - Global low latency
   - High availability
   - Disaster recovery

---

## References

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [SST V3 Documentation](https://sst.dev/docs)
- [MCP Specification](https://modelcontextprotocol.io)
- [Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
