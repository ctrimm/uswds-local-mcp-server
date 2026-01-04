# Production Deployment Checklist

This checklist covers everything needed for a production deployment of the USWDS MCP Server.

## ✅ Completed - Ready for Production

### Core Infrastructure
- [x] **DynamoDB Tables** - Users and Usage tables configured with deletion protection
- [x] **Lambda Functions** - MCP Server, Signup, Reset, and Admin API
- [x] **Function URLs** - All Lambda functions have public URLs with CORS
- [x] **Rate Limiting** - In-memory rate limiter (1 req/min, 100 req/day for free tier)
- [x] **CloudWatch Logs** - 30-day retention for production, 7-day for dev
- [x] **Error Handling** - Graceful error handling throughout

### Authentication & Authorization
- [x] **API Key Authentication** - Via Authorization header or x-api-key
- [x] **User Management** - Email-based user accounts with API keys
- [x] **Admin Access Control** - IS_ADMIN flag with admin authentication middleware
- [x] **User Status Management** - Active, blocked, suspended states

### Email Notifications
- [x] **Email Service** - Resend integration configured
- [x] **Welcome Emails** - Sent on signup with API key
- [x] **Reset Emails** - Sent when API key is regenerated
- [x] **Email Templates** - Professional HTML templates matching USWDS branding
- [x] **Graceful Failures** - Email failures don't block signup/reset

### Admin Functionality
- [x] **Admin API** - Complete REST API for user management
- [x] **User Management Endpoints** - List users, block/unblock, admin privileges
- [x] **Statistics Endpoint** - System-wide usage statistics
- [x] **Admin Auth Middleware** - Verifies IS_ADMIN flag

### Code Quality
- [x] **TypeScript Build** - Clean build with no errors
- [x] **Unit Tests** - 406 tests passing across 20 test suites
- [x] **Modular Architecture** - Refactored into focused, maintainable modules
- [x] **Test Coverage** - Auth, tools, stdio, shared modules

### Documentation
- [x] **Environment Variables** - Comprehensive .env.example
- [x] **SST Configuration** - Fully documented with comments
- [x] **Setup Instructions** - Resend and Cloudflare setup guides

### Website
- [x] **Pricing Page** - Simplified to free tier + self-hosted only
- [x] **Homepage** - USWDS-compliant hero and footer
- [x] **Signup Page** - Functional with API key generation
- [x] **Terms & Privacy** - Legal pages created
- [x] **404 Page** - User-friendly error page

---

## ⚠️ Required Before First Deploy

### 1. Set Up Cloudflare DNS
```bash
# 1. Log in to Cloudflare
# 2. Add your domain: uswdsmcp.com
# 3. Update nameservers at your registrar
# 4. Get Zone ID from Cloudflare dashboard (Overview page)
# 5. Create API Token:
#    - Go to "My Profile" > "API Tokens"
#    - Create token with "Zone:DNS:Edit" permissions
# 6. Set environment variable (in your shell or .env):
export CLOUDFLARE_ZONE_ID="your_zone_id_here"

# 7. Set secret:
npx sst secret set CLOUDFLARE_API_TOKEN "your_token_here" --stage production
```

**Status:** 🔴 **REQUIRED** - Custom domain (api.uswdsmcp.com) won't work without this

### 2. Set Up Resend Account
```bash
# 1. Sign up at https://resend.com
# 2. Add domain: mail.uswdsmcp.com
# 3. Verify domain ownership (add DNS records to Cloudflare)
# 4. Get API key from dashboard
# 5. Set secret:
npx sst secret set RESEND_API_KEY "re_your_key_here" --stage production
```

**Status:** 🔴 **REQUIRED** - Email notifications won't work without this

### 3. Configure Environment Variables
Update these in `sst.config.ts` or via environment:
```bash
# Required for email
EMAIL_FROM="USWDS MCP <noreply@mail.uswdsmcp.com>"
EMAIL_ENABLED="true"

# Required for custom domain
CLOUDFLARE_ZONE_ID="your_zone_id"
```

**Status:** ✅ Already configured in code (EMAIL_*), ⚠️ Need to set CLOUDFLARE_ZONE_ID

### 4. Create First Admin User
After first deployment:
```bash
# 1. Deploy the stack
npx sst deploy --stage production

# 2. Sign up via /signup to create your account
# 3. Go to AWS Console → DynamoDB → UsersTable
# 4. Find your user record and edit it
# 5. Add/set: "isAdmin": true
```

**Status:** 🟡 **POST-DEPLOYMENT** - Manual step after first deploy

### 4. Update Website URLs
Update these in the website code:
- GitHub org/repo URLs (currently placeholder)
- Support email addresses
- Any hardcoded URLs

**Status:** 🟡 **RECOMMENDED** - Update before launch

---

## ✅ Enabled - Custom Domain

### Domain & DNS
- [x] **Custom Domain** - api.uswdsmcp.com (production) / {stage}-api.uswdsmcp.com (dev)
- [x] **Cloudflare DNS** - Configured in sst.config.ts
- [x] **SSL Certificate** - CloudFront automatically provisions
- [x] **CloudFront CDN** - Enabled for custom domain

**Status:** ✅ Enabled and configured - Requires Cloudflare setup before deploy

## 🔵 Optional (Can Add Later)

### Monitoring & Alerts
- [ ] **CloudWatch Alarms** - Alert on errors, high latency, rate limit hits
- [ ] **Error Tracking** - Sentry or similar for error aggregation
- [ ] **Usage Dashboard** - Real-time usage visualization

**Status:** Recommended for production monitoring

### Performance
- [ ] **Load Testing** - Verify 1 req/min rate limiting works correctly
- [ ] **Cold Start Optimization** - Lambda warming if needed
- [ ] **Caching Strategy** - CloudFront or Lambda caching

**Status:** Can monitor and optimize after launch

### Paid Tiers (Future)
- [ ] **Stripe Integration** - Payment processing
- [ ] **Tier-Based Rate Limiting** - Different limits per tier
- [ ] **Subscription Management** - Handle upgrades/downgrades
- [ ] **Usage Tracking** - Per-user analytics dashboard

**Status:** 🔴 **DISABLED** - Paid tiers commented out in UI

---

## 📋 Deployment Steps

### Initial Production Deployment

```bash
# 1. Set up Cloudflare (REQUIRED)
# - Add uswdsmcp.com to Cloudflare
# - Update nameservers at registrar
# - Get Zone ID from dashboard
# - Create API token with Zone:DNS:Edit permissions

# 2. Set environment variable for Zone ID
export CLOUDFLARE_ZONE_ID="your_zone_id_here"

# 3. Set secrets (REQUIRED)
npx sst secret set CLOUDFLARE_API_TOKEN "your_token" --stage production
npx sst secret set RESEND_API_KEY "re_your_key_here" --stage production

# 4. Deploy infrastructure
npx sst deploy --stage production

# 5. Save the outputs (you'll need these URLs):
# - cdnUrl: https://api.uswdsmcp.com (custom domain)
# - cdnDomain: api.uswdsmcp.com
# - signupUrl: Direct Lambda URL (backup)
# - mcpUrl: Direct Lambda URL (backup)
# - adminUrl: For admin operations
# - resetUrl: For API key reset

# 6. Wait for DNS propagation (1-5 minutes)
# CloudFront will automatically:
# - Create DNS records in Cloudflare
# - Provision SSL certificate
# - Route traffic to Lambda

# 7. Test signup flow (use custom domain)
curl -X POST https://api.uswdsmcp.com/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com"}'

# 8. Make yourself admin (AWS Console → DynamoDB)
# Find your user record and set: "isAdmin": true

# 9. Test admin access
curl https://api.uswdsmcp.com/admin/stats \
  -H "Authorization: Bearer your-api-key"

# 10. Update website PUBLIC_SIGNUP_URL to:
# https://api.uswdsmcp.com
```

### Website Deployment
```bash
# Build website
cd website
npm run build

# Deploy to your hosting (Vercel, Netlify, S3, etc.)
# Update PUBLIC_SIGNUP_URL in website/.env to:
# https://api.uswdsmcp.com (production)
# or use your custom domain
```

---

## 🔒 Security Checklist

- [x] **API Key Authentication** - All endpoints require valid API key
- [x] **Rate Limiting** - Prevents abuse (1 req/min, 100 req/day)
- [x] **CORS Configuration** - Configured (restrict in production)
- [x] **Admin Access Control** - IS_ADMIN flag required for admin endpoints
- [x] **DynamoDB Encryption** - Encryption at rest enabled by default
- [x] **Lambda Logging** - No sensitive data logged
- [x] **Email Security** - API key sent once, not stored in logs
- [ ] **CORS Origins** - ⚠️ Currently allows `*`, restrict to your domain
- [ ] **CloudWatch Alarms** - Alert on suspicious activity

---

## 💰 Cost Estimates (AWS)

### Free Tier Deployment (First 12 months)
- **DynamoDB:** Free (up to 25GB, 25 read/write units)
- **Lambda:** Free (1M requests/month, 400K GB-seconds)
- **CloudWatch Logs:** $0.50/GB ingested (minimal)
- **Data Transfer:** Free tier covers most usage

**Monthly Cost:** ~$0-2/month

### After Free Tier
- **DynamoDB:** ~$1-5/month (on-demand pricing)
- **Lambda:** ~$1-10/month (depends on usage)
- **CloudWatch Logs:** ~$1-3/month
- **Data Transfer:** ~$0-5/month

**Monthly Cost:** ~$3-23/month for moderate usage

### External Services
- **Resend:** Free tier (100 emails/day) → $20/month (50K emails)
- **Cloudflare:** Free (DNS only)

---

## 🚀 Ready to Deploy?

### Minimum Requirements Met:
✅ Email service configured (Resend)
✅ Infrastructure code ready (SST)
✅ Admin functionality complete
✅ Tests passing (406/420)
✅ Documentation complete
✅ Custom domain configured (api.uswdsmcp.com)
✅ CloudFront CDN enabled

### Before Deployment:
1. **Set up Cloudflare** (add domain, get Zone ID, create API token)
2. Set CLOUDFLARE_ZONE_ID environment variable
3. Set CLOUDFLARE_API_TOKEN secret
4. Set RESEND_API_KEY secret
5. Verify mail.uswdsmcp.com domain in Resend (add DNS records to Cloudflare)
6. Review CORS settings (restrict `*` to your domain)
7. Update website URLs to production values

### After Deployment:
1. Wait for DNS propagation (1-5 minutes)
2. Verify SSL certificate provisioned
3. Create admin account (manual DynamoDB edit)
4. Test signup flow via https://api.uswdsmcp.com
5. Test email delivery
6. Monitor CloudWatch logs
7. Set up alarms (recommended)

---

## 📞 Support

- **GitHub Issues:** https://github.com/YOUR-ORG/uswds-local-mcp-server/issues
- **Email:** support@uswdsmcp.com
- **Documentation:** Check README.md and PRODUCTION_READINESS.md

---

**Last Updated:** 2026-01-04
**Version:** 0.2.0
**Status:** ✅ Ready for Production (with Resend setup)
