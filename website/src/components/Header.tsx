import React, { useState } from 'react';
import {
  Header as USWDSHeader,
  NavMenuButton,
  PrimaryNav,
  Title,
} from '@trussworks/react-uswds';

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const navItems = [
    <a key="docs" href="/docs" className="usa-nav__link">
      Docs
    </a>,
    <a key="pricing" href="/pricing" className="usa-nav__link">
      Pricing
    </a>,
    <a key="getting-started" href="/getting-started" className="usa-nav__link">
      Get Started
    </a>,
    <a key="github" href="https://github.com/ctrimm/uswds-local-mcp-server" target="_blank" rel="noopener noreferrer" className="usa-nav__link">
      GitHub
    </a>,
  ];

  return (
    <USWDSHeader basic>
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title>
            <a href="/" title="Home" aria-label="USWDS MCP Server Home">
              USWDS MCP
            </a>
          </Title>
          <NavMenuButton onClick={toggleMobileNav} label="Menu" />
        </div>
        <PrimaryNav
          items={navItems}
          mobileExpanded={mobileNavOpen}
          onToggleMobileNav={toggleMobileNav}
        />
      </div>
    </USWDSHeader>
  );
}
