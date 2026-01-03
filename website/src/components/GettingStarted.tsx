import React from 'react';
import {
  GridContainer,
  Card,
  CardHeader,
  CardBody,
} from '@trussworks/react-uswds';

export default function GettingStarted() {
  return (
    <GridContainer>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 className="font-heading-2xl text-primary margin-bottom-1">Getting Started</h1>
        <p className="font-body-lg text-base-dark margin-bottom-5">
          Start using the USWDS MCP Server in minutes
        </p>

        {/* Local Setup Section */}
        <section className="margin-bottom-6">
          <h2 className="font-heading-xl text-primary margin-bottom-2 padding-bottom-1 border-bottom-05 border-secondary">
            Local Development
          </h2>
          <p className="margin-bottom-3">Run the MCP server on your local machine for development.</p>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Prerequisites</h3>
          <ul className="usa-list">
            <li>Node.js 20 or higher (required by MCP SDK)</li>
            <li>npm or yarn package manager</li>
            <li>MCP-compatible client (Claude Desktop, Cursor, Cline, etc.)</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Installation Methods</h3>

          <h4 className="font-heading-md margin-top-3 margin-bottom-2">Option 1: Install via NPM (Recommended)</h4>
          <p className="margin-bottom-2">Install globally for easy access:</p>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`# Install globally
npm install -g uswds-local-mcp-server

# The command 'uswds-mcp' is now available
uswds-mcp --version`}
            </code>
          </pre>

          <h4 className="font-heading-md margin-top-3 margin-bottom-2">Option 2: Clone from GitHub</h4>
          <p className="margin-bottom-2">For development or customization:</p>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`# Clone the repository
git clone https://github.com/ctrimm/uswds-local-mcp-server.git
cd uswds-local-mcp-server

# Install dependencies
npm install

# Build the project
npm run build`}
            </code>
          </pre>

          <h3 className="font-heading-lg margin-top-4 margin-bottom-2">Configure MCP Client</h3>
          <p className="margin-bottom-2">Add the following configuration to your MCP client settings:</p>

          <h4 className="font-heading-md margin-top-3 margin-bottom-2">Claude Desktop</h4>
          <p className="margin-bottom-2">
            Edit <code className="bg-base-lightest padding-05 radius-md font-mono-xs">~/Library/Application Support/Claude/claude_desktop_config.json</code> (macOS) or{' '}
            <code className="bg-base-lightest padding-05 radius-md font-mono-xs">%APPDATA%/Claude/claude_desktop_config.json</code> (Windows):
          </p>

          <p className="text-bold margin-top-3 margin-bottom-1">If installed via NPM:</p>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`{
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

          <p className="text-bold margin-top-3 margin-bottom-1">If cloned from GitHub:</p>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/absolute/path/to/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}`}
            </code>
          </pre>

          <h3 className="font-heading-lg margin-top-4 margin-bottom-2">Environment Variables</h3>
          <table className="usa-table usa-table--borderless width-full margin-bottom-3">
            <thead>
              <tr>
                <th scope="col">Variable</th>
                <th scope="col">Default</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="font-mono-xs">USE_REACT_COMPONENTS</code></td>
                <td><code className="font-mono-xs">false</code></td>
                <td>Use React-USWDS components instead of vanilla USWDS</td>
              </tr>
              <tr>
                <td><code className="font-mono-xs">LOG_LEVEL</code></td>
                <td><code className="font-mono-xs">info</code></td>
                <td>Logging level (debug, info, warn, error)</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Remote Deployment Section */}
        <section className="margin-bottom-6">
          <h2 className="font-heading-xl text-primary margin-bottom-2 padding-bottom-1 border-bottom-05 border-secondary">
            Remote Deployment (AWS Lambda)
          </h2>
          <p className="margin-bottom-3">Deploy the MCP server to AWS Lambda for serverless, always-available access.</p>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Prerequisites</h3>
          <ul className="usa-list margin-bottom-3">
            <li>AWS account with credentials configured</li>
            <li>SST V3 installed globally: <code className="bg-base-lightest padding-05 radius-md font-mono-xs">npm install -g sst@latest</code></li>
            <li>Node.js 18 or higher</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Deploy to AWS</h3>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`# Install dependencies
npm install

# Deploy to production
npx sst deploy --stage production

# Output will show your Lambda Function URL:
# ✓  Complete
#    UswdsMcpServer: https://abc123.lambda-url.us-east-1.on.aws`}
            </code>
          </pre>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Configure API Key (Recommended)</h3>
          <p className="margin-bottom-2">Set an API key to secure your deployment:</p>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`# Set API key via SST secrets
npx sst secret set API_KEY your-secret-key-here --stage production

# Redeploy to apply changes
npx sst deploy --stage production`}
            </code>
          </pre>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Use Remote Server</h3>
          <p className="margin-bottom-2">Configure your MCP client to use the remote server via HTTP:</p>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`{
  "mcpServers": {
    "uswds-remote": {
      "url": "https://your-function-url.lambda-url.us-east-1.on.aws",
      "headers": {
        "Authorization": "Bearer your-secret-key-here"
      }
    }
  }
}`}
            </code>
          </pre>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Rate Limits</h3>
          <p className="margin-bottom-2">The hosted server includes rate limiting:</p>
          <ul className="usa-list margin-bottom-2">
            <li><strong>Free hosted tier:</strong> 1 request/minute, 100 requests/day</li>
            <li><strong>Pro tier:</strong> 1,000 requests/minute, 1,000,000 requests/month</li>
            <li><strong>Enterprise:</strong> Custom limits and dedicated support</li>
            <li><strong>Self-hosted:</strong> Unlimited (deploy to your own AWS infrastructure)</li>
          </ul>
          <p><a href="/pricing" className="usa-link">View pricing details →</a></p>
        </section>

        {/* Testing Section */}
        <section className="margin-bottom-6">
          <h2 className="font-heading-xl text-primary margin-bottom-2 padding-bottom-1 border-bottom-05 border-secondary">
            Test Your Installation
          </h2>
          <p className="margin-bottom-3">Once configured, test the MCP server in your client:</p>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">List Available Tools</h3>
          <p className="margin-bottom-2">In Claude Desktop, ask:</p>
          <blockquote className="bg-accent-cool-lighter border-left-05 border-primary padding-2 radius-md font-body-md text-italic margin-bottom-3">
            "What USWDS tools do you have available?"
          </blockquote>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Try a Simple Query</h3>
          <p className="margin-bottom-2">Test a basic tool call:</p>
          <blockquote className="bg-accent-cool-lighter border-left-05 border-primary padding-2 radius-md font-body-md text-italic margin-bottom-3">
            "List all USWDS components in the forms category"
          </blockquote>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Get Component Information</h3>
          <p className="margin-bottom-2">Request detailed component info:</p>
          <blockquote className="bg-accent-cool-lighter border-left-05 border-primary padding-2 radius-md font-body-md text-italic margin-bottom-3">
            "Show me how to use the USWDS Button component"
          </blockquote>
        </section>

        {/* Troubleshooting Section */}
        <section className="margin-bottom-6">
          <h2 className="font-heading-xl text-primary margin-bottom-2 padding-bottom-1 border-bottom-05 border-secondary">
            Troubleshooting
          </h2>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Server Not Starting</h3>
          <ul className="usa-list margin-bottom-3">
            <li>Verify Node.js version: <code className="bg-base-lightest padding-05 radius-md font-mono-xs">node --version</code> (should be 18+)</li>
            <li>Check build succeeded: <code className="bg-base-lightest padding-05 radius-md font-mono-xs">npm run build</code></li>
            <li>Verify path in config is absolute, not relative</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Tools Not Appearing</h3>
          <ul className="usa-list margin-bottom-3">
            <li>Restart your MCP client after config changes</li>
            <li>Check client logs for connection errors</li>
            <li>Verify JSON syntax in configuration file</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Lambda Deployment Issues</h3>
          <ul className="usa-list margin-bottom-3">
            <li>Verify AWS credentials: <code className="bg-base-lightest padding-05 radius-md font-mono-xs">aws sts get-caller-identity</code></li>
            <li>Check SST version: <code className="bg-base-lightest padding-05 radius-md font-mono-xs">sst version</code></li>
            <li>Review CloudWatch logs for errors</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">Rate Limit Errors (429)</h3>
          <ul className="usa-list margin-bottom-3">
            <li>Check current limits in response headers</li>
            <li>Wait for rate limit window to reset</li>
            <li>Consider upgrading to Pro tier for higher limits</li>
          </ul>
        </section>

        {/* Next Steps */}
        <section className="margin-bottom-6">
          <h2 className="font-heading-xl text-primary margin-bottom-3 padding-bottom-1 border-bottom-05 border-secondary">
            Next Steps
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <a href="/docs" style={{ textDecoration: 'none' }}>
              <Card className="height-full">
                <CardHeader>
                  <h3 className="usa-card__heading">Documentation</h3>
                </CardHeader>
                <CardBody>
                  <p className="margin-bottom-0 text-base-dark">
                    Explore all 18 available tools and their usage
                  </p>
                </CardBody>
              </Card>
            </a>
            <a href="https://github.com/ctrimm/uswds-local-mcp-server" style={{ textDecoration: 'none' }}>
              <Card className="height-full">
                <CardHeader>
                  <h3 className="usa-card__heading">GitHub Repository</h3>
                </CardHeader>
                <CardBody>
                  <p className="margin-bottom-0 text-base-dark">
                    View source code, report issues, contribute
                  </p>
                </CardBody>
              </Card>
            </a>
            <a href="/pricing" style={{ textDecoration: 'none' }}>
              <Card className="height-full">
                <CardHeader>
                  <h3 className="usa-card__heading">Pricing</h3>
                </CardHeader>
                <CardBody>
                  <p className="margin-bottom-0 text-base-dark">
                    Compare plans and upgrade for higher limits
                  </p>
                </CardBody>
              </Card>
            </a>
          </div>
        </section>
      </div>
    </GridContainer>
  );
}
