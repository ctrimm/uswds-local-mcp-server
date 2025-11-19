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
Create a standalone MCP server that provides 8 tools for working with Keystone Design System components, color tokens, accessibility guidelines, and validation.

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
    description: 'Interactive button component with multiple variants and states',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-button--docs',
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'tertiary' | 'outline'",
        required: false,
        description: 'Button style variant',
        defaultValue: 'primary',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        required: false,
        description: 'Button size',
        defaultValue: 'md',
      },
      {
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Whether button is disabled',
        defaultValue: 'false',
      },
    ],
    examples: [
      {
        title: 'Primary Button',
        code: `<button class="btn btn-primary">
  Click me
</button>`,
        description: 'Standard primary button using Bootstrap classes',
      },
    ],
    accessibility: {
      keyboardSupport: 'Activates with Enter or Space keys',
      ariaLabels: ['Use descriptive button text or aria-label'],
      screenReaderNotes: 'Button purpose should be clear from text alone',
    },
    relatedComponents: ['Link', 'Icon object'],
  },
  {
    name: 'Text input',
    category: 'forms',
    description: 'Text input field for single-line user input',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-text-input--docs',
    accessibility: {
      keyboardSupport: 'Standard text input keyboard navigation',
      ariaLabels: ['Always provide associated label', 'Use aria-describedby for helper text and errors'],
      screenReaderNotes: 'Label and validation messages announced automatically',
    },
    relatedComponents: ['Textarea', 'Select', 'Search input'],
  },
  {
    name: 'Textarea',
    category: 'forms',
    description: 'Multi-line text input for longer form content',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-textarea--docs',
    accessibility: {
      keyboardSupport: 'Standard textarea keyboard navigation',
      ariaLabels: ['Provide label with for/id relationship', 'Use aria-describedby for character count or helper text'],
    },
    relatedComponents: ['Text input'],
  },
  {
    name: 'Select',
    category: 'forms',
    description: 'Dropdown select menu for choosing from predefined options',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-select--docs',
    accessibility: {
      keyboardSupport: 'Arrow keys to navigate options, Enter to select, Escape to close',
      ariaLabels: ['Associate label with select', 'Use aria-required for required fields'],
    },
    relatedComponents: ['Radio', 'Checkbox'],
  },
  {
    name: 'Checkbox',
    category: 'forms',
    description: 'Checkbox input for binary or multi-select options',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-checkbox--docs',
    accessibility: {
      keyboardSupport: 'Space to toggle, Tab to navigate',
      ariaLabels: ['Provide label for each checkbox', 'Use fieldset/legend for checkbox groups'],
    },
    relatedComponents: ['Radio', 'Select'],
  },
  {
    name: 'Radio',
    category: 'forms',
    description: 'Radio button input for single selection from multiple options',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-radio--docs',
    accessibility: {
      keyboardSupport: 'Arrow keys to change selection within group, Tab to move between groups',
      ariaLabels: ['Use fieldset/legend for radio groups', 'All radios in group must have same name attribute'],
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
    description: 'Primary navigation bar with responsive toggle using Stimulus.js',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-navbar--docs',
    examples: [
      {
        title: 'Responsive Navbar',
        code: `<nav data-controller="revealable navbar">
  <div class="kds-navbar-header">
    <button
      class="kds-navbar-toggler"
      data-navbar-target="toggleButton"
      data-action="click->revealable#toggle click->navbar#toggleLabel"
      aria-expanded="false"
    >
      Menu
    </button>
  </div>
  <ul class="kds-nav" data-revealable-target="content">
    <!-- Navigation items -->
  </ul>
</nav>`,
        description: 'Navbar with Revealable and Navbar Stimulus controllers',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab through nav items, Enter to activate links',
      ariaLabels: ['Use nav element with aria-label', 'Toggle button manages aria-expanded'],
      screenReaderNotes: 'Navbar state (open/closed) announced via aria-expanded',
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
    description: 'Hierarchical navigation showing current page location',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-breadcrumb--docs',
    accessibility: {
      keyboardSupport: 'Tab through breadcrumb links',
      ariaLabels: ['Use nav with aria-label="Breadcrumb"', 'Use aria-current="page" on last item'],
    },
    relatedComponents: ['Link', 'Navbar'],
  },
  {
    name: 'Link',
    category: 'navigation',
    description: 'Hyperlink component for navigation and actions',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-link--docs',
    accessibility: {
      keyboardSupport: 'Enter to activate',
      ariaLabels: ['Link text must be descriptive', 'Avoid "click here" or "read more" without context'],
    },
    relatedComponents: ['Button', 'Navbar'],
  },

  // FEEDBACK & UI
  {
    name: 'Alert',
    category: 'feedback',
    description: 'Alert messages for success, error, warning, and info states',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-alert--docs',
    accessibility: {
      keyboardSupport: 'Focusable close button if dismissible',
      ariaLabels: ['Use role="alert" for important messages', 'Include clear, concise message text'],
      screenReaderNotes: 'role="alert" announces message immediately',
    },
    relatedComponents: ['Icon object'],
  },
  {
    name: 'Tag',
    category: 'feedback',
    description: 'Small label for categorization or status indication',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-tag--docs',
    accessibility: {
      ariaLabels: ['Ensure sufficient color contrast', 'Don't rely on color alone for meaning'],
    },
    relatedComponents: ['Alert'],
  },

  // CONTENT & LAYOUT
  {
    name: 'Card',
    category: 'content',
    description: 'Container component for grouping related content',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-card--docs',
    accessibility: {
      keyboardSupport: 'Tab to interactive elements within card',
      ariaLabels: ['Use heading to identify card content', 'Ensure proper heading hierarchy'],
    },
    relatedComponents: ['Button', 'Link', 'Typography'],
  },
  {
    name: 'Accordion',
    category: 'content',
    description: 'Expandable/collapsible content sections using Revealable controller',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-accordion--docs',
    examples: [
      {
        title: 'Accordion with Revealable',
        code: `<div data-controller="revealable">
  <button data-action="click->revealable#toggle" aria-expanded="false">
    Section Title
  </button>
  <div data-revealable-target="content" class="kds-revealable-content">
    Content that will be shown or hidden.
  </div>
</div>`,
        description: 'Accordion using Stimulus Revealable controller',
      },
    ],
    accessibility: {
      keyboardSupport: 'Enter/Space to toggle sections',
      ariaLabels: ['Use aria-expanded on toggle buttons', 'Associate button with content using aria-controls'],
      screenReaderNotes: 'Expanded/collapsed state announced via aria-expanded',
    },
    relatedComponents: ['Button'],
  },
  {
    name: 'List group',
    category: 'content',
    description: 'Styled list of items with optional actions',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-list-group--docs',
    accessibility: {
      keyboardSupport: 'Tab through interactive list items',
      ariaLabels: ['Use semantic list elements (ul/ol)', 'Provide list description with aria-label if needed'],
    },
    relatedComponents: ['Menu list', 'Link'],
  },
  {
    name: 'Footer',
    category: 'content',
    description: 'Page footer with site navigation and information',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-footer--docs',
    accessibility: {
      keyboardSupport: 'Tab through footer links',
      ariaLabels: ['Use footer element', 'Provide aria-label if multiple footers exist'],
    },
    relatedComponents: ['Link', 'Navbar'],
  },

  // DATA DISPLAY
  {
    name: 'Table',
    category: 'data',
    description: 'Data table with proper semantic markup',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-table--docs',
    accessibility: {
      keyboardSupport: 'Tab through interactive table elements',
      ariaLabels: ['Use th for headers', 'Use scope attribute on headers', 'Provide caption or aria-label'],
      screenReaderNotes: 'Screen readers announce row and column headers',
    },
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
    description: 'Icon component using Remix Icons',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-icon-object--docs',
    accessibility: {
      ariaLabels: ['Use aria-hidden="true" for decorative icons', 'Provide aria-label or title for functional icons', 'Ensure icons are not the only indicator of meaning'],
    },
    relatedComponents: ['Button', 'Link', 'Alert'],
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

    if (!hasKDSClasses && !hasBootstrapClasses) {
      warnings.push(
        'No Keystone Design System classes found. KDS uses Bootstrap classes (btn, card, etc.) and kds- prefix for custom components'
      );
    }

    // Check for Stimulus.js controllers on interactive components
    if ((code.includes('navbar') || code.includes('accordion')) && !hasStimulusControllers) {
      suggestions.push('Consider using Stimulus controllers (data-controller="revealable" or "navbar") for interactive components');
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

    // Check for proper ARIA on interactive elements
    if (code.includes('data-controller="revealable"') && !code.includes('aria-expanded')) {
      errors.push('Revealable controller requires aria-expanded attribute on toggle button');
    }

    const valid = errors.length === 0;

    return {
      valid,
      errors,
      warnings,
      suggestions,
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

✅ 8 MCP Tools:
1. list_keystone_components
2. get_keystone_component
3. get_keystone_design_tokens
4. search_keystone_components
5. get_keystone_accessibility_guidelines
6. validate_keystone_code
7. get_keystone_style_guide
8. get_keystone_component_examples

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
