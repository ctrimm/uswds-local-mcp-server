import React from 'react';
import {
  Button,
  GridContainer,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@trussworks/react-uswds';

export default function Pricing() {
  const tiers = [
    {
      name: 'Self-Hosted',
      price: '$0',
      period: 'forever',
      badge: 'Open Source',
      features: [
        'Unlimited requests',
        'Deploy anywhere (AWS, local, etc.)',
        'Add custom MCP tools',
        'Integrate into agentic systems',
        'Full control over data',
        'AGPL-3.0 license',
      ],
      cta: 'View on GitHub',
      ctaLink: 'https://github.com/ctrimm/uswds-local-mcp-server',
      featured: false,
    },
    {
      name: 'Free Hosted',
      price: '$0',
      period: '/month',
      badge: 'No Setup Required',
      features: [
        '1 requests/minute',
        '100 requests/day',
        'All 18 MCP tools',
        'No setup required',
        'Community support',
        'Perfect for testing',
      ],
      cta: 'Get Free API Key',
      ctaLink: '/signup',
      featured: true,
    },
    // PAID TIERS - Commented out for initial launch
    // Uncomment when payment integration is ready
    /*
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      badge: 'Most Popular',
      features: [
        '1,000 requests/minute',
        '1M requests/month',
        'Priority support',
        'Custom rate limits',
        'Usage analytics',
        'SLA guarantee',
      ],
      cta: 'Contact Us',
      ctaLink: 'mailto:support@uswdsmcp.com?subject=Pro%20Plan',
      featured: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      features: [
        'Unlimited requests',
        'Dedicated support',
        'Custom deployment',
        'Team management',
        'Custom integrations',
        'On-premise option',
      ],
      cta: 'Contact Sales',
      ctaLink: 'mailto:support@uswdsmcp.com?subject=Enterprise%20Plan',
      featured: false,
    },
    */
  ];

  const faqs = [
    {
      question: 'Why is this open source under AGPL-3.0?',
      answer: 'We chose AGPL to build a strong community around government digital services. It ensures that improvements made by organizations are shared back with everyone, strengthening the ecosystem. You can freely use, modify, and deploy it—just share improvements if you offer it as a service.',
    },
    {
      question: 'Can I add custom tools and integrate into agentic systems?',
      answer: 'Absolutely! When self-hosted, you have complete control. Add custom MCP tools, extend functionality, integrate into multi-agent workflows, or embed in larger systems. The AGPL license permits this—just share improvements if you run it as a public service.',
    },
    {
      question: 'What are the benefits of self-hosting vs. using hosted infrastructure?',
      answer: 'Self-hosting gives you unlimited requests, full control over data and infrastructure, and the ability to customize everything. Hosted infrastructure offers zero setup, automatic updates, and we handle all scaling and maintenance. Choose based on your needs!',
    },
    {
      question: 'Is the free hosted tier really free forever?',
      answer: 'Yes! The free hosted tier is completely free with no time limit, perfect for testing and small projects. For production workloads with higher volume, we recommend self-hosting (unlimited, ~$2-50/month AWS costs depending on usage).',
    },
    {
      question: 'What happens if I exceed my free hosted tier limits?',
      answer: "You'll receive a 429 Too Many Requests response with a Retry-After header. Your service won't be interrupted, just rate-limited. For unlimited access, self-host the server on your own infrastructure.",
    },
    // PAID PLAN FAQ - Commented out for initial launch
    /*
    {
      question: 'Do you offer discounts for government agencies?',
      answer: 'Yes! Contact us for special pricing for federal, state, and local government agencies.',
    },
    */
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary" style={{ padding: '3rem 0' }}>
        <GridContainer className="text-center">
          <h1 className="font-heading-3xl text-white margin-bottom-1">
            Simple, Transparent Pricing
          </h1>
          <p className="font-body-lg text-white" style={{ opacity: 0.9 }}>
            Start free. Scale as you grow.
          </p>
        </GridContainer>
      </section>

      {/* Pricing Tiers */}
      <section className="usa-section">
        <GridContainer>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {tiers.map((tier, idx) => (
              <Card
                key={idx}
                className="height-full"
                style={{
                  position: 'relative',
                  ...(tier.featured && {
                    transform: 'scale(1.05)',
                    borderColor: '#005ea2',
                    borderWidth: '2px',
                    boxShadow: '0 8px 16px rgba(0, 94, 162, 0.1)',
                  }),
                }}
              >
                {tier.badge && (
                  <div
                    className="bg-accent-warm text-white text-center padding-y-05 padding-x-2 radius-pill font-body-xs text-bold"
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      whiteSpace: 'nowrap',
                      zIndex: 1,
                    }}
                  >
                    {tier.badge}
                  </div>
                )}
                  <CardHeader>
                    <h2 className="usa-card__heading text-primary">{tier.name}</h2>
                    <div className="margin-bottom-2">
                      <span className="font-sans-3xl text-bold text-primary">
                        {tier.price}
                      </span>
                      {tier.period && (
                        <span className="font-body-lg text-base-dark">{tier.period}</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardBody>
                    <ul className="usa-list usa-list--unstyled">
                      {tier.features.map((feature, featureIdx) => (
                        <li
                          key={featureIdx}
                          className="padding-y-1 border-bottom-1px border-base-lighter"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                  <CardFooter>
                    <a href={tier.cta.includes('Contact') ? tier.ctaLink : tier.ctaLink}>
                      <Button
                        type="button"
                        className="width-full"
                        outline={!tier.featured}
                      >
                        {tier.cta}
                      </Button>
                    </a>
                  </CardFooter>
                </Card>
            ))}
          </div>

          {/* Open Source Note */}
          <div className="bg-accent-cool-lighter border-accent-cool border-2px padding-4 radius-md">
            <div className="grid-row grid-gap-4">
              <div className="tablet:grid-col-8">
                <h3 className="font-heading-lg text-primary margin-top-0 margin-bottom-1">
                  💡 Want unlimited access? Self-host for free!
                </h3>
                <p className="font-body-md margin-bottom-0">
                  USWDS MCP Server is <strong>fully open source (AGPL-3.0)</strong>. Deploy to your own infrastructure with no rate limits, add custom tools, and integrate into agentic systems. Typical AWS Lambda costs: $2-5/month for low usage, $20-50/month for high usage.
                </p>
              </div>
              <div className="tablet:grid-col-4 display-flex flex-align-center flex-justify-center">
                <a href="https://github.com/ctrimm/uswds-local-mcp-server" className="usa-button">
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </GridContainer>
      </section>

      {/* FAQ Section */}
      <section className="usa-section bg-base-lightest">
        <GridContainer>
          <h2 className="font-heading-2xl text-center text-primary margin-bottom-5">
            Frequently Asked Questions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {faqs.map((faq, idx) => (
              <Card key={idx} className="height-full">
                <CardHeader>
                  <h3 className="usa-card__heading">{faq.question}</h3>
                </CardHeader>
                <CardBody>
                  <p className="margin-bottom-0">{faq.answer}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </GridContainer>
      </section>
    </>
  );
}
