# Keystone Design System MCP Server - Implementation Guide for AI Agents

## Context

This document provides complete instructions for implementing a Keystone Design System MCP server alongside the existing USWDS MCP server in the `uswds-local-mcp-server` repository.

**What is Keystone?**
- Pennsylvania's official design system (KDS v2.0.1)
- Government design system similar to USWDS but for Pennsylvania state government
- **Components**: https://components.pa.gov (Storybook)
- **Documentation**: https://wcmauthorguide.pa.gov/en/keystone-design-system/
- **Built on**: Bootstrap framework
- **Interactivity**: Stimulus.js controllers (Revealable, Navbar)
- **Icons**: Remix Icons
- **Typography**: Plus Jakarta Sans (primary), Zilla Slab (serif)
- **Accessibility**: WCAG 2.1 AA compliant
- **Browser Support**: Latest versions of Chrome, Firefox, Safari, Edge

**Key Technical Details:**
- **Class Prefixes**: `kds-` for Keystone-specific components, Bootstrap classes for standard components
- **Stimulus Controllers**: `revealable` (show/hide content), `navbar` (responsive navigation)
- **Color System**: Primary, Secondary, Tertiary, Error colors with light/dark mode support
- **Total Components**: 19 components across Forms, Navigation, Feedback, Content, and Data categories

**Goal:**
Create a standalone MCP server that provides 9 tools for working with Keystone Design System components, color tokens, accessibility guidelines, validation, and dynamic documentation fetching.

## Repository Structure

Branch: `claude/keystone-design-system-mcp-tools` (or similar)

Files to create:
```
src/
├── keystone/
│   ├── index.ts                  # Main exports
│   ├── components.ts             # Component data structure
│   ├── color-tokens.ts          # Color token definitions
│   └── keystone-service.ts      # Service implementation
├── keystone-index.ts             # MCP server entry point
KEYSTONE_SETUP.md                 # Setup documentation
KEYSTONE_TODO.md                  # Data population guide
package.json                      # Update with Keystone scripts
```

## File 1: src/keystone/components.ts

**Purpose:** Component data structure and management functions

```typescript
// Keystone Design System Component Data
// KDS v2.0.1 - Built on Bootstrap, WCAG 2.1 AA compliant
// Source: https://components.pa.gov (Storybook)
// Framework: Bootstrap + Stimulus.js
// Icons: Remix Icons

export interface KeystoneComponent {
  name: string;
  category: string;
  description: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  usage?: {
    whenToUse?: string[];
    whenNotToUse?: string[];
    bestPractices?: string[];
  };
  props?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue?: string;
  }[];
  examples?: {
    title: string;
    code: string;
    description?: string;
  }[];
  accessibility?: {
    keyboardSupport?: string;
    ariaLabels?: string[];
    screenReaderNotes?: string;
  };
  relatedComponents?: string[];
  storybookUrl?: string;
}

// All 19 components available in KDS Storybook
// Class prefix: kds- (Keystone Design System)

export const keystoneComponents: KeystoneComponent[] = [
  // FORMS & INPUTS
  {
    name: 'Button',
    category: 'forms',
    description: 'Interactive button component for user actions. Available in filled (primary), outlined (secondary), and text (ghost) variants. Button labels should be short, clear, and written in sentence case. Use to trigger actions, not navigation.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-button--docs',
    usage: {
      whenToUse: [
        'When a user will trigger an action (submit form, save data, log in)',
        'For the most important call to action (use filled/primary style)',
        'For helpful but non-essential actions (use outlined/secondary style)',
        'For low-priority actions (use text/ghost style)',
        'For well-established actions when saving space (icon button)',
      ],
      whenNotToUse: [
        'Do not use buttons to navigate to different pages - use Link component instead',
        'Do not use vague labels like "Click here", "Learn more", or "Read more"',
        'Only use one primary button per page or section',
      ],
      bestPractices: [
        'Use specific labels like "Submit form", "Cancel request", "Begin application"',
        'Keep labels short and clear in sentence case',
        'Provide context to help users understand what will happen',
        'When using icon buttons, provide alt text or aria-label',
        'Always pair secondary buttons with a primary button',
        'Use ghost/text style when presenting multiple buttons together',
      ],
    },
    props: [
      {
        name: 'variant',
        type: "'filled' | 'outlined' | 'text'",
        required: false,
        description: 'Button style variant',
        defaultValue: 'filled',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Whether button is disabled',
        defaultValue: 'false',
      },
      {
        name: 'link',
        type: 'boolean',
        required: false,
        description: 'Whether button should behave as a link',
        defaultValue: 'false',
      },
      {
        name: 'icon',
        type: 'boolean',
        required: false,
        description: 'Whether button includes an icon',
        defaultValue: 'false',
      },
      {
        name: 'type',
        type: "'button' | 'submit' | 'reset'",
        required: false,
        description: 'HTML button type attribute',
        defaultValue: 'button',
      },
      {
        name: 'tabindex',
        type: 'number',
        required: false,
        description: 'Tab index for keyboard navigation',
        defaultValue: '0',
      },
    ],
    examples: [
      {
        title: 'Filled Button (Default)',
        code: `<button type="button" class="kds-button kds-button-filled" tabindex="0">
  Submit
</button>`,
        description: 'Solid filled button with primary color',
      },
      {
        title: 'Outlined Button',
        code: `<button type="button" class="kds-button kds-button-outlined" tabindex="0">
  Submit
</button>`,
        description: 'Button with border and transparent background',
      },
      {
        title: 'Text Button',
        code: `<button type="button" class="kds-button kds-button-text" tabindex="0">
  Submit
</button>`,
        description: 'Minimal button with text only, no background or border',
      },
      {
        title: 'Button with Icon',
        code: `<button type="button" class="kds-button kds-button-text" tabindex="0">
  <span>Submit</span>
  <i class="ri-arrow-right-line"></i>
</button>`,
        description: 'Button with text and Remix Icon (arrow)',
      },
    ],
    accessibility: {
      keyboardSupport: 'Activates with Enter or Space keys, navigable with Tab',
      ariaLabels: [
        'Use descriptive button text that explains action',
        'If button only contains icon, use aria-label to describe action',
        'Avoid generic labels like "click here" or "submit"',
      ],
      screenReaderNotes: 'Button purpose should be clear from text content. Icons should be supplementary, not the sole indicator of purpose.',
    },
    relatedComponents: ['Link', 'Icon object'],
  },
  {
    name: 'Text input',
    category: 'forms',
    description: 'Text input component that allows users to enter short strings of text into a field. Label should clearly describe the information that a user needs to enter. Can include help text and placeholder text. Help text provides context or formatting instructions. Placeholder text should be used sparingly as it disappears when typing.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-text-input--docs',
    usage: {
      whenToUse: [
        'Ideal for collecting short text responses from users',
        'Information like first and last name, usernames, or passwords',
        'Single-line text entry (words or short phrases)',
      ],
      whenNotToUse: [
        'Avoid if users need to enter at least a sentence of text',
        'Use text area component for longer text that needs more space and visibility',
      ],
      bestPractices: [
        'Label must clearly describe the information you expect the user to provide',
        'Never put critical information in placeholder text',
        'Place any essential instructions in help text instead',
        'Use sentence case for label and help text',
        'Use sentence case for placeholder text unless it conflicts with formatting guidelines',
        'Warning variant: when user needs to review a response (warning message replaces help text)',
        'Error variant: when response will prevent submission/save (missing required or invalid responses)',
      ],
    },
    props: [
      {
        name: 'variant',
        type: "'default' | 'warning' | 'error'",
        description: 'Visual state of the text input',
        defaultValue: 'default',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Whether the text input is disabled',
        defaultValue: 'false',
      },
      {
        name: 'withHelpText',
        type: 'boolean',
        description: 'Whether to show help text below the input',
        defaultValue: 'false',
      },
    ],
    examples: [
      {
        title: 'Default Text Input',
        code: `<label class="kds-form-control">
  <div class="kds-label kds-label-md">
    <span id="text-input-label" class="kds-label-text">Label</span>
  </div>
  <input type="text" class="kds-text-input" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" />
</label>`,
        description: 'Standard text input with label. Wrapped in label.kds-form-control with kds-label-md class.',
      },
      {
        title: 'Disabled Text Input',
        code: `<label class="kds-form-control">
  <div class="kds-label kds-label-md">
    <span id="text-input-label" class="kds-label-text">Label</span>
  </div>
  <input type="text" class="kds-text-input" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" disabled />
</label>`,
        description: 'Disabled text input using disabled attribute.',
      },
      {
        title: 'Warning Text Input',
        code: `<label class="kds-form-control">
  <div class="kds-label kds-label-md">
    <span id="text-input-label" class="kds-label-text">Label</span>
  </div>
  <div class="kds-input-icon">
    <input type="text" class="kds-text-input" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text"/>
    <i class="kds-icon kds-text-warning ri-alert-fill" aria-label="Warning icon"></i>
  </div>
  <div class="kds-label">
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-warning">Helper text</span>
  </div>
</label>`,
        description: 'Text input with warning state. Wrapped in kds-input-icon with warning icon (ri-alert-fill) and help text with kds-text-warning class. Warning message replaces help text.',
      },
      {
        title: 'Error Text Input',
        code: `<label class="kds-form-control">
  <div class="kds-label kds-label-md">
    <span id="text-input-label" class="kds-label-text">Label</span>
  </div>
  <div class="kds-input-icon">
    <input type="text" class="kds-text-input kds-text-input-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" aria-invalid="true"/>
    <i class="kds-icon kds-text-error ri-error-warning-fill" aria-label="Error icon"></i>
  </div>
  <div class="kds-label">
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-error">Helper text</span>
  </div>
</label>`,
        description: 'Text input with error state. Uses kds-text-input-error class, aria-invalid="true", wrapped in kds-input-icon with error icon (ri-error-warning-fill), and error help text with kds-text-error class. Error message replaces help text.',
      },
    ],
    accessibility: {
      keyboardSupport: 'Standard text input keyboard navigation, Tab to move between fields, Arrow keys to navigate text',
      ariaLabels: [
        'Always provide associated label',
        'Use aria-labelledby to associate label with input element',
        'Use aria-describedby for helper text and errors',
        'Error state inputs must include aria-invalid="true"',
        'Warning/error icons must include aria-label to describe the state',
        'Never put critical information in placeholder text - use help text instead',
      ],
      screenReaderNotes: 'Screen readers announce label, current value, and associated help text. Error state announced via aria-invalid. Label and validation messages announced automatically.',
    },
    relatedComponents: ['Textarea', 'Select', 'Search input'],
  },
  {
    name: 'Textarea',
    category: 'forms',
    description: 'Multi-line text input component for longer form content. Allows users to enter at least a sentence of text. Provides more space and better visibility than text input. Includes character count functionality via Stimulus controller.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-textarea--docs',
    usage: {
      whenToUse: [
        'When users need to enter at least a sentence of text',
        'For longer text that needs more space and visibility',
        'Multi-line text entry (paragraphs, descriptions, comments)',
      ],
      whenNotToUse: [
        'For short text responses (use text input instead)',
        'Single-line entries like names, usernames, or passwords',
      ],
      bestPractices: [
        'Label must clearly describe the information you expect the user to provide',
        'Use Stimulus textarea controller for character count functionality',
        'Set data-max attribute to define character limit',
        'Character counter updates dynamically as user types',
        'Use sentence case for label and help text',
        'Warning variant: when user needs to review a response',
        'Error variant: when response will prevent submission/save',
      ],
    },
    props: [
      {
        name: 'variant',
        type: "'default' | 'warning' | 'error'",
        description: 'Visual state of the textarea',
        defaultValue: 'default',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Whether the textarea is disabled',
        defaultValue: 'false',
      },
      {
        name: 'withHelpText',
        type: 'boolean',
        description: 'Whether to show help text below the textarea',
        defaultValue: 'false',
      },
      {
        name: 'maxLength',
        type: 'number',
        description: 'Maximum character length (used with Stimulus controller)',
        required: false,
      },
    ],
    examples: [
      {
        title: 'Default Textarea with Character Count',
        code: `<label class="kds-form-control" data-controller="textarea">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Label</span>
    <span class="kds-label-text-alt" data-textarea-target="counter"></span>
  </div>
  <textarea class="kds-textarea" data-textarea-target="input" data-action="input->textarea#charCount" data-max="10" data-alert-class="kds-textarea-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text"></textarea>
</label>`,
        description: 'Standard textarea with Stimulus textarea controller for character counting. Counter target displays character count, data-max sets limit, data-action triggers count update on input.',
      },
      {
        title: 'Disabled Textarea',
        code: `<label class="kds-form-control" data-controller="textarea">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Label</span>
    <span class="kds-label-text-alt" data-textarea-target="counter"></span>
  </div>
  <textarea class="kds-textarea" data-textarea-target="input" data-action="input->textarea#charCount" data-max="10" data-alert-class="kds-textarea-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" disabled></textarea>
</label>`,
        description: 'Disabled textarea using disabled attribute.',
      },
      {
        title: 'Warning Textarea',
        code: `<label class="kds-form-control" data-controller="textarea">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Label</span>
    <span class="kds-label-text-alt" data-textarea-target="counter"></span>
  </div>
  <div class="kds-input-icon">
    <textarea class="kds-textarea kds-textarea-warning" data-textarea-target="input" data-action="input->textarea#charCount" data-max="10" data-alert-class="kds-textarea-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text"></textarea>
    <i class="kds-icon kds-text-warning ri-alert-fill" aria-label="Warning icon"></i>
  </div>
  <div class="kds-label">
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-warning">Helper text</span>
  </div>
</label>`,
        description: 'Textarea with warning state. Uses kds-textarea-warning class, wrapped in kds-input-icon with warning icon (ri-alert-fill), and help text with kds-text-warning class.',
      },
      {
        title: 'Error Textarea',
        code: `<label class="kds-form-control" data-controller="textarea">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Label</span>
    <span class="kds-label-text-alt" data-textarea-target="counter"></span>
  </div>
  <div class="kds-input-icon">
    <textarea class="kds-textarea kds-textarea-error" data-textarea-target="input" data-action="input->textarea#charCount" data-max="10" data-alert-class="kds-textarea-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" aria-invalid="true"></textarea>
    <i class="kds-icon kds-text-error ri-error-warning-fill" aria-label="Error icon"></i>
  </div>
  <div class="kds-label">
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-error">Helper text</span>
  </div>
</label>`,
        description: 'Textarea with error state. Uses kds-textarea-error class, aria-invalid="true", wrapped in kds-input-icon with error icon (ri-error-warning-fill), and error help text with kds-text-error class.',
      },
    ],
    accessibility: {
      keyboardSupport: 'Standard textarea keyboard navigation, Tab to move between fields, Arrow keys to navigate text, Enter for new lines',
      ariaLabels: [
        'Provide label with for/id relationship',
        'Use aria-labelledby to associate label with textarea',
        'Use aria-describedby for character count or helper text',
        'Error state textareas must include aria-invalid="true"',
        'Warning/error icons must include aria-label to describe the state',
        'Character counter should be accessible to screen readers',
      ],
      screenReaderNotes: 'Screen readers announce label, current value, character count, and associated help text. Error state announced via aria-invalid.',
    },
    relatedComponents: ['Text input'],
  },
  {
    name: 'Select',
    category: 'forms',
    description: 'Dropdown select component that allows users to choose one response from a drop-down list. Used for single selection only. Often used on forms (like choosing U.S. state), choosing an action, filtering a list, or sorting content.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-select--docs',
    usage: {
      whenToUse: [
        'Building a form where user needs to submit selected data',
        'User should select a single option from a list of many options',
        'There is a limited and defined list of valid answers',
        'Each option is brief (long list of wordy responses is harder to read)',
        'Choosing an action, filtering a list, or sorting content',
      ],
      whenNotToUse: [
        'If user should select more than one response - use a checkbox group instead',
        'If the list only contains one or two possible responses - use a radio button group instead',
      ],
      bestPractices: [
        'Always provide an accurate label for your select box',
        'Keep options brief - long wordy responses are harder to read and select',
        'Use a limited and defined list of valid answers',
        'Assign a unique ID to any help text',
        'Make sure the input has aria-describedby attribute that matches help text ID',
        'Include a disabled, selected placeholder as the first option',
      ],
    },
    props: [
      {
        name: 'variant',
        type: "'default' | 'warning' | 'error'",
        description: 'Visual state of the select box',
        defaultValue: 'default',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Whether the select box is disabled',
        defaultValue: 'false',
      },
      {
        name: 'withHelpText',
        type: 'boolean',
        description: 'Whether to show help text below the select box',
        defaultValue: 'false',
      },
    ],
    examples: [
      {
        title: 'Default Select',
        code: `<label class="kds-form-control">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Pick the best fantasy franchise</span>
  </div>
  <select class="kds-select" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text">
    <option disabled selected></option>
    <option value="1">Star Wars</option>
    <option value="2">Harry Potter</option>
    <option value="3">Lord of the Rings</option>
    <option value="4">Planet of the Apes</option>
    <option value="5">Star Trek</option>
  </select>
</label>`,
        description: 'Standard select box with label. First option is disabled and selected (empty placeholder). Wrapped in label.kds-form-control.',
      },
      {
        title: 'Disabled Select',
        code: `<label class="kds-form-control">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Pick the best fantasy franchise</span>
  </div>
  <select class="kds-select" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" disabled>
    <option disabled selected></option>
    <option value="1">Star Wars</option>
    <option value="2">Harry Potter</option>
    <option value="3">Lord of the Rings</option>
    <option value="4">Planet of the Apes</option>
    <option value="5">Star Trek</option>
  </select>
</label>`,
        description: 'Disabled select box using disabled attribute.',
      },
      {
        title: 'Warning Select',
        code: `<label class="kds-form-control">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Pick the best fantasy franchise</span>
  </div>
  <div class="kds-input-icon">
    <select class="kds-select kds-select-warning" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text">
      <option disabled selected></option>
      <option value="1">Star Wars</option>
      <option value="2">Harry Potter</option>
      <option value="3">Lord of the Rings</option>
      <option value="4">Planet of the Apes</option>
      <option value="5">Star Trek</option>
    </select>
    <i class="kds-icon kds-text-warning ri-alert-fill" aria-label="Warning icon"></i>
  </div>
  <div class="kds-label">
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-warning">Alt label</span>
  </div>
</label>`,
        description: 'Select box with warning state. Uses kds-select-warning class, wrapped in kds-input-icon with warning icon (ri-alert-fill), and help text with kds-text-warning class.',
      },
      {
        title: 'Error Select',
        code: `<label class="kds-form-control">
  <div class="kds-label">
    <span id="text-input-label" class="kds-label-text">Pick the best fantasy franchise</span>
  </div>
  <div class="kds-input-icon">
    <select class="kds-select kds-select-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" aria-invalid="true">
      <option disabled selected></option>
      <option value="1">Star Wars</option>
      <option value="2">Harry Potter</option>
      <option value="3">Lord of the Rings</option>
      <option value="4">Planet of the Apes</option>
      <option value="5">Star Trek</option>
    </select>
    <i class="kds-icon kds-text-error ri-error-warning-fill" aria-label="Error icon"></i>
  </div>
  <div class="kds-label">
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-error">Alt label</span>
  </div>
</label>`,
        description: 'Select box with error state. Uses kds-select-error class, aria-invalid="true", wrapped in kds-input-icon with error icon (ri-error-warning-fill), and error help text with kds-text-error class.',
      },
    ],
    accessibility: {
      keyboardSupport: 'Arrow keys to navigate options, Enter to select, Space to open dropdown, Escape to close, Tab to move to next field',
      ariaLabels: [
        'Always provide an accurate label for select box',
        'Use aria-labelledby to associate label with select element',
        'Assign a unique ID to any help text',
        'Use aria-describedby attribute that matches help text ID',
        'Error state selects must include aria-invalid="true"',
        'Warning/error icons must include aria-label to describe the state',
        'Use aria-required for required fields',
      ],
      screenReaderNotes: 'Screen readers announce select box label, current value, number of options, and associated help text. Error state announced via aria-invalid.',
    },
    relatedComponents: ['Radio', 'Checkbox'],
  },
  {
    name: 'Checkbox',
    category: 'forms',
    description: 'Checkbox input allowing users to select multiple options from a list. Users can choose as many or as few as they want. Selecting one checkbox does not affect others. Each checkbox has a clear label and can include helper text.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-checkbox--docs',
    usage: {
      whenToUse: [
        'When users can select multiple options from a list',
        'In forms for multi-select fields',
        'For terms and conditions acceptance',
        'To filter content with multiple criteria',
        'When selection of one option does not affect others',
      ],
      whenNotToUse: [
        "Don't use if users should only select one option - use Radio button instead",
        "Don't create overly long lists - break into multiple questions",
      ],
      bestPractices: [
        'Provide clear and concise label for each checkbox',
        'Keep list of options short',
        'Include instructions and helper text as needed',
        'Use warning/error variants to show validation states',
        'Associate labels properly using aria-labelledby',
        'Use aria-describedby for helper text',
      ],
    },
    props: [
      {
        name: 'variant',
        type: "'default' | 'warning' | 'error'",
        required: false,
        description: 'Visual state of the checkbox',
        defaultValue: 'default',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Whether checkbox is disabled',
        defaultValue: 'false',
      },
      {
        name: 'checked',
        type: 'boolean',
        required: false,
        description: 'Whether checkbox is checked',
        defaultValue: 'false',
      },
      {
        name: 'withHelpText',
        type: 'boolean',
        required: false,
        description: 'Whether to display helper/validation text',
        defaultValue: 'false',
      },
      {
        name: 'tabindex',
        type: 'number',
        required: false,
        description: 'Tab index for keyboard navigation',
        defaultValue: '0',
      },
    ],
    examples: [
      {
        title: 'Default Checkbox',
        code: `<div class="kds-form-control">
  <label class="kds-label">
    <input type="checkbox" class="kds-checkbox" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text"/>
    <span id="text-input-label" class="kds-label-text">Remember me</span>
  </label>
</div>`,
        description: 'Standard checkbox with label',
      },
      {
        title: 'Disabled Checkbox',
        code: `<div class="kds-form-control kds-disabled">
  <label class="kds-label">
    <input type="checkbox" class="kds-checkbox" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" disabled/>
    <span id="text-input-label" class="kds-label-text">Remember me</span>
  </label>
</div>`,
        description: 'Disabled checkbox (non-interactive)',
      },
      {
        title: 'Warning Checkbox',
        code: `<div class="kds-form-control">
  <label class="kds-label">
    <input type="checkbox" class="kds-checkbox" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text"/>
    <span id="text-input-label" class="kds-label-text">Remember me</span>
  </label>
  <div class="kds-label">
    <i class="kds-icon kds-text-warning ri-alert-fill" aria-label="Warning icon"></i>
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-warning">Alt label</span>
  </div>
</div>`,
        description: 'Checkbox with warning state and helper text',
      },
      {
        title: 'Error Checkbox',
        code: `<div class="kds-form-control">
  <label class="kds-label">
    <input type="checkbox" class="kds-checkbox kds-checkbox-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" aria-invalid="true"/>
    <span id="text-input-label" class="kds-label-text">Remember me</span>
  </label>
  <div class="kds-label">
    <i class="kds-icon kds-text-error ri-error-warning-fill" aria-label="Error icon"></i>
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-error">Alt label</span>
  </div>
</div>`,
        description: 'Checkbox with error state, validation message, and aria-invalid',
      },
    ],
    accessibility: {
      keyboardSupport: 'Space to toggle checkbox, Tab to navigate between checkboxes',
      ariaLabels: [
        'Use aria-labelledby to associate input with label text',
        'Use aria-describedby to associate input with helper/error text',
        'Use aria-invalid="true" for error state',
        'Provide aria-label on status icons',
        'Use fieldset/legend for checkbox groups',
        'Disabled checkboxes should have disabled attribute',
      ],
      screenReaderNotes: 'Screen readers announce checkbox label, state (checked/unchecked), and any helper text. Error state announced via aria-invalid.',
    },
    relatedComponents: ['Radio', 'Select'],
  },
  {
    name: 'Radio',
    category: 'forms',
    description: 'Radio button input that lets users choose one option from a list of two or more choices. When a user picks a different option, the previous one is automatically unselected. Each radio button label should tell the user exactly what they are choosing.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-radio--docs',
    usage: {
      whenToUse: [
        'When the user must choose only one option from multiple choices',
        'Often used in forms and data tables',
        'Keep the list of options short to avoid overwhelming users',
      ],
      whenNotToUse: [
        "Don't use radio buttons if users need to choose more than one option - use checkboxes instead",
        'Avoid long lists of radio options, which overwhelm users',
      ],
      bestPractices: [
        'Keep the label short and meaningful - usually three words or fewer',
        'Use sentence case for labels',
        "Don't use ALL CAPS",
        'Every radio button needs a clear and concise label',
        'All radio buttons in a group must have the same name attribute',
        'Use fieldset/legend to group related radio buttons',
      ],
    },
    props: [
      {
        name: 'variant',
        type: "'default' | 'warning' | 'error'",
        description: 'Visual state of the radio button',
        defaultValue: 'default',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Whether the radio button is disabled',
        defaultValue: 'false',
      },
      {
        name: 'withHelpText',
        type: 'boolean',
        description: 'Whether to show help text below the radio button',
        defaultValue: 'false',
      },
      {
        name: 'checked',
        type: 'boolean',
        description: 'Whether the radio button is selected',
        defaultValue: 'false',
      },
    ],
    examples: [
      {
        title: 'Default Radio Button',
        code: `<div class="kds-form-control">
  <label class="kds-label">
    <input type="radio" class="kds-radio" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" />
    <span id="text-input-label" class="kds-label-text">Some choice</span>
  </label>
</div>`,
        description: 'Standard radio button with label. Must be wrapped in kds-form-control and kds-label.',
      },
      {
        title: 'Disabled Radio Button',
        code: `<div class="kds-form-control">
  <label class="kds-label">
    <input type="radio" class="kds-radio" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" disabled />
    <span id="text-input-label" class="kds-label-text">Some choice</span>
  </label>
</div>`,
        description: 'Disabled radio button using disabled attribute.',
      },
      {
        title: 'Warning Radio Button',
        code: `<div class="kds-form-control">
  <label class="kds-label">
    <input type="radio" class="kds-radio" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" />
    <span id="text-input-label" class="kds-label-text">Some choice</span>
  </label>
  <div class="kds-label">
    <i class="kds-icon kds-text-warning ri-alert-fill" aria-label="Warning icon"></i>
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-warning">Help text message</span>
  </div>
</div>`,
        description: 'Radio button with warning state. Includes warning icon (ri-alert-fill) and help text with kds-text-warning class.',
      },
      {
        title: 'Error Radio Button',
        code: `<div class="kds-form-control">
  <label class="kds-label">
    <input type="radio" class="kds-radio kds-radio-error" tabindex="0" aria-labelledby="text-input-label" aria-describedby="text-input-help-text" aria-invalid="true" />
    <span id="text-input-label" class="kds-label-text">Some choice</span>
  </label>
  <div class="kds-label">
    <i class="kds-icon kds-text-error ri-error-warning-fill" aria-label="Error icon"></i>
    <span id="text-input-help-text" class="kds-label-text-alt kds-text-error">Help text message</span>
  </div>
</div>`,
        description: 'Radio button with error state. Includes kds-radio-error class, aria-invalid="true", error icon (ri-error-warning-fill), and error help text with kds-text-error class.',
      },
      {
        title: 'Radio Button Group',
        code: `<fieldset class="kds-form-control">
  <legend class="kds-label-text">Select your preferred contact method</legend>
  <label class="kds-label">
    <input type="radio" name="contact" class="kds-radio" tabindex="0" aria-labelledby="contact-email" />
    <span id="contact-email" class="kds-label-text">Email</span>
  </label>
  <label class="kds-label">
    <input type="radio" name="contact" class="kds-radio" tabindex="0" aria-labelledby="contact-phone" />
    <span id="contact-phone" class="kds-label-text">Phone</span>
  </label>
  <label class="kds-label">
    <input type="radio" name="contact" class="kds-radio" tabindex="0" aria-labelledby="contact-mail" />
    <span id="contact-mail" class="kds-label-text">Mail</span>
  </label>
</fieldset>`,
        description: 'Radio button group using fieldset/legend for proper grouping. All radios share the same name attribute for mutual exclusivity.',
      },
    ],
    accessibility: {
      keyboardSupport: 'Arrow keys to move between radio buttons within group, Space to select, Tab to move between groups',
      ariaLabels: [
        'Use fieldset/legend to group related radio buttons',
        'All radios in a group must have the same name attribute',
        'Each radio must have aria-labelledby to associate with label text',
        'Use aria-describedby to associate with help text when present',
        'Error state radios must include aria-invalid="true"',
        'Warning/error icons must include aria-label to describe the state',
      ],
      screenReaderNotes: 'Screen readers announce radio button state (checked/unchecked), label text, and associated help text. Grouping with fieldset/legend helps users understand the context of choices.',
    },
    relatedComponents: ['Checkbox', 'Select'],
  },
  {
    name: 'Search input',
    category: 'forms',
    description: 'Specialized text input with search functionality',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-search-input--docs',
    accessibility: {
      keyboardSupport: 'Standard input navigation plus Enter to submit search',
      ariaLabels: ['Use role="search" on container', 'Provide clear label like "Search"'],
    },
    relatedComponents: ['Text input', 'Button'],
  },

  // NAVIGATION
  {
    name: 'Navbar',
    category: 'navigation',
    description: 'Header and navigation bar appearing throughout web app or site. Contains official website banner and navigation bar with logo, program name, search bar, navigation menu, and dropdown submenus. Required on every page.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-navbar--docs',
    usage: {
      whenToUse: [
        'Required on every page throughout the site',
        'Provide consistent site-wide navigation',
        'Display official Commonwealth of Pennsylvania branding',
        'Offer search functionality across the site',
        'Organize navigation with dropdown submenus',
      ],
      whenNotToUse: [
        'The header is required on all pages - should never be removed',
      ],
      bestPractices: [
        'Use clear, descriptive labels for all menu items',
        'Include official website banner with Commonwealth of Pennsylvania branding',
        'Implement responsive design with hamburger menu for smaller screens',
        'Use Stimulus controllers (revealable + navbar) for interactive behavior',
        'Provide search functionality with visually-hidden labels',
        'Organize complex navigation with dropdown submenus',
        'Maintain consistent header across all pages',
      ],
    },
    examples: [
      {
        title: 'Complete Header and Navbar',
        code: `<div class="kds-header">
  <img aria-hidden="true" class="image"
       src="https://www.pa.gov/content/dam/copapwp-pagov/en/global/images/bannerimage.png"
       alt="Commonwealth of Pennsylvania">
  <span class="kds-header-text">
    <a href="#" class="kds-link kds-link-inline" role="link" aria-label="Link">Official Website</a> of the Commonwealth of Pennsylvania
  </span>
</div>
<nav class="kds-navbar" data-controller="revealable navbar">
  <div class="kds-navbar-header">
    <h3 style="color: lightgrey">Keystone!</h3>
    <form method="get" action="#" class="d-none d-md-block">
      <div class="kds-search-input p-3">
        <label class="visually-hidden">Search</label>
        <input type="search" class="kds-text-input w-100" placeholder="Search" />
        <button type="submit" class="kds-button kds-button-filled">
          <span class="visually-hidden">Search</span>
          <i aria-hidden="true" class="ri-search-line"></i>
        </button>
      </div>
    </form>
    <button class="kds-navbar-toggler" data-navbar-target="toggleButton"
            data-action="click->revealable#toggle click->navbar#toggleLabel" aria-expanded="false">Menu
    </button>
  </div>
  <ul class="kds-nav" data-revealable-target="content">
    <li class="kds-nav-item d-md-none">
      <form method="get" action="#">
        <div class="kds-search-input p-3">
          <label class="visually-hidden">Search</label>
          <input type="search" class="kds-text-input w-100" placeholder="Search" />
          <button type="submit" class="kds-button kds-button-filled">
            <span class="visually-hidden">Search</span>
            <i aria-hidden="true" class="ri-search-line"></i>
          </button>
        </div>
      </form>
    </li>
    <li class="kds-nav-item"><a href="#" class="kds-nav-link">Home</a></li>
    <li class="kds-nav-item" data-controller="revealable">
      <button
        id="navbarDropdown"
        class="kds-nav-link kds-dropdown-toggle"
        data-action="click->revealable#toggle"
        aria-expanded="false">
        Reserve Your Spot
      </button>
      <ul class="kds-menu-list kds-dropdown kds-revealable"
          data-revealable-target="content"
          aria-labelledby="navbarDropdown">
        <li><a class="kds-menu-item" href="#"><i class="kds-icon ri-circle-fill"></i>Sub Item 1</a></li>
        <li><a class="kds-menu-item" href="#"><i class="kds-icon ri-triangle-fill"></i>Sub Item 2</a></li>
        <li><a class="kds-menu-item" href="#"><i class="kds-icon ri-pentagon-fill"></i>Sub Item 3</a></li>
      </ul>
    </li>
    <li class="kds-nav-item"><a href="#" class="kds-nav-link">Camping This Weekend</a></li>
    <li class="kds-nav-item"><a href="#" class="kds-nav-link">Interactive Map</a></li>
    <li class="kds-nav-item"><a href="#" class="kds-nav-link">Fees & Policies</a></li>
  </ul>
</nav>`,
        description: 'Complete header with Commonwealth banner and navbar with search, menu items, and dropdown submenu',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab through nav items, Enter to activate links/buttons, Space to activate buttons, Arrow keys within dropdown menus, Escape to close dropdowns',
      ariaLabels: [
        'Use semantic <nav> element for navigation',
        'Hamburger menu toggle button requires aria-expanded to indicate menu state',
        'Dropdown toggle buttons require aria-expanded to indicate submenu state',
        'Dropdown menus require aria-labelledby to associate with toggle button',
        'Search inputs require visually-hidden labels (use Bootstrap .visually-hidden class)',
        'Icon-only buttons (search, menu toggle) require visually-hidden text or aria-label',
      ],
      screenReaderNotes: 'Navbar state (open/closed) announced via aria-expanded. Stimulus controllers (revealable + navbar) manage ARIA attributes automatically. Responsive search appears in both desktop (d-none d-md-block) and mobile (d-md-none) versions with proper labels.',
    },
    relatedComponents: ['Link', 'Menu list', 'Breadcrumb'],
  },
  {
    name: 'Menu list',
    category: 'navigation',
    description: 'Vertical list of navigation or action items',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-menu-list--docs',
    accessibility: {
      keyboardSupport: 'Tab through menu items, Enter to activate',
      ariaLabels: ['Use role="menu" for true menus', 'Use role="list" for simple lists'],
    },
    relatedComponents: ['Navbar', 'List group'],
  },
  {
    name: 'Breadcrumb',
    category: 'navigation',
    description: 'Secondary navigation showing the path from homepage to current page. Shows where the page fits in site hierarchy (not user history). Located at top left above page title. Desktop shows full trail, mobile shows simplified back link.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-breadcrumb--docs',
    usage: {
      whenToUse: [
        'Show breadcrumbs on all pages except the homepage',
        'When users need to see where they are in the website structure',
        'To provide quick navigation back to parent pages',
      ],
      whenNotToUse: [
        "Don't use breadcrumbs to replace main navigation",
        "Don't show breadcrumbs on the homepage",
        "Don't use breadcrumbs to show user navigation history",
      ],
      bestPractices: [
        'Each breadcrumb item is the name of a parent page and links to that page',
        'Breadcrumb links must clearly describe the link destination - avoid vague labels',
        'Visually locate at top left of page, right above page title',
        'On mobile, shorten breadcrumbs to save space',
        'Separators between links are not interactive',
      ],
    },
    examples: [
      {
        title: 'Desktop Breadcrumb',
        code: `<nav class="kds-breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li class="kds-breadcrumb-item">
      <a href="/">Home</a>
    </li>
    <li class="kds-breadcrumb-item">
      <a href="/products">Products</a>
    </li>
    <li class="kds-breadcrumb-item kds-breadcrumb-current">
      <span aria-current="page">Current Page</span>
    </li>
  </ol>
</nav>`,
        description: 'Full breadcrumb trail for desktop with Home > Products > Current Page',
      },
      {
        title: 'Mobile Breadcrumb',
        code: `<nav class="kds-breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li class="kds-breadcrumb-item">
      <i class="ri-arrow-left-line"></i>
      <a href="#" aria-current="page">Breadcrumb</a>
    </li>
  </ol>
</nav>`,
        description: 'Simplified mobile breadcrumb with back arrow icon',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab through breadcrumb links, Enter to navigate',
      ariaLabels: [
        'Wrap in <nav> with aria-label="Breadcrumb"',
        'Use <ol> for ordered list structure',
        'Use aria-current="page" on current page span',
        'Apply kds-breadcrumb-current class to current item',
      ],
      screenReaderNotes: 'Screen readers announce "Breadcrumb navigation" and list structure. Current page identified via aria-current.',
    },
    relatedComponents: ['Link', 'Navbar', 'Icon object'],
  },
  {
    name: 'Link',
    category: 'navigation',
    description: 'Hyperlink component that takes users to another page, website, or part of the same page. Available in two variants: Inline links (appear within running text) and Standalone links (appear on their own, may include icons). Link text should be short, clear, and specific about the destination.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-link--docs',
    usage: {
      whenToUse: [
        'Navigate to another PA.gov page',
        'Link to an external website',
        'Jump to a specific section on the same page',
        'Link to a PDF file (include [PDF] at the end of link text)',
        'Draft an email (mailto: link)',
        'Call a phone number (tel: link)',
        'Use inline links within sentences or running text',
        'Use standalone links after descriptive sentences or in lists',
      ],
      whenNotToUse: [
        'Links are for navigation, not for triggering actions',
        "If user needs to do something (sign up, save, submit), use a button instead",
        "Don't use icons in inline links (icons only for standalone links)",
      ],
      bestPractices: [
        'Link text should clearly explain where the link goes',
        'Keep link text specific, brief, and clear',
        'Avoid vague labels like "Click here", "Read more", "This link"',
        'Use descriptive labels like "Your account", "View election results", "Register for the event"',
        'Screen reader users navigate pages using link text - make it understandable without surrounding context',
        'For PDFs, include [PDF] at the end of link text',
        'Standalone links can include icons (typically right arrow)',
        'Inline links should not include icons',
      ],
    },
    props: [
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        description: 'Link size variant',
        defaultValue: 'medium',
      },
      {
        name: 'variant',
        type: "'inline' | 'standalone'",
        description: 'Link variant - inline for within text, standalone for on its own',
        defaultValue: 'inline',
      },
      {
        name: 'linkText',
        type: 'string',
        description: 'Text to display in the link',
        required: true,
      },
      {
        name: 'href',
        type: 'string',
        description: 'Destination URL',
        required: true,
      },
    ],
    examples: [
      {
        title: 'Inline Link',
        code: `<a href="#" class="kds-link kds-link-inline kds-link-md" role="link" aria-label="Link">
  Link
</a>`,
        description: 'Inline link appears within running text, such as within a sentence. Use kds-link-inline variant. Do not use icons.',
      },
      {
        title: 'Standalone Link with Icon',
        code: `<a href="#" class="kds-link kds-link-standalone kds-link-md" role="link" aria-label="Link">
  <span>Link</span>
  <i class="ri-arrow-right-line"></i>
</a>`,
        description: 'Standalone link appears on its own, may be used after a descriptive sentence or as part of a list. Can include an icon (typically right arrow).',
      },
      {
        title: 'Link Sizes',
        code: `<!-- Small link -->
<a href="#" class="kds-link kds-link-inline kds-link-sm" role="link" aria-label="Small link">
  Small link
</a>

<!-- Medium link (default) -->
<a href="#" class="kds-link kds-link-inline kds-link-md" role="link" aria-label="Medium link">
  Medium link
</a>

<!-- Large link -->
<a href="#" class="kds-link kds-link-inline kds-link-lg" role="link" aria-label="Large link">
  Large link
</a>`,
        description: 'Links are available in three sizes: small (kds-link-sm), medium (kds-link-md), and large (kds-link-lg).',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab to focus on links, Enter to activate and navigate to destination',
      ariaLabels: [
        'Link text must clearly explain where the link goes',
        'All links should include role="link" attribute',
        'All links must include descriptive aria-label that matches or enhances link text',
        'Screen reader users often navigate pages by link text - make it understandable without surrounding context',
        'Avoid vague link labels: "Click here", "Read more", "This link"',
        'Use specific labels: "Your account", "View election results", "Register for the event"',
      ],
      screenReaderNotes: 'Screen reader users can navigate a page using link text alone. Link text must be descriptive enough to understand destination without reading surrounding content.',
    },
    relatedComponents: ['Breadcrumb', 'Button'],
  },

  // FEEDBACK & UI
  {
    name: 'Alert',
    category: 'feedback',
    description: 'Alert messages for info, warning, and error states. Two types: Global alerts (used across every page for critical/emergency information) and In-page alerts (used on single page for contextual information to help complete tasks).',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-alert--docs',
    usage: {
      whenToUse: [
        'Global alerts: for critical information or emergency notifications across entire site',
        'Global alerts: for events that affect all users site-wide',
        'In-page alerts: to notify users of errors, missing required fields, form submission issues',
        'In-page alerts: to provide important (but not critical) information to readers',
        'In-page alerts: to communicate changes in a process, missing information, required attachments',
      ],
      whenNotToUse: [
        "Don't use global alerts for information that only applies to single page/process (use in-page alerts)",
        "Don't use in-page alerts for critical information or emergencies (use global alerts)",
        "Don't overuse global alerts - limit usage and remove as soon as event ends",
      ],
      bestPractices: [
        'Choose variant that matches severity of alert (info, warning, error)',
        'Use clear and brief alert title',
        'Provide short, plain-language summary (two sentences or less)',
        'Include end date for alert if applicable',
        'Conclude with link using descriptive link text',
        'Global alerts: Keep brief so quickly readable, link to page with more info',
        'In-page alerts: Provide context to help users complete their task',
        'Global alerts: Remove as soon as event has ended',
      ],
    },
    props: [
      {
        name: 'type',
        type: '"global" | "local"',
        required: true,
        description: 'Alert type: global (across all pages, critical/emergency) or local/in-page (single page, contextual)',
      },
      {
        name: 'variant',
        type: '"info" | "warning" | "error"',
        required: true,
        description: 'Alert variant: info (blue), warning (yellow), error (red)',
      },
      {
        name: 'role',
        type: '"alert"',
        required: true,
        description: 'ARIA role for accessibility',
      },
      {
        name: 'data-controller',
        type: '"presentation"',
        required: true,
        description: 'Stimulus controller for alert presentation and dismissal',
      },
    ],
    examples: [
      {
        title: 'Global Alert - Info',
        code: `<div class="kds-alert kds-alert-global kds-alert-global-info" role="alert" data-controller="presentation">
  <div class="kds-alert-content">
    <p class="kds-alert-global-title">Alert Title</p>
    <p class="kds-alert-global-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
</div>`,
        description: 'Global alert for critical site-wide information - appears across all pages',
      },
      {
        title: 'Global Alert - Warning',
        code: `<div class="kds-alert kds-alert-global kds-alert-global-warning" role="alert" data-controller="presentation">
  <div class="kds-alert-content">
    <p class="kds-alert-global-title">Alert Title</p>
    <p class="kds-alert-global-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
</div>`,
        description: 'Global warning alert for site-wide emergency notifications',
      },
      {
        title: 'Global Alert - Error',
        code: `<div class="kds-alert kds-alert-global kds-alert-global-error" role="alert" data-controller="presentation">
  <div class="kds-alert-content">
    <p class="kds-alert-global-title">Alert Title</p>
    <p class="kds-alert-global-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
</div>`,
        description: 'Global error alert for critical system-wide issues',
      },
      {
        title: 'In-Page Alert - Info',
        code: `<div class="kds-alert kds-alert-local kds-alert-local-info" role="alert" data-controller="presentation">
  <i class="ri-information-2-line" aria-hidden="true"></i>
  <div class="kds-alert-content">
    <p class="kds-alert-local-title">Alert Title</p>
    <p class="kds-alert-local-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
  <button class="kds-alert-dismiss-button" aria-label="Close" title="Close" data-action="click->presentation#dismiss">
    <i class="ri-close-line" aria-hidden="true"></i>
  </button>
</div>`,
        description: 'In-page alert for contextual information on single page - includes icon and dismiss button',
      },
      {
        title: 'In-Page Alert - Warning',
        code: `<div class="kds-alert kds-alert-local kds-alert-local-warning" role="alert" data-controller="presentation">
  <i class="ri-alert-line" aria-hidden="true"></i>
  <div class="kds-alert-content">
    <p class="kds-alert-local-title">Alert Title</p>
    <p class="kds-alert-local-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
  <button class="kds-alert-dismiss-button" aria-label="Close" title="Close" data-action="click->presentation#dismiss">
    <i class="ri-close-line" aria-hidden="true"></i>
  </button>
</div>`,
        description: 'In-page warning for missing fields or validation issues on current page',
      },
      {
        title: 'In-Page Alert - Error',
        code: `<div class="kds-alert kds-alert-local kds-alert-local-error" role="alert" data-controller="presentation">
  <i class="ri-error-warning-line" aria-hidden="true"></i>
  <div class="kds-alert-content">
    <p class="kds-alert-local-title">Alert Title</p>
    <p class="kds-alert-local-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
  <button class="kds-alert-dismiss-button" aria-label="Close" title="Close" data-action="click->presentation#dismiss">
    <i class="ri-close-line" aria-hidden="true"></i>
  </button>
</div>`,
        description: 'In-page error for form submission issues or task-blocking problems',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab to dismiss button on in-page alerts, Enter/Space to dismiss',
      ariaLabels: [
        'Use role="alert" on container for screen reader announcement',
        'Use aria-hidden="true" on decorative icons',
        'Use aria-label="Close" on dismiss button',
        'Include descriptive title and message',
        'Choose variant (info/warning/error) that matches severity',
        'Keep message brief (two sentences or less)',
        'Provide descriptive link text when including links',
      ],
      screenReaderNotes: 'role="alert" causes immediate announcement. Icons are decorative and hidden from screen readers. Dismiss button is keyboard accessible. Global alerts persist across pages, in-page alerts are contextual to current page.',
    },
    relatedComponents: ['Icon object', 'Button'],
  },
  {
    name: 'Tag',
    category: 'feedback',
    description: 'Small elements that contain keywords to help users tell the difference between similar content. Tags may be purely informational or dismissable. Dismissable tags allow users to close or remove a tag by selecting an x button. Can use multiple tags but avoid stacking them vertically.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-tag--docs',
    usage: {
      whenToUse: [
        'For large collections of content that fits into defined categories',
        'Help users identify the most relevant content for them',
        'Label publication dates or audience types',
        'Use the close button variant when a user can remove a filter',
        'Sort and group content for comparison',
      ],
      whenNotToUse: [
        "Don't use tags for unique identifiers",
        'Tags help users to sort and group content - only useful when they help compare information',
        "Don't use if content doesn't fit into comparable categories",
      ],
      bestPractices: [
        'Provide brief, clear labels for each tag',
        "Avoid relying on color to communicate the meaning of a particular tag",
        'Can use multiple tags but avoid stacking them vertically',
        'Use dismissable tags (with close button) when users can remove filters',
        'Tags are for categorization and comparison, not unique identification',
      ],
    },
    props: [
      {
        name: 'color',
        type: "'primary' | 'secondary' | 'success' | 'error' | 'warning'",
        description: 'Color variant of the tag',
        defaultValue: 'primary',
      },
      {
        name: 'label',
        type: 'string',
        description: 'Text content of the tag',
        required: true,
      },
      {
        name: 'dismissable',
        type: 'boolean',
        description: 'Whether the tag includes a close button',
        defaultValue: 'true',
      },
    ],
    examples: [
      {
        title: 'Primary Tag (Dismissable)',
        code: `<div class="kds-tag kds-tag-primary" data-controller="presentation">
  <span>Label</span>
  <button class="kds-icon-button" data-action="click->presentation#dismiss"><i class="ri-close-line"></i></button>
</div>`,
        description: 'Primary tag with dismiss button. Uses Stimulus presentation controller for dismiss functionality.',
      },
      {
        title: 'Secondary Tag (Dismissable)',
        code: `<div class="kds-tag kds-tag-secondary" data-controller="presentation">
  <span>Label</span>
  <button class="kds-icon-button" data-action="click->presentation#dismiss"><i class="ri-close-line"></i></button>
</div>`,
        description: 'Secondary tag variant with dismiss button.',
      },
      {
        title: 'Success Tag (Dismissable)',
        code: `<div class="kds-tag kds-tag-success" data-controller="presentation">
  <span>Label</span>
  <button class="kds-icon-button" data-action="click->presentation#dismiss"><i class="ri-close-line"></i></button>
</div>`,
        description: 'Success tag variant with dismiss button.',
      },
      {
        title: 'Error Tag (Dismissable)',
        code: `<div class="kds-tag kds-tag-error" data-controller="presentation">
  <span>Label</span>
  <button class="kds-icon-button" data-action="click->presentation#dismiss"><i class="ri-close-line"></i></button>
</div>`,
        description: 'Error tag variant with dismiss button.',
      },
      {
        title: 'Warning Tag (Dismissable)',
        code: `<div class="kds-tag kds-tag-warning" data-controller="presentation">
  <span>Label</span>
  <button class="kds-icon-button" data-action="click->presentation#dismiss"><i class="ri-close-line"></i></button>
</div>`,
        description: 'Warning tag variant with dismiss button.',
      },
      {
        title: 'Informational Tag (No Dismiss Button)',
        code: `<div class="kds-tag kds-tag-primary">
  <span>Publication: 2024</span>
</div>`,
        description: 'Informational tag without dismiss button. Used for displaying non-removable information like publication dates.',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab to focus dismiss button (if present), Enter or Space to activate dismiss',
      ariaLabels: [
        'Provide brief, clear labels for each tag',
        "Avoid relying on color alone to communicate tag meaning - don't use color as the sole differentiator",
        'Ensure sufficient color contrast for tag text',
        'Dismiss buttons should include accessible labels or aria-label',
        'Consider adding visually-hidden text to dismiss buttons (e.g., "Remove filter")',
      ],
      screenReaderNotes: 'Screen readers announce tag label text. When dismissable, announce button as interactive element. Avoid relying solely on color to convey meaning.',
    },
    relatedComponents: ['Card', 'Alert'],
  },

  // CONTENT & LAYOUT
  {
    name: 'Card',
    category: 'content',
    description: 'Card component using style and formatting to draw attention to content. Each card is part of a card group; a card should never be displayed alone. Cards can be customized with images, icons, dates, and tags.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-card--docs',
    usage: {
      whenToUse: [
        'Present a group of similar links while differentiating them from one another',
        'Share featured locations with distinctive features or descriptions',
        'Use with tags for large collections that fit into categories, topics, or audiences',
        'Add date field for timely links (blog posts, events)',
        'Organize frequently used resources or documentation',
      ],
      whenNotToUse: [
        "When you don't have a compelling image or useful icon for each item (use List group instead)",
        "When you want to feature content but don't have a link destination (use image/icon object with text)",
        'When you only have one card (cards are designed for groups)',
      ],
      bestPractices: [
        'Every card must include: title, description, and link (required)',
        'Optional elements: image, icon, date, tags',
        'Cards must always be displayed in groups, never alone',
        'Provide meaningful link text',
        'If using images, include alt text',
      ],
    },
    props: [
      {
        name: 'withImage',
        type: 'boolean',
        required: false,
        description: 'Show image in the card (kds-card-img-top)',
        defaultValue: 'false',
      },
      {
        name: 'imageUrl',
        type: 'string',
        required: false,
        description: 'URL for the card media image',
      },
      {
        name: 'withIcon',
        type: 'boolean',
        required: false,
        description: 'Show icon in the card (kds-icon-object)',
        defaultValue: 'false',
      },
      {
        name: 'cardTitle',
        type: 'string',
        required: true,
        description: 'Title text for the card (h3.kds-card-title)',
      },
      {
        name: 'cardText',
        type: 'string',
        required: true,
        description: 'Body text for the card (p.kds-card-text)',
      },
      {
        name: 'linkType',
        type: "'no-link' | 'link-with-label-icon' | 'link-with-icon-only'",
        required: false,
        description: 'Type of link to display',
        defaultValue: 'link-with-label-icon',
      },
      {
        name: 'linkLabel',
        type: 'string',
        required: false,
        description: 'Label text for the card link',
        defaultValue: 'See More',
      },
      {
        name: 'withDate',
        type: 'boolean',
        required: false,
        description: 'Show date in the card header',
        defaultValue: 'false',
      },
      {
        name: 'date',
        type: 'string',
        required: false,
        description: 'Date to display in header (kds-label)',
      },
      {
        name: 'tagText',
        type: 'string',
        required: false,
        description: 'Text for the tag in header',
      },
      {
        name: 'tagColor',
        type: 'string',
        required: false,
        description: 'Color of the tag (e.g., primary)',
        defaultValue: 'primary',
      },
    ],
    examples: [
      {
        title: 'Full Card with Image, Tag, and Date',
        code: `<div class="kds-card">
  <img class="kds-card-img-top"
       src="https://example.com/image.jpg"
       alt="Cool gradient" />

  <div class="kds-card-body">
    <div class="kds-card-header">
      <span class="kds-tag kds-tag-primary">Fact of the Day</span>
      <span class="kds-label kds-label-md kds-text-normal">2025-05-20</span>
    </div>
    <h3 class="kds-card-title">
      Did You Know There is a Tunnel Under Ocean Blvd?!
    </h3>

    <p class="kds-card-text">
      The Jergins Tunnel located beneath Ocean Boulevard in Long Beach, California is a pedestrian tunnel that was built in 1927 to provide safe access from the Jergins Trust Building to the beach and the Pike amusement zone, passing under the busy thoroughfare. It was known for its ornate tile work and shops. The Jergins Tunnel was closed to the public in 1967.
    </p>

    <a href="#" class="kds-card-labeled-link" role="link" aria-label="See More">
      <span>See More</span>
      <i class="ri-arrow-right-line"></i>
    </a>
  </div>
</div>`,
        description: 'Complete card with all optional elements: image, tag, date, and labeled link',
      },
      {
        title: 'Icon Card',
        code: `<div class="kds-card">
  <div class="kds-card-body">
    <div class="kds-icon-object kds-icon-object-lg" aria-label="Hand with heart icon">
      <i class="ri-hand-heart-line"></i>
    </div>
    <h3 class="kds-card-title">
      Did You Know There is a Tunnel Under Ocean Blvd?
    </h3>

    <p class="kds-card-text">
      The Jergins Tunnel located beneath Ocean Boulevard in Long Beach, California is a pedestrian tunnel that was built in 1927 to provide safe access from the Jergins Trust Building to the beach and the Pike amusement zone, passing under the busy thoroughfare. It was known for its ornate tile work and shops. The Jergins Tunnel was closed to the public in 1967.
    </p>

    <a href="#" class="kds-card-labeled-link" role="link" aria-label="See More">
      <span>See More</span>
      <i class="ri-arrow-right-line"></i>
    </a>
  </div>
</div>`,
        description: 'Card with icon instead of image, using kds-icon-object component',
      },
      {
        title: 'Plain Card',
        code: `<div class="kds-card">
  <div class="kds-card-body">
    <h3 class="kds-card-title">
      Did You Know There is a Tunnel Under Ocean Blvd?
    </h3>

    <p class="kds-card-text">
      The Jergins Tunnel located beneath Ocean Boulevard in Long Beach, California is a pedestrian tunnel that was built in 1927 to provide safe access from the Jergins Trust Building to the beach and the Pike amusement zone, passing under the busy thoroughfare. It was known for its ornate tile work and shops. The Jergins Tunnel was closed to the public in 1967.
    </p>

    <a href="#" class="kds-card-labeled-link" role="link" aria-label="See More">
      <span>See More</span>
      <i class="ri-arrow-right-line"></i>
    </a>
  </div>
</div>`,
        description: 'Minimal card with only required elements: title, text, and link',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab to interactive elements within card (links), Enter to activate',
      ariaLabels: [
        'Use h3.kds-card-title for proper heading hierarchy',
        'Links must have role="link" and descriptive aria-label',
        'Images must have meaningful alt text',
        'Icon objects must have aria-label to describe purpose',
      ],
      screenReaderNotes: 'Card structure announced through heading hierarchy. Links provide context via aria-label. Icons are labeled for screen readers.',
    },
    relatedComponents: ['Link', 'Tag', 'Icon object', 'List group'],
  },
  {
    name: 'Accordion',
    category: 'content',
    description: 'Expandable/collapsible content sections for hiding or showing large blocks of content. Each accordion has a heading and text area. Usually seen in groups. Helps save space and reduce user overwhelm, but can obscure important information.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-accordion--docs',
    usage: {
      whenToUse: [
        'Content that is only relevant to a specific group of users',
        'Scenarios where users might choose one or two headings while ignoring others (e.g., different transportation options)',
        'Small collection of headings - more than a handful can overwhelm users',
        'When users can gather value from scanning the headings',
      ],
      whenNotToUse: [
        'Avoid using accordions to organize all of your content',
        'Do not put critical information in an accordion',
        'Do not use if text needs to be searchable online (harder for search engines)',
        'Avoid if users need to compare content across multiple sections',
      ],
      bestPractices: [
        'Use short and descriptive headings that are easy to compare',
        'Keep accordion groups relatively small for easy scanning',
        "Don't rely solely on accordions - pair with other components",
        'Verify heading hierarchy is correct on the page',
        'Make headings specific enough that users know what to expect when expanded',
      ],
    },
    props: [
      {
        name: 'id',
        type: 'string',
        required: true,
        description: 'Unique identifier for the accordion container',
      },
      {
        name: 'data-bs-toggle',
        type: '"collapse"',
        required: true,
        description: 'Bootstrap collapse toggle attribute on button',
      },
      {
        name: 'aria-expanded',
        type: 'boolean',
        required: true,
        description: 'Indicates whether accordion panel is expanded',
      },
      {
        name: 'aria-controls',
        type: 'string',
        required: true,
        description: 'ID of the controlled collapse element',
      },
    ],
    examples: [
      {
        title: 'Multi-Panel Accordion',
        code: `<div class="kds-accordion" id="accordionPanelsStayOpenExample">
  <div class="kds-accordion-item">
    <h2 class="kds-accordion-header" id="panelsStayOpen-headingOne">
      <button class="kds-accordion-button" type="button" data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne">
        Different Sizes of Infinity
      </button>
    </h2>
    <div id="panelsStayOpen-collapseOne" class="kds-accordion-collapse collapse show"
         aria-labelledby="panelsStayOpen-headingOne">
      <div class="kds-accordion-body">
        Mathematics has shown that the concept of 'infinity' isn't monolithic; there are actually different,
        distinct sizes of infinity. It's been proven that the infinity of all points on a continuous line (the
        real numbers) is fundamentally 'larger' than the infinity of all whole numbers (1, 2, 3...), even though
        both sets go on forever without end.
      </div>
    </div>
  </div>
  <div class="kds-accordion-item">
    <h2 class="kds-accordion-header" id="panelsStayOpen-headingTwo">
      <button class="kds-accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo">
        Looking Back in Time
      </button>
    </h2>
    <div id="panelsStayOpen-collapseTwo" class="kds-accordion-collapse collapse"
         aria-labelledby="panelsStayOpen-headingTwo">
      <div class="kds-accordion-body">
        Because light travels at a vast but finite speed, we never see the universe as it exists right now. When
        we observe distant stars or galaxies, we are actually seeing them as they were when the light began its
        journey. Looking at the Andromeda Galaxy, 2.5 million light-years away, means we see it as it appeared
        2.5 million years in the past. Essentially, telescopes act as time machines, allowing us to witness
        cosmic history.
      </div>
    </div>
  </div>
  <div class="kds-accordion-item">
    <h2 class="kds-accordion-header" id="panelsStayOpen-headingThree">
      <button class="kds-accordion-button collapsed" type="button" data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree">
        Earth's Protective Shield
      </button>
    </h2>
    <div id="panelsStayOpen-collapseThree" class="kds-accordion-collapse collapse"
         aria-labelledby="panelsStayOpen-headingThree">
      <div class="kds-accordion-body">
        Deep beneath our feet, the churning motion of molten iron in Earth's liquid outer core acts like a giant
        dynamo, generating our planet's magnetic field. This invisible field extends far into space, forming a
        protective shield (the magnetosphere) that deflects the majority of harmful charged particles streaming
        from the sun (the solar wind). Without this geologically generated shield, solar radiation would strip
        away our atmosphere and make surface life impossible.
      </div>
    </div>
  </div>
</div>`,
        description: 'Full accordion with three panels using Bootstrap collapse, kds-accordion classes',
      },
      {
        title: 'Single Accordion Item',
        code: `<div class="kds-accordion-item">
  <h2 class="kds-accordion-header" id="heading-example">
    <button class="kds-accordion-button" type="button" data-bs-toggle="collapse"
            data-bs-target="#collapse-example" aria-expanded="true"
            aria-controls="collapse-example">
      Panel Title
    </button>
  </h2>
  <div id="collapse-example" class="kds-accordion-collapse collapse show"
       aria-labelledby="heading-example">
    <div class="kds-accordion-body">
      Panel content goes here.
    </div>
  </div>
</div>`,
        description: 'Single accordion panel structure',
      },
    ],
    accessibility: {
      keyboardSupport: 'Enter/Space to toggle accordion panels, Tab to navigate between buttons',
      ariaLabels: [
        'Use aria-expanded on accordion buttons (true when open, false when closed)',
        'Use aria-controls to associate button with collapse content',
        'Use aria-labelledby to associate collapse with heading',
        'Wrap button in h2/h3 for proper heading hierarchy',
      ],
      screenReaderNotes: 'Expanded/collapsed state announced via aria-expanded. Use semantic heading elements for panel titles.',
    },
    relatedComponents: ['Button', 'Card'],
  },
  {
    name: 'List group',
    category: 'content',
    description: 'Vertically stacked list of links for highlighting related content. Can be displayed in one or two columns. Each list item must include a title, link destination, and end link icon. Optional elements include leading icon, pretitle, and description.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-list-group--docs',
    usage: {
      whenToUse: [
        'Highlight links based on category, subject, or audience',
        'Provide supplementary navigation',
        'Display a curated list of related resources or pages',
      ],
      whenNotToUse: [
        'Avoid list groups for unordered (bulleted) lists within running copy',
        'List groups are designed as a separate component, not inline content',
        'Only use a list group when each list item has a link',
        "Don't use for non-clickable list items (use standard HTML lists instead)",
      ],
      bestPractices: [
        'Each list item must include: title, link destination, and end link icon',
        'All links must have meaningful link text',
        'Use leading icons to provide visual categorization',
        'Use pretitle for additional context or categorization',
        'Use help text (description) to provide more detail about the destination',
        'End adornment icon is required (typically ri-arrow-right-line or ri-external-link-line)',
      ],
    },
    props: [
      {
        name: 'hasPretitle',
        type: 'boolean',
        description: 'Whether to show pretitle above the title',
        defaultValue: 'false',
      },
      {
        name: 'pretitleText',
        type: 'string',
        description: 'Text content for the pretitle',
        required: false,
      },
      {
        name: 'iconType',
        type: "'ri-arrow-right-line' | 'ri-external-link-line'",
        description: 'End adornment icon type (required link indicator)',
        defaultValue: 'ri-arrow-right-line',
      },
      {
        name: 'twoColumnLayout',
        type: 'boolean',
        description: 'Display list group in two-column layout',
        defaultValue: 'false',
      },
      {
        name: 'showAvatar',
        type: 'boolean',
        description: 'Show avatar/leading icon',
        defaultValue: 'false',
      },
      {
        name: 'showHelpText',
        type: 'boolean',
        description: 'Show help text (description) below title',
        defaultValue: 'false',
      },
      {
        name: 'helpText',
        type: 'string',
        description: 'Description text content below title',
        required: false,
      },
    ],
    examples: [
      {
        title: 'List Group with Leading Icons, Pretitles, and Descriptions',
        code: `<div class="kds-list-group-container">
  <ul class="kds-list-group">
    <li class="kds-list-group-item">
      <a href="#">
        <i data-list-item-type="start-adornment" class="ri-drinks-2-line"></i>
        <div class="kds-list-group-item-content">
          <span class="kds-list-group-item-pretitle">Pretitle</span>
          <span>Milk Shake</span>
          <p class="kds-list-group-item-help-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget volutpat lacus. Nam fermentum augue at aliquet feugiat. Nunc faucibus odio tortor, eu laoreet risus mattis iaculis.</p>
        </div>
        <i data-list-item-type="end-adornment" class="ri-arrow-right-line"></i>
      </a>
    </li>
    <li class="kds-list-group-item">
      <a href="#">
        <i data-list-item-type="start-adornment" class="ri-cup-line"></i>
        <div class="kds-list-group-item-content">
          <span class="kds-list-group-item-pretitle">Pretitle</span>
          <span>Coffee</span>
          <p class="kds-list-group-item-help-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget volutpat lacus. Nam fermentum augue at aliquet feugiat. Nunc faucibus odio tortor, eu laoreet risus mattis iaculis.</p>
        </div>
        <i data-list-item-type="end-adornment" class="ri-arrow-right-line"></i>
      </a>
    </li>
    <li class="kds-list-group-item">
      <a href="#">
        <i data-list-item-type="start-adornment" class="ri-bowl-line"></i>
        <div class="kds-list-group-item-content">
          <span class="kds-list-group-item-pretitle">Pretitle</span>
          <span>Ramen ラーメン</span>
          <p class="kds-list-group-item-help-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget volutpat lacus. Nam fermentum augue at aliquet feugiat. Nunc faucibus odio tortor, eu laoreet risus mattis iaculis.</p>
        </div>
        <i data-list-item-type="end-adornment" class="ri-arrow-right-line"></i>
      </a>
    </li>
  </ul>
</div>`,
        description: 'Complete list group with leading icons (start-adornment), pretitles, titles, descriptions (help-text), and end link icons (end-adornment).',
      },
      {
        title: 'Simple List Group (Title and Link Icon Only)',
        code: `<div class="kds-list-group-container">
  <ul class="kds-list-group">
    <li class="kds-list-group-item">
      <a href="#">
        <div class="kds-list-group-item-content">
          <span>Apply for Benefits</span>
        </div>
        <i data-list-item-type="end-adornment" class="ri-arrow-right-line"></i>
      </a>
    </li>
    <li class="kds-list-group-item">
      <a href="#">
        <div class="kds-list-group-item-content">
          <span>Check Application Status</span>
        </div>
        <i data-list-item-type="end-adornment" class="ri-arrow-right-line"></i>
      </a>
    </li>
    <li class="kds-list-group-item">
      <a href="#">
        <div class="kds-list-group-item-content">
          <span>Find Local Services</span>
        </div>
        <i data-list-item-type="end-adornment" class="ri-arrow-right-line"></i>
      </a>
    </li>
  </ul>
</div>`,
        description: 'Minimal list group with only required elements: title and end link icon. Leading icons, pretitles, and help text are optional.',
      },
      {
        title: 'List Group with External Link Icons',
        code: `<div class="kds-list-group-container">
  <ul class="kds-list-group">
    <li class="kds-list-group-item">
      <a href="https://example.com" target="_blank">
        <div class="kds-list-group-item-content">
          <span>External Resource</span>
        </div>
        <i data-list-item-type="end-adornment" class="ri-external-link-line"></i>
      </a>
    </li>
    <li class="kds-list-group-item">
      <a href="https://example.org" target="_blank">
        <div class="kds-list-group-item-content">
          <span>Partner Website</span>
        </div>
        <i data-list-item-type="end-adornment" class="ri-external-link-line"></i>
      </a>
    </li>
  </ul>
</div>`,
        description: 'Use ri-external-link-line icon for external links instead of ri-arrow-right-line.',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab through interactive list items, Enter to activate links',
      ariaLabels: [
        'Use semantic <ul> element for list structure',
        'Each list item must be an <li> element',
        'All links must have meaningful link text that describes the destination',
        'If using external links, consider adding aria-label to indicate "Opens in new window"',
        'Leading icons (start-adornment) should include aria-hidden="true" as they are decorative',
        'End icons (end-adornment) should include aria-hidden="true" as link text conveys the action',
      ],
      screenReaderNotes: 'Screen readers announce list structure (number of items) and each link. Use meaningful link text so users can understand destinations without visual context.',
    },
    relatedComponents: ['Menu list', 'Link', 'Card'],
  },
  {
    name: 'Footer',
    category: 'content',
    description: 'Page footer appearing at the bottom of every page. Includes logo, up to 3 lists of links, and copyright banner with policy links. Required on all pages throughout web app or site.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-footer--docs',
    usage: {
      whenToUse: [
        'Required on every page throughout the site',
        'Provide consistent site-wide navigation',
        'Display copyright and legal information',
        'Link to accessibility, privacy, and policy pages',
      ],
      whenNotToUse: [
        'The footer is required on all pages - should never be removed',
      ],
      bestPractices: [
        'Use clear, descriptive link text',
        'Group similar links under clear headings for screen reader structure',
        'Include Commonwealth of Pennsylvania logo',
        'Maintain consistent footer across all pages',
        'Include standard policy links: Accessibility, Privacy & Disclaimers, Translation Disclaimer, Security',
      ],
    },
    examples: [
      {
        title: 'Complete Footer',
        code: `<footer class="kds-footer">
  <div class="d-flex flex-wrap justify-content-between gap-5 px-2">
    <div>
      <img class="kds-footer-logo" src="static/media/copa-logo.1be43736.svg" />
    </div>
    <div class="d-flex flex-wrap gap-5">
      <ul class="list-unstyled">
        <li class="pb-2 kds-title kds-title-sm kds-text-bold kds-text-uppercase kds-text-spacing-sm">Section Label 1</li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 1</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 2</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 3</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 4</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 5</a></li>
      </ul>

      <ul class="list-unstyled">
        <li class="pb-2 kds-title kds-title-sm kds-text-bold kds-text-uppercase kds-text-spacing-sm">Section Label 2</li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 1</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 2</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 3</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 4</a></li>
        <li class="py-2"><a href="#" class="kds-label kds-label-lg">Placeholder link 5</a></li>
      </ul>
    </div>
  </div>

  <div class="kds-footer-copyright-banner px-2">
    <p class="kds-footer-copyright-banner-text">Copyright © 2025 Commonwealth of Pennsylvania. All rights reserved.</p>

    <ul class="kds-footer-copyright-banner-links">
      <li><a href="#">Accessibility</a></li>
      <li><a href="#">Privacy & Disclaimers</a></li>
      <li><a href="#">Translation Disclaimer</a></li>
      <li><a href="#">Security</a></li>
    </ul>
  </div>
</footer>`,
        description: 'Full footer with logo, 2 link sections, and copyright banner with policy links',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab to navigate through footer links, Enter to activate',
      ariaLabels: [
        'Use <footer> semantic element',
        'Group similar links under clear headings (kds-title)',
        'Use descriptive link text - avoid "click here" or vague labels',
        'Ensure sufficient color contrast for text and links',
        'Use list-unstyled class with proper list structure (ul/li)',
      ],
      screenReaderNotes: 'Screen readers announce footer landmark. Section headings provide structure for navigation. Links are announced with their descriptive text.',
    },
    relatedComponents: ['Link', 'Navbar', 'Typography'],
  },

  // DATA DISPLAY
  {
    name: 'Table',
    category: 'data',
    description: 'Simple grid that displays data in a structured format using numbers, short sentences, phrases, or other data points. Helps users find specific information and compare content across columns and rows.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-table--docs',
    usage: {
      whenToUse: [
        'Display data simply in a structured format',
        'Compare content across columns and rows',
        'Structure short bits of content to be visually scannable',
        'Help users find specific information (e.g., office addresses and hours)',
        'For large data sets, consider using multiple tables with clear headings',
      ],
      whenNotToUse: [
        'Avoid tables if you have cells with long written sections or paragraph-length information',
        'Do not use tables to create layouts for web pages - use layout grid instead',
        'If your table includes paragraph-length information, consider another format',
      ],
      bestPractices: [
        'A table needs a clear header that gives the user enough context to understand the contents',
        'Use brief, clear labels for columns and rows',
        'Follow plain language best practices',
        'Use th elements for headers with scope attribute',
        'First column can be used as row headers with scope="row"',
        'Include a descriptive table title using h2.kds-table-title',
        'Keep cell content short - avoid long paragraphs',
      ],
    },
    props: [
      {
        name: 'headers',
        type: 'string[]',
        description: 'Column headers for the table',
        required: true,
      },
      {
        name: 'rows',
        type: 'array[]',
        description: 'Table rows data',
        required: true,
      },
      {
        name: 'firstColumnAsHeader',
        type: 'boolean',
        description: 'Renders the first column as header cells (th with scope="row")',
        defaultValue: 'false',
      },
      {
        name: 'firstRowAsHeader',
        type: 'boolean',
        description: 'Controls the visibility of the table header (thead)',
        defaultValue: 'true',
      },
      {
        name: 'title',
        type: 'string',
        description: 'Title for the table',
        required: false,
      },
      {
        name: 'showTitle',
        type: 'boolean',
        description: 'Controls the visibility of the table title',
        defaultValue: 'false',
      },
    ],
    examples: [
      {
        title: 'Table with Title and Row Headers',
        code: `<table class="kds-table">
  <h2 class="kds-table-title">Financial Performance</h2>
  <thead>
    <tr>
      <th>Quarter</th>
      <th>Revenue</th>
      <th>Expenses</th>
      <th>Profit</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Q1 2024</th>
      <td>$100,000</td>
      <td>$80,000</td>
      <td>$20,000</td>
    </tr>
    <tr>
      <th scope="row">Q2 2024</th>
      <td>$120,000</td>
      <td>$85,000</td>
      <td>$35,000</td>
    </tr>
    <tr>
      <th scope="row">Q3 2024</th>
      <td>$150,000</td>
      <td>$95,000</td>
      <td>$55,000</td>
    </tr>
  </tbody>
</table>`,
        description: 'Table with descriptive title (h2.kds-table-title), column headers in thead, and first column as row headers (th with scope="row"). Data cells use td elements.',
      },
      {
        title: 'Simple Table without Title',
        code: `<table class="kds-table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Email</th>
      <th>Phone</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Smith</td>
      <td>john@example.com</td>
      <td>(555) 123-4567</td>
    </tr>
    <tr>
      <td>Jane Doe</td>
      <td>jane@example.com</td>
      <td>(555) 987-6543</td>
    </tr>
  </tbody>
</table>`,
        description: 'Simple table without title. Uses thead for column headers and tbody for data rows. All cells are td elements.',
      },
      {
        title: 'Table with Caption',
        code: `<table class="kds-table">
  <caption>Office Locations and Hours</caption>
  <thead>
    <tr>
      <th>Location</th>
      <th>Address</th>
      <th>Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Harrisburg Office</th>
      <td>123 State St, Harrisburg, PA</td>
      <td>Mon-Fri 9am-5pm</td>
    </tr>
    <tr>
      <th scope="row">Philadelphia Office</th>
      <td>456 Market St, Philadelphia, PA</td>
      <td>Mon-Fri 8am-6pm</td>
    </tr>
  </tbody>
</table>`,
        description: 'Table using standard HTML caption element for accessibility. First column as row headers with scope="row".',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab through interactive table elements (if table contains links or buttons)',
      ariaLabels: [
        'Use semantic <table> element',
        'Use <th> elements for all headers (column and row headers)',
        'Use scope="col" for column headers (default for th in thead)',
        'Use scope="row" for row headers (when first column is a header)',
        'Provide table context with <caption> element or h2.kds-table-title',
        'Use <thead> for table header rows',
        'Use <tbody> for table body rows',
        'Brief, clear labels for columns and rows following plain language',
      ],
      screenReaderNotes: 'Screen readers announce row and column headers when navigating table cells. Proper use of th with scope attribute helps screen reader users understand table structure and relationships.',
    },
    relatedComponents: ['List group', 'Typography'],
  },
  {
    name: 'Typography',
    category: 'content',
    description: 'Text styling using Plus Jakarta Sans and Zilla Slab fonts',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-typography--docs',
    accessibility: {
      ariaLabels: ['Maintain proper heading hierarchy', 'Ensure minimum 16px font size for body text', 'Meet color contrast ratios'],
    },
  },
  {
    name: 'Icon object',
    category: 'ui',
    description: 'Icon component using Remix Icons (https://remixicon.com/). Simple, easily graspable way to add visual emphasis, signal actions, or indicate feedback state while reducing cognitive load. Available in small and large sizes.',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-icon-object--docs',
    usage: {
      whenToUse: [
        'To draw attention to actions - combine with text to inform users about performing an action',
        'To help readers find key information - use as scannable visual indicators (phone number, email)',
        'To enhance actionable targets - great for touch/click targets (menu, sharing)',
        'For common actions like opening menus or sharing content',
      ],
      whenNotToUse: [
        "When meaning is ambiguous - use icons conventionally only, add text if unclear",
        "To compensate for page structure - fix content placement instead of using icons",
        "For illustrative artwork - use illustrations instead, not functional icons",
        "As sole indicator of meaning - always combine with text",
      ],
      bestPractices: [
        'Combine icons with text to improve usability',
        'Be consistent with icon meaning throughout site/app',
        'Use icons in common or conventional ways only',
        'When interactive, combine with other components (Button, Link)',
        'Hide decorative icons from screen readers with aria-hidden="true"',
        'Provide aria-label for meaningful/functional icons',
        'Establish reliable relationship between icon and specific concept',
        'Use consistent set of icons for familiar look and feel',
      ],
    },
    props: [
      {
        name: 'size',
        type: "'sm' | 'lg'",
        required: false,
        description: 'Icon size: small (kds-icon-object-sm) or large (kds-icon-object-lg)',
        defaultValue: 'sm',
      },
      {
        name: 'icon',
        type: 'string',
        required: true,
        description: 'Remix Icon class name (e.g., ri-hand-heart-line)',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        required: false,
        description: 'Descriptive label for screen readers (required for functional icons)',
      },
    ],
    examples: [
      {
        title: 'Small Icon',
        code: `<div class="kds-icon-object kds-icon-object-sm" aria-label="Hand with heart icon">
  <i class="ri-hand-heart-line"></i>
</div>`,
        description: 'Small icon with aria-label for accessibility',
      },
      {
        title: 'Large Icon',
        code: `<div class="kds-icon-object kds-icon-object-lg" aria-label="Hand with heart icon">
  <i class="ri-hand-heart-line"></i>
</div>`,
        description: 'Large icon with aria-label for accessibility',
      },
      {
        title: 'Decorative Icon (Hidden from Screen Readers)',
        code: `<a href="https://twitter.com/example">
  <i class="ri-arrow-forward-line" aria-hidden="true" role="img"></i>
  Twitter account
</a>`,
        description: 'Icon combined with text, hidden from screen readers as redundant',
      },
    ],
    accessibility: {
      keyboardSupport: 'Icons themselves are not interactive - keyboard support depends on parent component (Button, Link, etc.)',
      ariaLabels: [
        'Use aria-hidden="true" and role="img" for decorative/redundant icons',
        'Provide aria-label for functional/meaningful icons',
        'Ensure icons are not the only indicator of meaning - combine with text',
        'When interactive, implement within functional component (Button, Link)',
        'Decorative icons in links/buttons should be hidden if text is present',
      ],
      screenReaderNotes: 'Functional icons announced via aria-label. Decorative icons with aria-hidden="true" are skipped. Icons combined with text provide redundant visual emphasis.',
    },
    relatedComponents: ['Button', 'Link', 'Alert', 'Card'],
  },
];

export function getKeystoneComponent(name: string): KeystoneComponent | undefined {
  return keystoneComponents.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  );
}

export function listKeystoneComponents(category?: string): KeystoneComponent[] {
  if (!category || category === 'all') {
    return keystoneComponents;
  }
  return keystoneComponents.filter((c) => c.category === category);
}

export function getKeystoneCategories(): string[] {
  const categories = new Set(keystoneComponents.map((c) => c.category));
  return Array.from(categories).sort();
}
```

## File 2: src/keystone/color-tokens.ts

**Purpose:** Color token definitions and management

```typescript
// Keystone Design System Color Tokens
// Source: Official Keystone Design System (KDS) v2.0.1
// Built on Bootstrap, WCAG 2.1 AA compliant

export interface ColorToken {
  name: string;
  value: string;
  rgb: string;
  category: string;
  usage: string;
  mode: 'light' | 'dark';
  wcagCompliant?: boolean;
}

export const keystoneColorTokens: ColorToken[] = [
  // PRIMARY COLORS - LIGHT MODE
  {
    name: 'primary',
    value: '#00629E',
    rgb: 'rgb(0, 98, 158)',
    category: 'primary',
    usage: 'Primary brand color, key UI elements',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-primary',
    value: '#FFFFFF',
    rgb: 'rgb(255, 255, 255)',
    category: 'primary',
    usage: 'Text/icons on primary background',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'primary-container',
    value: '#CFE5FF',
    rgb: 'rgb(207, 229, 255)',
    category: 'primary',
    usage: 'Container backgrounds for primary elements',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-primary-container',
    value: '#001D34',
    rgb: 'rgb(0, 29, 52)',
    category: 'primary',
    usage: 'Text on primary container',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'primary-fixed',
    value: '#CFE5FF',
    rgb: 'rgb(207, 229, 255)',
    category: 'primary',
    usage: 'Fixed primary color across themes',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-primary-fixed',
    value: '#001D34',
    rgb: 'rgb(0, 29, 52)',
    category: 'primary',
    usage: 'Text on fixed primary',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'primary-fixed-dim',
    value: '#9ACBFF',
    rgb: 'rgb(154, 203, 255)',
    category: 'primary',
    usage: 'Dimmed primary fixed color',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-primary-fixed-variant',
    value: '#004A78',
    rgb: 'rgb(0, 74, 120)',
    category: 'primary',
    usage: 'Variant text on fixed primary',
    mode: 'light',
    wcagCompliant: true,
  },

  // PRIMARY COLORS - DARK MODE
  {
    name: 'primary',
    value: '#9ACBFF',
    rgb: 'rgb(154, 203, 255)',
    category: 'primary',
    usage: 'Primary brand color, key UI elements',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-primary',
    value: '#003355',
    rgb: 'rgb(0, 51, 85)',
    category: 'primary',
    usage: 'Text/icons on primary background',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'primary-container',
    value: '#004A78',
    rgb: 'rgb(0, 74, 120)',
    category: 'primary',
    usage: 'Container backgrounds for primary elements',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-primary-container',
    value: '#CFE5FF',
    rgb: 'rgb(207, 229, 255)',
    category: 'primary',
    usage: 'Text on primary container',
    mode: 'dark',
    wcagCompliant: true,
  },

  // SECONDARY COLORS - LIGHT MODE
  {
    name: 'secondary',
    value: '#526070',
    rgb: 'rgb(82, 96, 112)',
    category: 'secondary',
    usage: 'Secondary UI elements, less prominent actions',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-secondary',
    value: '#FFFFFF',
    rgb: 'rgb(255, 255, 255)',
    category: 'secondary',
    usage: 'Text/icons on secondary background',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'secondary-container',
    value: '#D6E4F7',
    rgb: 'rgb(214, 228, 247)',
    category: 'secondary',
    usage: 'Container backgrounds for secondary elements',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-secondary-container',
    value: '#0F1D2A',
    rgb: 'rgb(15, 29, 42)',
    category: 'secondary',
    usage: 'Text on secondary container',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'secondary-fixed',
    value: '#D6E4F7',
    rgb: 'rgb(214, 228, 247)',
    category: 'secondary',
    usage: 'Fixed secondary color',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-secondary-fixed',
    value: '#0F1D2A',
    rgb: 'rgb(15, 29, 42)',
    category: 'secondary',
    usage: 'Text on fixed secondary',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'secondary-fixed-dim',
    value: '#BAC8DA',
    rgb: 'rgb(186, 200, 218)',
    category: 'secondary',
    usage: 'Dimmed secondary fixed color',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-secondary-fixed-variant',
    value: '#3A4857',
    rgb: 'rgb(58, 72, 87)',
    category: 'secondary',
    usage: 'Variant text on fixed secondary',
    mode: 'light',
    wcagCompliant: true,
  },

  // SECONDARY COLORS - DARK MODE
  {
    name: 'secondary',
    value: '#BAC8DA',
    rgb: 'rgb(186, 200, 218)',
    category: 'secondary',
    usage: 'Secondary UI elements',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-secondary',
    value: '#243240',
    rgb: 'rgb(36, 50, 64)',
    category: 'secondary',
    usage: 'Text/icons on secondary background',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'secondary-container',
    value: '#3A4857',
    rgb: 'rgb(58, 72, 87)',
    category: 'secondary',
    usage: 'Container backgrounds for secondary elements',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-secondary-container',
    value: '#D6E4F7',
    rgb: 'rgb(214, 228, 247)',
    category: 'secondary',
    usage: 'Text on secondary container',
    mode: 'dark',
    wcagCompliant: true,
  },

  // TERTIARY COLORS - LIGHT MODE
  {
    name: 'tertiary',
    value: '#835500',
    rgb: 'rgb(131, 85, 0)',
    category: 'tertiary',
    usage: 'Tertiary UI elements, accents',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-tertiary',
    value: '#FFFFFF',
    rgb: 'rgb(255, 255, 255)',
    category: 'tertiary',
    usage: 'Text/icons on tertiary background',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'tertiary-container',
    value: '#FFDDB4',
    rgb: 'rgb(255, 221, 180)',
    category: 'tertiary',
    usage: 'Container backgrounds for tertiary elements',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-tertiary-container',
    value: '#291800',
    rgb: 'rgb(41, 24, 0)',
    category: 'tertiary',
    usage: 'Text on tertiary container',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'tertiary-fixed',
    value: '#FFDDB4',
    rgb: 'rgb(255, 221, 180)',
    category: 'tertiary',
    usage: 'Fixed tertiary color',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-tertiary-fixed',
    value: '#291800',
    rgb: 'rgb(41, 24, 0)',
    category: 'tertiary',
    usage: 'Text on fixed tertiary',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'tertiary-fixed-dim',
    value: '#FFB954',
    rgb: 'rgb(255, 185, 84)',
    category: 'tertiary',
    usage: 'Dimmed tertiary fixed color',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-tertiary-fixed-variant',
    value: '#633F00',
    rgb: 'rgb(99, 63, 0)',
    category: 'tertiary',
    usage: 'Variant text on fixed tertiary',
    mode: 'light',
    wcagCompliant: true,
  },

  // TERTIARY COLORS - DARK MODE
  {
    name: 'tertiary',
    value: '#FFB954',
    rgb: 'rgb(255, 185, 84)',
    category: 'tertiary',
    usage: 'Tertiary UI elements, accents',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-tertiary',
    value: '#452B00',
    rgb: 'rgb(69, 43, 0)',
    category: 'tertiary',
    usage: 'Text/icons on tertiary background',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'tertiary-container',
    value: '#633F00',
    rgb: 'rgb(99, 63, 0)',
    category: 'tertiary',
    usage: 'Container backgrounds for tertiary elements',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-tertiary-container',
    value: '#FFDDB4',
    rgb: 'rgb(255, 221, 180)',
    category: 'tertiary',
    usage: 'Text on tertiary container',
    mode: 'dark',
    wcagCompliant: true,
  },

  // ERROR COLORS - LIGHT MODE
  {
    name: 'error',
    value: '#BA1A1A',
    rgb: 'rgb(186, 26, 26)',
    category: 'error',
    usage: 'Error states, destructive actions',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-error',
    value: '#FFFFFF',
    rgb: 'rgb(255, 255, 255)',
    category: 'error',
    usage: 'Text/icons on error background',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'error-container',
    value: '#FFDAD6',
    rgb: 'rgb(255, 218, 214)',
    category: 'error',
    usage: 'Container backgrounds for error elements',
    mode: 'light',
    wcagCompliant: true,
  },
  {
    name: 'on-error-container',
    value: '#410002',
    rgb: 'rgb(65, 0, 2)',
    category: 'error',
    usage: 'Text on error container',
    mode: 'light',
    wcagCompliant: true,
  },

  // ERROR COLORS - DARK MODE
  {
    name: 'error',
    value: '#FFB4AB',
    rgb: 'rgb(255, 180, 171)',
    category: 'error',
    usage: 'Error states, destructive actions',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-error',
    value: '#690005',
    rgb: 'rgb(105, 0, 5)',
    category: 'error',
    usage: 'Text/icons on error background',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'error-container',
    value: '#93000A',
    rgb: 'rgb(147, 0, 10)',
    category: 'error',
    usage: 'Container backgrounds for error elements',
    mode: 'dark',
    wcagCompliant: true,
  },
  {
    name: 'on-error-container',
    value: '#FFDAD6',
    rgb: 'rgb(255, 218, 214)',
    category: 'error',
    usage: 'Text on error container',
    mode: 'dark',
    wcagCompliant: true,
  },
];

export function getKeystoneColorToken(name: string, mode?: 'light' | 'dark'): ColorToken | undefined {
  const tokens = keystoneColorTokens.filter(
    (token) => token.name.toLowerCase() === name.toLowerCase()
  );

  if (mode) {
    return tokens.find((token) => token.mode === mode);
  }

  // Return light mode by default
  return tokens.find((token) => token.mode === 'light') || tokens[0];
}

export function listKeystoneColorTokens(category?: string, mode?: 'light' | 'dark'): ColorToken[] {
  let tokens = keystoneColorTokens;

  if (category && category !== 'all') {
    tokens = tokens.filter((token) => token.category === category);
  }

  if (mode) {
    tokens = tokens.filter((token) => token.mode === mode);
  }

  return tokens;
}

export function getKeystoneColorCategories(): string[] {
  const categories = new Set(keystoneColorTokens.map((token) => token.category));
  return Array.from(categories).sort();
}
```

## File 3: src/keystone/keystone-service.ts

**Purpose:** Service layer implementing all business logic for MCP tools

```typescript
// Keystone Design System MCP Service
// Provides MCP tools for Pennsylvania's Keystone Design System

import {
  getKeystoneComponent,
  listKeystoneComponents,
  getKeystoneCategories,
  type KeystoneComponent,
} from './components.js';
import {
  getKeystoneColorToken,
  listKeystoneColorTokens,
  getKeystoneColorCategories,
  type ColorToken,
} from './color-tokens.js';

export class KeystoneService {
  /**
   * List all Keystone components
   */
  listComponents(category?: string): {
    components: KeystoneComponent[];
    categories: string[];
    total: number;
  } {
    const components = listKeystoneComponents(category);
    const categories = getKeystoneCategories();

    return {
      components,
      categories,
      total: components.length,
    };
  }

  /**
   * Get detailed information about a specific component
   */
  getComponentInfo(componentName: string, includeExamples: boolean = true): {
    component: KeystoneComponent | null;
    error?: string;
  } {
    const component = getKeystoneComponent(componentName);

    if (!component) {
      return {
        component: null,
        error: `Component "${componentName}" not found in Keystone Design System`,
      };
    }

    // Optionally remove examples if not requested
    if (!includeExamples && component.examples) {
      const { examples, ...componentWithoutExamples } = component;
      return { component: componentWithoutExamples as KeystoneComponent };
    }

    return { component };
  }

  /**
   * Get design tokens (colors, spacing, typography, etc.)
   */
  getDesignTokens(category?: string): {
    tokens: ColorToken[];
    categories: string[];
    total: number;
  } {
    const tokens = listKeystoneColorTokens(category);
    const categories = getKeystoneColorCategories();

    return {
      tokens,
      categories,
      total: tokens.length,
    };
  }

  /**
   * Get accessibility guidelines for Keystone components
   */
  getAccessibilityGuidelines(componentName?: string): {
    guidelines: any;
    wcagLevel: string;
  } {
    if (componentName) {
      const component = getKeystoneComponent(componentName);
      if (component) {
        return {
          guidelines: component.accessibility || {},
          wcagLevel: component.wcagLevel,
        };
      }
    }

    // General accessibility guidelines
    return {
      guidelines: {
        general: [
          'All components must meet WCAG 2.1 AA standards',
          'Color contrast ratios must be at least 4.5:1 for normal text',
          'Interactive elements must be keyboard accessible',
          'Form inputs must have associated labels',
          'Images must have alt text',
          'Page structure must use semantic HTML',
        ],
        resources: [
          'https://wcmauthorguide.pa.gov/en/accessibility-best-practices.html',
          'https://www.w3.org/WAI/WCAG21/quickref/',
        ],
      },
      wcagLevel: 'AA',
    };
  }

  /**
   * Search components by keyword
   */
  searchComponents(keyword: string): {
    results: KeystoneComponent[];
    query: string;
    total: number;
  } {
    const lowerKeyword = keyword.toLowerCase();
    const allComponents = listKeystoneComponents();

    const results = allComponents.filter(
      (component) =>
        component.name.toLowerCase().includes(lowerKeyword) ||
        component.description.toLowerCase().includes(lowerKeyword) ||
        component.category.toLowerCase().includes(lowerKeyword)
    );

    return {
      results,
      query: keyword,
      total: results.length,
    };
  }

  /**
   * Get component examples with code
   */
  getComponentExamples(componentName: string): {
    examples: any[];
    error?: string;
  } {
    const component = getKeystoneComponent(componentName);

    if (!component) {
      return {
        examples: [],
        error: `Component "${componentName}" not found`,
      };
    }

    return {
      examples: component.examples || [],
    };
  }

  /**
   * Get style guide information
   */
  getStyleGuide(): {
    principles: string[];
    resources: string[];
  } {
    return {
      principles: [
        'Use Pennsylvania brand colors consistently',
        'Maintain WCAG AA accessibility standards',
        'Use clear, concise language',
        'Ensure mobile-first responsive design',
        'Follow semantic HTML structure',
        'Provide clear error messages and validation',
      ],
      resources: [
        'https://wcmauthorguide.pa.gov/en/style-guide.html',
        'https://wcmauthorguide.pa.gov/en/keystone-design-system/getting-started.html',
        'https://components.pa.gov',
      ],
    };
  }

  /**
   * Validate Keystone component usage
   */
  validateComponent(code: string): {
    valid: boolean;
    errors: string[];
    warnings: string[];
    suggestions: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // KDS is built on Bootstrap, so check for both KDS-specific and Bootstrap classes
    const hasKDSClasses = code.includes('kds-');
    const hasBootstrapClasses = /class="[^"]*\b(btn|card|nav|alert|table|form|badge|list-group|accordion|breadcrumb)\b/.test(code);
    const hasStimulusControllers = code.includes('data-controller=');
    const hasBootstrapData = code.includes('data-bs-');

    if (!hasKDSClasses && !hasBootstrapClasses) {
      warnings.push(
        'No Keystone Design System classes found. KDS uses Bootstrap classes (btn, card, etc.) and kds- prefix for custom components'
      );
    }

    // Check for Bootstrap data attributes on components that need them
    if (code.includes('kds-accordion') && !code.includes('data-bs-toggle="collapse"')) {
      errors.push('Accordion buttons require data-bs-toggle="collapse" attribute');
    }

    // Check for Stimulus.js controllers on navbar components
    if (code.includes('kds-navbar') && !hasStimulusControllers) {
      suggestions.push('Consider using Stimulus controllers (data-controller="revealable navbar") for responsive navigation');
    }

    // Check for accessibility attributes
    if (code.includes('<button') && !code.includes('aria-')) {
      suggestions.push('Consider adding ARIA labels for better accessibility');
    }

    if (code.includes('<img') && !code.includes('alt=')) {
      errors.push('Images must have alt attributes for accessibility');
    }

    if (code.includes('<input') && !code.includes('<label')) {
      errors.push('Form inputs must have associated labels');
    }

    // Check for proper ARIA on accordion elements
    if (code.includes('kds-accordion-button') && !code.includes('aria-expanded')) {
      errors.push('Accordion buttons require aria-expanded attribute');
    }

    if (code.includes('kds-accordion-button') && !code.includes('aria-controls')) {
      errors.push('Accordion buttons require aria-controls attribute to associate with collapse panel');
    }

    if (code.includes('kds-accordion-collapse') && !code.includes('aria-labelledby')) {
      warnings.push('Accordion panels should use aria-labelledby to reference their heading');
    }

    // Check for proper ARIA on alert elements
    if (code.includes('kds-alert') && !code.includes('role="alert"')) {
      errors.push('Alert components require role="alert" for accessibility');
    }

    if (code.includes('kds-alert') && !code.includes('data-controller="presentation"')) {
      warnings.push('Alert components should use data-controller="presentation" for Stimulus functionality');
    }

    if (code.includes('kds-alert-local') && !code.includes('kds-alert-dismiss-button')) {
      suggestions.push('In-page alerts (kds-alert-local) typically include a dismiss button with aria-label="Close"');
    }

    if (code.includes('class="ri-') && !code.includes('aria-hidden="true"')) {
      warnings.push('Remix Icons should include aria-hidden="true" as they are decorative');
    }

    if (code.includes('kds-alert-dismiss-button') && !code.includes('aria-label')) {
      errors.push('Alert dismiss buttons require aria-label for screen reader users');
    }

    // Check for proper breadcrumb structure
    if (code.includes('kds-breadcrumb')) {
      if (!code.includes('aria-label="Breadcrumb"')) {
        errors.push('Breadcrumb nav must include aria-label="Breadcrumb"');
      }

      if (!code.includes('<ol>')) {
        errors.push('Breadcrumb must use <ol> for ordered list structure');
      }

      if (code.includes('kds-breadcrumb-current') && !code.includes('aria-current="page"')) {
        errors.push('Current breadcrumb item must include aria-current="page"');
      }

      if (!code.includes('kds-breadcrumb-item')) {
        warnings.push('Breadcrumb items should use kds-breadcrumb-item class');
      }
    }

    // Check for button best practices
    if (code.includes('kds-button')) {
      const hasVariantClass = /kds-button-(filled|outlined|text)/.test(code);
      if (!hasVariantClass) {
        warnings.push('Button should specify a variant: kds-button-filled, kds-button-outlined, or kds-button-text');
      }

      // Check for icon-only buttons
      const hasOnlyIcon = code.includes('class="ri-') && !code.includes('<span>');
      if (hasOnlyIcon && !code.includes('aria-label')) {
        errors.push('Icon-only buttons must include aria-label to describe the action');
      }

      // Check button type
      if (code.includes('<button') && !code.includes('type=')) {
        suggestions.push('Specify button type attribute (button, submit, or reset)');
      }
    }

    // Check for card component structure
    if (code.includes('kds-card')) {
      // Check for required elements
      if (!code.includes('kds-card-title')) {
        errors.push('Card must include kds-card-title (h3 element)');
      }

      if (!code.includes('kds-card-text')) {
        errors.push('Card must include kds-card-text (p element)');
      }

      if (!code.includes('kds-card-labeled-link') && !code.includes('<a')) {
        warnings.push('Card should include a link (kds-card-labeled-link)');
      }

      // Check for proper structure
      if (!code.includes('kds-card-body')) {
        errors.push('Card must include kds-card-body wrapper');
      }

      // Check for link accessibility
      if (code.includes('kds-card-labeled-link')) {
        if (!code.includes('role="link"')) {
          errors.push('Card links should include role="link"');
        }

        if (!code.includes('aria-label')) {
          errors.push('Card links must include descriptive aria-label');
        }
      }

      // Check for image alt text
      if (code.includes('kds-card-img-top') && !code.includes('alt=')) {
        errors.push('Card images must include meaningful alt text');
      }

      // Check for icon object accessibility
      if (code.includes('kds-icon-object') && !code.includes('aria-label')) {
        errors.push('Icon objects in cards must include aria-label');
      }

      // Suggest proper heading usage
      if (code.includes('kds-card-title') && !code.includes('<h3')) {
        suggestions.push('Card titles should use h3 element for proper heading hierarchy');
      }
    }

    // Check for checkbox component structure
    if (code.includes('kds-checkbox')) {
      // Check for form control wrapper
      if (!code.includes('kds-form-control')) {
        warnings.push('Checkbox should be wrapped in kds-form-control');
      }

      // Check for label association
      if (!code.includes('kds-label')) {
        errors.push('Checkbox must be wrapped in label.kds-label');
      }

      if (!code.includes('kds-label-text')) {
        errors.push('Checkbox must have span.kds-label-text for label text');
      }

      // Check for ARIA attributes
      if (!code.includes('aria-labelledby')) {
        errors.push('Checkbox must include aria-labelledby to associate with label');
      }

      // Check for helper text association
      if (code.includes('kds-label-text-alt') && !code.includes('aria-describedby')) {
        errors.push('When helper text is present, checkbox must use aria-describedby');
      }

      // Check for error state attributes
      if (code.includes('kds-checkbox-error') && !code.includes('aria-invalid="true"')) {
        errors.push('Error state checkboxes must include aria-invalid="true"');
      }

      // Check for icon accessibility
      if (code.includes('kds-icon') && !code.includes('aria-label')) {
        errors.push('Status icons (warning/error) must include aria-label');
      }

      // Check for disabled state
      if (code.includes('kds-disabled') && !code.includes('disabled')) {
        warnings.push('Disabled checkboxes should have disabled attribute on input');
      }
    }

    // Check for select component structure
    if (code.includes('kds-select')) {
      // Check for form control wrapper
      if (!code.includes('kds-form-control')) {
        warnings.push('Select box should be wrapped in label.kds-form-control');
      }

      // Check for label
      if (!code.includes('kds-label')) {
        errors.push('Select box must have kds-label wrapper for label text');
      }

      if (!code.includes('kds-label-text')) {
        errors.push('Select box must have span.kds-label-text for label text');
      }

      // Check for ARIA attributes
      if (!code.includes('aria-labelledby')) {
        errors.push('Select element must include aria-labelledby to associate with label');
      }

      // Check for help text association
      if (code.includes('kds-label-text-alt') && !code.includes('aria-describedby')) {
        errors.push('When help text is present, select must use aria-describedby');
      }

      // Check for error state attributes
      if (code.includes('kds-select-error') && !code.includes('aria-invalid="true"')) {
        errors.push('Error state selects must include aria-invalid="true"');
      }

      // Check for warning/error state wrapper
      if ((code.includes('kds-select-warning') || code.includes('kds-select-error')) && !code.includes('kds-input-icon')) {
        errors.push('Warning and error state selects must be wrapped in div.kds-input-icon with status icon');
      }

      // Check for warning/error icons
      if ((code.includes('kds-text-warning') || code.includes('kds-text-error')) && code.includes('kds-icon')) {
        if (!code.includes('aria-label')) {
          errors.push('Status icons (warning/error) must include aria-label');
        }
      }

      // Check for placeholder option
      if (code.includes('<option')) {
        if (!code.includes('disabled selected')) {
          suggestions.push('Consider including a disabled, selected placeholder as the first option for better UX');
        }
      }

      // Validate help text structure for warning/error
      if (code.includes('kds-label-text-alt')) {
        // Check for proper icon
        if (code.includes('kds-text-warning') && !code.includes('ri-alert-fill')) {
          suggestions.push('Warning state typically uses ri-alert-fill icon');
        }

        if (code.includes('kds-text-error') && !code.includes('ri-error-warning-fill')) {
          suggestions.push('Error state typically uses ri-error-warning-fill icon');
        }
      }

      // Check for option values
      if (code.includes('<option') && !code.includes('value=')) {
        warnings.push('Select options should include value attribute for proper form submission');
      }

      // Check that select is not multiple (this is single-select only)
      if (code.includes('multiple')) {
        warnings.push('Single-select component detected with multiple attribute. Use checkbox group for multi-select.');
      }

      // Suggest radio buttons for short lists
      const optionCount = (code.match(/<option/g) || []).length;
      if (optionCount <= 3 && optionCount > 0) {
        suggestions.push('For 1-2 options, consider using radio buttons instead of a select box');
      }
    }

    // Check for radio button component structure
    if (code.includes('kds-radio')) {
      // Check for form control wrapper
      if (!code.includes('kds-form-control')) {
        warnings.push('Radio button should be wrapped in kds-form-control');
      }

      // Check for label association
      if (!code.includes('kds-label')) {
        errors.push('Radio button must be wrapped in label.kds-label');
      }

      if (!code.includes('kds-label-text')) {
        errors.push('Radio button must have span.kds-label-text for label text');
      }

      // Check for ARIA attributes
      if (!code.includes('aria-labelledby')) {
        errors.push('Radio button must include aria-labelledby to associate with label');
      }

      // Check for helper text association
      if (code.includes('kds-label-text-alt') && !code.includes('aria-describedby')) {
        errors.push('When help text is present, radio button must use aria-describedby');
      }

      // Check for error state attributes
      if (code.includes('kds-radio-error') && !code.includes('aria-invalid="true"')) {
        errors.push('Error state radio buttons must include aria-invalid="true"');
      }

      // Check for warning/error icons
      if ((code.includes('kds-text-warning') || code.includes('kds-text-error')) && code.includes('kds-icon')) {
        if (!code.includes('aria-label')) {
          errors.push('Status icons (warning/error) must include aria-label');
        }
      }

      // Check for disabled state
      if (code.includes('disabled') && !code.includes('kds-disabled')) {
        suggestions.push('Consider adding kds-disabled class for consistent styling of disabled radio buttons');
      }

      // Check for radio button groups
      if (code.includes('type="radio"')) {
        // Count number of radio buttons
        const radioCount = (code.match(/type="radio"/g) || []).length;

        if (radioCount > 1) {
          // Multiple radios - should be grouped
          if (!code.includes('<fieldset')) {
            warnings.push('Radio button groups should be wrapped in <fieldset> with <legend>');
          }

          if (!code.includes('<legend')) {
            warnings.push('Radio button groups should have <legend> describing the group');
          }

          // Check for shared name attribute
          if (!code.includes('name=')) {
            errors.push('All radio buttons in a group must have the same name attribute for mutual exclusivity');
          }
        }
      }

      // Validate help text structure
      if (code.includes('kds-label-text-alt')) {
        // Check for proper icon
        if (code.includes('kds-text-warning') && !code.includes('ri-alert-fill')) {
          suggestions.push('Warning state typically uses ri-alert-fill icon');
        }

        if (code.includes('kds-text-error') && !code.includes('ri-error-warning-fill')) {
          suggestions.push('Error state typically uses ri-error-warning-fill icon');
        }
      }

      // Check label best practices
      const labelMatch = code.match(/kds-label-text">([^<]+)</);
      if (labelMatch && labelMatch[1]) {
        const labelText = labelMatch[1].trim();

        // Check for ALL CAPS
        if (labelText === labelText.toUpperCase() && labelText.length > 1) {
          warnings.push("Don't use ALL CAPS for radio button labels. Use sentence case instead.");
        }

        // Check label length (suggest keeping it short)
        const wordCount = labelText.split(/\s+/).length;
        if (wordCount > 5) {
          suggestions.push('Keep radio button labels short and meaningful - usually three words or fewer');
        }
      }
    }

    // Check for footer component structure
    if (code.includes('kds-footer')) {
      // Check for semantic footer element
      if (!code.includes('<footer')) {
        errors.push('Footer must use semantic <footer> element');
      }

      // Check for logo
      if (!code.includes('kds-footer-logo')) {
        warnings.push('Footer should include kds-footer-logo with Commonwealth of Pennsylvania logo');
      }

      // Check for copyright banner
      if (!code.includes('kds-footer-copyright-banner')) {
        errors.push('Footer must include kds-footer-copyright-banner section');
      }

      // Check for copyright text
      if (code.includes('kds-footer-copyright-banner') && !code.includes('kds-footer-copyright-banner-text')) {
        errors.push('Copyright banner must include kds-footer-copyright-banner-text with copyright notice');
      }

      // Check for policy links
      if (code.includes('kds-footer-copyright-banner') && !code.includes('kds-footer-copyright-banner-links')) {
        warnings.push('Copyright banner should include kds-footer-copyright-banner-links (Accessibility, Privacy, etc.)');
      }

      // Check for link structure
      if (code.includes('list-unstyled')) {
        if (!code.includes('kds-title')) {
          suggestions.push('Footer link sections should have kds-title headings for grouping');
        }
      }

      // Check for logo alt text
      if (code.includes('kds-footer-logo') && !code.includes('alt=')) {
        warnings.push('Footer logo should have alt text (or empty alt="" if decorative)');
      }
    }

    // Check for icon object component
    if (code.includes('kds-icon-object')) {
      // Check for size specification
      const hasSize = code.includes('kds-icon-object-sm') || code.includes('kds-icon-object-lg');
      if (!hasSize) {
        warnings.push('Icon object should specify size: kds-icon-object-sm or kds-icon-object-lg');
      }

      // Check for Remix Icon
      if (!code.includes('class="ri-')) {
        errors.push('Icon object must include Remix Icon (class starting with ri-)');
      }

      // Check for aria-label on functional icons
      const isStandalone = !code.includes('<a') && !code.includes('<button');
      if (isStandalone && !code.includes('aria-label')) {
        errors.push('Standalone icon objects must include aria-label for accessibility');
      }

      // Suggest hiding decorative icons
      const hasText = code.includes('</a>') || code.includes('</button>') || code.includes('<span');
      if (hasText && !code.includes('aria-hidden')) {
        suggestions.push('Consider using aria-hidden="true" on decorative icons when combined with text');
      }
    }

    // Check for Remix Icons usage (not in icon-object wrapper)
    if (code.includes('class="ri-') && !code.includes('kds-icon-object')) {
      // Icon used directly (like in alerts, buttons, etc.)
      const isDecorative = code.includes('<span') || code.includes('</a>') || code.includes('</button>');

      if (isDecorative && !code.includes('aria-hidden="true"')) {
        suggestions.push('Decorative icons should include aria-hidden="true" when combined with text');
      }

      if (!isDecorative && !code.includes('aria-label')) {
        warnings.push('Functional icons should include aria-label to describe their purpose');
      }
    }

    // Check for navbar/header component structure
    if (code.includes('kds-navbar') || code.includes('kds-header')) {
      // Check for header component presence (should appear with navbar)
      if (code.includes('kds-navbar') && !code.includes('kds-header')) {
        warnings.push('Navbar should be accompanied by kds-header component with Commonwealth branding');
      }

      // Check for semantic nav element
      if (code.includes('kds-navbar') && !code.includes('<nav')) {
        errors.push('Navbar must use semantic <nav> element');
      }

      // Check for Stimulus controllers on navbar
      if (code.includes('kds-navbar')) {
        if (!code.includes('data-controller="revealable navbar"') && !code.includes('data-controller="navbar revealable"')) {
          warnings.push('Navbar should use Stimulus controllers: data-controller="revealable navbar"');
        }
      }

      // Check for hamburger menu toggle button
      if (code.includes('kds-navbar-toggler')) {
        if (!code.includes('aria-expanded')) {
          errors.push('Navbar toggle button (kds-navbar-toggler) must include aria-expanded attribute');
        }

        if (!code.includes('data-action')) {
          warnings.push('Navbar toggle button should have data-action to trigger Stimulus controllers');
        }

        // Check for accessible label
        const hasVisibleText = /kds-navbar-toggler[^>]*>[\s\S]*?[A-Za-z]/.test(code);
        const hasAriaLabel = code.includes('aria-label');
        if (!hasVisibleText && !hasAriaLabel) {
          errors.push('Navbar toggle button must include visible text (e.g., "Menu") or aria-label');
        }
      }

      // Check for dropdown structure
      if (code.includes('kds-dropdown')) {
        // Check for dropdown toggle button
        if (code.includes('kds-dropdown-toggle')) {
          if (!code.includes('aria-expanded')) {
            errors.push('Dropdown toggle buttons must include aria-expanded attribute');
          }

          if (!code.includes('id=')) {
            errors.push('Dropdown toggle buttons must have id attribute for aria-labelledby association');
          }
        }

        // Check for dropdown menu aria-labelledby
        if (code.includes('kds-menu-list') && code.includes('kds-dropdown')) {
          if (!code.includes('aria-labelledby')) {
            errors.push('Dropdown menus (kds-menu-list) must include aria-labelledby to associate with toggle button');
          }
        }
      }

      // Check for search input accessibility
      if (code.includes('kds-search-input')) {
        // Check for label (must be present, even if visually hidden)
        if (!code.includes('<label')) {
          errors.push('Search input must have a <label> element (use .visually-hidden if you want to hide it visually)');
        }

        // Suggest visually-hidden class for search labels
        if (code.includes('<label') && !code.includes('visually-hidden')) {
          suggestions.push('Consider using .visually-hidden class on search labels for cleaner visual design while maintaining accessibility');
        }

        // Check for search button accessibility
        const hasSearchButton = code.includes('type="submit"') && code.includes('kds-search-input');
        if (hasSearchButton) {
          const hasIconOnly = code.includes('ri-search-line') && !/<button[^>]*>[^<]*[A-Za-z]/.test(code);
          if (hasIconOnly && !code.includes('visually-hidden') && !code.includes('aria-label')) {
            errors.push('Icon-only search buttons must include visually-hidden text (e.g., <span class="visually-hidden">Search</span>) or aria-label');
          }
        }
      }

      // Check for responsive design patterns
      if (code.includes('kds-navbar')) {
        const hasResponsiveClasses = code.includes('d-none d-md-block') || code.includes('d-md-none');
        if (!hasResponsiveClasses) {
          suggestions.push('Consider using Bootstrap responsive display classes (d-none, d-md-block, d-md-none) for mobile/desktop variants');
        }

        // Check for both desktop and mobile search if search is present
        if (code.includes('kds-search-input')) {
          const hasDesktopSearch = code.includes('d-none d-md-block');
          const hasMobileSearch = code.includes('d-md-none');

          if (hasDesktopSearch && !hasMobileSearch) {
            warnings.push('If providing desktop search (d-none d-md-block), consider adding mobile search variant (d-md-none) for consistent experience');
          }
        }
      }

      // Check for navigation list structure
      if (code.includes('kds-nav')) {
        if (!code.includes('<ul') && !code.includes('<ol')) {
          errors.push('Navigation menu (kds-nav) must use <ul> or <ol> for list structure');
        }

        if (!code.includes('kds-nav-item')) {
          warnings.push('Navigation items should use kds-nav-item class on <li> elements');
        }

        if (!code.includes('kds-nav-link')) {
          warnings.push('Navigation links should use kds-nav-link class');
        }
      }

      // Check for header image accessibility
      if (code.includes('kds-header') && code.includes('<img')) {
        if (!code.includes('alt=')) {
          errors.push('Header image must include alt attribute (e.g., alt="Commonwealth of Pennsylvania")');
        }

        // Check for aria-hidden on decorative header images
        const hasDecorativeImage = code.includes('kds-header') && code.includes('aria-hidden="true"');
        if (!hasDecorativeImage && code.includes('kds-header-text')) {
          suggestions.push('Consider using aria-hidden="true" on decorative header images when text provides the same information');
        }
      }

      // Check for official website text
      if (code.includes('kds-header') && !code.includes('Official Website')) {
        warnings.push('Header should include "Official Website of the Commonwealth of Pennsylvania" text');
      }
    }

    // Check for list group component structure
    if (code.includes('kds-list-group')) {
      // Check for container wrapper
      if (!code.includes('kds-list-group-container')) {
        warnings.push('List group should be wrapped in kds-list-group-container div');
      }

      // Check for semantic list element
      if (!code.includes('<ul') && !code.includes('<ol')) {
        errors.push('List group must use semantic <ul> or <ol> element');
      }

      // Check for list items
      if (!code.includes('kds-list-group-item')) {
        errors.push('List group must contain kds-list-group-item elements');
      }

      // Check for required content wrapper
      if (!code.includes('kds-list-group-item-content')) {
        errors.push('Each list group item must include kds-list-group-item-content wrapper');
      }

      // Check for links in list items
      if (code.includes('kds-list-group-item') && !code.includes('<a href')) {
        errors.push('Each list group item must contain a link (<a> element). List groups are for linked items only.');
      }

      // Check for required end adornment (link icon)
      if (code.includes('kds-list-group-item') && !code.includes('data-list-item-type="end-adornment"')) {
        errors.push('Each list group item must include end adornment icon (data-list-item-type="end-adornment")');
      }

      // Check for appropriate end adornment icons
      if (code.includes('data-list-item-type="end-adornment"')) {
        const hasAppropriateIcon = code.includes('ri-arrow-right-line') || code.includes('ri-external-link-line');
        if (!hasAppropriateIcon) {
          warnings.push('End adornment icons should typically be ri-arrow-right-line or ri-external-link-line');
        }
      }

      // Check for external links with appropriate icon
      if (code.includes('target="_blank"') && code.includes('ri-arrow-right-line')) {
        suggestions.push('Consider using ri-external-link-line icon for external links (target="_blank") instead of ri-arrow-right-line');
      }

      // Suggest aria-hidden for decorative icons
      if (code.includes('data-list-item-type="start-adornment"') && !code.includes('aria-hidden')) {
        suggestions.push('Leading icons (start-adornment) should include aria-hidden="true" as they are decorative');
      }

      if (code.includes('data-list-item-type="end-adornment"') && !code.includes('aria-hidden')) {
        suggestions.push('End adornment icons should include aria-hidden="true" as link text conveys the action');
      }

      // Check for meaningful link text
      const hasGenericText = code.toLowerCase().includes('>link</') || code.toLowerCase().includes('>click</');
      if (hasGenericText) {
        warnings.push('List group links should have meaningful text describing the destination, not generic text like "Link" or "Click"');
      }

      // Check structure: pretitle should come before title
      if (code.includes('kds-list-group-item-pretitle')) {
        // This is a suggestion to maintain proper order
        suggestions.push('Ensure pretitle (kds-list-group-item-pretitle) appears before the title span in the DOM order');
      }

      // Check that help text uses paragraph element
      if (code.includes('kds-list-group-item-help-text') && !code.includes('<p class="kds-list-group-item-help-text"')) {
        warnings.push('Help text should use <p> element with kds-list-group-item-help-text class');
      }

      // Check for external links with target but no aria-label
      if (code.includes('target="_blank"') && !code.includes('aria-label')) {
        warnings.push('External links (target="_blank") should include aria-label to indicate "Opens in new window"');
      }
    }

    // Check for link component structure
    if (code.includes('kds-link')) {
      // Check for variant class
      const hasVariant = code.includes('kds-link-inline') || code.includes('kds-link-standalone');
      if (!hasVariant) {
        warnings.push('Link should specify a variant: kds-link-inline or kds-link-standalone');
      }

      // Check for size class
      const hasSize = code.includes('kds-link-sm') || code.includes('kds-link-md') || code.includes('kds-link-lg');
      if (!hasSize) {
        warnings.push('Link should specify a size: kds-link-sm, kds-link-md, or kds-link-lg');
      }

      // Check for role attribute
      if (!code.includes('role="link"')) {
        errors.push('Links must include role="link" attribute');
      }

      // Check for aria-label
      if (!code.includes('aria-label')) {
        errors.push('Links must include descriptive aria-label');
      }

      // Check for href attribute
      if (!code.includes('href=')) {
        errors.push('Links must include href attribute with destination URL');
      }

      // Check for vague link text (case-insensitive)
      const linkText = code.toLowerCase();
      const vagueLabels = ['click here', 'read more', 'this link', 'click this', 'here'];
      for (const vague of vagueLabels) {
        if (linkText.includes(vague)) {
          errors.push(`Avoid vague link text like "${vague}". Use specific, descriptive labels that explain the destination.`);
        }
      }

      // Check that inline links don't have icons
      if (code.includes('kds-link-inline') && code.includes('class="ri-')) {
        errors.push('Inline links should not include icons. Icons are only for standalone links.');
      }

      // Check standalone links with icons have proper structure
      if (code.includes('kds-link-standalone') && code.includes('class="ri-')) {
        // Check that link text is wrapped in <span>
        if (!code.includes('<span>')) {
          warnings.push('Standalone links with icons should wrap link text in <span> element');
        }

        // Suggest right arrow icon for standalone links
        if (!code.includes('ri-arrow-right-line') && !code.includes('ri-external-link-line')) {
          suggestions.push('Standalone links typically use ri-arrow-right-line icon (or ri-external-link-line for external links)');
        }
      }

      // Check for PDF links
      if (code.includes('.pdf') || linkText.includes('pdf')) {
        if (!linkText.includes('[pdf]')) {
          warnings.push('Links to PDF files should include [PDF] in the link text');
        }
      }

      // Suggest specific use cases
      if (code.includes('href="mailto:')) {
        suggestions.push('Email links (mailto:) should have descriptive text like "Email support" rather than showing the email address');
      }

      if (code.includes('href="tel:')) {
        suggestions.push('Phone links (tel:) should display formatted phone number like "(555) 123-4567"');
      }
    }

    // Check for table component structure
    if (code.includes('kds-table') || (code.includes('<table') && code.includes('class='))) {
      // Check for semantic table element
      if (!code.includes('<table')) {
        errors.push('Tables must use semantic <table> element');
      }

      // Check for table class
      if (code.includes('<table') && !code.includes('kds-table')) {
        warnings.push('Tables should use kds-table class for proper styling');
      }

      // Check for thead section
      if (!code.includes('<thead')) {
        warnings.push('Tables should have <thead> section for column headers');
      }

      // Check for tbody section
      if (!code.includes('<tbody')) {
        warnings.push('Tables should have <tbody> section for data rows');
      }

      // Check for th elements in header
      if (code.includes('<thead') && !code.includes('<th')) {
        errors.push('Table header (<thead>) must contain <th> elements for column headers');
      }

      // Check for tr elements
      if (!code.includes('<tr')) {
        errors.push('Tables must contain <tr> elements for rows');
      }

      // Check for td or th elements in tbody
      if (code.includes('<tbody') && !code.includes('<td') && !code.includes('<th')) {
        errors.push('Table body must contain <td> or <th> elements for data cells');
      }

      // Check for scope attribute on th elements
      if (code.includes('<th') && code.includes('<tbody')) {
        // If there are th elements in tbody (row headers), they should have scope="row"
        if (!code.includes('scope="row"') && code.includes('<tbody>')) {
          suggestions.push('Row headers (th in tbody) should include scope="row" attribute for accessibility');
        }
      }

      // Check for table title or caption
      const hasTitle = code.includes('kds-table-title');
      const hasCaption = code.includes('<caption');

      if (!hasTitle && !hasCaption) {
        warnings.push('Tables should have a title (h2.kds-table-title) or <caption> for context');
      }

      // Validate title element if present
      if (code.includes('kds-table-title')) {
        if (!code.includes('<h2 class="kds-table-title"') && !code.includes('class="kds-table-title"')) {
          suggestions.push('Table title should use <h2> element with kds-table-title class');
        }
      }

      // Check that table is not being used for layout
      const hasLayoutIndicators = code.includes('width=') || code.includes('border="0"') || code.includes('cellpadding');
      if (hasLayoutIndicators) {
        errors.push('Do not use tables for layout. Use layout grid instead. Tables are for data only.');
      }

      // Warn about potential long content
      const avgCellLength = code.length / ((code.match(/<td/g) || []).length || 1);
      if (avgCellLength > 200) {
        suggestions.push('Table cells appear to contain long content. Consider another format if cells have paragraph-length information.');
      }

      // Check for consistent row structure
      const rows = code.match(/<tr[^>]*>[\s\S]*?<\/tr>/g) || [];
      if (rows.length > 1) {
        const cellCounts = rows.map(row => {
          const tdCount = (row.match(/<td/g) || []).length;
          const thCount = (row.match(/<th/g) || []).length;
          return tdCount + thCount;
        });

        const firstRowCellCount = cellCounts[0];
        const inconsistent = cellCounts.some(count => count !== firstRowCellCount);

        if (inconsistent) {
          warnings.push('Table rows should have consistent number of cells for proper structure');
        }
      }

      // Suggest brief, clear labels
      if (code.includes('<th')) {
        suggestions.push('Use brief, clear labels for table headers following plain language best practices');
      }
    }

    // Check for text input component structure
    if (code.includes('kds-text-input')) {
      // Check for form control wrapper
      if (!code.includes('kds-form-control')) {
        warnings.push('Text input should be wrapped in label.kds-form-control');
      }

      // Check for label
      if (!code.includes('kds-label')) {
        errors.push('Text input must have kds-label wrapper for label text');
      }

      if (!code.includes('kds-label-text')) {
        errors.push('Text input must have span.kds-label-text for label text');
      }

      // Check for ARIA attributes
      if (!code.includes('aria-labelledby')) {
        errors.push('Text input must include aria-labelledby to associate with label');
      }

      // Check for help text association
      if (code.includes('kds-label-text-alt') && !code.includes('aria-describedby')) {
        errors.push('When help text is present, text input must use aria-describedby');
      }

      // Check for error state attributes
      if (code.includes('kds-text-input-error') && !code.includes('aria-invalid="true"')) {
        errors.push('Error state text inputs must include aria-invalid="true"');
      }

      // Check for warning/error state wrapper
      if ((code.includes('kds-text-warning') || code.includes('kds-text-error')) && code.includes('kds-icon')) {
        if (!code.includes('kds-input-icon')) {
          errors.push('Warning and error state text inputs must be wrapped in div.kds-input-icon with status icon');
        }
      }

      // Check for warning/error icons
      if ((code.includes('kds-text-warning') || code.includes('kds-text-error')) && code.includes('kds-icon')) {
        if (!code.includes('aria-label')) {
          errors.push('Status icons (warning/error) must include aria-label');
        }
      }

      // Validate help text structure for warning/error
      if (code.includes('kds-label-text-alt')) {
        // Check for proper icon
        if (code.includes('kds-text-warning') && !code.includes('ri-alert-fill')) {
          suggestions.push('Warning state typically uses ri-alert-fill icon');
        }

        if (code.includes('kds-text-error') && !code.includes('ri-error-warning-fill')) {
          suggestions.push('Error state typically uses ri-error-warning-fill icon');
        }
      }

      // Warn about placeholder text
      if (code.includes('placeholder=')) {
        suggestions.push('Use placeholder text sparingly - never put critical information in placeholder text. Use help text instead.');
      }

      // Check for input type
      if (!code.includes('type=')) {
        suggestions.push('Text input should specify type attribute (text, email, password, etc.)');
      }
    }

    // Check for textarea component structure
    if (code.includes('kds-textarea')) {
      // Check for form control wrapper
      if (!code.includes('kds-form-control')) {
        warnings.push('Textarea should be wrapped in label.kds-form-control');
      }

      // Check for Stimulus controller
      if (!code.includes('data-controller="textarea"')) {
        suggestions.push('Textarea should use data-controller="textarea" for character count functionality');
      }

      // Check for character counter target
      if (code.includes('data-controller="textarea"') && !code.includes('data-textarea-target="counter"')) {
        warnings.push('Textarea with Stimulus controller should include character counter target (data-textarea-target="counter")');
      }

      // Check for character count input target
      if (code.includes('data-controller="textarea"') && !code.includes('data-textarea-target="input"')) {
        warnings.push('Textarea with Stimulus controller should include input target (data-textarea-target="input")');
      }

      // Check for character count action
      if (code.includes('data-controller="textarea"') && !code.includes('data-action="input->textarea#charCount"')) {
        warnings.push('Textarea should trigger charCount on input (data-action="input->textarea#charCount")');
      }

      // Check for data-max attribute
      if (code.includes('data-controller="textarea"') && !code.includes('data-max=')) {
        suggestions.push('Consider adding data-max attribute to define character limit');
      }

      // Check for label
      if (!code.includes('kds-label')) {
        errors.push('Textarea must have kds-label wrapper for label text');
      }

      if (!code.includes('kds-label-text')) {
        errors.push('Textarea must have span.kds-label-text for label text');
      }

      // Check for ARIA attributes
      if (!code.includes('aria-labelledby')) {
        errors.push('Textarea must include aria-labelledby to associate with label');
      }

      // Check for help text association
      if (code.includes('kds-label-text-alt') && !code.includes('aria-describedby')) {
        errors.push('When help text is present, textarea must use aria-describedby');
      }

      // Check for error state attributes
      if (code.includes('kds-textarea-error') && !code.includes('aria-invalid="true"')) {
        errors.push('Error state textareas must include aria-invalid="true"');
      }

      // Check for warning/error state wrapper
      if ((code.includes('kds-textarea-warning') || code.includes('kds-textarea-error')) && code.includes('kds-icon')) {
        if (!code.includes('kds-input-icon')) {
          errors.push('Warning and error state textareas must be wrapped in div.kds-input-icon with status icon');
        }
      }

      // Check for warning/error icons
      if ((code.includes('kds-text-warning') || code.includes('kds-text-error')) && code.includes('kds-icon')) {
        if (!code.includes('aria-label')) {
          errors.push('Status icons (warning/error) must include aria-label');
        }
      }

      // Validate help text structure for warning/error
      if (code.includes('kds-label-text-alt')) {
        // Check for proper icon
        if (code.includes('kds-text-warning') && !code.includes('ri-alert-fill')) {
          suggestions.push('Warning state typically uses ri-alert-fill icon');
        }

        if (code.includes('kds-text-error') && !code.includes('ri-error-warning-fill')) {
          suggestions.push('Error state typically uses ri-error-warning-fill icon');
        }
      }
    }

    // Check for tag component structure
    if (code.includes('kds-tag')) {
      // Check for color variant
      const hasColorVariant = /kds-tag-(primary|secondary|success|error|warning)/.test(code);
      if (!hasColorVariant) {
        warnings.push('Tag should specify a color variant: kds-tag-primary, kds-tag-secondary, kds-tag-success, kds-tag-error, or kds-tag-warning');
      }

      // Check for label content
      if (!code.includes('<span>')) {
        warnings.push('Tag should contain a <span> element for label text');
      }

      // Check for dismissable tags with Stimulus controller
      if (code.includes('kds-icon-button')) {
        // Tag has dismiss button
        if (!code.includes('data-controller="presentation"')) {
          warnings.push('Dismissable tags should use data-controller="presentation" for Stimulus functionality');
        }

        if (!code.includes('data-action="click->presentation#dismiss"')) {
          warnings.push('Dismiss button should have data-action="click->presentation#dismiss"');
        }

        // Check for close icon
        if (!code.includes('ri-close-line')) {
          suggestions.push('Dismiss button typically uses ri-close-line icon');
        }

        // Check for button type
        if (code.includes('kds-icon-button') && !code.includes('type=')) {
          suggestions.push('Dismiss button should include type="button" attribute');
        }

        // Check for accessible label on dismiss button
        if (!code.includes('aria-label') && !code.includes('visually-hidden')) {
          warnings.push('Dismiss button should include aria-label or visually-hidden text (e.g., "Remove filter")');
        }
      }

      // Warn about color-only meaning
      if (hasColorVariant) {
        suggestions.push('Avoid relying on color alone to communicate tag meaning - ensure text labels are descriptive');
      }

      // Check for brief labels
      const labelMatch = code.match(/<span>([^<]+)<\/span>/);
      if (labelMatch && labelMatch[1]) {
        const labelText = labelMatch[1].trim();
        const wordCount = labelText.split(/\s+/).length;

        if (wordCount > 4) {
          suggestions.push('Keep tag labels brief and clear - usually 1-3 words');
        }

        // Check for unique identifiers (like IDs)
        if (/^[A-Z0-9-]{8,}$/i.test(labelText) || /^ID[:-]?\d+$/i.test(labelText)) {
          warnings.push("Tags should not be used for unique identifiers - use tags for categorization and comparison only");
        }
      }

      // Check for vertical stacking
      const tagCount = (code.match(/kds-tag/g) || []).length;
      if (tagCount > 3 && code.includes('display: block') || code.includes('flex-direction: column')) {
        warnings.push('Avoid stacking tags vertically - use horizontal layout for multiple tags');
      }

      // Validate structure
      if (!code.includes('class="kds-tag')) {
        errors.push('Tag must use kds-tag class');
      }
    }

    const valid = errors.length === 0;

    return {
      valid,
      errors,
      warnings,
      suggestions,
    };
  }

  /**
   * Fetch live documentation from Keystone Design System website
   * NOTE: This is a placeholder - actual implementation requires Puppeteer or similar
   * Use the provided Puppeteer scraper script to extract data locally
   */
  async fetchDocumentation(path: string): Promise<{
    content: string;
    url: string;
    available_paths?: string[];
    error?: string;
  }> {
    // Map of available documentation paths
    const availablePaths = [
      'getting-started',
      'foundations/color',
      'foundations/typography',
      'foundations/spacing',
      'foundations/grid',
      'components/button',
      'components/navbar',
      'components/accordion',
      'components/alert',
      'components/card',
      'patterns/forms',
      'patterns/navigation',
      'utilities/helpers',
    ];

    // Validate path
    if (!availablePaths.includes(path)) {
      return {
        content: '',
        url: `https://wcmauthorguide.pa.gov/en/keystone-design-system/${path}.html`,
        available_paths: availablePaths,
        error: `Path "${path}" not found. Use one of the available paths listed.`,
      };
    }

    // Return instruction message
    return {
      content: `To fetch live documentation, use the Puppeteer scraper script:

npm run scrape:keystone -- ${path}

This will extract the latest documentation from:
https://wcmauthorguide.pa.gov/en/keystone-design-system/${path}.html

The scraper bypasses 403 restrictions by using browser automation.
See KEYSTONE_SCRAPER_GUIDE.md for full instructions.`,
      url: `https://wcmauthorguide.pa.gov/en/keystone-design-system/${path}.html`,
      available_paths: availablePaths,
    };
  }
}
```

## File 4: src/keystone/index.ts

**Purpose:** Main module exports

```typescript
// Keystone Design System - Main Export
export { KeystoneService } from './keystone-service.js';
export { keystoneComponents, getKeystoneComponent, listKeystoneComponents } from './components.js';
export { keystoneColorTokens, getKeystoneColorToken, listKeystoneColorTokens } from './color-tokens.js';
export type { KeystoneComponent } from './components.js';
export type { ColorToken } from './color-tokens.js';
```

## File 5: src/keystone-index.ts

**Purpose:** MCP server entry point with all 8 tools

```typescript
#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { KeystoneService } from './keystone/keystone-service.js';

// Initialize Keystone service
const keystoneService = new KeystoneService();

// Create MCP server
const server = new Server(
  {
    name: 'keystone-mcp-server',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools for Keystone Design System
const tools: Tool[] = [
  {
    name: 'list_keystone_components',
    description: 'List all available Keystone Design System components with descriptions',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Filter by category (e.g., "forms", "navigation", "all")',
        },
      },
    },
  },
  {
    name: 'get_keystone_component',
    description: 'Get detailed information about a specific Keystone component including props, examples, and accessibility guidance',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Name of the component (e.g., "Button", "Alert", "TextInput")',
        },
        include_examples: {
          type: 'boolean',
          description: 'Include code examples',
          default: true,
        },
      },
      required: ['component_name'],
    },
  },
  {
    name: 'get_keystone_design_tokens',
    description: 'Get Keystone design tokens for colors, spacing, typography, etc.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Token category to retrieve (all, primary, secondary, neutral, semantic)',
        },
      },
    },
  },
  {
    name: 'search_keystone_components',
    description: 'Search Keystone components by keyword',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: 'Keyword to search for in component names, descriptions, or categories',
        },
      },
      required: ['keyword'],
    },
  },
  {
    name: 'get_keystone_accessibility_guidelines',
    description: 'Get accessibility guidelines for Keystone components',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Optional: Get accessibility guidelines for a specific component',
        },
      },
    },
  },
  {
    name: 'validate_keystone_code',
    description: 'Validate HTML code for Keystone Design System patterns and accessibility',
    inputSchema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          description: 'HTML code to validate',
        },
      },
      required: ['code'],
    },
  },
  {
    name: 'get_keystone_style_guide',
    description: 'Get Keystone Design System style guide and principles',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_keystone_component_examples',
    description: 'Get code examples for a specific Keystone component',
    inputSchema: {
      type: 'object',
      properties: {
        component_name: {
          type: 'string',
          description: 'Name of the component',
        },
      },
      required: ['component_name'],
    },
  },
  {
    name: 'fetch_keystone_documentation',
    description: 'Fetch live documentation from Keystone Design System website (requires Puppeteer scraper)',
    inputSchema: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Documentation path (e.g., "getting-started", "foundations/color", "components/button")',
        },
      },
      required: ['path'],
    },
  },
];

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_keystone_components': {
        const result = keystoneService.listComponents(args?.category as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_component': {
        const result = keystoneService.getComponentInfo(
          args?.component_name as string,
          args?.include_examples !== false
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_design_tokens': {
        const result = keystoneService.getDesignTokens(args?.category as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'search_keystone_components': {
        const result = keystoneService.searchComponents(args?.keyword as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_accessibility_guidelines': {
        const result = keystoneService.getAccessibilityGuidelines(
          args?.component_name as string
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'validate_keystone_code': {
        const result = keystoneService.validateComponent(args?.code as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_style_guide': {
        const result = keystoneService.getStyleGuide();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_keystone_component_examples': {
        const result = keystoneService.getComponentExamples(
          args?.component_name as string
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'fetch_keystone_documentation': {
        const result = await keystoneService.fetchDocumentation(
          args?.path as string
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ error: errorMessage }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  console.error('Keystone MCP Server starting...');
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Keystone MCP Server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
```

## File 6: package.json Updates

**Purpose:** Add Keystone scripts and bin entry

**Changes to make:**

1. Add to `bin` section:
```json
"bin": {
  "uswds-mcp": "./dist/index.js",
  "keystone-mcp": "./dist/keystone-index.js"
},
```

2. Add to `scripts` section:
```json
"dev:keystone": "tsc && node dist/keystone-index.js",
"inspector:keystone": "npx @modelcontextprotocol/inspector dist/keystone-index.js",
```

3. Add to `keywords`:
```json
"keystone",
"keystone-design-system",
"pennsylvania",
"state",
```

## Implementation Steps

1. **Create branch:**
   ```bash
   git checkout -b claude/keystone-design-system-mcp-tools
   ```

2. **Create directory structure:**
   ```bash
   mkdir -p src/keystone
   ```

3. **Create all files** listed above with the exact content

4. **Update package.json** with the changes listed

5. **Build to verify:**
   ```bash
   npm run build
   ```

6. **Test with inspector:**
   ```bash
   npm run inspector:keystone
   ```

7. **Commit:**
   ```bash
   git add .
   git commit -m "feat: Add Keystone Design System MCP server"
   ```

## Key Features Implemented

✅ 9 MCP Tools:
1. list_keystone_components
2. get_keystone_component
3. get_keystone_design_tokens
4. search_keystone_components
5. get_keystone_accessibility_guidelines
6. validate_keystone_code
7. get_keystone_style_guide
8. get_keystone_component_examples
9. fetch_keystone_documentation (with Puppeteer scraper support)

✅ TypeScript with full type safety
✅ Service layer pattern
✅ Data structures ready for population
✅ Accessibility-first approach
✅ Pennsylvania-specific branding

## Data Population Needed

The structure is complete but needs real data from:
- https://components.pa.gov - Component details
- https://wcmauthorguide.pa.gov/en/keystone-design-system/foundations/color.html - Color tokens

See KEYSTONE_TODO.md for detailed population guide.

## Claude Desktop Configuration

```json
{
  "mcpServers": {
    "keystone": {
      "command": "/path/to/node20/bin/node",
      "args": ["/path/to/dist/keystone-index.js"]
    }
  }
}
```

## Success Criteria

- ✅ All 8 tools respond successfully
- ✅ TypeScript compiles without errors
- ✅ Server starts in MCP Inspector
- ✅ Can run alongside USWDS server
- ✅ Documentation is complete

---

**End of Implementation Guide**
