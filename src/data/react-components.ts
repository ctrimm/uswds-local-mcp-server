/**
 * Comprehensive React-USWDS component database
 * Based on https://github.com/trussworks/react-uswds
 *
 * @version React-USWDS v11.0.0 (December 2025)
 * @uswdsVersion USWDS 3.13.0
 * @see https://github.com/trussworks/react-uswds/releases/tag/11.0.0
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

  // Additional missing components
  Banner: {
    name: 'Banner',
    category: 'ui',
    description: 'The banner identifies official U.S. government websites',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-banner--docs',
    props: [
      { name: 'aria-label', type: 'string', required: false, description: 'Accessible label for banner' },
    ],
    examples: [
      {
        title: 'Basic Banner',
        code: `import { Banner, BannerContent, BannerGuidance, BannerButton } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Banner>
      <BannerContent>
        Official government website
      </BannerContent>
    </Banner>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Place banner at top of all government websites',
        'Provide clear indication of official government status',
        'Ensure expandable content is keyboard accessible'
      ],
      wcagCriteria: ['2.4.1', '4.1.2']
    }
  },

  Footer: {
    name: 'Footer',
    category: 'navigation',
    description: 'The footer provides consistent structure for footer content across government websites',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-footer--docs',
    props: [
      { name: 'size', type: "'big' | 'medium' | 'slim'", required: false, description: 'Footer size variant' },
      { name: 'primary', type: 'React.ReactNode', required: false, description: 'Primary footer content section' },
      { name: 'secondary', type: 'React.ReactNode', required: false, description: 'Secondary footer content section' },
    ],
    examples: [
      {
        title: 'Basic Footer',
        code: `import { Footer, FooterNav, Logo } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Footer size="medium">
      <Logo
        image={<img src="/logo.png" alt="Logo" />}
        heading={<h3>Agency Name</h3>}
      />
    </Footer>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use footer landmark',
        'Include contact information',
        'Ensure all links are keyboard accessible',
        'Maintain consistent footer across site'
      ],
      wcagCriteria: ['1.3.1', '2.4.1']
    },
    relatedComponents: ['Header']
  },

  Pagination: {
    name: 'Pagination',
    category: 'navigation',
    description: 'Pagination helps users navigate through pages of content',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-pagination--docs',
    props: [
      { name: 'pathname', type: 'string', required: true, description: 'Base path for pagination links' },
      { name: 'totalPages', type: 'number', required: true, description: 'Total number of pages' },
      { name: 'currentPage', type: 'number', required: true, description: 'Current active page (1-indexed)' },
      { name: 'maxSlots', type: 'number', required: false, default: '7', description: 'Maximum page slots to show' },
      { name: 'onClickPageNumber', type: 'function', required: false, description: 'Callback when page number clicked' },
      { name: 'onClickNext', type: 'function', required: false, description: 'Callback when next clicked' },
      { name: 'onClickPrevious', type: 'function', required: false, description: 'Callback when previous clicked' },
    ],
    examples: [
      {
        title: 'Basic Pagination',
        code: `import { Pagination } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Pagination
      pathname="/search"
      totalPages={10}
      currentPage={3}
    />
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Indicate current page clearly',
        'Provide keyboard navigation',
        'Use nav landmark with aria-label',
        'Announce page changes to screen readers'
      ],
      ariaAttributes: [
        'aria-label="Pagination": Label the navigation',
        'aria-current="page": Mark current page'
      ],
      wcagCriteria: ['2.4.1', '2.4.5', '4.1.2']
    }
  },

  Search: {
    name: 'Search',
    category: 'forms',
    description: 'Search allows users to search for specific content',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-search--docs',
    props: [
      { name: 'size', type: "'big' | 'small'", required: false, description: 'Search input size' },
      { name: 'onSubmit', type: 'function', required: true, description: 'Form submit handler' },
      { name: 'placeholder', type: 'string', required: false, description: 'Search input placeholder' },
    ],
    examples: [
      {
        title: 'Basic Search',
        code: `import { Search } from '@trussworks/react-uswds'

export function Example() {
  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle search
  }

  return (
    <Search onSubmit={handleSubmit} placeholder="Search" />
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Provide clear placeholder text',
        'Use search landmark or role',
        'Ensure submit button is labeled',
        'Provide search results count'
      ],
      ariaAttributes: [
        'role="search": Identify search region',
        'aria-label: Label search input if no visible label'
      ],
      wcagCriteria: ['1.3.1', '2.4.6', '4.1.2']
    }
  },

  Tooltip: {
    name: 'Tooltip',
    category: 'ui',
    description: 'A tooltip provides additional information on hover or focus',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-tooltip--docs',
    props: [
      { name: 'label', type: 'string', required: true, description: 'Tooltip text content' },
      { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", required: false, default: 'top', description: 'Tooltip position' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
    ],
    examples: [
      {
        title: 'Basic Tooltip',
        code: `import { Tooltip, Button } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Tooltip label="Additional information" position="top">
      <Button type="button">Hover me</Button>
    </Tooltip>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Tooltip content must be accessible via keyboard',
        'Do not put essential information only in tooltips',
        'Ensure tooltip does not obscure important content',
        'Provide sufficient time to read tooltip'
      ],
      ariaAttributes: [
        'aria-describedby: Link trigger to tooltip',
        'role="tooltip": Identify tooltip element'
      ],
      wcagCriteria: ['1.4.13', '2.1.1', '4.1.2']
    }
  },

  ProcessList: {
    name: 'ProcessList',
    category: 'ui',
    description: 'A process list displays the steps or stages in a process',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-process-list--docs',
    props: [],
    examples: [
      {
        title: 'Basic Process List',
        code: `import { ProcessList, ProcessListItem, ProcessListHeading } from '@trussworks/react-uswds'

export function Example() {
  return (
    <ProcessList>
      <ProcessListItem>
        <ProcessListHeading type="h4">
          Start a process
        </ProcessListHeading>
        <p>Description of the first step</p>
      </ProcessListItem>
      <ProcessListItem>
        <ProcessListHeading type="h4">
          Continue the process
        </ProcessListHeading>
        <p>Description of the second step</p>
      </ProcessListItem>
    </ProcessList>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use ordered list for sequential processes',
        'Provide clear step descriptions',
        'Use appropriate heading levels'
      ],
      wcagCriteria: ['1.3.1', '2.4.6']
    }
  },

  SiteAlert: {
    name: 'SiteAlert',
    category: 'ui',
    description: 'A site alert communicates urgent sitewide information',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-site-alert--docs',
    props: [
      { name: 'variant', type: "'emergency' | 'info'", required: true, description: 'Alert variant/severity' },
      { name: 'heading', type: 'string', required: false, description: 'Alert heading' },
      { name: 'showClose', type: 'boolean', required: false, description: 'Show close button' },
    ],
    examples: [
      {
        title: 'Emergency Site Alert',
        code: `import { SiteAlert } from '@trussworks/react-uswds'

export function Example() {
  return (
    <SiteAlert variant="emergency" heading="Emergency alert">
      This is an emergency notification message.
    </SiteAlert>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Place at top of page before header',
        'Use emergency variant sparingly',
        'Ensure alert is announced to screen readers',
        'Make dismissible alerts keyboard accessible'
      ],
      ariaAttributes: [
        'role="region": Alert region',
        'aria-live: For dynamic alerts'
      ],
      wcagCriteria: ['1.3.1', '4.1.2']
    }
  },

  SummaryBox: {
    name: 'SummaryBox',
    category: 'ui',
    description: 'A summary box highlights important information',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-summary-box--docs',
    props: [
      { name: 'heading', type: 'string', required: false, description: 'Summary box heading' },
    ],
    examples: [
      {
        title: 'Basic Summary Box',
        code: `import { SummaryBox } from '@trussworks/react-uswds'

export function Example() {
  return (
    <SummaryBox heading="Key information">
      <ul>
        <li>Important point 1</li>
        <li>Important point 2</li>
        <li>Important point 3</li>
      </ul>
    </SummaryBox>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use semantic heading elements',
        'Ensure content is concise',
        'Maintain adequate color contrast'
      ],
      wcagCriteria: ['1.3.1', '1.4.3', '2.4.6']
    }
  },

  Collection: {
    name: 'Collection',
    category: 'ui',
    description: 'A collection displays a compact list of multiple related items',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-collection--docs',
    props: [],
    examples: [
      {
        title: 'Basic Collection',
        code: `import { Collection, CollectionItem, CollectionHeading, CollectionDescription, CollectionMeta } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Collection>
      <CollectionItem>
        <CollectionHeading headingLevel="h3">
          <a href="#" className="usa-link">Collection item heading</a>
        </CollectionHeading>
        <CollectionDescription>
          Description of the collection item
        </CollectionDescription>
        <CollectionMeta>
          <span>January 1, 2024</span>
        </CollectionMeta>
      </CollectionItem>
    </Collection>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use semantic list structure',
        'Provide clear link text',
        'Use appropriate heading levels',
        'Ensure meta information is accessible'
      ],
      wcagCriteria: ['1.3.1', '2.4.4', '2.4.6']
    }
  },

  IconList: {
    name: 'IconList',
    category: 'ui',
    description: 'An icon list pairs icons with list items for visual reinforcement',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-icon-list--docs',
    props: [],
    examples: [
      {
        title: 'Basic Icon List',
        code: `import { IconList, IconListItem, IconListIcon, IconListContent } from '@trussworks/react-uswds'

export function Example() {
  return (
    <IconList>
      <IconListItem>
        <IconListIcon>
          <svg className="usa-icon" aria-hidden="true" role="img">
            {/* Icon SVG */}
          </svg>
        </IconListIcon>
        <IconListContent>
          List item with icon
        </IconListContent>
      </IconListItem>
    </IconList>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Mark decorative icons as aria-hidden',
        'Provide text alternatives for meaningful icons',
        'Ensure list structure is semantic'
      ],
      wcagCriteria: ['1.1.1', '1.3.1']
    }
  },

  Identifier: {
    name: 'Identifier',
    category: 'navigation',
    description: 'The identifier provides agency branding and required links',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-identifier--docs',
    props: [],
    examples: [
      {
        title: 'Basic Identifier',
        code: `import { Identifier, IdentifierMasthead, IdentifierLogos, IdentifierLogo, IdentifierLinks, IdentifierLink } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Identifier>
      <IdentifierMasthead aria-label="Agency identifier">
        <IdentifierLogos>
          <IdentifierLogo href="#">
            <img src="/logo.png" alt="Agency logo" />
          </IdentifierLogo>
        </IdentifierLogos>
      </IdentifierMasthead>
      <IdentifierLinks>
        <IdentifierLink href="/about">About</IdentifierLink>
        <IdentifierLink href="/accessibility">Accessibility</IdentifierLink>
      </IdentifierLinks>
    </Identifier>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Place in footer',
        'Include required government links',
        'Provide logo alt text',
        'Ensure all links are accessible'
      ],
      wcagCriteria: ['1.1.1', '2.4.4', '4.1.2']
    }
  },

  Link: {
    name: 'Link',
    category: 'navigation',
    description: 'Links connect users to other pages or sections',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-link--docs',
    props: [
      { name: 'href', type: 'string', required: true, description: 'Link destination URL' },
      { name: 'variant', type: "'external' | 'unstyled'", required: false, description: 'Link style variant' },
      { name: 'asCustom', type: 'React.ComponentType', required: false, description: 'Custom component to render as' },
    ],
    examples: [
      {
        title: 'Basic Link',
        code: `import { Link } from '@trussworks/react-uswds'

export function Example() {
  return <Link href="/page">Link text</Link>
}`
      },
      {
        title: 'External Link',
        code: `import { Link } from '@trussworks/react-uswds'

export function Example() {
  return (
    <Link href="https://example.com" variant="external">
      External link
    </Link>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use descriptive link text',
        'Indicate external links',
        'Provide sufficient color contrast',
        'Ensure links are keyboard accessible'
      ],
      ariaAttributes: [
        'aria-label: Use for ambiguous link text',
        'target="_blank": Add for external links with rel="noopener noreferrer"'
      ],
      wcagCriteria: ['1.4.3', '2.4.4', '2.4.9']
    }
  },

  CharacterCount: {
    name: 'CharacterCount',
    category: 'forms',
    description: 'Character count helps users know how much text they can enter',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-character-count--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Input ID' },
      { name: 'name', type: 'string', required: true, description: 'Input name' },
      { name: 'maxLength', type: 'number', required: true, description: 'Maximum character count' },
      { name: 'defaultValue', type: 'string', required: false, description: 'Default input value' },
      { name: 'isTextArea', type: 'boolean', required: false, description: 'Use textarea instead of input' },
    ],
    examples: [
      {
        title: 'Character Count Input',
        code: `import { CharacterCount, Label } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="message">Message (max 500 characters)</Label>
      <CharacterCount
        id="message"
        name="message"
        maxLength={500}
        isTextArea
      />
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Announce count changes to screen readers',
        'Provide clear maximum length indication',
        'Show remaining vs used characters',
        'Update count in real-time'
      ],
      ariaAttributes: [
        'aria-live="polite": Announce count updates',
        'aria-describedby: Link to count message'
      ],
      wcagCriteria: ['3.3.1', '4.1.2']
    }
  },

  DateInput: {
    name: 'DateInput',
    category: 'forms',
    description: 'Date input allows users to enter a date using three text fields',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-date-input--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Date input group ID' },
      { name: 'name', type: 'string', required: true, description: 'Date input group name' },
      { name: 'disabled', type: 'boolean', required: false, description: 'Disable all date inputs' },
    ],
    examples: [
      {
        title: 'Basic Date Input',
        code: `import { DateInput, Label } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="birthdate">Date of birth</Label>
      <DateInput
        id="birthdate"
        name="birthdate"
      />
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Label each date field clearly',
        'Use fieldset and legend for grouping',
        'Provide expected format guidance',
        'Support keyboard navigation between fields'
      ],
      wcagCriteria: ['1.3.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['DatePicker', 'DateRangePicker']
  },

  RangeInput: {
    name: 'RangeInput',
    category: 'forms',
    description: 'Range input allows users to select from a range of values',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-range-input--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Range input ID' },
      { name: 'name', type: 'string', required: true, description: 'Range input name' },
      { name: 'min', type: 'number', required: true, description: 'Minimum value' },
      { name: 'max', type: 'number', required: true, description: 'Maximum value' },
      { name: 'step', type: 'number', required: false, description: 'Step increment' },
      { name: 'defaultValue', type: 'number', required: false, description: 'Default value' },
    ],
    examples: [
      {
        title: 'Basic Range Input',
        code: `import { RangeInput, Label } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="range">Select a value</Label>
      <RangeInput
        id="range"
        name="range"
        min={0}
        max={100}
        step={10}
      />
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Provide clear labels for min and max values',
        'Show current value',
        'Support keyboard adjustment (arrow keys)',
        'Consider alternative input for precise values'
      ],
      ariaAttributes: [
        'aria-valuemin: Minimum value',
        'aria-valuemax: Maximum value',
        'aria-valuenow: Current value',
        'aria-valuetext: Text representation of value'
      ],
      wcagCriteria: ['1.3.1', '2.1.1', '4.1.2']
    }
  },

  InputPrefix: {
    name: 'InputPrefix',
    category: 'forms',
    description: 'Input prefix or suffix adds context to text inputs',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-input-prefix-suffix--docs',
    props: [],
    examples: [
      {
        title: 'Input with Prefix',
        code: `import { Label, TextInput } from '@trussworks/react-uswds'

export function Example() {
  return (
    <>
      <Label htmlFor="price">Price</Label>
      <div className="usa-input-group">
        <div className="usa-input-prefix" aria-hidden="true">$</div>
        <TextInput id="price" name="price" type="text" />
      </div>
    </>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Mark prefix/suffix as aria-hidden if decorative',
        'Include prefix/suffix in accessible name if meaningful',
        'Ensure input remains focusable'
      ],
      wcagCriteria: ['1.3.1', '4.1.2']
    },
    relatedComponents: ['TextInput']
  },

  LanguageSelector: {
    name: 'LanguageSelector',
    category: 'navigation',
    description: 'Language selector allows users to change the site language',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-language-selector--docs',
    props: [
      { name: 'langs', type: 'LanguageDefinition[]', required: true, description: 'Available languages' },
      { name: 'onLanguageChange', type: 'function', required: false, description: 'Language change callback' },
    ],
    examples: [
      {
        title: 'Language Selector',
        code: `import { LanguageSelector } from '@trussworks/react-uswds'

const langs = [
  { attr: 'en', label: 'English', on_click: () => {} },
  { attr: 'es', label: 'Español', on_click: () => {} },
]

export function Example() {
  return <LanguageSelector langs={langs} />
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Label language selector clearly',
        'Use lang attribute for each language option',
        'Ensure keyboard accessibility',
        'Persist language choice'
      ],
      ariaAttributes: [
        'lang: Set for each language option'
      ],
      wcagCriteria: ['3.1.1', '3.1.2', '4.1.2']
    }
  },

  InPageNavigation: {
    name: 'InPageNavigation',
    category: 'navigation',
    description: 'In-page navigation helps users navigate within long pages',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-in-page-navigation--docs',
    props: [
      { name: 'items', type: 'InPageNavItem[]', required: true, description: 'Navigation items' },
      { name: 'headingLevel', type: "'h2' | 'h3' | 'h4' | 'h5' | 'h6'", required: false, description: 'Heading level for title' },
    ],
    examples: [
      {
        title: 'In-Page Navigation',
        code: `import { InPageNavigation } from '@trussworks/react-uswds'

const items = [
  { href: '#section-1', text: 'Section 1' },
  { href: '#section-2', text: 'Section 2' },
  { href: '#section-3', text: 'Section 3' },
]

export function Example() {
  return (
    <InPageNavigation
      items={items}
      headingLevel="h4"
    />
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use nav landmark with descriptive label',
        'Ensure all anchors have valid targets',
        'Highlight current section',
        'Support keyboard navigation'
      ],
      ariaAttributes: [
        'aria-label="On this page": Label navigation'
      ],
      wcagCriteria: ['1.3.1', '2.4.1', '2.4.5']
    },
    relatedComponents: ['SideNav']
  },

  DateRangePicker: {
    name: 'DateRangePicker',
    category: 'forms',
    description: 'Date range picker for selecting a start and end date',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-date-range-picker--docs',
    props: [
      { name: 'startDateLabel', type: 'string', required: false, description: 'Label for start date input' },
      { name: 'startDateHint', type: 'string', required: false, description: 'Hint text for start date' },
      { name: 'startDatePickerProps', type: 'DatePickerProps', required: false, description: 'Props for start date picker' },
      { name: 'endDateLabel', type: 'string', required: false, description: 'Label for end date input' },
      { name: 'endDateHint', type: 'string', required: false, description: 'Hint text for end date' },
      { name: 'endDatePickerProps', type: 'DatePickerProps', required: false, description: 'Props for end date picker' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ],
    examples: [
      {
        title: 'Basic date range picker',
        code: `import { DateRangePicker } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <DateRangePicker
      startDateLabel="Start date"
      startDateHint="mm/dd/yyyy"
      endDateLabel="End date"
      endDateHint="mm/dd/yyyy"
    />
  )
}`
      },
      {
        title: 'With validation',
        code: `import { DateRangePicker } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <DateRangePicker
      startDateLabel="Event start"
      endDateLabel="Event end"
      startDatePickerProps={{
        required: true,
        minDate: '2024-01-01'
      }}
      endDatePickerProps={{
        required: true,
        minDate: '2024-01-01'
      }}
    />
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Provide clear labels for both date inputs',
        'Include hint text for expected format',
        'Validate end date is after start date',
        'Support keyboard navigation'
      ],
      ariaAttributes: [
        'Labels automatically associated with inputs'
      ],
      wcagCriteria: ['1.3.1', '3.3.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['DatePicker', 'DateInput']
  },

  FileInput: {
    name: 'FileInput',
    category: 'forms',
    description: 'File input component for uploading files',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-file-input--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Unique identifier for the input' },
      { name: 'name', type: 'string', required: true, description: 'Name attribute for the input' },
      { name: 'accept', type: 'string', required: false, description: 'Accepted file types (e.g., ".pdf,.doc")' },
      { name: 'multiple', type: 'boolean', required: false, default: 'false', description: 'Allow multiple file selection' },
      { name: 'onChange', type: 'function', required: false, description: 'Callback when files are selected' },
      { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disable the input' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ],
    examples: [
      {
        title: 'Basic file input',
        code: `import { FileInput, Label } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="file-input">Select a file</Label>
      <FileInput
        id="file-input"
        name="file-input"
      />
    </div>
  )
}`
      },
      {
        title: 'Multiple files with restrictions',
        code: `import { FileInput, Label } from '@trussworks/react-uswds'

export default function Example() {
  const handleChange = (e) => {
    console.log('Files selected:', e.target.files)
  }

  return (
    <div>
      <Label htmlFor="documents">Upload documents</Label>
      <FileInput
        id="documents"
        name="documents"
        accept=".pdf,.doc,.docx"
        multiple
        onChange={handleChange}
      />
    </div>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always pair with a descriptive Label',
        'Specify accepted file types when applicable',
        'Provide clear feedback when files are selected',
        'Include file size and type restrictions in instructions'
      ],
      wcagCriteria: ['1.3.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['Label', 'FormGroup']
  },

  TimePicker: {
    name: 'TimePicker',
    category: 'forms',
    description: 'Time picker component for selecting times',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-time-picker--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Unique identifier for the input' },
      { name: 'name', type: 'string', required: true, description: 'Name attribute for the input' },
      { name: 'defaultValue', type: 'string', required: false, description: 'Default time value (HH:MM format)' },
      { name: 'minTime', type: 'string', required: false, description: 'Minimum selectable time' },
      { name: 'maxTime', type: 'string', required: false, description: 'Maximum selectable time' },
      { name: 'step', type: 'number', required: false, default: '30', description: 'Minute interval steps' },
      { name: 'onChange', type: 'function', required: false, description: 'Callback when time changes' },
      { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disable the picker' }
    ],
    examples: [
      {
        title: 'Basic time picker',
        code: `import { TimePicker, Label } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="appointment-time">Appointment time</Label>
      <TimePicker
        id="appointment-time"
        name="appointment-time"
      />
    </div>
  )
}`
      },
      {
        title: 'With restrictions',
        code: `import { TimePicker, Label } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="meeting-time">Meeting time</Label>
      <TimePicker
        id="meeting-time"
        name="meeting-time"
        minTime="09:00"
        maxTime="17:00"
        step={15}
        defaultValue="14:00"
      />
    </div>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Provide a clear label',
        'Support keyboard input for manual entry',
        'Display time format clearly',
        'Validate time is within allowed range'
      ],
      wcagCriteria: ['1.3.1', '3.3.1', '3.3.2', '4.1.2']
    },
    relatedComponents: ['DatePicker', 'DateRangePicker']
  },

  Label: {
    name: 'Label',
    category: 'forms',
    description: 'Label component for form inputs',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-form-elements--docs',
    props: [
      { name: 'htmlFor', type: 'string', required: true, description: 'ID of the associated input element' },
      { name: 'children', type: 'ReactNode', required: true, description: 'Label text or content' },
      { name: 'error', type: 'boolean', required: false, default: 'false', description: 'Style label as error state' },
      { name: 'hint', type: 'ReactNode', required: false, description: 'Optional hint text below label' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ],
    examples: [
      {
        title: 'Basic label',
        code: `import { Label, TextInput } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="email">Email address</Label>
      <TextInput id="email" name="email" type="email" />
    </div>
  )
}`
      },
      {
        title: 'Label with hint',
        code: `import { Label, TextInput } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="username" hint="Use only letters and numbers">
        Username
      </Label>
      <TextInput id="username" name="username" />
    </div>
  )
}`
      },
      {
        title: 'Error state label',
        code: `import { Label, TextInput, ErrorMessage } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="password" error>
        Password
      </Label>
      <ErrorMessage>Password is required</ErrorMessage>
      <TextInput id="password" name="password" type="password" validationStatus="error" />
    </div>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always use htmlFor to associate with input',
        'Keep label text clear and concise',
        'Place label before the input it describes',
        'Use hint text for additional context'
      ],
      ariaAttributes: [
        'htmlFor automatically creates association'
      ],
      wcagCriteria: ['1.3.1', '2.4.6', '3.3.2']
    },
    relatedComponents: ['TextInput', 'FormGroup', 'ErrorMessage']
  },

  FormGroup: {
    name: 'FormGroup',
    category: 'forms',
    description: 'Container component that groups form elements with proper spacing and structure',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-form-elements--docs',
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Form elements to group' },
      { name: 'error', type: 'boolean', required: false, default: 'false', description: 'Apply error styling to group' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' }
    ],
    examples: [
      {
        title: 'Basic form group',
        code: `import { FormGroup, Label, TextInput } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <FormGroup>
      <Label htmlFor="name">Full name</Label>
      <TextInput id="name" name="name" type="text" />
    </FormGroup>
  )
}`
      },
      {
        title: 'Form group with error',
        code: `import { FormGroup, Label, TextInput, ErrorMessage } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <FormGroup error>
      <Label htmlFor="email" error>Email address</Label>
      <ErrorMessage>Enter a valid email address</ErrorMessage>
      <TextInput
        id="email"
        name="email"
        type="email"
        validationStatus="error"
      />
    </FormGroup>
  )
}`
      },
      {
        title: 'Multiple form groups',
        code: `import { FormGroup, Label, TextInput, Textarea, Button } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <form>
      <FormGroup>
        <Label htmlFor="subject">Subject</Label>
        <TextInput id="subject" name="subject" />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" />
      </FormGroup>

      <Button type="submit">Submit</Button>
    </form>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Use to group related form elements',
        'Maintains proper spacing and visual hierarchy',
        'Supports error state styling',
        'Ensures consistent form layout'
      ],
      wcagCriteria: ['1.3.1']
    },
    relatedComponents: ['Label', 'TextInput', 'Textarea', 'Select']
  },

  Icon: {
    name: 'Icon',
    category: 'ui',
    description: 'Component for rendering USWDS icons from the icon sprite',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-icon--docs',
    props: [
      { name: 'children', type: 'ReactNode', required: true, description: 'Icon name (e.g., "check", "close", "menu")' },
      { name: 'size', type: "'3' | '4' | '5' | '6' | '7' | '8' | '9'", required: false, description: 'Icon size (3-9, maps to CSS units)' },
      { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
      { name: 'role', type: 'string', required: false, default: 'img', description: 'ARIA role' },
      { name: 'aria-label', type: 'string', required: false, description: 'Accessible label for the icon' }
    ],
    examples: [
      {
        title: 'Basic icon',
        code: `import { Icon } from '@trussworks/react-uswds'

export default function Example() {
  return <Icon>check</Icon>
}`
      },
      {
        title: 'Icon with size',
        code: `import { Icon } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Icon size="3">close</Icon>
      <Icon size="5">menu</Icon>
      <Icon size="9">search</Icon>
    </div>
  )
}`
      },
      {
        title: 'Icon with accessible label',
        code: `import { Icon, Button } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <Button>
      <Icon aria-label="Close dialog">close</Icon>
    </Button>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Provide aria-label for meaningful icons',
        'Use role="img" for decorative icons',
        'Set aria-hidden="true" for purely decorative icons',
        'Ensure sufficient color contrast'
      ],
      ariaAttributes: [
        'aria-label: Describe icon purpose',
        'aria-hidden: Hide decorative icons from screen readers'
      ],
      wcagCriteria: ['1.1.1', '1.4.3', '1.4.11']
    },
    relatedComponents: ['Button', 'IconList']
  },

  TextInputMask: {
    name: 'TextInputMask',
    category: 'forms',
    description: 'Masked text input for formatted data entry (phone numbers, SSN, etc.)',
    importPath: '@trussworks/react-uswds',
    url: 'https://trussworks.github.io/react-uswds/?path=/docs/components-text-input-mask--docs',
    props: [
      { name: 'id', type: 'string', required: true, description: 'Unique identifier for the input' },
      { name: 'name', type: 'string', required: true, description: 'Name attribute for the input' },
      { name: 'mask', type: 'string', required: true, description: 'Input mask pattern (e.g., "(___) ___-____" for phone)' },
      { name: 'pattern', type: 'string', required: false, description: 'RegEx pattern for validation' },
      { name: 'placeholder', type: 'string', required: false, description: 'Placeholder text' },
      { name: 'value', type: 'string', required: false, description: 'Controlled input value' },
      { name: 'onChange', type: 'function', required: false, description: 'Callback when value changes' },
      { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disable the input' }
    ],
    examples: [
      {
        title: 'Phone number mask',
        code: `import { TextInputMask, Label } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="phone">Phone number</Label>
      <TextInputMask
        id="phone"
        name="phone"
        mask="(___) ___-____"
        pattern="\\(\\d{3}\\) \\d{3}-\\d{4}"
        placeholder="(555) 555-5555"
      />
    </div>
  )
}`
      },
      {
        title: 'SSN mask',
        code: `import { TextInputMask, Label } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="ssn">Social Security Number</Label>
      <TextInputMask
        id="ssn"
        name="ssn"
        mask="___-__-____"
        pattern="\\d{3}-\\d{2}-\\d{4}"
        placeholder="555-55-5555"
      />
    </div>
  )
}`
      },
      {
        title: 'ZIP code mask',
        code: `import { TextInputMask, Label } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="zip">ZIP Code</Label>
      <TextInputMask
        id="zip"
        name="zip"
        mask="_____"
        pattern="\\d{5}"
        placeholder="12345"
      />
    </div>
  )
}`
      }
    ],
    accessibility: {
      guidelines: [
        'Always pair with a descriptive Label',
        'Show mask format in placeholder or hint text',
        'Provide clear error messages for invalid formats',
        'Ensure keyboard input works smoothly with mask'
      ],
      wcagCriteria: ['1.3.1', '3.3.1', '3.3.2', '3.3.3']
    },
    relatedComponents: ['TextInput', 'Label', 'FormGroup']
  },
};

export const COMPONENT_CATEGORIES = {
  forms: 'Forms',
  ui: 'UI Components',
  navigation: 'Navigation',
  layout: 'Layout',
};
