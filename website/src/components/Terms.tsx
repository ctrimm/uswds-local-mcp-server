import React from 'react';
import { GridContainer } from '@trussworks/react-uswds';

export default function Terms() {
  return (
    <GridContainer>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 className="font-heading-2xl text-primary margin-bottom-1">Terms of Service</h1>
        <p className="text-base-dark margin-bottom-05">Effective Date: January 3, 2026</p>
        <p className="font-body-md text-base-dark margin-bottom-5">
          Last Updated: January 3, 2026
        </p>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">1. Acceptance of Terms</h2>
          <p className="margin-bottom-2">
            By accessing or using the USWDS MCP Server (the "Service"), whether through our hosted infrastructure or by self-hosting the open source software, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">2. Description of Service</h2>
          <p className="margin-bottom-2">
            USWDS MCP Server provides access to U.S. Web Design System (USWDS) components, design tokens, validation tools, and related functionality through the Model Context Protocol (MCP). The Service is available in two forms:
          </p>
          <ul className="usa-list">
            <li><strong>Hosted Service:</strong> Managed infrastructure provided by us with rate limits based on your chosen tier</li>
            <li><strong>Self-Hosted:</strong> Open source software (AGPL-3.0) that you deploy to your own infrastructure</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">3. License and Open Source</h2>
          <p className="margin-bottom-2">
            The USWDS MCP Server software is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). This means:
          </p>
          <ul className="usa-list">
            <li>You may use, modify, and distribute the software</li>
            <li>You may deploy it to your own infrastructure without restriction</li>
            <li>If you offer the software as a service (SaaS), you must make your source code available under AGPL-3.0</li>
            <li>The full license text is available at <a href="https://www.gnu.org/licenses/agpl-3.0.html" className="usa-link">https://www.gnu.org/licenses/agpl-3.0.html</a></li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">4. API Keys and Account Security</h2>
          <p className="margin-bottom-2">
            If you use our hosted service, you will receive an API key. You are responsible for:
          </p>
          <ul className="usa-list">
            <li>Keeping your API key confidential</li>
            <li>All activity that occurs under your API key</li>
            <li>Notifying us immediately of any unauthorized use</li>
            <li>Not sharing your API key with others</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">5. Rate Limits and Usage</h2>
          <p className="margin-bottom-2">
            Our hosted service includes the following rate limits:
          </p>
          <ul className="usa-list">
            <li><strong>Free Hosted Tier:</strong> 1 request/minute, 100 requests/day</li>
            <li><strong>Pro Tier:</strong> 1,000 requests/minute, 1,000,000 requests/month</li>
            <li><strong>Enterprise Tier:</strong> Custom limits</li>
            <li><strong>Self-Hosted:</strong> No rate limits imposed by us</li>
          </ul>
          <p className="margin-top-2">
            Exceeding rate limits will result in HTTP 429 (Too Many Requests) responses. We may modify rate limits with reasonable notice.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">6. Prohibited Uses</h2>
          <p className="margin-bottom-2">You may not use the Service to:</p>
          <ul className="usa-list">
            <li>Violate any laws or regulations</li>
            <li>Infringe on intellectual property rights</li>
            <li>Transmit malware, viruses, or malicious code</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Interfere with or disrupt the Service</li>
            <li>Use the Service for denial-of-service attacks</li>
            <li>Circumvent rate limits through technical means</li>
            <li>Resell or redistribute hosted API access without written permission</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">7. Disclaimers and Limitation of Liability</h2>
          <p className="margin-bottom-2">
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="margin-bottom-2">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">8. Service Modifications and Termination</h2>
          <p className="margin-bottom-2">
            We reserve the right to:
          </p>
          <ul className="usa-list">
            <li>Modify or discontinue the hosted service at any time</li>
            <li>Suspend or terminate API keys for Terms violations</li>
            <li>Change pricing with 30 days notice</li>
            <li>Update these Terms with notice via email or website</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">9. Intellectual Property</h2>
          <p className="margin-bottom-2">
            The USWDS MCP Server software is licensed under AGPL-3.0. U.S. Web Design System (USWDS) is developed by the U.S. General Services Administration and is in the public domain. Component libraries and frameworks used may have their own licenses (see repository for details).
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">10. Data and Privacy</h2>
          <p className="margin-bottom-2">
            Your use of the Service is also governed by our <a href="/privacy" className="usa-link">Privacy Policy</a>. By using the Service, you consent to our data practices as described in the Privacy Policy.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">11. Governing Law</h2>
          <p className="margin-bottom-2">
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">12. Contact Information</h2>
          <p className="margin-bottom-2">
            For questions about these Terms, please contact us at:
          </p>
          <p className="margin-bottom-1">
            <a href="mailto:support@uswdsmcp.com" className="usa-link">support@uswdsmcp.com</a>
          </p>
          <p>
            <a href="https://github.com/ctrimm/uswds-local-mcp-server/issues" className="usa-link">GitHub Issues</a>
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">13. Changes to Terms</h2>
          <p className="margin-bottom-2">
            We may update these Terms from time to time. We will notify you of material changes by posting the new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <div className="bg-base-lightest padding-3 radius-md margin-top-5">
          <p className="margin-bottom-0">
            <strong>Questions?</strong> Contact us at <a href="mailto:support@uswdsmcp.com" className="usa-link">support@uswdsmcp.com</a> or visit our{' '}
            <a href="https://github.com/ctrimm/uswds-local-mcp-server" className="usa-link">GitHub repository</a>.
          </p>
        </div>
      </div>
    </GridContainer>
  );
}
