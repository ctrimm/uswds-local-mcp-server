import React from 'react';
import {
  Button,
  GridContainer,
} from '@trussworks/react-uswds';

export default function Homepage() {
  const features = [
    {
      icon: '🎯',
      title: '18 Powerful Tools',
      description: 'Component info, code generation, validation, accessibility checks, and more—all in one place.'
    },
    {
      icon: '♿',
      title: 'Accessibility First',
      description: 'WCAG compliance guidance, color contrast checks, and validated patterns built-in.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Multi-layer caching delivers sub-millisecond response times. Works offline with local installation.'
    },
    {
      icon: '🎨',
      title: 'React-USWDS v11.0.0',
      description: 'Latest components, design tokens, and patterns from React-USWDS and USWDS 3.13.0.'
    },
    {
      icon: '🔧',
      title: 'Tailwind Support',
      description: 'Access USWDS components built with Tailwind CSS from v2.uswds-tailwind.com.'
    },
    {
      icon: '🔓',
      title: 'Fully Open Source',
      description: 'AGPL-3.0 licensed. Deploy to your own infrastructure, add custom tools, integrate into agentic systems—no limits.'
    }
  ];

  const clients = [
    'Claude Desktop',
    'Claude Code',
    'Cursor',
    'Cline',
    'Windsurf',
    'Zed',
  ];

  const capabilities = [
    'Component documentation for 40+ USWDS components',
    'AI-powered code generation',
    'Accessibility validation',
    'Design token reference',
    'Color contrast checker',
    'Icon browser (90+ icons)',
    'Layout patterns',
    'Form generation'
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="usa-hero bg-primary-darker">
        <GridContainer>
          <div className="usa-hero__callout bg-accent-warm-lighter">
            <h1 className="usa-hero__heading">
              <span className="usa-hero__heading--alt">Build Accessible Government Websites with AI</span>
            </h1>
            <p>
              MCP server providing instant access to USWDS components, design tokens, and validation tools—directly in your AI assistant.
            </p>

            {/* Announcement Banner */}
            <div className="bg-white border-accent-warm border-2px radius-md padding-2 margin-top-2 margin-bottom-2">
              <div className="display-flex flex-align-center gap-1 flex-wrap">
                <span className="usa-tag bg-accent-warm">LIMITED TIME</span>
                <strong className="text-ink">Free Hosted Instance Available</strong>
              </div>
              <p className="text-ink margin-top-1 margin-bottom-0 font-body-2xs">
                Get instant access to our hosted MCP server—no setup required. Just your email address to start building.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="display-flex gap-1 flex-wrap margin-top-2">
              <a href="/signup" className="usa-button">Get Free API Key</a>
              <a href="/getting-started" className="usa-button usa-button--outline">Get Started</a>
              <a href="/docs" className="usa-button usa-button--outline">View Docs</a>
            </div>
          </div>
        </GridContainer>
      </section>

      {/* Features Section */}
      <section className="usa-section">
        <GridContainer>
          <h2 className="font-heading-2xl text-center margin-bottom-5">
            Why USWDS MCP Server?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white border-base-light border-2px radius-md padding-3 height-full">
                <div className="font-sans-3xl text-center margin-bottom-2">
                  {feature.icon}
                </div>
                <h3 className="font-heading-md text-center text-primary margin-bottom-2">
                  {feature.title}
                </h3>
                <p className="text-center font-body-sm margin-bottom-0 text-base-dark">{feature.description}</p>
              </div>
            ))}
          </div>
        </GridContainer>
      </section>

      {/* Quick Start Section */}
      <section className="usa-section bg-base-lightest">
        <GridContainer>
          <h2 className="font-heading-2xl text-center margin-bottom-5">
            Quick Start
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
            {/* Local Development */}
            <div className="bg-white border-base-light border-2px radius-md height-full">
              <div className="padding-3 border-bottom-2px border-base-lighter">
                <h3 className="font-heading-md margin-0 text-primary">Local Development</h3>
              </div>
              <div className="padding-3">
                <p className="margin-bottom-2 text-base-dark">Install via NPM and configure your MCP client:</p>
                <pre className="bg-ink padding-2 radius-md overflow-x-auto" style={{ margin: 0 }}>
                  <code className="text-white font-mono-xs line-height-mono-4" style={{ display: 'block', whiteSpace: 'pre' }}>
{`npm install -g uswds-local-mcp-server

# Configure Claude Desktop
{
  "mcpServers": {
    "uswds": {
      "command": "uswds-mcp",
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="padding-3 border-top-2px border-base-lighter">
                <a href="/getting-started" className="usa-button usa-button--outline">
                  View Full Guide
                </a>
              </div>
            </div>

            {/* Remote Deployment */}
            <div className="bg-white border-base-light border-2px radius-md height-full">
              <div className="padding-3 border-bottom-2px border-base-lighter">
                <h3 className="font-heading-md margin-0 text-primary">Remote Deployment</h3>
              </div>
              <div className="padding-3">
                <p className="margin-bottom-2 text-base-dark">Deploy to AWS Lambda for team-wide access:</p>
                <pre className="bg-ink padding-2 radius-md overflow-x-auto" style={{ margin: 0 }}>
                  <code className="text-white font-mono-xs line-height-mono-4" style={{ display: 'block', whiteSpace: 'pre' }}>
{`npm run sst:deploy:prod

# Configure your MCP client
{
  "mcpServers": {
    "uswds": {
      "url": "https://YOUR-FUNCTION-URL",
      "headers": {
        "x-api-key": "your-key"
      }
    }
  }
}`}
                  </code>
                </pre>
              </div>
              <div className="padding-3 border-top-2px border-base-lighter">
                <a href="/docs#deployment" className="usa-button usa-button--outline">
                  Deployment Docs
                </a>
              </div>
            </div>
          </div>

          {/* Capabilities List */}
          <div className="bg-white border-base-light border-2px radius-md margin-top-4">
            <div className="padding-3 border-bottom-2px border-base-lighter">
              <h3 className="font-heading-md margin-0 text-primary">What You Get</h3>
            </div>
            <div className="padding-3">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  {capabilities.slice(0, 4).map((capability, idx) => (
                    <div key={idx} className="margin-bottom-1">
                      ✓ {capability}
                    </div>
                  ))}
                </div>
                <div>
                  {capabilities.slice(4).map((capability, idx) => (
                    <div key={idx} className="margin-bottom-1">
                      ✓ {capability}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="padding-3 border-top-2px border-base-lighter">
              <a href="/docs" className="usa-button">
                Explore All Tools
              </a>
            </div>
          </div>
        </GridContainer>
      </section>

      {/* Supported Clients */}
      <section className="usa-section">
        <GridContainer>
          <h2 className="font-heading-2xl text-center margin-bottom-3">
            Works With Your Favorite AI Tools
          </h2>
          <p className="text-center font-body-lg text-base-dark maxw-tablet margin-x-auto margin-bottom-4">
            Compatible with any MCP-enabled client
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {clients.map((client, idx) => (
              <div key={idx} className="bg-white border-base-light border-2px radius-md padding-3 text-center">
                <span className="text-bold">{client}</span>
              </div>
            ))}
          </div>
        </GridContainer>
      </section>

      {/* Open Source Section */}
      <section className="usa-section bg-base-lightest">
        <GridContainer>
          <div className="grid-row grid-gap-6">
            <div className="tablet:grid-col-7">
              <h2 className="font-heading-2xl text-primary margin-bottom-2">
                Open Source. Extensible. Community-Driven.
              </h2>
              <p className="font-body-lg text-base-dark margin-bottom-3">
                USWDS MCP Server is fully open source under AGPL-3.0, ensuring improvements benefit the entire community.
              </p>

              <div className="margin-bottom-3">
                <h3 className="font-heading-lg text-primary margin-bottom-1">Deploy Without Limits</h3>
                <ul className="usa-list">
                  <li>Host on your own infrastructure (AWS Lambda, local, anywhere)</li>
                  <li>No rate limits when self-hosted</li>
                  <li>Add custom MCP tools tailored to your needs</li>
                  <li>Integrate into agentic systems and workflows</li>
                  <li>Full control over data and performance</li>
                </ul>
              </div>

              <div className="margin-bottom-3">
                <h3 className="font-heading-lg text-primary margin-bottom-1">Or Use Our Hosted Infrastructure</h3>
                <ul className="usa-list">
                  <li><strong>Free tier:</strong> Get started immediately with our hosted API</li>
                  <li><strong>Paid plans:</strong> Higher limits, priority support, SLA guarantees</li>
                  <li>No setup or maintenance required</li>
                  <li>We handle scaling, caching, and updates</li>
                </ul>
              </div>

              <a href="https://github.com/ctrimm/uswds-local-mcp-server" className="usa-button usa-button--outline">
                View on GitHub
              </a>
            </div>

            <div className="tablet:grid-col-5">
              <div className="bg-white border-base-light border-2px radius-md padding-3">
                <h3 className="font-heading-md text-primary margin-bottom-2">Why AGPL-3.0?</h3>
                <p className="font-body-sm text-base-dark margin-bottom-2">
                  We chose the <strong>GNU Affero General Public License v3.0</strong> to ensure that improvements to USWDS MCP Server benefit everyone, not just proprietary systems.
                </p>

                <div className="margin-bottom-2">
                  <h4 className="font-body-md text-bold text-primary margin-bottom-05">What this means for you:</h4>
                  <ul className="usa-list font-body-2xs">
                    <li>✓ Free to use, modify, and distribute</li>
                    <li>✓ Deploy to your own infrastructure</li>
                    <li>✓ Add custom tools and integrations</li>
                    <li>✓ Use in commercial projects</li>
                    <li>⚠️ Share improvements if you offer it as a service</li>
                  </ul>
                </div>

                <div className="bg-accent-cool-lighter padding-2 radius-md">
                  <p className="font-body-2xs text-base-darkest margin-bottom-0">
                    <strong>Building a community:</strong> AGPL ensures that when organizations improve the server, those enhancements come back to the community—strengthening the ecosystem for government digital services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GridContainer>
      </section>

      {/* CTA Section */}
      <section className="usa-section bg-primary-darker">
        <GridContainer className="text-center">
          <h2 className="font-heading-2xl text-white margin-bottom-2">
            Ready to Build?
          </h2>
          <p className="font-body-lg text-white margin-bottom-4 maxw-tablet margin-x-auto">
            Start building accessible government websites with AI assistance today.
          </p>
          <div className="display-flex flex-justify-center gap-2 flex-wrap">
            <a href="/signup">
              <Button type="button" size="big" accentStyle="warm">
                Get Free API Key
              </Button>
            </a>
            <a href="/pricing">
              <Button type="button" size="big" unstyled className="usa-button usa-button--outline usa-button--inverse usa-button--big">
                View Pricing
              </Button>
            </a>
          </div>
        </GridContainer>
      </section>
    </>
  );
}
