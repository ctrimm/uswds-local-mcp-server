# USWDS MCP Website

Marketing website for the USWDS MCP Server, built with Astro and deployed to S3/CloudFront.

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

```bash
# Build and deploy to AWS
npm run deploy

# Or deploy manually
npm run build
npx sst deploy --stage production
```

## Structure

```
website/
├── src/
│   ├── layouts/
│   │   └── Layout.astro        # Main layout
│   └── pages/
│       ├── index.astro          # Home page
│       ├── pricing.astro        # Pricing page
│       ├── docs.astro           # Documentation (TODO)
│       └── getting-started.astro # Getting started (TODO)
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── sst.config.ts                # SST deployment config
└── package.json
```

## Customization

### Domain Setup

1. Purchase `uswdsmcp.com`
2. Configure DNS (Route53 or Cloudflare)
3. Uncomment domain config in `sst.config.ts`
4. Deploy

### Images & Video

- Add images to `public/images/`
- Add video to `public/video/`
- Update references in pages

### Content

- Edit pages in `src/pages/`
- Modify layout in `src/layouts/Layout.astro`
- Update styles inline in each `.astro` file

## Cost

**AWS S3 + CloudFront:**
- ~$1-2/month for typical traffic
- Free tier covers most small sites

## Support

Questions? Open an issue at https://github.com/ctrimm/uswds-local-mcp-server/issues
