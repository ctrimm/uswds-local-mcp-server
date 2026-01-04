# MCP Server Architecture

This document outlines the current architecture of the USWDS MCP Server and planned improvements.

## Current Architecture (v0.2.0 - MVP)

### Endpoints

```
Production:
├── https://api.uswdsmcp.com/          → MCP Server (tools/list, tools/call)
├── https://api.uswdsmcp.com/signup    → User signup (future CloudFront routing)
├── https://api.uswdsmcp.com/reset     → API key reset (future CloudFront routing)
└── https://api.uswdsmcp.com/admin/*   → Admin API (future CloudFront routing)

Development:
└── https://{stage}-api.uswdsmcp.com/  → Stage-specific deployments
```

**Note**: Currently, signup/reset/admin use direct Lambda Function URLs. CloudFront routing to be configured in deployment.

### Transport Protocol

**Current**: Basic HTTP with JSON-RPC 2.0
- Single POST endpoint for MCP requests
- Supports `tools/list` and `tools/call` methods
- Standard JSON request/response format

**MCP Methods Supported**:
- `tools/list` - List all available USWDS components
- `tools/call` - Generate component code or get component info

### Authentication

**Method**: API Key via HTTP headers
- `Authorization: Bearer {api-key}` (preferred)
- `x-api-key: {api-key}` (alternative)

**User Management**:
- Email-based registration
- Free tier: 1 req/min, 100 req/day
- Admin accounts with elevated privileges

### Security Features

✅ **Implemented**:
- API key authentication
- Rate limiting (in-memory, per API key)
- Origin header validation (prevents DNS rebinding)
- CORS configuration
- Admin access control (IS_ADMIN flag)
- DynamoDB encryption at rest
- CloudWatch logging (30-day retention)

⚠️ **Needs Configuration**:
- CORS origins (currently `*`, should restrict to specific domains)
- CloudWatch alarms (monitoring)

### Infrastructure

**AWS Services**:
- **Lambda Functions**:
  - McpServer (1024 MB, 5 min timeout)
  - SignupFunction (512 MB, 30 sec timeout)
  - ResetFunction (512 MB, 30 sec timeout)
  - AdminFunction (512 MB, 30 sec timeout)
- **DynamoDB Tables**:
  - UsersTable (email → user data with isAdmin flag)
  - UsageTable (API key → usage logs, 90-day TTL)
- **CloudFront CDN**: Custom domain with auto SSL
- **Cloudflare DNS**: Domain management

**External Services**:
- **Resend**: Email notifications (mail.uswdsmcp.com)

### Caching Strategy

**Lambda Cache** (in-memory):
- Component metadata (24-hour TTL)
- Layout patterns (24-hour TTL)
- Clears on cold start

**No External Cache**: CloudFront caching disabled (dynamic content)

---

## MCP Best Practices Compliance

### ✅ What We Do Right

1. **HTTPS Only** - All traffic via CloudFront with auto SSL
2. **Secure Authentication** - API key-based with rate limiting
3. **JSON-RPC 2.0** - Standard MCP protocol format
4. **Origin Validation** - Prevents DNS rebinding attacks
5. **User Management** - Complete signup/reset/admin flows
6. **Error Handling** - Graceful failures with proper error codes

### ⚠️ Areas for Improvement (v2.0 Roadmap)

Based on the [MCP 2025-03-26 Specification](https://modelcontextprotocol.io) and production servers like [SimpleScraper](https://simplescraper.io/docs/mcp-server):

#### 1. Endpoint Convention
**Current**: `https://api.uswdsmcp.com/` (root)
**Best Practice**: `https://api.uswdsmcp.com/mcp` (explicit path)

**Why**: Makes it clearer this is an MCP endpoint, follows convention

**Impact**: Low (works fine, just not conventional)

#### 2. Streamable HTTP Transport
**Current**: Basic HTTP with JSON request/response
**Best Practice**: [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports) (2025-03-26 spec)

**Features**:
- Single `POST /mcp` endpoint
- Supports both batch (JSON) and streaming (SSE) responses
- More efficient for large responses

**Impact**: Moderate (current approach works but is less efficient)

#### 3. Session Management
**Current**: Stateless requests
**Best Practice**: `Mcp-Session-Id` header for persistent sessions

**Benefits**:
- Better for conversation-based interactions
- Enables server-side state management
- More efficient caching

**Impact**: Low for current use cases, higher for future features

#### 4. OAuth 2.1 Discovery
**Current**: API key only
**Best Practice**: OAuth 2.1 with discovery endpoints

**Endpoints**:
- `/.well-known/oauth-authorization-server`
- `/.well-known/openid-configuration`

**Impact**: Low (API keys work fine for our use case)

#### 5. CORS Restriction
**Current**: `allowOrigins: ['*']`
**Best Practice**: Specific domain whitelist

**Impact**: Security concern (should be addressed before v1.0)

---

## Migration Path: MVP → v2.0

### Phase 1: MVP Launch (Current)
**Goal**: Get to production quickly with proven patterns

**What We Have**:
- ✅ Working MCP server (tools/list, tools/call)
- ✅ User management (signup, reset, admin)
- ✅ Rate limiting and auth
- ✅ Email notifications
- ✅ Custom domain with SSL
- ✅ Origin validation

**What's Missing** (acceptable for MVP):
- `/mcp` endpoint convention (using root instead)
- Streamable HTTP transport (using basic HTTP)
- Session management (stateless is fine)
- OAuth discovery (API keys sufficient)

### Phase 2: Security Hardening (Pre-v1.0)
**Priority**: Before announcing publicly

**Tasks**:
1. Restrict CORS origins to specific domains
2. Set up CloudWatch alarms (error rate, latency, rate limits)
3. Add monitoring dashboard
4. Load testing (verify 1 req/min works correctly)

### Phase 3: v2.0 Improvements (Post-Launch)
**Priority**: After MVP is stable

**Major Changes**:
1. **Refactor to `/mcp` endpoint**
   - Update CloudFront routing
   - Maintain backward compatibility with root endpoint
   - Update documentation

2. **Implement Streamable HTTP transport**
   - Add SSE support for streaming responses
   - Keep JSON support for batch requests
   - Lambda streaming response mode

3. **Add session management**
   - Implement `Mcp-Session-Id` header
   - DynamoDB session table
   - Server-side conversation state

4. **OAuth 2.1 support** (optional)
   - Add discovery endpoints
   - Implement OAuth flow for enterprise clients
   - Keep API key support for simple cases

---

## Decision: MVP Launch Strategy

### Recommended Approach

**Launch with current architecture** because:
1. ✅ Fully functional and tested (406 tests passing)
2. ✅ Secure (origin validation, rate limiting, auth)
3. ✅ Follows JSON-RPC 2.0 spec (core MCP requirement)
4. ✅ Production-ready infrastructure (CloudFront, DynamoDB)
5. ✅ Complete user management (signup, reset, admin)

**Address these before v1.0**:
1. 🔧 Restrict CORS origins
2. 🔧 Set up CloudWatch alarms
3. 📝 Document current limitations

**Defer to v2.0**:
1. 📋 Refactor to `/mcp` endpoint
2. 📋 Streamable HTTP transport
3. 📋 Session management
4. 📋 OAuth 2.1 discovery

### Why This Makes Sense

**For Users**:
- MCP clients (Claude Desktop, etc.) work fine with current setup
- API key authentication is simpler than OAuth for most users
- Stateless requests are easier to debug

**For Development**:
- Get feedback on core functionality first
- Avoid premature optimization
- Can refactor based on real usage patterns

**For Business**:
- Launch faster (ready now vs 2-3 weeks)
- Validate product-market fit
- Iterate based on user feedback

---

## Comparison: Our Server vs SimpleScraper

| Feature | USWDS MCP | SimpleScraper | Notes |
|---------|-----------|---------------|-------|
| **Endpoint** | `https://api.uswdsmcp.com/` | `https://mcp.simplescraper.io/mcp` | We use root, they use `/mcp` |
| **Transport** | Basic HTTP | Streamable HTTP | Both work, theirs is newer spec |
| **Auth** | API Key | API Key | Same approach |
| **Sessions** | No | Yes (Mcp-Session-Id) | Not critical for our use case |
| **HTTPS** | Yes (CloudFront) | Yes | Same |
| **Rate Limiting** | Yes (1/min, 100/day) | Unknown | We have it |
| **Custom Domain** | Yes | Yes | Same |
| **Origin Validation** | Yes | Likely | We have it |

**Verdict**: Our architecture is comparable. Main difference is we use basic HTTP instead of Streamable HTTP (acceptable for MVP).

---

## Testing Against MCP Spec

### Compliant

- ✅ JSON-RPC 2.0 format
- ✅ HTTPS required
- ✅ Authentication (API key)
- ✅ Error handling (standard codes)
- ✅ Tool definitions schema
- ✅ Security (origin validation)

### Non-Critical Deviations

- ⚠️ Root endpoint vs `/mcp` (convention, not requirement)
- ⚠️ Basic HTTP vs Streamable HTTP (both valid transports)
- ⚠️ No session management (optional feature)
- ⚠️ No OAuth discovery (API keys are valid auth method)

---

## Conclusion

**Current Status**: Production-ready for MVP launch

**Recommendation**:
1. Deploy as-is (architecture is sound)
2. Restrict CORS origins in production
3. Set up monitoring (CloudWatch alarms)
4. Plan v2.0 improvements based on user feedback

**Not Blockers**:
- Missing `/mcp` endpoint convention
- Streamable HTTP transport
- Session management
- OAuth discovery

These can be added in v2.0 after validating the core product.

---

**Last Updated**: 2026-01-04
**Version**: 0.2.0
**Status**: ✅ Ready for MVP Launch
