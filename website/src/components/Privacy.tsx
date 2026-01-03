import React from 'react';
import { GridContainer } from '@trussworks/react-uswds';

export default function Privacy() {
  return (
    <GridContainer>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 className="font-heading-2xl text-primary margin-bottom-1">Privacy Policy</h1>
        <p className="text-base-dark margin-bottom-05">Effective Date: January 3, 2026</p>
        <p className="font-body-md text-base-dark margin-bottom-5">
          Last Updated: January 3, 2026
        </p>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">1. Introduction</h2>
          <p className="margin-bottom-2">
            This Privacy Policy explains how USWDS MCP Server ("we," "us," or "our") collects, uses, and protects your information when you use our hosted service. This policy applies only to our hosted infrastructure. If you self-host the open source software, you control all data processing.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">2. Information We Collect</h2>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">2.1 Information You Provide</h3>
          <ul className="usa-list">
            <li><strong>Email Address:</strong> When you sign up for an API key</li>
            <li><strong>API Key:</strong> Generated for authentication</li>
            <li><strong>Payment Information:</strong> For paid tiers (processed by third-party payment providers)</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">2.2 Automatically Collected Information</h3>
          <ul className="usa-list">
            <li><strong>Usage Data:</strong> API requests, timestamps, request counts</li>
            <li><strong>Technical Data:</strong> IP address, user agent, request/response headers</li>
            <li><strong>Performance Metrics:</strong> Response times, error rates, cache hit rates</li>
            <li><strong>Log Data:</strong> Server logs for debugging and security monitoring</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">2.3 Information We Do NOT Collect</h3>
          <ul className="usa-list">
            <li>The content of your MCP requests or responses (except in error logs for debugging)</li>
            <li>Personal information beyond email addresses</li>
            <li>Tracking cookies or advertising identifiers</li>
            <li>Third-party analytics or tracking scripts</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">3. How We Use Your Information</h2>
          <p className="margin-bottom-2">We use collected information for:</p>
          <ul className="usa-list">
            <li><strong>Service Delivery:</strong> Processing API requests, authentication, and authorization</li>
            <li><strong>Rate Limiting:</strong> Enforcing usage limits and preventing abuse</li>
            <li><strong>Billing:</strong> Processing payments for paid tiers</li>
            <li><strong>Security:</strong> Detecting and preventing fraud, abuse, and security threats</li>
            <li><strong>Performance:</strong> Monitoring service health and optimizing performance</li>
            <li><strong>Support:</strong> Responding to questions and troubleshooting issues</li>
            <li><strong>Legal Compliance:</strong> Meeting legal obligations and enforcing our Terms of Service</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">4. Data Storage and Security</h2>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">4.1 Where Data is Stored</h3>
          <p className="margin-bottom-2">
            Our hosted service runs on Amazon Web Services (AWS) infrastructure in the United States. Data is stored in:
          </p>
          <ul className="usa-list">
            <li><strong>DynamoDB:</strong> User accounts, API keys, usage quotas</li>
            <li><strong>CloudWatch Logs:</strong> Application logs (retained for 30 days)</li>
            <li><strong>Lambda Memory:</strong> Temporary rate limit counters (cleared on cold starts)</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">4.2 Security Measures</h3>
          <p className="margin-bottom-2">We implement industry-standard security measures:</p>
          <ul className="usa-list">
            <li>Encryption in transit (TLS 1.2+)</li>
            <li>Encryption at rest for database storage</li>
            <li>API key authentication</li>
            <li>Rate limiting and abuse detection</li>
            <li>Regular security updates and monitoring</li>
            <li>AWS security best practices and compliance</li>
          </ul>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">4.3 Data Retention</h3>
          <ul className="usa-list">
            <li><strong>Account Data:</strong> Retained while your account is active</li>
            <li><strong>Usage Logs:</strong> Retained for 30 days for debugging and analytics</li>
            <li><strong>Billing Records:</strong> Retained for 7 years for tax and legal compliance</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">5. Data Sharing and Third Parties</h2>
          <p className="margin-bottom-2">We do not sell your personal information. We may share data with:</p>
          <ul className="usa-list">
            <li><strong>AWS:</strong> Infrastructure provider (subject to AWS privacy policies)</li>
            <li><strong>Payment Processors:</strong> For paid tier billing (Stripe or similar)</li>
            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
          </ul>
          <p className="margin-top-2">
            We do not share data with advertisers, marketers, or data brokers.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">6. Your Rights and Choices</h2>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">6.1 Access and Correction</h3>
          <p className="margin-bottom-2">
            You may request access to or correction of your personal information by contacting us at{' '}
            <a href="mailto:support@uswdsmcp.com" className="usa-link">support@uswdsmcp.com</a>.
          </p>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">6.2 Account Deletion</h3>
          <p className="margin-bottom-2">
            You may request deletion of your account and associated data by contacting us. We will delete your information within 30 days, except where retention is required by law.
          </p>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">6.3 Data Portability</h3>
          <p className="margin-bottom-2">
            You may request an export of your usage data in a machine-readable format.
          </p>

          <h3 className="font-heading-lg margin-top-3 margin-bottom-2">6.4 Self-Hosting Alternative</h3>
          <p className="margin-bottom-2">
            For complete data control, you may self-host the AGPL-3.0 licensed software on your own infrastructure. When self-hosted, we collect no data about your usage.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">7. Cookies and Tracking</h2>
          <p className="margin-bottom-2">
            Our service uses minimal cookies:
          </p>
          <ul className="usa-list">
            <li><strong>Essential Cookies:</strong> Required for authentication and service operation</li>
            <li><strong>No Advertising Cookies:</strong> We do not use advertising or tracking cookies</li>
            <li><strong>No Third-Party Analytics:</strong> We do not use Google Analytics or similar services</li>
          </ul>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">8. Children's Privacy</h2>
          <p className="margin-bottom-2">
            Our service is not directed to children under 13. We do not knowingly collect information from children. If you believe a child has provided us with personal information, please contact us.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">9. International Users</h2>
          <p className="margin-bottom-2">
            Our servers are located in the United States. If you access our service from outside the U.S., your information will be transferred to and processed in the United States. By using our service, you consent to this transfer.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">10. Changes to This Policy</h2>
          <p className="margin-bottom-2">
            We may update this Privacy Policy from time to time. We will notify you of material changes by:
          </p>
          <ul className="usa-list">
            <li>Posting the updated policy on this page</li>
            <li>Updating the "Last Updated" date</li>
            <li>Sending email notifications for significant changes</li>
          </ul>
          <p className="margin-top-2">
            Your continued use of the service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="margin-bottom-4">
          <h2 className="font-heading-xl text-primary margin-bottom-2">11. Contact Us</h2>
          <p className="margin-bottom-2">
            For privacy-related questions or requests, please contact us:
          </p>
          <ul className="usa-list">
            <li><strong>Email:</strong> <a href="mailto:support@uswdsmcp.com" className="usa-link">support@uswdsmcp.com</a></li>
            <li><strong>GitHub:</strong> <a href="https://github.com/ctrimm/uswds-local-mcp-server/issues" className="usa-link">Report an issue</a></li>
          </ul>
        </section>

        <div className="bg-base-lightest padding-3 radius-md margin-top-5">
          <h3 className="font-heading-md text-primary margin-top-0 margin-bottom-2">Open Source Privacy</h3>
          <p className="margin-bottom-0">
            Remember: When you self-host the AGPL-3.0 licensed software, you have complete control over your data. This Privacy Policy applies only to our hosted service. Visit our{' '}
            <a href="https://github.com/ctrimm/uswds-local-mcp-server" className="usa-link">GitHub repository</a>{' '}
            to learn about self-hosting.
          </p>
        </div>
      </div>
    </GridContainer>
  );
}
