/**
 * Comprehensive React-USWDS component database
 * Based on https://github.com/trussworks/react-uswds
 */

export interface ComponentData {
  name: string;
  category: string;
  description: string;
  importPath: string;
  url: string;
  props: PropDefinition[];
  examples: CodeExample[];
  accessibility: AccessibilityInfo;
  relatedComponents?: string[];
}

export interface PropDefinition {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface CodeExample {
  title: string;
  code: string;
  description?: string;
}

export interface AccessibilityInfo {
  guidelines: string[];
  ariaAttributes?: string[];
  wcagCriteria?: string[];
}

export const REACT_COMPONENTS: Record<string, ComponentData> = {
  // ===== FORMS =====
  Button: {
    name: 'Button',
    category: 'forms',
    description: 'Buttons signal actions and direct users through key moments in an experience',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-button--docs',
    props: [
      { name: 'type', type: "'button' | 'submit' | 'reset'", required: false, default: 'button', description: 'Button type attribute' },
      { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disable the button' },
      { name: 'size', type: "'big' | 'small'", required: false, description: 'Button size variant' },
      { name: 'variant', type: "'default' | 'outline' | 'unstyled' | 'base'", required: false, description: 'Button style variant' },
      { name: 'secondary', type: 'boolean', required: false, description: 'Apply secondary styling' },
      { name: 'accent', type: 'boolean', required: false, description: 'Apply accent styling' },
      { name: 'accentStyle', type: "'cool' | 'warm'", required: false, description: 'Accent color style' },
      { name: 'fullWidth', type: 'boolean', required: false, description: 'Make button full width' },
      { name: 'inverse', type: 'boolean', required: false, description: 'Inverse color scheme for dark backgrounds' },
    ],
    examples: [
      {
        title: 'Primary Button',
        code: `import { Button } from '@trussworks/react-uswds'

export function Example() {
  return <Button type="button">Click me</Button>
}`,
        description: 'Default primary button for the most important action'
      },
      {
        title: 'Secondary Button',
        code: `import { Button } from '@trussworks/react-uswds'

export function Example() {
  return <Button type="button" secondary>Secondary action</Button>
}`,
        description: 'Secondary button for less prominent actions'
      },
      {
        title: 'Outline Button',
        code: `import { Button } from '@trussworks/react-uswds'

export function Example() {
  return <Button type="button" variant="outline">Outline button</Button>
}`,
        description: 'Outline variant for tertiary actions'
      },
      {
        title: 'Button Sizes',
        code: `import { Button } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Button type="button" size="big">Big button</Button>
      <Button type="button">Default button</Button>
      <Button type="button" size="small">Small button</Button>
    </>
  )
}`,
        description: 'Available button sizes'
      }
    ],
    accessibility: {
      guidelines: [
        'Use semantic button type (button, submit, or reset)',
        'Ensure button text is descriptive and meaningful',
        'Provide sufficient color contrast (4.5:1 minimum)',
        'Make clickable area at least 44x44 pixels',
        'Support keyboard navigation (Enter and Space keys)',
        'Provide visible focus indicators'
      ],
      ariaAttributes: [
        'aria-label: Use when button text is not descriptive enough',
        'aria-pressed: For toggle buttons to indicate state',
        'aria-expanded: For buttons that control expandable regions',
        'aria-disabled: When button is disabled (in addition to disabled attribute)'
      ],
      wcagCriteria: ['1.4.3', '2.1.1', '2.4.7', '3.2.4']
    },
    relatedComponents: ['ButtonGroup']
  },

  ButtonGroup: {
    name: 'ButtonGroup',
    category: 'forms',
    description: 'Group related buttons together',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-button-group--docs',
    props: [
      { name: 'type', type: "'default' | 'segmented'", required: false, default: 'default', description: 'Button group style' },
    ],
    examples: [
      {
        title: 'Button Group',
        code: `import { ButtonGroup, Button } from '@trussworks/react-uswds'

export function Example() {
  return (
    <ButtonGroup>
      <Button type="button">Continue</Button>
      <Button type="button" variant="outline">Back</Button>
    </ButtonGroup>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Maintain proper focus order within button group',
        'Ensure adequate spacing between buttons for touch targets'
      ]
    },
    relatedComponents: ['Button']
  },

  TextInput: {
    name: 'TextInput',
    category: 'forms',
    description: 'A text input allows users to enter any combination of letters, numbers, or symbols',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-text-input--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Input ID for label association' },
      { name: 'name', type: 'string', required: true, description: 'Input name attribute' },
      { name: 'type', type: "'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url'", required: false, default: 'text', description: 'Input type' },
      { name: 'value', type: 'string', required: false, description: 'Controlled input value' },
      { name: 'defaultValue', type: 'string', required: false, description: 'Uncontrolled input default value' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the input' },
      { name: 'validationStatus', type: "'error' | 'success'", required: false, description: 'Validation state' },
      { name: 'inputSize', type: "'small' | 'medium'", required: false, description: 'Input size variant' },
      { name: 'inputRef', type: 'React.RefObject<HTMLInputElement>', required: false, description: 'Ref for the input element' },
    ],
    examples: [
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
      },
      {
        title: 'Text Input with Success',
        code: `import { Label, TextInput } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="username-input">Username</Label>
      <TextInput
        id="username-input"
        name="username"
        type="text"
        validationStatus="success"
      />
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always pair with a Label component',
        'Use unique ID that matches label htmlFor',
        'For validation errors, use aria-describedby to link to ErrorMessage',
        'Use appropriate input type for better mobile keyboards',
        'Mark required fields with required attribute',
        'Provide helpful placeholder text, but do not rely on it as the only label'
      ],
      ariaAttributes: [
        'aria-describedby: Link to helper text or error messages',
        'aria-required: Indicate required fields',
        'aria-invalid: Mark invalid inputs'
      ],
      wcagCriteria: ['1.3.1', '1.3.5', '3.3.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['Label', 'FormGroup', 'ErrorMessage']
  },

  Textarea: {
    name: 'Textarea',
    category: 'forms',
    description: 'A textarea allows users to enter multiple lines of text',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-textarea--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Textarea ID for label association' },
      { name: 'name', type: 'string', required: true, description: 'Textarea name attribute' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the textarea' },
      { name: 'validationStatus', type: "'error' | 'success'", required: false, description: 'Validation state' },
    ],
    examples: [
      {
        title: 'Basic Textarea',
        code: `import { Label, Textarea } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="message">Message</Label>
      <Textarea id="message" name="message" />
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always pair with a Label',
        'Use aria-describedby for helper text',
        'Consider character count indicators for accessibility'
      ],
      wcagCriteria: ['1.3.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['Label', 'FormGroup']
  },

  Checkbox: {
    name: 'Checkbox',
    category: 'forms',
    description: 'Checkboxes allow users to select one or more options from a list',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-checkbox--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Checkbox ID' },
      { name: 'name', type: 'string', required: true, description: 'Checkbox name' },
      { name: 'label', type: 'React.ReactNode', required: true, description: 'Checkbox label text' },
      { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state' },
      { name: 'defaultChecked', type: 'boolean', required: false, description: 'Uncontrolled default checked' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the checkbox' },
      { name: 'tile', type: 'boolean', required: false, description: 'Use tile variant' },
    ],
    examples: [
      {
        title: 'Basic Checkbox',
        code: `import { Checkbox } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Checkbox
      id="checkbox-1"
      name="checkbox-1"
      label="I agree to the terms"
    />
  )
}`
      },
      {
        title: 'Checkbox Group',
        code: `import { Checkbox } from '@trussworks/react-uswds'

export function Example() {
  return (
    <fieldset className="usa-fieldset">
      <legend className="usa-legend">Select all that apply</legend>
      <Checkbox id="option-1" name="options" label="Option 1" />
      <Checkbox id="option-2" name="options" label="Option 2" />
      <Checkbox id="option-3" name="options" label="Option 3" />
    </fieldset>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Group related checkboxes in fieldset with legend',
        'Provide clear, descriptive labels',
        'Ensure checkbox is keyboard accessible',
        'Make touch target at least 44x44 pixels'
      ],
      ariaAttributes: [
        'aria-describedby: Link to helper text',
        'aria-checked: Automatically managed by input'
      ],
      wcagCriteria: ['1.3.1', '2.4.6', '3.3.2', '4.1.2']
    },
    relatedComponents: ['Radio', 'FormGroup']
  },

  Radio: {
    name: 'Radio',
    category: 'forms',
    description: 'Radio buttons allow users to select exactly one option from a group',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-radio--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Radio ID' },
      { name: 'name', type: 'string', required: true, description: 'Radio name (same for all in group)' },
      { name: 'label', type: 'React.ReactNode', required: true, description: 'Radio label text' },
      { name: 'value', type: 'string', required: true, description: 'Radio value' },
      { name: 'checked', type: 'boolean', required: false, description: 'Controlled checked state' },
      { name: 'defaultChecked', type: 'boolean', required: false, description: 'Uncontrolled default checked' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the radio' },
      { name: 'tile', type: 'boolean', required: false, description: 'Use tile variant' },
    ],
    examples: [
      {
        title: 'Radio Group',
        code: `import { Radio } from '@trussworks/react-uswds'

export function Example() {
  return (
    <fieldset className="usa-fieldset">
      <legend className="usa-legend">Select one option</legend>
      <Radio
        id="option-1"
        name="options"
        label="Option 1"
        value="option-1"
      />
      <Radio
        id="option-2"
        name="options"
        label="Option 2"
        value="option-2"
      />
      <Radio
        id="option-3"
        name="options"
        label="Option 3"
        value="option-3"
      />
    </fieldset>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always group radios in fieldset with legend',
        'All radios in group must share the same name attribute',
        'Provide clear, descriptive labels',
        'Ensure one option can be selected by default when appropriate'
      ],
      wcagCriteria: ['1.3.1', '2.4.6', '3.3.2', '4.1.2']
    },
    relatedComponents: ['Checkbox', 'FormGroup']
  },

  Select: {
    name: 'Select',
    category: 'forms',
    description: 'A select component allows users to choose one option from a dropdown list',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-select--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Select ID' },
      { name: 'name', type: 'string', required: true, description: 'Select name' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the select' },
      { name: 'validationStatus', type: "'error' | 'success'", required: false, description: 'Validation state' },
    ],
    examples: [
      {
        title: 'Basic Select',
        code: `import { Label, Select } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="options">Select an option</Label>
      <Select id="options" name="options">
        <option>- Select -</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always pair with a Label',
        'Provide a default "Select" option',
        'Group related options with optgroup',
        'Keep option text concise'
      ],
      wcagCriteria: ['1.3.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['ComboBox', 'Label']
  },

  ComboBox: {
    name: 'ComboBox',
    category: 'forms',
    description: 'A combo box combines a text input with a dropdown list, allowing users to type or select',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-combo-box--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'ComboBox ID' },
      { name: 'name', type: 'string', required: true, description: 'ComboBox name' },
      { name: 'options', type: 'ComboBoxOption[]', required: true, description: 'Array of options' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the combo box' },
    ],
    examples: [
      {
        title: 'Basic ComboBox',
        code: `import { Label, ComboBox } from '@trussworks/react-uswds'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'orange', label: 'Orange' },
]

export function Example() {
  return (
    <>
      <Label htmlFor="fruit">Select a fruit</Label>
      <ComboBox
        id="fruit"
        name="fruit"
        options={options}
      />
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Provide clear instructions for use',
        'Support keyboard navigation (arrow keys, Enter, Escape)',
        'Announce results to screen readers',
        'Show loading state when fetching options'
      ],
      ariaAttributes: [
        'aria-expanded: Indicates dropdown state',
        'aria-autocomplete: Indicates autocomplete behavior',
        'aria-activedescendant: Identifies focused option'
      ],
      wcagCriteria: ['1.3.1', '2.1.1', '4.1.2']
    },
    relatedComponents: ['Select', 'TextInput']
  },

  DatePicker: {
    name: 'DatePicker',
    category: 'forms',
    description: 'A date picker helps users select a single date',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-date-picker--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'DatePicker ID' },
      { name: 'name', type: 'string', required: true, description: 'DatePicker name' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable the date picker' },
      { name: 'minDate', type: 'string', required: false, description: 'Minimum selectable date (YYYY-MM-DD)' },
      { name: 'maxDate', type: 'string', required: false, description: 'Maximum selectable date (YYYY-MM-DD)' },
      { name: 'defaultValue', type: 'string', required: false, description: 'Default date value' },
    ],
    examples: [
      {
        title: 'Basic DatePicker',
        code: `import { Label, DatePicker } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="appointment-date">Appointment date</Label>
      <DatePicker
        id="appointment-date"
        name="appointment-date"
      />
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Provide keyboard navigation for calendar',
        'Support manual date entry',
        'Announce date changes to screen readers',
        'Provide clear date format instructions'
      ],
      wcagCriteria: ['1.3.1', '2.1.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['DateRangePicker', 'TimePicker']
  },

  // ===== UI COMPONENTS =====
  Alert: {
    name: 'Alert',
    category: 'ui',
    description: 'Alerts keep users informed of important and sometimes time-sensitive changes',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-alert--docs',
    props: [
      { name: 'type', type: "'success' | 'warning' | 'error' | 'info'", required: true, description: 'Alert type/severity' },
      { name: 'heading', type: 'string | React.ReactNode', required: false, description: 'Alert heading text' },
      { name: 'headingLevel', type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", required: false, default: 'h4', description: 'Heading level for accessibility' },
      { name: 'slim', type: 'boolean', required: false, description: 'Use slim variant' },
      { name: 'noIcon', type: 'boolean', required: false, description: 'Hide alert icon' },
      { name: 'validation', type: 'boolean', required: false, description: 'Use for form validation' },
      { name: 'cta', type: 'React.ReactNode', required: false, description: 'Call-to-action element' },
    ],
    examples: [
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
      There was an error processing your request. Please try again.
    </Alert>
  )
}`
      },
      {
        title: 'Slim Alert',
        code: `import { Alert } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Alert type="info" slim>
      Additional information about this page
    </Alert>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use appropriate alert type for the message severity',
        'Include descriptive heading',
        'Use headingLevel prop to maintain heading hierarchy',
        'For validation errors, set validation={true} and link to form fields',
        'Place alerts in logical reading order'
      ],
      ariaAttributes: [
        'role="region": Automatically applied for accessibility',
        'aria-label: Auto-generated from alert type',
        'aria-describedby: Link to detailed error messages in form validation'
      ],
      wcagCriteria: ['1.3.1', '1.4.3', '2.4.6', '4.1.2']
    },
    relatedComponents: ['Banner']
  },

  Accordion: {
    name: 'Accordion',
    category: 'ui',
    description: 'An accordion is a list of collapsible sections used to organize content',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-accordion--docs',
    props: [
      { name: 'items', type: 'AccordionItemProps[]', required: true, description: 'Array of accordion items' },
      { name: 'bordered', type: 'boolean', required: false, description: 'Add borders to accordion' },
      { name: 'multiselectable', type: 'boolean', required: false, description: 'Allow multiple items open' },
    ],
    examples: [
      {
        title: 'Basic Accordion',
        code: `import { Accordion } from '@trussworks/react-uswds'

const items = [
  {
    title: 'First section',
    content: <p>Content for first section</p>,
    expanded: false,
    id: 'section-1',
    headingLevel: 'h4' as const,
  },
  {
    title: 'Second section',
    content: <p>Content for second section</p>,
    expanded: false,
    id: 'section-2',
    headingLevel: 'h4' as const,
  },
]

export function Example() {
  return <Accordion items={items} />
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Support keyboard navigation (Tab, Space, Enter)',
        'Use appropriate heading levels',
        'Indicate expanded/collapsed state clearly',
        'Maintain focus management when expanding/collapsing'
      ],
      ariaAttributes: [
        'aria-expanded: Indicates panel state',
        'aria-controls: Links button to panel',
        'role="region": Applied to content panels'
      ],
      wcagCriteria: ['1.3.1', '2.1.1', '4.1.2']
    }
  },

  Modal: {
    name: 'Modal',
    category: 'ui',
    description: 'A modal disables page content and focuses the user attention on a single task or message',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-modal--docs',
    props: [
      { name: 'isOpen', type: 'boolean', required: true, description: 'Control modal visibility' },
      { name: 'onClose', type: 'function', required: false, description: 'Callback when modal closes' },
      { name: 'id', type: 'string', required: true, description: 'Modal ID' },
      { name: 'aria-labelledby', type: 'string', required: false, description: 'ID of element labeling the modal' },
      { name: 'aria-describedby', type: 'string', required: false, description: 'ID of element describing the modal' },
      { name: 'variant', type: "'default' | 'large'", required: false, description: 'Modal size variant' },
      { name: 'forceAction', type: 'boolean', required: false, description: 'Prevent closing by clicking outside' },
    ],
    examples: [
      {
        title: 'Basic Modal',
        code: `import { Modal, ModalHeading, ModalFooter, Button } from '@trussworks/react-uswds'
import { useState } from 'react'

export function Example() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button type="button" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        id="example-modal"
        aria-labelledby="modal-heading"
        aria-describedby="modal-description"
      >
        <ModalHeading id="modal-heading">
          Modal Title
        </ModalHeading>
        <div id="modal-description">
          <p>This is the modal content.</p>
        </div>
        <ModalFooter>
          <Button type="button" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Trap focus within modal when open',
        'Return focus to trigger element on close',
        'Allow closing with Escape key',
        'Prevent background scrolling when open',
        'Use aria-labelledby and aria-describedby',
        'Ensure sufficient color contrast',
        'Make close button keyboard accessible'
      ],
      ariaAttributes: [
        'role="dialog": Automatically applied',
        'aria-modal="true": Indicates modal behavior',
        'aria-labelledby: Link to modal heading',
        'aria-describedby: Link to modal description'
      ],
      wcagCriteria: ['1.3.1', '2.1.1', '2.1.2', '2.4.3', '4.1.2']
    },
    relatedComponents: ['Button']
  },

  Card: {
    name: 'Card',
    category: 'ui',
    description: 'Cards contain content and actions about a single subject',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-card--docs',
    props: [
      { name: 'gridLayout', type: 'GridLayoutProp', required: false, description: 'Grid layout configuration' },
      { name: 'headerFirst', type: 'boolean', required: false, description: 'Show header before media' },
      { name: 'containerProps', type: 'object', required: false, description: 'Props for card container' },
    ],
    examples: [
      {
        title: 'Basic Card',
        code: `import { Card, CardHeader, CardBody, CardFooter, Button } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Card>
      <CardHeader>
        <h3 className="usa-card__heading">Card Title</h3>
      </CardHeader>
      <CardBody>
        <p>Card content goes here with relevant information.</p>
      </CardBody>
      <CardFooter>
        <Button type="button">Action</Button>
      </CardFooter>
    </Card>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use semantic heading elements',
        'Ensure interactive elements are keyboard accessible',
        'Provide sufficient color contrast',
        'Make card actions clearly identifiable'
      ],
      wcagCriteria: ['1.3.1', '1.4.3', '2.4.6']
    },
    relatedComponents: ['Grid']
  },

  Tag: {
    name: 'Tag',
    category: 'ui',
    description: 'Tags draw attention to new or important content',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-tag--docs',
    props: [
      { name: 'background', type: 'string', required: false, description: 'Background color token' },
    ],
    examples: [
      {
        title: 'Basic Tags',
        code: `import { Tag } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Tag>Default</Tag>
      <Tag background="accent-warm">Warm</Tag>
      <Tag background="accent-cool">Cool</Tag>
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Ensure sufficient color contrast',
        'Do not rely solely on color to convey meaning',
        'Keep tag text concise'
      ],
      wcagCriteria: ['1.4.3', '1.4.1']
    }
  },

  Table: {
    name: 'Table',
    category: 'ui',
    description: 'A table organizes complex information in a grid',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-table--docs',
    props: [
      { name: 'bordered', type: 'boolean', required: false, description: 'Add borders to cells' },
      { name: 'compact', type: 'boolean', required: false, description: 'Use compact spacing' },
      { name: 'striped', type: 'boolean', required: false, description: 'Stripe alternating rows' },
      { name: 'fullWidth', type: 'boolean', required: false, description: 'Make table full width' },
      { name: 'scrollable', type: 'boolean', required: false, description: 'Enable horizontal scrolling' },
      { name: 'caption', type: 'string', required: false, description: 'Table caption' },
    ],
    examples: [
      {
        title: 'Basic Table',
        code: `import { Table } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Table bordered caption="User information">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">John Doe</th>
          <td>john@example.com</td>
          <td>Active</td>
        </tr>
        <tr>
          <th scope="row">Jane Smith</th>
          <td>jane@example.com</td>
          <td>Active</td>
        </tr>
      </tbody>
    </Table>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always provide a caption or aria-label',
        'Use th elements for headers',
        'Use scope attribute on headers',
        'For complex tables, use headers and id attributes',
        'Avoid merging cells when possible',
        'Make sortable columns keyboard accessible'
      ],
      ariaAttributes: [
        'aria-label: Alternative to caption',
        'aria-sort: Indicate sort direction for sortable columns'
      ],
      wcagCriteria: ['1.3.1', '2.4.6', '4.1.2']
    }
  },

  // ===== NAVIGATION =====
  Header: {
    name: 'Header',
    category: 'navigation',
    description: 'The header provides consistent structure for branding and navigation',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-header--docs',
    props: [
      { name: 'basic', type: 'boolean', required: false, description: 'Use basic header variant' },
      { name: 'extended', type: 'boolean', required: false, description: 'Use extended header variant' },
    ],
    examples: [
      {
        title: 'Basic Header',
        code: `import { Header, Title } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Header basic>
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title>Project Title</Title>
        </div>
      </div>
    </Header>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use <header> landmark element',
        'Provide skip navigation link',
        'Ensure adequate color contrast',
        'Make navigation keyboard accessible',
        'Use current page indicators'
      ],
      wcagCriteria: ['1.3.1', '2.4.1', '2.4.7', '3.2.3']
    },
    relatedComponents: ['Navigation', 'Banner']
  },

  SideNav: {
    name: 'SideNav',
    category: 'navigation',
    description: 'Hierarchical navigation for complex sites',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-side-navigation--docs',
    props: [
      { name: 'items', type: 'SideNavItem[]', required: true, description: 'Navigation items' },
    ],
    examples: [
      {
        title: 'Side Navigation',
        code: `import { SideNav } from '@trussworks/react-uswds'

const items = [
  <a href="/page-1" className="usa-current">Current page</a>,
  <a href="/page-2">Page 2</a>,
  <a href="/page-3">Page 3</a>,
]

export function Example() {
  return <SideNav items={items} />
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Indicate current page clearly',
        'Support keyboard navigation',
        'Use nav landmark',
        'Maintain consistent navigation order'
      ],
      wcagCriteria: ['1.3.1', '2.4.7', '3.2.3']
    },
    relatedComponents: ['Header', 'Navigation']
  },

  Breadcrumb: {
    name: 'Breadcrumb',
    category: 'navigation',
    description: 'Breadcrumbs show the location of the current page in the site hierarchy',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-breadcrumb--docs',
    props: [],
    examples: [
      {
        title: 'Basic Breadcrumb',
        code: `import { Breadcrumb, BreadcrumbBar, BreadcrumbLink } from '@trussworks/react-uswds'

export function Example() {
  return (
    <BreadcrumbBar>
      <Breadcrumb>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </Breadcrumb>
      <Breadcrumb>
        <BreadcrumbLink href="/section">Section</BreadcrumbLink>
      </Breadcrumb>
      <Breadcrumb current>
        <span>Current Page</span>
      </Breadcrumb>
    </BreadcrumbBar>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use nav element with aria-label="Breadcrumbs"',
        'Indicate current page with aria-current="page"',
        'Keep breadcrumb trail concise',
        'Make links keyboard accessible'
      ],
      ariaAttributes: [
        'aria-label="Breadcrumbs": Label the navigation',
        'aria-current="page": Mark current page'
      ],
      wcagCriteria: ['1.3.1', '2.4.8', '4.1.2']
    }
  },

  StepIndicator: {
    name: 'StepIndicator',
    category: 'navigation',
    description: 'A step indicator shows progress through a multi-step process',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-step-indicator--docs',
    props: [
      { name: 'headingLevel', type: "'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'", required: false, default: 'h4', description: 'Heading level' },
      { name: 'ofText', type: 'string', required: false, default: 'of', description: 'Text for "of"' },
      { name: 'stepText', type: 'string', required: false, default: 'Step', description: 'Text for "Step"' },
    ],
    examples: [
      {
        title: 'Step Indicator',
        code: `import { StepIndicator, StepIndicatorStep } from '@trussworks/react-uswds'

export function Example() {
  return (
    <StepIndicator headingLevel="h4">
      <StepIndicatorStep label="Personal information" status="complete" />
      <StepIndicatorStep label="Contact details" status="current" />
      <StepIndicatorStep label="Review" status="incomplete" />
    </StepIndicator>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use appropriate heading level',
        'Clearly indicate current step',
        'Show completed vs incomplete steps',
        'Consider providing skip link to current step'
      ],
      wcagCriteria: ['1.3.1', '2.4.6']
    }
  },

  // ===== LAYOUT =====
  Grid: {
    name: 'Grid',
    category: 'layout',
    description: 'The grid component provides a flexible 12-column grid system',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-grid--docs',
    props: [
      { name: 'row', type: 'boolean', required: false, description: 'Create a row' },
      { name: 'col', type: 'boolean | number', required: false, description: 'Create a column' },
      { name: 'gap', type: 'string | number', required: false, description: 'Gap between grid items' },
      { name: 'tablet', type: 'GridLayoutProp', required: false, description: 'Tablet breakpoint layout' },
      { name: 'desktop', type: 'GridLayoutProp', required: false, description: 'Desktop breakpoint layout' },
    ],
    examples: [
      {
        title: 'Responsive Grid',
        code: `import { Grid } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Grid row gap="lg">
      <Grid col={12} tablet={{ col: 6 }} desktop={{ col: 4 }}>
        <p>Column 1</p>
      </Grid>
      <Grid col={12} tablet={{ col: 6 }} desktop={{ col: 4 }}>
        <p>Column 2</p>
      </Grid>
      <Grid col={12} tablet={{ col: 12 }} desktop={{ col: 4 }}>
        <p>Column 3</p>
      </Grid>
    </Grid>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Ensure logical reading order in source',
        'Do not rely solely on visual layout to convey meaning',
        'Test with zoom and reflow',
        'Ensure content is accessible at all breakpoints'
      ],
      wcagCriteria: ['1.3.1', '1.3.2', '1.4.10']
    },
    relatedComponents: ['GridContainer']
  },

  GridContainer: {
    name: 'GridContainer',
    category: 'layout',
    description: 'A grid container wraps grid content with max-width and centering',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-grid-container--docs',
    props: [
      { name: 'containerSize', type: "'mobile' | 'mobile-lg' | 'tablet' | 'tablet-lg' | 'desktop' | 'desktop-lg' | 'widescreen'", required: false, description: 'Container max-width' },
    ],
    examples: [
      {
        title: 'Grid Container',
        code: `import { GridContainer, Grid } from '@trussworks/react-uswds'

export function Example() {
  return (
    <GridContainer>
      <Grid row>
        <Grid col={12}>
          <p>Content within container</p>
        </Grid>
      </Grid>
    </GridContainer>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use containers to improve readability',
        'Do not constrain all content - allow full-width when appropriate',
        'Test with zoom and different viewport sizes'
      ],
      wcagCriteria: ['1.4.10']
    },
    relatedComponents: ['Grid']
  },
};

export const COMPONENT_CATEGORIES = {
  forms: 'Forms',
  ui: 'UI Components',
  navigation: 'Navigation',
  layout: 'Layout',
};
