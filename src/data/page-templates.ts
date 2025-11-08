/**
 * React-USWDS Page Templates
 * Full-page examples for quick prototyping
 * Based on https://trussworks.github.io/react-uswds/?path=/docs/page-templates-*
 */

export interface PageTemplate {
  name: string;
  slug: string;
  description: string;
  url: string;
  category: string;
  componentsUsed: string[];
  code: string;
  preview?: string;
  useCase: string[];
}

export const PAGE_TEMPLATES: Record<string, PageTemplate> = {
  SignIn: {
    name: 'Sign In',
    slug: 'sign-in',
    description: 'A simple sign-in page with email and password fields',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/page-templates-sign-in--docs',
    category: 'authentication',
    componentsUsed: ['Form', 'TextInput', 'Button', 'Label', 'GridContainer'],
    useCase: [
      'User authentication pages',
      'Login forms',
      'Simple account access'
    ],
    code: `import {
  Form,
  TextInput,
  Button,
  Label,
  GridContainer,
  Title
} from '@trussworks/react-uswds'

export default function SignInPage() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle sign in
  }

  return (
    <GridContainer className="usa-section">
      <div className="grid-row flex-justify-center">
        <div className="grid-col-12 tablet:grid-col-8 desktop:grid-col-6">
          <Title>Sign in</Title>
          <p className="usa-intro">
            Use your email and password to sign in.
          </p>

          <Form onSubmit={handleSubmit} large>
            <Label htmlFor="email">Email address</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              autoCapitalize="off"
              autoCorrect="off"
              required
            />

            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              required
            />

            <Button type="submit">Sign in</Button>
          </Form>

          <p className="text-center">
            <a href="/create-account" className="usa-link">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </GridContainer>
  )
}`
  },

  CreateAccount: {
    name: 'Create Account',
    slug: 'create-account',
    description: 'Account creation page with email, password, and confirmation fields',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/page-templates-create-account--docs',
    category: 'authentication',
    componentsUsed: ['Form', 'TextInput', 'Button', 'Label', 'Checkbox', 'GridContainer'],
    useCase: [
      'User registration',
      'New account signup',
      'User onboarding'
    ],
    code: `import {
  Form,
  TextInput,
  Button,
  Label,
  Checkbox,
  GridContainer,
  Title
} from '@trussworks/react-uswds'

export default function CreateAccountPage() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle account creation
  }

  return (
    <GridContainer className="usa-section">
      <div className="grid-row flex-justify-center">
        <div className="grid-col-12 tablet:grid-col-8 desktop:grid-col-6">
          <Title>Create account</Title>
          <p className="usa-intro">
            Create an account to get started.
          </p>

          <Form onSubmit={handleSubmit} large>
            <Label htmlFor="email">Email address</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              autoCapitalize="off"
              autoCorrect="off"
              required
            />

            <Label htmlFor="password">Create password</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              required
            />

            <Label htmlFor="password-confirm">Re-type password</Label>
            <TextInput
              id="password-confirm"
              name="password-confirm"
              type="password"
              required
            />

            <Checkbox
              id="terms"
              name="terms"
              label="I agree to the terms and conditions"
              required
            />

            <Button type="submit">Create account</Button>
          </Form>

          <p className="text-center">
            Already have an account?{' '}
            <a href="/sign-in" className="usa-link">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </GridContainer>
  )
}`
  },

  MultipleSignInOptions: {
    name: 'Multiple Sign In Options',
    slug: 'multiple-sign-in-options',
    description: 'Sign-in page with multiple authentication methods (email, Login.gov, etc.)',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/page-templates-multiple-sign-in-options--docs',
    category: 'authentication',
    componentsUsed: ['Form', 'TextInput', 'Button', 'Label', 'GridContainer'],
    useCase: [
      'Federated authentication',
      'Multiple sign-in providers',
      'Government login integration'
    ],
    code: `import {
  Form,
  TextInput,
  Button,
  Label,
  GridContainer,
  Title,
  Icon
} from '@trussworks/react-uswds'

export default function MultipleSignInPage() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle sign in
  }

  const handleLoginGov = () => {
    // Handle Login.gov authentication
  }

  return (
    <GridContainer className="usa-section">
      <div className="grid-row flex-justify-center">
        <div className="grid-col-12 tablet:grid-col-8 desktop:grid-col-6">
          <Title>Sign in</Title>

          <div className="margin-bottom-4">
            <Button
              type="button"
              onClick={handleLoginGov}
              className="width-full"
              outline
            >
              <Icon className="margin-right-1">account_circle</Icon>
              Sign in with Login.gov
            </Button>
          </div>

          <div className="usa-prose margin-y-3">
            <p className="text-center text-base">
              <strong>OR</strong>
            </p>
          </div>

          <Form onSubmit={handleSubmit} large>
            <Label htmlFor="email">Email address</Label>
            <TextInput
              id="email"
              name="email"
              type="email"
              autoCapitalize="off"
              autoCorrect="off"
              required
            />

            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              required
            />

            <Button type="submit" className="width-full">
              Sign in
            </Button>
          </Form>

          <p className="text-center margin-top-4">
            <a href="/forgot-password" className="usa-link">
              Forgot password?
            </a>
          </p>

          <p className="text-center">
            Do not have an account?{' '}
            <a href="/create-account" className="usa-link">
              Create one now
            </a>
          </p>
        </div>
      </div>
    </GridContainer>
  )
}`
  },

  LandingPage: {
    name: 'Landing Page',
    slug: 'landing-page',
    description: 'Marketing-style landing page with hero, features, and call-to-action',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/page-templates-landing-page--docs',
    category: 'marketing',
    componentsUsed: ['GridContainer', 'Grid', 'Button', 'Card', 'CardGroup', 'Header', 'Footer'],
    useCase: [
      'Product landing pages',
      'Service introduction',
      'Marketing pages',
      'Public-facing home pages'
    ],
    code: `import {
  GridContainer,
  Grid,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardGroup,
  Header,
  Footer,
  Title
} from '@trussworks/react-uswds'

export default function LandingPage() {
  return (
    <>
      <section className="usa-hero" aria-label="Introduction">
        <GridContainer>
          <div className="usa-hero__callout">
            <Title className="usa-hero__heading">
              <span className="usa-hero__heading--alt">
                Bring your attention to
              </span>
              A tagline highlights your approach
            </Title>
            <p>
              Support the callout with some short explanatory text.
              You do not need more than a couple of sentences.
            </p>
            <Button type="button">Call to action</Button>
          </div>
        </GridContainer>
      </section>

      <section className="grid-container usa-section">
        <Grid row gap>
          <Grid tablet={{ col: 4 }}>
            <Title headingLevel="h2" className="font-heading-xl margin-top-0">
              A tagline highlights your approach
            </Title>
          </Grid>
          <Grid tablet={{ col: 8 }} className="usa-prose">
            <p>
              The tagline should inspire confidence and interest,
              focusing on the value that your overall approach offers
              to your audience.
            </p>
            <p>
              Use a combination of display text and body text to
              present your key points.
            </p>
          </Grid>
        </Grid>
      </section>

      <section className="usa-graphic-list usa-section usa-section--dark">
        <GridContainer>
          <Grid row gap className="usa-graphic-list__row">
            <Grid tablet={{ col: 6 }} className="usa-media-block">
              <img
                className="usa-media-block__img"
                src="/img/circle-124.png"
                alt="Alt text"
              />
              <div className="usa-media-block__body">
                <Title headingLevel="h3">Graphic headings</Title>
                <p>
                  Graphic headings can be used a few ways, depending on what
                  your landing page is about.
                </p>
              </div>
            </Grid>

            <Grid tablet={{ col: 6 }} className="usa-media-block">
              <img
                className="usa-media-block__img"
                src="/img/circle-124.png"
                alt="Alt text"
              />
              <div className="usa-media-block__body">
                <Title headingLevel="h3">Stick to 2 or 3</Title>
                <p>
                  Any more than 3 may be too much. Divide complex
                  information into more specific pages.
                </p>
              </div>
            </Grid>
          </Grid>

          <Grid row gap className="usa-graphic-list__row">
            <Grid tablet={{ col: 6 }} className="usa-media-block">
              <img
                className="usa-media-block__img"
                src="/img/circle-124.png"
                alt="Alt text"
              />
              <div className="usa-media-block__body">
                <Title headingLevel="h3">Provide key points</Title>
                <p>
                  Keep body text to about 30 words. They can be shorter,
                  but try to be somewhat balanced across all four.
                </p>
              </div>
            </Grid>

            <Grid tablet={{ col: 6 }} className="usa-media-block">
              <img
                className="usa-media-block__img"
                src="/img/circle-124.png"
                alt="Alt text"
              />
              <div className="usa-media-block__body">
                <Title headingLevel="h3">Never highlight anything</Title>
                <p>
                  Highlight the most important benefit: what your user
                  gets out of your service, or any overall approach.
                </p>
              </div>
            </Grid>
          </Grid>
        </GridContainer>
      </section>

      <section className="usa-section">
        <GridContainer>
          <Title headingLevel="h2" className="font-heading-xl margin-y-0">
            Section heading
          </Title>
          <p className="usa-intro">
            Everything up to this point should help users understand your
            agency or project.
          </p>

          <CardGroup>
            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <Title headingLevel="h3" className="usa-card__heading">
                  Card 1
                </Title>
              </CardHeader>
              <CardBody>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </CardBody>
              <CardFooter>
                <Button type="button" base>
                  Visit Florida
                </Button>
              </CardFooter>
            </Card>

            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <Title headingLevel="h3" className="usa-card__heading">
                  Card 2
                </Title>
              </CardHeader>
              <CardBody>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </CardBody>
              <CardFooter>
                <Button type="button" base>
                  Visit California
                </Button>
              </CardFooter>
            </Card>

            <Card gridLayout={{ tablet: { col: 4 } }}>
              <CardHeader>
                <Title headingLevel="h3" className="usa-card__heading">
                  Card 3
                </Title>
              </CardHeader>
              <CardBody>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </CardBody>
              <CardFooter>
                <Button type="button" base>
                  Visit Maryland
                </Button>
              </CardFooter>
            </Card>
          </CardGroup>
        </GridContainer>
      </section>
    </>
  )
}`
  },

  Documentation: {
    name: 'Documentation',
    slug: 'documentation',
    description: 'Documentation page layout with sidebar navigation and content area',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/page-templates-documentation--docs',
    category: 'content',
    componentsUsed: ['GridContainer', 'Grid', 'SideNav', 'InPageNavigation'],
    useCase: [
      'Documentation sites',
      'Help pages',
      'Knowledge bases',
      'Technical documentation'
    ],
    code: `import {
  GridContainer,
  Grid,
  SideNav,
  InPageNavigation,
  Title
} from '@trussworks/react-uswds'

const sideNavItems = [
  <a href="#getting-started" className="usa-current">
    Getting started
  </a>,
  <a href="#installation">Installation</a>,
  <a href="#usage">Usage</a>,
  <a href="#components">Components</a>,
  <a href="#examples">Examples</a>,
]

const inPageNavItems = [
  { href: '#overview', text: 'Overview' },
  { href: '#prerequisites', text: 'Prerequisites' },
  { href: '#setup', text: 'Setup' },
  { href: '#next-steps', text: 'Next steps' },
]

export default function DocumentationPage() {
  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        <Grid desktop={{ col: 3 }}>
          <SideNav items={sideNavItems} />
        </Grid>

        <Grid desktop={{ col: 6 }}>
          <div className="usa-prose">
            <Title id="overview">Getting started</Title>

            <p className="usa-intro">
              Use this documentation template to provide users with
              guidance on how to use your service or product.
            </p>

            <Title headingLevel="h2" id="prerequisites">
              Prerequisites
            </Title>
            <p>
              Before you begin, make sure you have the following:
            </p>
            <ul>
              <li>Node.js 16.x or higher</li>
              <li>npm or yarn package manager</li>
              <li>Basic knowledge of React</li>
            </ul>

            <Title headingLevel="h2" id="setup">
              Setup
            </Title>
            <p>
              Follow these steps to get started:
            </p>
            <ol>
              <li>Install the package: <code>npm install @trussworks/react-uswds</code></li>
              <li>Import components in your app</li>
              <li>Start building!</li>
            </ol>

            <Title headingLevel="h2" id="next-steps">
              Next steps
            </Title>
            <p>
              Now that you have completed the setup, you can:
            </p>
            <ul>
              <li>Browse the component library</li>
              <li>Read the accessibility guidelines</li>
              <li>Check out example implementations</li>
            </ul>
          </div>
        </Grid>

        <Grid desktop={{ col: 3 }}>
          <aside className="desktop:position-sticky desktop:top-2">
            <InPageNavigation
              items={inPageNavItems}
              headingLevel="h4"
            />
          </aside>
        </Grid>
      </Grid>
    </GridContainer>
  )
}`
  },

  Forms: {
    name: 'Forms',
    slug: 'forms',
    description: 'Complex multi-section form layout with validation',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/page-templates-forms--docs',
    category: 'forms',
    componentsUsed: ['Form', 'FormGroup', 'TextInput', 'Select', 'Textarea', 'Button', 'Label', 'StepIndicator', 'GridContainer'],
    useCase: [
      'Application forms',
      'Multi-step processes',
      'Data collection',
      'Registration forms'
    ],
    code: `import {
  Form,
  FormGroup,
  TextInput,
  Select,
  Textarea,
  Button,
  Label,
  Fieldset,
  GridContainer,
  Grid,
  Title
} from '@trussworks/react-uswds'

export default function FormsPage() {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission
  }

  return (
    <GridContainer className="usa-section">
      <Grid row gap>
        <Grid desktop={{ col: 8 }}>
          <Title>Application form</Title>
          <p className="usa-intro">
            Complete this form to submit your application.
          </p>

          <Form onSubmit={handleSubmit} large>
            <Fieldset legend="Personal Information" legendStyle="large">
              <Grid row gap>
                <Grid tablet={{ col: 6 }}>
                  <FormGroup>
                    <Label htmlFor="first-name">First name</Label>
                    <TextInput
                      id="first-name"
                      name="first-name"
                      type="text"
                      required
                    />
                  </FormGroup>
                </Grid>

                <Grid tablet={{ col: 6 }}>
                  <FormGroup>
                    <Label htmlFor="last-name">Last name</Label>
                    <TextInput
                      id="last-name"
                      name="last-name"
                      type="text"
                      required
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              <FormGroup>
                <Label htmlFor="email">Email address</Label>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="phone">Phone number</Label>
                <TextInput
                  id="phone"
                  name="phone"
                  type="tel"
                />
              </FormGroup>
            </Fieldset>

            <Fieldset legend="Address" legendStyle="large">
              <FormGroup>
                <Label htmlFor="street">Street address</Label>
                <TextInput
                  id="street"
                  name="street"
                  type="text"
                  required
                />
              </FormGroup>

              <Grid row gap>
                <Grid tablet={{ col: 6 }}>
                  <FormGroup>
                    <Label htmlFor="city">City</Label>
                    <TextInput
                      id="city"
                      name="city"
                      type="text"
                      required
                    />
                  </FormGroup>
                </Grid>

                <Grid tablet={{ col: 3 }}>
                  <FormGroup>
                    <Label htmlFor="state">State</Label>
                    <Select id="state" name="state" required>
                      <option value="">- Select -</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="CA">California</option>
                      {/* Add more states */}
                    </Select>
                  </FormGroup>
                </Grid>

                <Grid tablet={{ col: 3 }}>
                  <FormGroup>
                    <Label htmlFor="zip">ZIP code</Label>
                    <TextInput
                      id="zip"
                      name="zip"
                      type="text"
                      pattern="[0-9]{5}"
                      required
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </Fieldset>

            <Fieldset legend="Additional Information" legendStyle="large">
              <FormGroup>
                <Label htmlFor="comments">Comments or questions</Label>
                <Textarea
                  id="comments"
                  name="comments"
                />
              </FormGroup>
            </Fieldset>

            <div className="margin-top-4">
              <Button type="submit">Submit application</Button>
              <Button type="button" base className="margin-left-1">
                Save as draft
              </Button>
            </div>
          </Form>
        </Grid>

        <Grid desktop={{ col: 4 }}>
          <aside className="usa-prose">
            <Title headingLevel="h3">Need help?</Title>
            <p>
              If you need assistance completing this form, please contact us:
            </p>
            <ul>
              <li>Phone: 1-800-555-5555</li>
              <li>Email: help@example.gov</li>
            </ul>
          </aside>
        </Grid>
      </Grid>
    </GridContainer>
  )
}`
  },

  NotFound: {
    name: 'Not Found (404)',
    slug: 'not-found',
    description: '404 error page with helpful navigation options',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/page-templates-not-found--docs',
    category: 'error',
    componentsUsed: ['GridContainer', 'Grid', 'Button', 'Link'],
    useCase: [
      '404 error pages',
      'Page not found errors',
      'Broken link handling'
    ],
    code: `import {
  GridContainer,
  Grid,
  Button,
  Link,
  Title
} from '@trussworks/react-uswds'

export default function NotFoundPage() {
  return (
    <GridContainer className="usa-section">
      <Grid row className="flex-justify-center">
        <Grid col={12} tablet={{ col: 10 }} desktop={{ col: 8 }}>
          <div className="text-center">
            <p className="text-base margin-0">404</p>
            <Title className="margin-top-1">
              Page not found
            </Title>
            <p className="usa-intro">
              We are sorry, we cannot find the page you are looking for.
              The link you followed may be broken, or the page may have
              been removed.
            </p>

            <div className="margin-y-5">
              <ul className="usa-list usa-list--unstyled">
                <li>
                  <Link href="/" className="usa-link">
                    Visit our homepage
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="usa-link">
                    Contact us
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="usa-link">
                    Browse our sitemap
                  </Link>
                </li>
              </ul>
            </div>

            <div className="margin-top-6">
              <Button type="button" onClick={() => window.history.back()}>
                Go back
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  )
}`
  }
};

export const TEMPLATE_CATEGORIES = {
  authentication: 'Authentication',
  marketing: 'Marketing',
  content: 'Content',
  forms: 'Forms',
  error: 'Error Pages'
};
