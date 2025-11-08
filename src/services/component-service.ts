import axios from 'axios';
import * as cheerio from 'cheerio';

interface ComponentInfo {
  name: string;
  description: string;
  category: string;
  props?: any[];
  examples?: any[];
  accessibility?: string;
  url: string;
}

export class ComponentService {
  private useReact: boolean;
  private baseUrl: string;
  private reactBaseUrl = 'https://trussworks.github.io/react-uswds';
  private uswdsBaseUrl = 'https://designsystem.digital.gov';

  constructor(useReact: boolean = false) {
    this.useReact = useReact;
    this.baseUrl = useReact ? this.reactBaseUrl : this.uswdsBaseUrl;
  }

  async listComponents(category: string = 'all'): Promise<any> {
    if (this.useReact) {
      return this.listReactComponents(category);
    } else {
      return this.listUSWDSComponents(category);
    }
  }

  private async listReactComponents(category: string): Promise<any> {
    // React-USWDS components (from their Storybook and documentation)
    const components: ComponentInfo[] = [
      // Forms
      { name: 'Button', category: 'forms', description: 'Clickable button element with various styles', url: `${this.reactBaseUrl}/?path=/docs/components-button--docs` },
      { name: 'TextInput', category: 'forms', description: 'Single-line text input field', url: `${this.reactBaseUrl}/?path=/docs/components-text-input--docs` },
      { name: 'Checkbox', category: 'forms', description: 'Checkbox input for multiple selections', url: `${this.reactBaseUrl}/?path=/docs/components-checkbox--docs` },
      { name: 'Radio', category: 'forms', description: 'Radio button for single selection', url: `${this.reactBaseUrl}/?path=/docs/components-radio--docs` },
      { name: 'Select', category: 'forms', description: 'Dropdown selection list', url: `${this.reactBaseUrl}/?path=/docs/components-select--docs` },
      { name: 'Textarea', category: 'forms', description: 'Multi-line text input field', url: `${this.reactBaseUrl}/?path=/docs/components-textarea--docs` },
      { name: 'DatePicker', category: 'forms', description: 'Date selection input', url: `${this.reactBaseUrl}/?path=/docs/components-date-picker--docs` },
      { name: 'DateRangePicker', category: 'forms', description: 'Date range selection input', url: `${this.reactBaseUrl}/?path=/docs/components-date-range-picker--docs` },
      { name: 'TimePicker', category: 'forms', description: 'Time selection input', url: `${this.reactBaseUrl}/?path=/docs/components-time-picker--docs` },
      { name: 'ComboBox', category: 'forms', description: 'Combination of text input and dropdown', url: `${this.reactBaseUrl}/?path=/docs/components-combo-box--docs` },
      { name: 'FileInput', category: 'forms', description: 'File upload input', url: `${this.reactBaseUrl}/?path=/docs/components-file-input--docs` },
      { name: 'Label', category: 'forms', description: 'Form field label', url: `${this.reactBaseUrl}/?path=/docs/components-label--docs` },
      { name: 'FormGroup', category: 'forms', description: 'Group related form fields', url: `${this.reactBaseUrl}/?path=/docs/components-form-group--docs` },

      // Navigation
      { name: 'Header', category: 'navigation', description: 'Site header with branding and navigation', url: `${this.reactBaseUrl}/?path=/docs/components-header--docs` },
      { name: 'Footer', category: 'navigation', description: 'Site footer with links and information', url: `${this.reactBaseUrl}/?path=/docs/components-footer--docs` },
      { name: 'Navigation', category: 'navigation', description: 'Primary navigation menu', url: `${this.reactBaseUrl}/?path=/docs/components-navigation--docs` },
      { name: 'SideNav', category: 'navigation', description: 'Sidebar navigation menu', url: `${this.reactBaseUrl}/?path=/docs/components-side-navigation--docs` },
      { name: 'Breadcrumb', category: 'navigation', description: 'Hierarchical navigation trail', url: `${this.reactBaseUrl}/?path=/docs/components-breadcrumb--docs` },
      { name: 'StepIndicator', category: 'navigation', description: 'Multi-step process indicator', url: `${this.reactBaseUrl}/?path=/docs/components-step-indicator--docs` },
      { name: 'Link', category: 'navigation', description: 'Styled anchor link', url: `${this.reactBaseUrl}/?path=/docs/components-link--docs` },

      // UI Components
      { name: 'Alert', category: 'ui', description: 'Informational alert message', url: `${this.reactBaseUrl}/?path=/docs/components-alert--docs` },
      { name: 'Modal', category: 'ui', description: 'Dialog overlay window', url: `${this.reactBaseUrl}/?path=/docs/components-modal--docs` },
      { name: 'Accordion', category: 'ui', description: 'Expandable/collapsible content sections', url: `${this.reactBaseUrl}/?path=/docs/components-accordion--docs` },
      { name: 'Banner', category: 'ui', description: 'Official government website banner', url: `${this.reactBaseUrl}/?path=/docs/components-banner--docs` },
      { name: 'Card', category: 'ui', description: 'Content container card', url: `${this.reactBaseUrl}/?path=/docs/components-card--docs` },
      { name: 'Tag', category: 'ui', description: 'Label or tag element', url: `${this.reactBaseUrl}/?path=/docs/components-tag--docs` },
      { name: 'Tooltip', category: 'ui', description: 'Hover information popup', url: `${this.reactBaseUrl}/?path=/docs/components-tooltip--docs` },
      { name: 'Table', category: 'ui', description: 'Data table', url: `${this.reactBaseUrl}/?path=/docs/components-table--docs` },
      { name: 'Pagination', category: 'ui', description: 'Page navigation controls', url: `${this.reactBaseUrl}/?path=/docs/components-pagination--docs` },
      { name: 'ProcessList', category: 'ui', description: 'Ordered process steps list', url: `${this.reactBaseUrl}/?path=/docs/components-process-list--docs` },

      // Layout
      { name: 'Grid', category: 'layout', description: 'Responsive grid system', url: `${this.reactBaseUrl}/?path=/docs/components-grid--docs` },
      { name: 'GridContainer', category: 'layout', description: 'Grid container wrapper', url: `${this.reactBaseUrl}/?path=/docs/components-grid-container--docs` },
    ];

    if (category === 'all') {
      return {
        mode: 'react-uswds',
        total: components.length,
        categories: ['forms', 'navigation', 'ui', 'layout'],
        components: components.map(c => ({
          name: c.name,
          category: c.category,
          description: c.description,
          url: c.url
        }))
      };
    }

    const filtered = components.filter(c => c.category === category);
    return {
      mode: 'react-uswds',
      category,
      total: filtered.length,
      components: filtered.map(c => ({
        name: c.name,
        description: c.description,
        url: c.url
      }))
    };
  }

  private async listUSWDSComponents(category: string): Promise<any> {
    // Vanilla USWDS components
    const components: ComponentInfo[] = [
      // Forms
      { name: 'Button', category: 'forms', description: 'Clickable button element', url: `${this.uswdsBaseUrl}/components/button/` },
      { name: 'Text input', category: 'forms', description: 'Single-line text input', url: `${this.uswdsBaseUrl}/components/text-input/` },
      { name: 'Checkbox', category: 'forms', description: 'Checkbox selection', url: `${this.uswdsBaseUrl}/components/checkbox/` },
      { name: 'Radio button', category: 'forms', description: 'Radio button selection', url: `${this.uswdsBaseUrl}/components/radio-buttons/` },
      { name: 'Select', category: 'forms', description: 'Dropdown menu', url: `${this.uswdsBaseUrl}/components/select/` },
      { name: 'Textarea', category: 'forms', description: 'Multi-line text input', url: `${this.uswdsBaseUrl}/components/textarea/` },
      { name: 'Date picker', category: 'forms', description: 'Date selection input', url: `${this.uswdsBaseUrl}/components/date-picker/` },
      { name: 'Date range picker', category: 'forms', description: 'Date range selection', url: `${this.uswdsBaseUrl}/components/date-range-picker/` },
      { name: 'Time picker', category: 'forms', description: 'Time selection input', url: `${this.uswdsBaseUrl}/components/time-picker/` },
      { name: 'Combo box', category: 'forms', description: 'Autocomplete dropdown', url: `${this.uswdsBaseUrl}/components/combo-box/` },
      { name: 'File input', category: 'forms', description: 'File upload', url: `${this.uswdsBaseUrl}/components/file-input/` },

      // Navigation
      { name: 'Header', category: 'navigation', description: 'Site header', url: `${this.uswdsBaseUrl}/components/header/` },
      { name: 'Footer', category: 'navigation', description: 'Site footer', url: `${this.uswdsBaseUrl}/components/footer/` },
      { name: 'Navigation', category: 'navigation', description: 'Primary navigation', url: `${this.uswdsBaseUrl}/components/navigation/` },
      { name: 'Side navigation', category: 'navigation', description: 'Sidebar navigation', url: `${this.uswdsBaseUrl}/components/side-navigation/` },
      { name: 'Breadcrumb', category: 'navigation', description: 'Navigation breadcrumb', url: `${this.uswdsBaseUrl}/components/breadcrumb/` },
      { name: 'Step indicator', category: 'navigation', description: 'Process steps', url: `${this.uswdsBaseUrl}/components/step-indicator/` },

      // UI
      { name: 'Alert', category: 'ui', description: 'Alert notification', url: `${this.uswdsBaseUrl}/components/alert/` },
      { name: 'Modal', category: 'ui', description: 'Modal dialog', url: `${this.uswdsBaseUrl}/components/modal/` },
      { name: 'Accordion', category: 'ui', description: 'Expandable sections', url: `${this.uswdsBaseUrl}/components/accordion/` },
      { name: 'Banner', category: 'ui', description: 'Government banner', url: `${this.uswdsBaseUrl}/components/banner/` },
      { name: 'Card', category: 'ui', description: 'Content card', url: `${this.uswdsBaseUrl}/components/card/` },
      { name: 'Tag', category: 'ui', description: 'Tag label', url: `${this.uswdsBaseUrl}/components/tag/` },
      { name: 'Tooltip', category: 'ui', description: 'Tooltip popup', url: `${this.uswdsBaseUrl}/components/tooltip/` },
      { name: 'Table', category: 'ui', description: 'Data table', url: `${this.uswdsBaseUrl}/components/table/` },
    ];

    if (category === 'all') {
      return {
        mode: 'vanilla-uswds',
        total: components.length,
        categories: ['forms', 'navigation', 'ui'],
        components: components.map(c => ({
          name: c.name,
          category: c.category,
          description: c.description,
          url: c.url
        }))
      };
    }

    const filtered = components.filter(c => c.category === category);
    return {
      mode: 'vanilla-uswds',
      category,
      total: filtered.length,
      components: filtered.map(c => ({
        name: c.name,
        description: c.description,
        url: c.url
      }))
    };
  }

  async getComponentInfo(componentName: string, includeExamples: boolean = true): Promise<any> {
    if (this.useReact) {
      return this.getReactComponentInfo(componentName, includeExamples);
    } else {
      return this.getUSWDSComponentInfo(componentName, includeExamples);
    }
  }

  private async getReactComponentInfo(componentName: string, includeExamples: boolean): Promise<any> {
    // For React-USWDS, provide component information
    const reactComponents: Record<string, any> = {
      'Button': {
        name: 'Button',
        description: 'The Button component renders a clickable button element with USWDS styling',
        category: 'forms',
        importPath: '@trussworks/react-uswds',
        props: [
          { name: 'type', type: "'button' | 'submit' | 'reset'", required: false, default: 'button', description: 'Button type attribute' },
          { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disable the button' },
          { name: 'size', type: "'big' | 'small'", required: false, description: 'Button size variant' },
          { name: 'variant', type: "'default' | 'outline' | 'unstyled' | 'base'", required: false, description: 'Button style variant' },
          { name: 'secondary', type: 'boolean', required: false, description: 'Apply secondary styling' },
          { name: 'accent', type: 'boolean', required: false, description: 'Apply accent styling' },
          { name: 'fullWidth', type: 'boolean', required: false, description: 'Make button full width' },
        ],
        examples: includeExamples ? [
          {
            title: 'Primary Button',
            code: `import { Button } from '@trussworks/react-uswds'

export function Example() {
  return <Button type="button">Click me</Button>
}`
          },
          {
            title: 'Secondary Button',
            code: `import { Button } from '@trussworks/react-uswds'

export function Example() {
  return <Button type="button" secondary>Secondary action</Button>
}`
          },
          {
            title: 'Outline Button',
            code: `import { Button } from '@trussworks/react-uswds'

export function Example() {
  return <Button type="button" variant="outline">Outline button</Button>
}`
          }
        ] : [],
        accessibility: {
          guidelines: [
            'Use semantic button type (button, submit, or reset)',
            'Ensure button text is descriptive and meaningful',
            'Provide sufficient color contrast (4.5:1 minimum)',
            'Make clickable area at least 44x44 pixels',
            'Support keyboard navigation (Enter and Space keys)'
          ],
          ariaAttributes: [
            'aria-label: Use when button text is not descriptive enough',
            'aria-pressed: For toggle buttons to indicate state',
            'aria-expanded: For buttons that control expandable regions'
          ]
        },
        relatedComponents: ['ButtonGroup', 'Link'],
        url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-button--docs'
      },
      'Alert': {
        name: 'Alert',
        description: 'Alerts keep users informed of important and sometimes time-sensitive changes',
        category: 'ui',
        importPath: '@trussworks/react-uswds',
        props: [
          { name: 'type', type: "'success' | 'warning' | 'error' | 'info'", required: true, description: 'Alert type/severity' },
          { name: 'heading', type: 'string | React.ReactNode', required: false, description: 'Alert heading text' },
          { name: 'headingLevel', type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", required: false, default: 'h4', description: 'Heading level for accessibility' },
          { name: 'slim', type: 'boolean', required: false, description: 'Use slim variant' },
          { name: 'noIcon', type: 'boolean', required: false, description: 'Hide alert icon' },
          { name: 'validation', type: 'boolean', required: false, description: 'Use for form validation' },
        ],
        examples: includeExamples ? [
          {
            title: 'Success Alert',
            code: `import { Alert } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Alert type="success" heading="Success">
      Your action was completed successfully.
    </Alert>
  )
}`
          },
          {
            title: 'Error Alert',
            code: `import { Alert } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Alert type="error" heading="Error" headingLevel="h3">
      There was an error processing your request.
    </Alert>
  )
}`
          }
        ] : [],
        accessibility: {
          guidelines: [
            'Use appropriate alert type for the message severity',
            'Include descriptive heading',
            'Use headingLevel prop to maintain heading hierarchy',
            'For validation errors, set validation={true} and link to form fields'
          ],
          ariaAttributes: [
            'role="region": Automatically applied for accessibility',
            'aria-label: Auto-generated from alert type',
            'aria-describedby: Link to detailed error messages in form validation'
          ]
        },
        url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-alert--docs'
      },
      'TextInput': {
        name: 'TextInput',
        description: 'A text input allows users to enter any combination of letters, numbers, or symbols',
        category: 'forms',
        importPath: '@trussworks/react-uswds',
        props: [
          { name: 'id', type: 'string', required: true, description: 'Input ID for label association' },
          { name: 'name', type: 'string', required: true, description: 'Input name attribute' },
          { name: 'type', type: "'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url'", required: false, default: 'text', description: 'Input type' },
          { name: 'value', type: 'string', required: false, description: 'Controlled input value' },
          { name: 'defaultValue', type: 'string', required: false, description: 'Uncontrolled input default value' },
          { name: 'disabled', type: 'boolean', required: false, description: 'Disable the input' },
          { name: 'validationStatus', type: "'error' | 'success'", required: false, description: 'Validation state' },
          { name: 'inputSize', type: "'small' | 'medium'", required: false, description: 'Input size variant' },
        ],
        examples: includeExamples ? [
          {
            title: 'Basic Text Input',
            code: `import { Label, TextInput } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="input-id">Input label</Label>
      <TextInput id="input-id" name="input-name" type="text" />
    </>
  )
}`
          },
          {
            title: 'Text Input with Error',
            code: `import { Label, TextInput, ErrorMessage } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="email-input" error>Email address</Label>
      <TextInput
        id="email-input"
        name="email"
        type="email"
        validationStatus="error"
        aria-describedby="email-error"
      />
      <ErrorMessage id="email-error">
        Enter a valid email address
      </ErrorMessage>
    </>
  )
}`
          }
        ] : [],
        accessibility: {
          guidelines: [
            'Always pair with a Label component',
            'Use unique ID that matches label htmlFor',
            'For validation errors, use aria-describedby to link to ErrorMessage',
            'Use appropriate input type for better mobile keyboards',
            'Mark required fields with required attribute'
          ]
        },
        url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-text-input--docs'
      }
    };

    const component = reactComponents[componentName];
    if (!component) {
      return {
        error: `Component "${componentName}" not found`,
        mode: 'react-uswds',
        suggestion: `Available components: ${Object.keys(reactComponents).join(', ')}`,
        message: 'Check component name spelling and capitalization'
      };
    }

    return {
      mode: 'react-uswds',
      ...component
    };
  }

  private async getUSWDSComponentInfo(componentName: string, includeExamples: boolean): Promise<any> {
    // For vanilla USWDS, provide basic info and link to docs
    return {
      mode: 'vanilla-uswds',
      name: componentName,
      message: 'For detailed vanilla USWDS documentation, visit the official docs',
      url: `${this.uswdsBaseUrl}/components/${componentName.toLowerCase().replace(/\s+/g, '-')}/`,
      guidance: {
        classes: `Use "usa-${componentName.toLowerCase().replace(/\s+/g, '-')}" as the base class`,
        accessibility: 'Refer to USWDS documentation for specific accessibility requirements',
        examples: includeExamples ? 'Visit the URL above for complete HTML examples' : 'Not included'
      }
    };
  }

  async searchDocs(query: string, docType: string = 'all'): Promise<any> {
    // Simple keyword-based search for now
    const lowerQuery = query.toLowerCase();

    return {
      query,
      docType,
      mode: this.useReact ? 'react-uswds' : 'vanilla-uswds',
      results: [
        {
          title: 'Official Documentation',
          url: this.useReact
            ? `${this.reactBaseUrl}/?path=/docs/`
            : `${this.uswdsBaseUrl}/search/?query=${encodeURIComponent(query)}`,
          description: 'Search the official documentation for detailed information'
        }
      ],
      message: 'For comprehensive search results, visit the documentation URLs provided'
    };
  }

  async getAccessibilityGuidance(componentOrPattern: string): Promise<any> {
    return {
      component: componentOrPattern,
      mode: this.useReact ? 'react-uswds' : 'vanilla-uswds',
      wcagLevel: 'AA',
      guidelines: [
        'All interactive elements must be keyboard accessible',
        'Maintain 4.5:1 color contrast ratio for text',
        'Provide clear focus indicators',
        'Use semantic HTML elements',
        'Include appropriate ARIA labels and roles',
        'Ensure components work with screen readers'
      ],
      resources: [
        { title: 'WCAG 2.1 Guidelines', url: 'https://www.w3.org/WAI/WCAG21/quickref/' },
        { title: 'USWDS Accessibility', url: `${this.uswdsBaseUrl}/documentation/accessibility/` },
      ]
    };
  }
}
