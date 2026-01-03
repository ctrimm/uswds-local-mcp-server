import React from 'react';
import {
  Footer as USWDSFooter,
  FooterNav,
  GridContainer,
} from '@trussworks/react-uswds';

export default function Footer() {
  const returnToTop = (
    <GridContainer className="usa-footer__return-to-top">
      <a href="#">Return to top</a>
    </GridContainer>
  );

  const socialLinks = (
    <div className="grid-row grid-gap-1">
      <div className="grid-col-auto">
        <a className="usa-social-link usa-social-link--github" href="https://github.com/ctrimm/uswds-local-mcp-server">
          <span>GitHub</span>
        </a>
      </div>
    </div>
  );

  const primaryLinks = {
    resources: [
      <a key="docs" href="/docs" className="usa-footer__primary-link">
        Documentation
      </a>,
      <a key="getting-started" href="/getting-started" className="usa-footer__primary-link">
        Getting Started
      </a>,
      <a key="github" href="https://github.com/ctrimm/uswds-local-mcp-server" className="usa-footer__primary-link">
        GitHub
      </a>,
    ],
    community: [
      <a key="issues" href="https://github.com/ctrimm/uswds-local-mcp-server/issues" className="usa-footer__primary-link">
        Report Issue
      </a>,
      <a key="discussions" href="https://github.com/ctrimm/uswds-local-mcp-server/discussions" className="usa-footer__primary-link">
        Discussions
      </a>,
    ],
  };

  return (
    <USWDSFooter
      returnToTop={returnToTop}
      size="medium"
      primary={
        <div className="usa-footer__primary-container grid-row">
          <div className="mobile-lg:grid-col-8">
            <FooterNav
              aria-label="Footer navigation"
              size="medium"
              links={[
                ...primaryLinks.resources,
                ...primaryLinks.community,
              ]}
            />
          </div>
          <div className="mobile-lg:grid-col-4">
            <h3 className="usa-footer__primary-heading">USWDS MCP Server</h3>
            <p>AI-powered development with the U.S. Web Design System</p>
          </div>
        </div>
      }
      secondary={
        <GridContainer className="usa-footer__secondary-section">
          <div className="grid-row grid-gap">
            <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-2">
              <div className="mobile-lg:grid-col-auto">
                <h3 className="usa-footer__logo-heading">USWDS MCP</h3>
              </div>
            </div>
            <div className="usa-footer__contact-links mobile-lg:grid-col-6">
              {socialLinks}
              <p className="usa-footer__contact-heading">
                &copy; 2026 USWDS MCP Server
              </p>
              <address className="usa-footer__address">
                <div className="usa-footer__contact-info grid-row grid-gap">
                  <div className="grid-col-auto">
                    Licensed under AGPL-3.0
                  </div>
                </div>
              </address>
            </div>
          </div>
        </GridContainer>
      }
    />
  );
}
