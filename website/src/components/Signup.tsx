import React, { useState } from 'react';
import {
  Button,
  GridContainer,
  Alert,
  TextInput,
  Label,
} from '@trussworks/react-uswds';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ apiKey: string; message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const SIGNUP_URL = import.meta.env.PUBLIC_SIGNUP_URL || 'https://YOUR-SIGNUP-URL';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(SIGNUP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess({ apiKey: data.apiKey, message: data.message });
      } else {
        setError(data.error || 'Failed to generate API key. Please try again.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyApiKey = () => {
    if (success?.apiKey) {
      navigator.clipboard.writeText(success.apiKey).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy. Please select and copy manually.');
      });
    }
  };

  return (
    <GridContainer>
      <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{
          background: 'white',
          border: '2px solid #dfe1e2',
          borderRadius: '8px',
          padding: '3rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 className="font-heading-2xl text-center text-primary margin-bottom-1">
            Get Your API Key
          </h1>
          <p className="font-body-lg text-center text-base-dark margin-bottom-3">
            Start using the USWDS MCP Server in seconds. Enter your email to receive your free API key.
          </p>

          {/* Benefits Section */}
          <div className="bg-accent-cool-lighter border-left-05 border-primary padding-3 margin-bottom-3 radius-md">
            <h3 className="margin-top-0 font-heading-md text-primary">What you'll get:</h3>
            <div className="margin-bottom-0">
              <div className="margin-bottom-1">
                ✓ <strong>Free tier:</strong> 100 requests/minute, 10,000 requests/day
              </div>
              <div className="margin-bottom-1">
                ✓ Access to all 18 USWDS tools
              </div>
              <div className="margin-bottom-1">
                ✓ React-USWDS v11.0.0 + Tailwind support
              </div>
              <div className="margin-bottom-0">
                ✓ No credit card required
              </div>
            </div>
          </div>

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="margin-top-3">
              <Label htmlFor="email" className="text-bold">Email Address</Label>
              <TextInput
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="maxw-full"
              />

              <Button
                type="submit"
                className="width-full margin-top-2"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Get Free API Key'}
              </Button>

              <p className="text-center font-body-xs text-base-dark margin-top-2 margin-bottom-0">
                By signing up, you agree to our <a href="/terms" className="usa-link">Terms of Service</a> and{' '}
                <a href="/privacy" className="usa-link">Privacy Policy</a>.
              </p>
            </form>
          )}

          {/* Error Alert */}
          {error && (
            <Alert type="error" heading="Error" className="margin-top-3" headingLevel="h3">
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <div className="margin-top-3">
              <Alert type="success" heading="Success!" className="margin-bottom-3" headingLevel="h3">
                {success.message}
              </Alert>

              <div style={{
                background: 'white',
                border: '2px solid #00a91c',
                borderRadius: '4px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <Label htmlFor="api-key-display" className="text-bold margin-bottom-1">
                  Your API Key:
                </Label>
                <div className="display-flex gap-1 flex-align-center">
                  <code
                    id="api-key-display"
                    className="bg-base-lightest padding-105 radius-md font-mono-xs flex-1"
                    style={{ wordBreak: 'break-all' }}
                  >
                    {success.apiKey}
                  </code>
                  <Button
                    type="button"
                    onClick={copyApiKey}
                    outline
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <Alert
                  type="warning"
                  headingLevel="h4"
                  slim
                  noIcon={false}
                  className="margin-top-2 margin-bottom-0"
                >
                  Save this key securely! You won't be able to see it again.
                </Alert>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="font-heading-md text-ink margin-bottom-2">Next Steps:</h4>
                <ol className="usa-list margin-left-3">
                  <li className="margin-bottom-1">Copy your API key above</li>
                  <li className="margin-bottom-1">
                    Configure your MCP client with:
                    <pre className="bg-ink padding-2 radius-md margin-top-1 overflow-x-auto">
                      <code className="text-white font-mono-xs" style={{ display: 'block', whiteSpace: 'pre' }}>
{`{
  "mcpServers": {
    "uswds": {
      "url": "https://uswdsmcp.com",
      "headers": {
        "x-api-key": "${success.apiKey}"
      }
    }
  }
}`}
                      </code>
                    </pre>
                  </li>
                  <li>
                    <a href="/getting-started" className="usa-link">View full setup instructions →</a>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="margin-top-5 padding-top-3 border-top-2px border-base-lighter text-center">
            <h3 className="font-heading-md text-primary margin-bottom-2">Need Help?</h3>
            <p className="margin-bottom-0">
              <a href="/getting-started" className="usa-link display-block margin-bottom-1">
                View setup instructions →
              </a>
              <a href="/docs" className="usa-link display-block">
                Browse documentation →
              </a>
            </p>
          </div>
        </div>
      </div>
    </GridContainer>
  );
}
