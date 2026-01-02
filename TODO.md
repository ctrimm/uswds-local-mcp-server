# TODO List

## 🔴 Critical Priority

### Fix Lambda MCP Request Handler
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 2-3 hours

The Lambda handler doesn't properly route MCP requests to the server. Currently returns a placeholder message instead of executing tools.

**Tasks:**
- [ ] Implement proper MCP request routing in `src/lambda.ts`
- [ ] Parse incoming JSON-RPC requests (method, params, id)
- [ ] Route `tools/list` to ListToolsRequestSchema handler
- [ ] Route `tools/call` to CallToolRequestSchema handler
- [ ] Format responses according to MCP spec
- [ ] Add request validation (jsonrpc version, required fields)
- [ ] Test all 18 tools via HTTP/Lambda
- [ ] Update VALIDATION.md when complete

**Acceptance Criteria:**
- All 18 MCP tools work when called via Lambda Function URL
- Proper JSON-RPC 2.0 responses returned
- Error handling for invalid requests
- Tests pass for Lambda handler

---

## 🟠 High Priority

### Implement Rate Limiting
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 3-4 hours

Add rate limiting to prevent abuse of the MCP server.

**Phase 1: MVP (Start Here)**
- [ ] Implement in-memory rate limiter (`src/middleware/rate-limiter.ts`)
- [ ] Add rate limit checks to Lambda handler
- [ ] Return 429 status code when limit exceeded
- [ ] Add rate limit headers (X-RateLimit-*)
- [ ] Log rate limit hits to CloudWatch
- [ ] Set initial limits: 100 req/min, 10K req/day per API key
- [ ] Document rate limits in README.md
- [ ] Test with load testing tool (Apache Bench or Artillery)

**Phase 2: Production (Later)**
- [ ] Implement DynamoDB-based rate limiter
- [ ] Create DynamoDB table in SST config
- [ ] Add per-API-key quota tracking
- [ ] Support multiple usage tiers (free/paid)
- [ ] Add quota monitoring dashboard

**Resources:**
- See `RATE_LIMITING.md` for detailed implementation guide
- AWS Lambda throttling best practices

---

### Create Marketing Website (uswdsmcp.com)
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 1-2 days

Build a marketing site to explain how to interface with the USWDS MCP Server.

**Domain Setup:**
- [ ] Purchase domain: `uswdsmcp.com`
- [ ] Configure DNS (Route53 or Cloudflare)
- [ ] Set up SSL certificate

**Site Content:**
- [ ] **Home Page**
  - Hero section with tagline
  - Key features overview
  - Quick start guide
  - Supported clients (Claude Desktop, Cursor, Cline, etc.)
  - Architecture diagram from README

- [ ] **Getting Started**
  - Local installation instructions
  - Remote deployment guide (link to DEPLOY.md)
  - MCP client configuration examples
  - First request walkthrough

- [ ] **Documentation**
  - All available tools (18 tools)
  - Tool usage examples
  - Code snippets for each tool
  - API reference (MCP JSON-RPC endpoints)

- [ ] **Pricing / Usage Tiers**
  - Free tier: 10K requests/day
  - Paid tier: 1M requests/month
  - Enterprise: Custom limits
  - Pricing calculator

- [ ] **Developer Resources**
  - Link to GitHub repository
  - Changelog / Release notes
  - ARCHITECTURE.md
  - Contributing guide
  - Community Discord/Slack

- [ ] **API Status Page**
  - Real-time server status
  - Uptime statistics
  - Incident history
  - Subscribe to status updates

**Technology Stack Options:**
- **Option 1: Next.js + Vercel** (Recommended)
  - Fast deployment
  - Built-in SEO
  - Edge functions for dynamic content
  - Cost: Free tier or ~$20/month

- **Option 2: Astro + Cloudflare Pages**
  - Ultra-fast static site
  - Great SEO
  - Cost: Free

- **Option 3: Simple HTML/CSS + S3 + CloudFront**
  - Dead simple
  - Cost: ~$1-2/month

**Design Inspiration:**
- [Stripe Docs](https://stripe.com/docs) - Clear, developer-focused
- [Vercel Docs](https://vercel.com/docs) - Clean, searchable
- [Supabase](https://supabase.com) - Good hero, clear CTAs
- [MCP Official Site](https://modelcontextprotocol.io) - Match MCP branding

**Deliverables:**
- [ ] Live website at `https://uswdsmcp.com`
- [ ] API documentation
- [ ] Interactive tool explorer
- [ ] Quick start guide
- [ ] Link to GitHub repo
- [ ] Status page

---

## 🟡 Medium Priority

### Add Comprehensive Testing
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 4-6 hours

**Lambda Handler Tests:**
- [ ] Unit tests for authentication
- [ ] Unit tests for rate limiting
- [ ] Unit tests for MCP request routing
- [ ] Integration tests with MCP SDK
- [ ] Mock Lambda events/contexts

**Load Testing:**
- [ ] Test with 100 concurrent requests
- [ ] Test with 1000 concurrent requests
- [ ] Measure cold start times
- [ ] Measure warm start times
- [ ] Test cache hit rates

**Tools to Use:**
- Jest for unit tests
- Artillery for load testing
- AWS Lambda Power Tuning for optimization

---

### Improve Error Handling
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 2-3 hours

- [ ] Create custom error types
- [ ] Add proper HTTP status codes
- [ ] Improve error messages
- [ ] Log stack traces to CloudWatch
- [ ] Add error categorization (client vs server errors)
- [ ] Return user-friendly error messages

---

### CloudWatch Monitoring & Alerts
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 2-3 hours

**Alarms:**
- [ ] High request rate (>10K/min)
- [ ] High error rate (>1%)
- [ ] High throttles (>10/min)
- [ ] Long duration (>5s p99)
- [ ] High cost (>$X/day)

**Dashboard:**
- [ ] Request count over time
- [ ] Error rate over time
- [ ] Cache hit rate
- [ ] Average duration
- [ ] Concurrent executions
- [ ] Cost tracking

**SNS Notifications:**
- [ ] Email alerts for critical issues
- [ ] Slack/Discord webhook integration

---

## 🟢 Low Priority

### Documentation Improvements
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 2-3 hours

- [ ] Add troubleshooting guide to DEPLOY.md
- [ ] Add FAQ section to README
- [ ] Add video walkthrough (optional)
- [ ] Add OpenAPI/Swagger spec
- [ ] Add Postman collection
- [ ] Update diagrams with actual architecture

---

### Performance Optimizations
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 3-4 hours

- [ ] Enable Graviton2 (ARM64) for 20% cost savings
- [ ] Tune Lambda memory settings
- [ ] Implement Lambda SnapStart (if available for Node.js)
- [ ] Add CloudFront caching for frequently requested data
- [ ] Optimize bundle size (tree-shaking)
- [ ] Add compression (gzip/brotli)

---

### Multi-Region Deployment
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 1 day

- [ ] Deploy to us-east-1 (primary)
- [ ] Deploy to eu-west-1 (Europe)
- [ ] Deploy to ap-southeast-1 (Asia)
- [ ] Set up Route53 latency-based routing
- [ ] Add health checks
- [ ] Test failover scenarios

---

### API Key Management Portal
**Status:** Not Started
**Assignee:** -
**Estimated Time:** 2-3 days

Web portal for users to manage their API keys:

- [ ] User authentication (Auth0 or Cognito)
- [ ] API key generation
- [ ] Usage dashboard (requests, quotas, billing)
- [ ] API key revocation
- [ ] Usage analytics
- [ ] Billing integration (Stripe)

---

## 📋 Future Enhancements

### Advanced Features
- [ ] Webhook support for async operations
- [ ] Request caching at CloudFront level
- [ ] GraphQL endpoint (in addition to MCP)
- [ ] WebSocket support for real-time updates
- [ ] Batch request support
- [ ] Response compression
- [ ] Request signing for enhanced security

### Developer Experience
- [ ] TypeScript SDK for direct API access
- [ ] Python SDK
- [ ] CLI tool for testing
- [ ] VSCode extension
- [ ] Playwright tests for end-to-end testing

### Business Features
- [ ] Team accounts (multiple users per API key)
- [ ] Custom domains for enterprise
- [ ] SLA guarantees
- [ ] Dedicated support
- [ ] White-label option

---

## ✅ Completed

- [x] Initial Lambda handler implementation
- [x] Multi-layer caching service (L1 + L2)
- [x] SST V3 configuration
- [x] API key authentication
- [x] DEPLOY.md documentation
- [x] ARCHITECTURE.md documentation
- [x] README.md architecture section
- [x] Health check endpoint
- [x] CloudWatch logging
- [x] All 18 MCP tools defined

---

## 📊 Progress Tracking

**Overall Progress:** 40% complete

| Category | Progress |
|----------|----------|
| Core Lambda Functionality | 70% |
| Rate Limiting | 0% |
| Testing | 20% |
| Documentation | 80% |
| Marketing Site | 0% |
| Monitoring | 30% |
| Performance | 50% |

---

## 🎯 Next 3 Items to Work On

1. **Fix Lambda MCP Request Handler** (Critical - blocks deployment)
2. **Implement MVP Rate Limiting** (High - blocks public launch)
3. **Create Marketing Website** (High - needed for user onboarding)

**Estimated time to production-ready:** 5-7 days
