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

  return (
    <USWDSFooter
      returnToTop={returnToTop}
      size="big"
      primary={
        <GridContainer className="usa-footer__primary-section">
          <div className="grid-row grid-gap">
            <div className="mobile-lg:grid-col-8">
              <nav className="usa-footer__nav" aria-label="Footer navigation">
                <div className="grid-row grid-gap-4">
                  <div className="mobile-lg:grid-col-6 desktop:grid-col-4">
                    <section className="usa-footer__primary-content usa-footer__primary-content--collapsible">
                      <h4 className="usa-footer__primary-heading">Documentation</h4>
                      <ul className="usa-list usa-list--unstyled">
                        <li className="usa-footer__secondary-link">
                          <a href="/getting-started">Getting Started</a>
                        </li>
                        <li className="usa-footer__secondary-link">
                          <a href="/docs">Documentation</a>
                        </li>
                        <li className="usa-footer__secondary-link">
                          <a href="https://github.com/ctrimm/uswds-local-mcp-server">GitHub</a>
                        </li>
                      </ul>
                    </section>
                  </div>
                  <div className="mobile-lg:grid-col-6 desktop:grid-col-4">
                    <section className="usa-footer__primary-content usa-footer__primary-content--collapsible">
                      <h4 className="usa-footer__primary-heading">Community</h4>
                      <ul className="usa-list usa-list--unstyled">
                        <li className="usa-footer__secondary-link">
                          <a href="https://github.com/ctrimm/uswds-local-mcp-server/issues">Report Issue</a>
                        </li>
                        <li className="usa-footer__secondary-link">
                          <a href="https://github.com/ctrimm/uswds-local-mcp-server/discussions">Discussions</a>
                        </li>
                      </ul>
                    </section>
                  </div>
                </div>
              </nav>
            </div>
            <div className="mobile-lg:grid-col-4">
              <div className="usa-footer__primary-content">
                <h4 className="usa-footer__primary-heading">USWDS MCP Server</h4>
                <p className="usa-footer__contact-info">
                  AI-powered development with the U.S. Web Design System
                </p>
              </div>
            </div>
          </div>
        </GridContainer>
      }
      secondary={
        <GridContainer className="usa-footer__secondary-section">
          <div className="grid-row grid-gap">
            <div className="usa-footer__logo grid-row mobile-lg:grid-col-6 mobile-lg:grid-gap-2">
              <div className="mobile-lg:grid-col-auto">
                <p className="usa-footer__logo-heading">USWDS MCP</p>
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
