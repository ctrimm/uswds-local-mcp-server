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
      name: 'Free',
      price: '$0',
      period: '/month',
      features: [
        '100 requests/minute',
        '10,000 requests/day',
        'All 18 MCP tools',
        'Local or remote deployment',
        'Community support',
        'Open source (AGPL-3.0)',
      ],
      cta: 'Get Started',
      ctaLink: '/getting-started',
      featured: false,
    },
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
  ];

  const faqs = [
    {
      question: 'Is the free tier really free forever?',
      answer: 'Yes! The free tier is completely free with no time limit. Perfect for individual developers and small projects.',
    },
    {
      question: 'Can I self-host?',
      answer: 'Absolutely! The code is open source (AGPL-3.0). Deploy to AWS Lambda for ~$2-50/month depending on usage.',
    },
    {
      question: 'What happens if I exceed my limits?',
      answer: "You'll receive a 429 Too Many Requests response with a Retry-After header. Your service won't be interrupted, just rate-limited.",
    },
    {
      question: 'Do you offer discounts for government agencies?',
      answer: 'Yes! Contact us for special pricing for federal, state, and local government agencies.',
    },
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

          {/* Self-Hosted Note */}
          <div className="bg-base-lightest text-center padding-3 radius-md">
            <p className="margin-0">
              <strong>Self-Hosted?</strong> Deploy your own instance to AWS Lambda. Typical costs: $2-5/month for low usage, $20-50/month for high usage.
            </p>
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
