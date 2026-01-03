import React from 'react';
import { GridContainer, Button } from '@trussworks/react-uswds';

export default function NotFound() {
  return (
    <GridContainer>
      <div style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '5rem 2rem',
        textAlign: 'center'
      }}>
        <div className="bg-base-lightest padding-5 radius-md">
          <h1 className="font-heading-3xl text-primary margin-bottom-2">404</h1>
          <h2 className="font-heading-xl text-base-darker margin-bottom-2">
            Page Not Found
          </h2>
          <p className="font-body-lg text-base-dark margin-bottom-4">
            We can't find the page you're looking for. It may have been moved, deleted, or never existed.
          </p>

          <div className="display-flex flex-column flex-align-center gap-2">
            <a href="/">
              <Button type="button" size="big">
                Go to Homepage
              </Button>
            </a>
            <a href="/getting-started">
              <Button type="button" outline size="big">
                Getting Started
              </Button>
            </a>
          </div>

          <div className="margin-top-5 padding-top-4 border-top-2px border-base-lighter">
            <h3 className="font-heading-md text-primary margin-bottom-2">
              Looking for something specific?
            </h3>
            <div className="display-flex flex-column flex-align-center gap-1">
              <a href="/docs" className="usa-link">
                Browse Documentation
              </a>
              <a href="/pricing" className="usa-link">
                View Pricing Plans
              </a>
              <a href="/signup" className="usa-link">
                Get Free API Key
              </a>
              <a href="https://github.com/ctrimm/uswds-local-mcp-server" className="usa-link">
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </GridContainer>
  );
}
