import React from 'react';
import {
  GridContainer,
  Card,
  CardHeader,
  CardBody,
} from '@trussworks/react-uswds';

export default function Docs() {
  const sections = [
    { id: 'component-tools', title: 'Component Tools' },
    { id: 'design-tokens', title: 'Design Tokens' },
    { id: 'validation', title: 'Validation Tools' },
    { id: 'accessibility', title: 'Accessibility Tools' },
    { id: 'icons', title: 'Icon Tools' },
    { id: 'layout', title: 'Layout Tools' },
    { id: 'code-generation', title: 'Code Generation' },
    { id: 'tailwind', title: 'Tailwind + USWDS Tools' },
  ];

  return (
    <GridContainer>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 className="font-heading-2xl text-primary margin-bottom-1">API Documentation</h1>
        <p className="font-body-lg text-base-dark margin-bottom-4">
          Complete reference for all 18 USWDS MCP tools
        </p>

        {/* Table of Contents */}
        <nav className="bg-accent-cool-lighter border-left-05 border-primary padding-3 margin-bottom-5 radius-md">
          <h2 className="font-heading-md text-primary margin-top-0 margin-bottom-2">
            Quick Navigation
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.5rem'
          }}>
            {sections.map((section) => (
              <div key={section.id}>
                <a href={`#${section.id}`} className="usa-link">
                  {section.title}
                </a>
              </div>
            ))}
          </div>
        </nav>

        {/* Component Tools */}
        <section id="component-tools" className="margin-bottom-6" style={{ scrollMarginTop: '2rem' }}>
          <h2 className="font-heading-xl text-primary margin-bottom-3 padding-bottom-1 border-bottom-05 border-secondary">
            Component Tools
          </h2>

          <Card className="margin-bottom-3">
            <CardHeader>
              <h3 className="usa-card__heading font-mono-md">list_components</h3>
            </CardHeader>
            <CardBody>
              <p className="margin-bottom-2">
                List all available USWDS or React-USWDS components with descriptions.
              </p>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Parameters</h4>
              <table className="usa-table usa-table--borderless width-full margin-bottom-2">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="font-mono-xs">category</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>Filter by category: "all", "forms", "navigation", "layout", "content", "ui"</td>
                  </tr>
                  <tr>
                    <td><code className="font-mono-xs">framework</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>"react", "vanilla", or "tailwind"</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Example</h4>
              <pre className="bg-ink padding-2 radius-md overflow-x-auto">
                <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`// In Claude Desktop
"List all USWDS components in the forms category"

// Response includes:
// - Button, TextInput, Select, Checkbox, Radio, etc.`}
                </code>
              </pre>
            </CardBody>
          </Card>

          <Card className="margin-bottom-3">
            <CardHeader>
              <h3 className="usa-card__heading font-mono-md">get_component_info</h3>
            </CardHeader>
            <CardBody>
              <p className="margin-bottom-2">
                Get detailed information about a specific USWDS component including props, variants, and usage examples.
              </p>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Parameters</h4>
              <table className="usa-table usa-table--borderless width-full margin-bottom-2">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="font-mono-xs">component_name</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>Name of the component (e.g., "Button", "Alert")</td>
                  </tr>
                  <tr>
                    <td><code className="font-mono-xs">include_examples</code></td>
                    <td>boolean</td>
                    <td>No</td>
                    <td>Include code examples (default: true)</td>
                  </tr>
                  <tr>
                    <td><code className="font-mono-xs">framework</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>"react", "vanilla", or "tailwind"</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Example</h4>
              <pre className="bg-ink padding-2 radius-md overflow-x-auto">
                <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`// In Claude Desktop
"Show me how to use the USWDS Button component"

// Response includes:
// - All button variants (primary, secondary, accent, outline, etc.)
// - Props documentation
// - Code examples for React-USWDS and vanilla USWDS`}
                </code>
              </pre>
            </CardBody>
          </Card>
        </section>

        {/* Design Tokens */}
        <section id="design-tokens" className="margin-bottom-6" style={{ scrollMarginTop: '2rem' }}>
          <h2 className="font-heading-xl text-primary margin-bottom-3 padding-bottom-1 border-bottom-05 border-secondary">
            Design Tokens
          </h2>

          <Card>
            <CardHeader>
              <h3 className="usa-card__heading font-mono-md">get_design_tokens</h3>
            </CardHeader>
            <CardBody>
              <p className="margin-bottom-2">
                Get USWDS design tokens for colors, spacing, typography, and breakpoints.
              </p>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Parameters</h4>
              <table className="usa-table usa-table--borderless width-full margin-bottom-2">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="font-mono-xs">category</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>Filter by: "all", "color", "spacing", "typography", "breakpoints"</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Example</h4>
              <pre className="bg-ink padding-2 radius-md overflow-x-auto">
                <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`// In Claude Desktop
"What are the USWDS color tokens?"

// Response includes:
// - Primary colors (blue-60v, red-warm-50v, etc.)
// - Semantic colors (success, error, warning, info)
// - Theme colors with hex values`}
                </code>
              </pre>
            </CardBody>
          </Card>
        </section>

        {/* Accessibility */}
        <section id="accessibility" className="margin-bottom-6" style={{ scrollMarginTop: '2rem' }}>
          <h2 className="font-heading-xl text-primary margin-bottom-3 padding-bottom-1 border-bottom-05 border-secondary">
            Accessibility Tools
          </h2>

          <Card>
            <CardHeader>
              <h3 className="usa-card__heading font-mono-md">check_color_contrast</h3>
            </CardHeader>
            <CardBody>
              <p className="margin-bottom-2">
                Check WCAG color contrast ratios between foreground and background colors.
              </p>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Parameters</h4>
              <table className="usa-table usa-table--borderless width-full margin-bottom-2">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="font-mono-xs">foreground</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>Foreground color (hex, rgb, or USWDS token)</td>
                  </tr>
                  <tr>
                    <td><code className="font-mono-xs">background</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>Background color (hex, rgb, or USWDS token)</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Example</h4>
              <pre className="bg-ink padding-2 radius-md overflow-x-auto">
                <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`// In Claude Desktop
"Check color contrast between #005ea2 and #ffffff"

// Response includes:
// - Contrast ratio (e.g., 7.1:1)
// - WCAG AA/AAA compliance for normal and large text
// - Pass/fail status`}
                </code>
              </pre>
            </CardBody>
          </Card>
        </section>

        {/* Layout Tools */}
        <section id="layout" className="margin-bottom-6" style={{ scrollMarginTop: '2rem' }}>
          <h2 className="font-heading-xl text-primary margin-bottom-3 padding-bottom-1 border-bottom-05 border-secondary">
            Layout & Component Suggestions
          </h2>

          <Card className="margin-bottom-3">
            <CardHeader>
              <h3 className="usa-card__heading font-mono-md">suggest_components</h3>
            </CardHeader>
            <CardBody>
              <p className="margin-bottom-2">
                Get AI-powered component recommendations for specific use cases.
              </p>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Parameters</h4>
              <table className="usa-table usa-table--borderless width-full margin-bottom-2">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="font-mono-xs">use_case</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>Description of what you're building</td>
                  </tr>
                  <tr>
                    <td><code className="font-mono-xs">framework</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>"react", "vanilla", or "tailwind"</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Example</h4>
              <pre className="bg-ink padding-2 radius-md overflow-x-auto">
                <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`// In Claude Desktop
"What USWDS components should I use for a user registration form?"

// Response includes:
// - Form, TextInput, Select, Button, Alert
// - Usage recommendations
// - Accessibility considerations`}
                </code>
              </pre>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="usa-card__heading font-mono-md">compare_components</h3>
            </CardHeader>
            <CardBody>
              <p className="margin-bottom-2">
                Compare two similar USWDS components to understand their differences.
              </p>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Parameters</h4>
              <table className="usa-table usa-table--borderless width-full margin-bottom-2">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Required</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="font-mono-xs">component1</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>First component name</td>
                  </tr>
                  <tr>
                    <td><code className="font-mono-xs">component2</code></td>
                    <td>string</td>
                    <td>Yes</td>
                    <td>Second component name</td>
                  </tr>
                  <tr>
                    <td><code className="font-mono-xs">framework</code></td>
                    <td>string</td>
                    <td>No</td>
                    <td>"react", "vanilla", or "tailwind"</td>
                  </tr>
                </tbody>
              </table>

              <h4 className="font-heading-sm margin-top-3 margin-bottom-1">Example</h4>
              <pre className="bg-ink padding-2 radius-md overflow-x-auto">
                <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`// In Claude Desktop
"Compare USWDS Alert and Banner components"

// Response includes:
// - Key differences
// - When to use each
// - Props comparison`}
                </code>
              </pre>
            </CardBody>
          </Card>
        </section>

        {/* HTTP API Reference */}
        <section className="margin-bottom-6">
          <h2 className="font-heading-xl text-primary margin-bottom-3 padding-bottom-1 border-bottom-05 border-secondary">
            HTTP API Reference
          </h2>
          <p className="margin-bottom-3">
            When using the remote Lambda deployment, all tools are accessible via JSON-RPC 2.0 over HTTP.
          </p>

          <h3 className="font-heading-md margin-top-3 margin-bottom-2">Endpoint</h3>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs">
              POST https://your-function-url.lambda-url.us-east-1.on.aws
            </code>
          </pre>

          <h3 className="font-heading-md margin-top-3 margin-bottom-2">Request Format</h3>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto margin-bottom-3">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "list_components",
    "arguments": {
      "category": "forms",
      "framework": "react"
    }
  }
}`}
            </code>
          </pre>

          <h3 className="font-heading-md margin-top-3 margin-bottom-2">Rate Limit Headers</h3>
          <pre className="bg-ink padding-2 radius-md overflow-x-auto">
            <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 60
X-Request-Id: abc-123
X-Processing-Time: 45ms`}
            </code>
          </pre>
        </section>

        {/* Support */}
        <section className="margin-bottom-6">
          <h2 className="font-heading-xl text-primary margin-bottom-3 padding-bottom-1 border-bottom-05 border-secondary">
            Need Help?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            <a href="/getting-started" style={{ textDecoration: 'none' }}>
              <Card className="height-full">
                <CardHeader>
                  <h3 className="usa-card__heading">Getting Started</h3>
                </CardHeader>
                <CardBody>
                  <p className="margin-bottom-0 text-base-dark">
                    Setup instructions for local and remote deployment
                  </p>
                </CardBody>
              </Card>
            </a>
            <a href="https://github.com/ctrimm/uswds-local-mcp-server/issues" style={{ textDecoration: 'none' }}>
              <Card className="height-full">
                <CardHeader>
                  <h3 className="usa-card__heading">Report an Issue</h3>
                </CardHeader>
                <CardBody>
                  <p className="margin-bottom-0 text-base-dark">
                    Found a bug or have a feature request?
                  </p>
                </CardBody>
              </Card>
            </a>
            <a href="https://github.com/ctrimm/uswds-local-mcp-server" style={{ textDecoration: 'none' }}>
              <Card className="height-full">
                <CardHeader>
                  <h3 className="usa-card__heading">View Source</h3>
                </CardHeader>
                <CardBody>
                  <p className="margin-bottom-0 text-base-dark">
                    Explore the codebase on GitHub
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
