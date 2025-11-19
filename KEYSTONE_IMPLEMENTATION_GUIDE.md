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
    description: 'Alert messages for info, warning, and error states. Two types: Global (page-level) and Local (contextual with dismiss)',
    wcagLevel: 'AA',
    storybookUrl: 'https://components.pa.gov/?path=/docs/components-alert--docs',
    props: [
      {
        name: 'type',
        type: '"global" | "local"',
        required: true,
        description: 'Alert type: global (page-level, no icons/dismiss) or local (contextual, with icons/dismiss)',
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
        description: 'Global info alert for page-level messages',
      },
      {
        title: 'Global Alert - Warning',
        code: `<div class="kds-alert kds-alert-global kds-alert-global-warning" role="alert" data-controller="presentation">
  <div class="kds-alert-content">
    <p class="kds-alert-global-title">Alert Title</p>
    <p class="kds-alert-global-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
</div>`,
        description: 'Global warning alert',
      },
      {
        title: 'Global Alert - Error',
        code: `<div class="kds-alert kds-alert-global kds-alert-global-error" role="alert" data-controller="presentation">
  <div class="kds-alert-content">
    <p class="kds-alert-global-title">Alert Title</p>
    <p class="kds-alert-global-message">A simple primary alert—check it out <a href="#">here</a>!</p>
  </div>
</div>`,
        description: 'Global error alert',
      },
      {
        title: 'Local Alert - Info',
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
        description: 'Local info alert with Remix icon and dismiss button',
      },
      {
        title: 'Local Alert - Warning',
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
        description: 'Local warning alert with alert icon',
      },
      {
        title: 'Local Alert - Error',
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
        description: 'Local error alert with error icon',
      },
    ],
    accessibility: {
      keyboardSupport: 'Tab to dismiss button on local alerts, Enter/Space to dismiss',
      ariaLabels: [
        'Use role="alert" on container for screen reader announcement',
        'Use aria-hidden="true" on decorative icons',
        'Use aria-label="Close" on dismiss button',
        'Include descriptive title and message',
      ],
      screenReaderNotes: 'role="alert" causes immediate announcement. Icons are decorative and hidden from screen readers. Dismiss button is keyboard accessible.',
    },
    relatedComponents: ['Icon object', 'Button'],
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
      suggestions.push('Local alerts typically include a dismiss button with aria-label="Close"');
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
