# Keystone MCP Server - Data Population Guide

This guide explains how to populate the Keystone MCP server with real component data, design tokens, and examples from Pennsylvania's design system.

## Current Status

✅ **Complete**: Server structure, TypeScript types, 8 MCP tools
📝 **Needs Work**: Component data, color tokens, examples, validation rules

## Priority 1: Core Components (High Priority)

### Components to Add

Research and add these components from https://components.pa.gov:

#### Forms & Inputs
- [ ] **Button** (partially complete - needs more variants)
- [ ] **TextInput**
- [ ] **Checkbox**
- [ ] **Radio**
- [ ] **Select**
- [ ] **Textarea**
- [ ] **Toggle/Switch**
- [ ] **FileUpload**
- [ ] **DatePicker**

#### Feedback & Alerts
- [ ] **Alert**
- [ ] **Toast/Notification**
- [ ] **ProgressBar**
- [ ] **Spinner/Loader**
- [ ] **ErrorMessage**
- [ ] **SuccessMessage**

#### Navigation
- [ ] **Header**
- [ ] **Footer**
- [ ] **Breadcrumb**
- [ ] **Tabs**
- [ ] **Pagination**
- [ ] **Stepper**

#### Content
- [ ] **Card**
- [ ] **Table**
- [ ] **Accordion**
- [ ] **Modal**
- [ ] **Tooltip**

## How to Add a Component

### Step 1: Research Component on Storybook

Visit: https://components.pa.gov

1. Find component in sidebar
2. Review "Docs" tab for:
   - Component description
   - Props/attributes
   - Usage guidelines
   - Accessibility notes
3. Review "Canvas" tab for:
   - Visual examples
   - Different states/variants
4. Check "Controls" for available props

### Step 2: Add to components.ts

Edit `src/keystone/components.ts`:

```typescript
{
  name: 'TextInput',  // Component name from Storybook
  category: 'forms',  // Category: forms, navigation, content, etc.
  description: 'Text input field for user data entry',  // From docs
  wcagLevel: 'AA',  // From accessibility section
  storybookUrl: 'https://components.pa.gov/?path=/docs/components-textinput--docs',

  props: [  // From Controls tab
    {
      name: 'label',
      type: 'string',
      required: true,
      description: 'Input label text',
    },
    {
      name: 'type',
      type: "'text' | 'email' | 'password' | 'number'",
      required: false,
      description: 'Input type',
      defaultValue: 'text',
    },
    {
      name: 'error',
      type: 'string',
      required: false,
      description: 'Error message to display',
    },
    // ... more props
  ],

  examples: [  // From Canvas examples
    {
      title: 'Basic Text Input',
      code: `<div class="pa-form-group">
  <label for="name" class="pa-label">Full Name</label>
  <input type="text" id="name" class="pa-input" />
</div>`,
      description: 'Standard text input with label',
    },
    {
      title: 'Input with Error',
      code: `<div class="pa-form-group pa-form-group--error">
  <label for="email" class="pa-label">Email</label>
  <input type="email" id="email" class="pa-input pa-input--error" aria-invalid="true" aria-describedby="email-error" />
  <span id="email-error" class="pa-error-message">Please enter a valid email</span>
</div>`,
      description: 'Text input with error state',
    },
  ],

  accessibility: {  // From accessibility documentation
    keyboardSupport: 'Standard input keyboard navigation',
    ariaLabels: [
      'Use aria-describedby for error messages',
      'Set aria-invalid="true" for error state',
      'Always provide associated label',
    ],
    screenReaderNotes: 'Error messages announced when invalid',
  },

  relatedComponents: ['Button', 'Form', 'ErrorMessage'],
},
```

### Step 3: Rebuild and Test

```bash
npm run build
npm run inspector:keystone
```

Test the new component:
```
get_keystone_component { component_name: "TextInput" }
```

## Priority 2: Design Tokens (High Priority)

### Color Tokens to Research

Edit `src/keystone/color-tokens.ts`:

Visit: https://wcmauthorguide.pa.gov/en/keystone-design-system/foundations/color.html

#### Primary Brand Colors
- [ ] Pennsylvania Blue (exact hex value)
- [ ] Pennsylvania Gold/Yellow (exact hex value)
- [ ] Any additional brand colors

#### Semantic Colors
- [ ] Success (green)
- [ ] Error (red)
- [ ] Warning (orange/yellow)
- [ ] Info (blue)

#### Neutral Grays
- [ ] Gray scale (100, 200, 300, 400, 500, 600, 700, 800, 900)
- [ ] White
- [ ] Black

#### Interactive States
- [ ] Link colors (default, hover, visited, active)
- [ ] Focus states
- [ ] Disabled states

### How to Add Color Tokens

```typescript
{
  name: 'pa-blue-primary',  // Token name from documentation
  value: '#003F87',  // Exact hex from style guide
  category: 'primary',  // Category
  usage: 'Primary actions, headers, key UI elements',  // When to use
  contrastRatio: 7.5,  // Contrast against white (if documented)
  wcagCompliant: true,  // AA or better on white background
},
```

### Calculate Contrast Ratios

Use: https://webaim.org/resources/contrastchecker/

- Enter color against white background
- Note contrast ratio
- Mark `wcagCompliant: true` if ≥ 4.5:1 (AA) or ≥ 7:1 (AAA)

## Priority 3: Enhanced Validation (Medium Priority)

### Validation Rules to Add

Edit `src/keystone/keystone-service.ts` in the `validateComponent` method:

```typescript
// Check for required ARIA attributes
if (code.includes('role="button"') && !code.includes('tabindex')) {
  warnings.push('Custom buttons should have tabindex attribute');
}

// Check for form labels
const inputs = code.match(/<input[^>]*>/g) || [];
inputs.forEach(input => {
  const hasId = /id="([^"]+)"/.test(input);
  if (hasId) {
    const id = input.match(/id="([^"]+)"/)[1];
    if (!code.includes(`for="${id}"`)) {
      errors.push(`Input with id="${id}" missing associated label`);
    }
  }
});

// Check for semantic HTML
if (code.includes('<div') && code.includes('role="navigation"')) {
  suggestions.push('Use <nav> instead of <div role="navigation">');
}

// Check for Pennsylvania-specific patterns
const paClassPattern = /class="[^"]*pa-/;
if (!paClassPattern.test(code)) {
  warnings.push('No Pennsylvania design system classes found (pa- prefix)');
}
```

## Priority 4: Documentation Examples (Medium Priority)

### Add Real-World Examples

For each component, add examples showing:

1. **Basic usage** - Simplest implementation
2. **Error state** - With validation/error messages
3. **Disabled state** - Non-interactive state
4. **With icon** - If applicable
5. **Form integration** - How it works in forms

Example:

```typescript
examples: [
  {
    title: 'Basic Button',
    code: `<button class="pa-button">Click me</button>`,
    description: 'Standard primary button',
  },
  {
    title: 'Secondary Button',
    code: `<button class="pa-button pa-button--secondary">Cancel</button>`,
    description: 'Secondary action',
  },
  {
    title: 'Disabled Button',
    code: `<button class="pa-button" disabled aria-disabled="true">Disabled</button>`,
    description: 'Non-interactive disabled state',
  },
  {
    title: 'Button with Icon',
    code: `<button class="pa-button">
  <svg class="pa-icon" aria-hidden="true">...</svg>
  <span>Download</span>
</button>`,
    description: 'Button with leading icon',
  },
],
```

## Priority 5: Accessibility Guidelines (Low Priority)

### Per-Component Accessibility

For each component, document:

1. **Keyboard support** - What keys do what
2. **ARIA attributes** - Which ARIA to use when
3. **Screen reader behavior** - What gets announced
4. **Focus management** - Tab order, focus indicators

Example:

```typescript
accessibility: {
  keyboardSupport: 'Enter or Space to activate. Tab to navigate.',
  ariaLabels: [
    'Use aria-label if button has only icon',
    'Use aria-expanded for toggle buttons',
    'Use aria-pressed for toggle state',
  ],
  screenReaderNotes: 'Button text or aria-label is announced. State changes (pressed, expanded) are announced.',
},
```

## Data Sources

### Official Resources

1. **Component Library**: https://components.pa.gov
   - Browse all components
   - View props and examples
   - See accessibility notes

2. **Keystone Documentation**: https://wcmauthorguide.pa.gov/en/keystone-design-system/
   - Design foundations
   - Color palette
   - Typography
   - Spacing

3. **GitHub (if public)**: Search for "Keystone design system Pennsylvania"
   - Source code
   - Additional examples
   - Implementation details

4. **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
   - Accessibility requirements
   - Testing criteria

### Research Workflow

1. Open https://components.pa.gov in browser
2. For each component:
   - Read Docs tab → Copy description, props
   - View Canvas tab → Get code examples
   - Check Accessibility → Note ARIA requirements
   - Review Controls → List all props
3. Add to `components.ts`
4. Test with `npm run inspector:keystone`

## Automation Ideas (Optional)

### Web Scraping

If manual data entry is too time-consuming:

```bash
# Install dependencies
npm install cheerio axios

# Create scripts/scrape-keystone.js
```

```javascript
import axios from 'axios';
import * as cheerio from 'cheerio';

async function scrapeComponent(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  // Extract component info from Storybook HTML
  const name = $('h1').first().text();
  const description = $('p').first().text();

  // ... extract props, examples, etc.

  return { name, description };
}
```

**Note**: Check robots.txt and terms of service before scraping.

## Testing Checklist

After adding components/tokens:

- [ ] TypeScript compiles: `npm run build`
- [ ] No type errors
- [ ] MCP Inspector shows tools: `npm run inspector:keystone`
- [ ] `list_keystone_components` returns new components
- [ ] `get_keystone_component` returns full details
- [ ] Examples are valid HTML
- [ ] Color tokens have valid hex values
- [ ] WCAG compliance accurately marked

## Contribution Workflow

1. Create feature branch: `git checkout -b add-component-textinput`
2. Edit `src/keystone/components.ts` or `color-tokens.ts`
3. Build: `npm run build`
4. Test: `npm run inspector:keystone`
5. Commit: `git commit -m "feat: Add TextInput component with examples"`
6. Push: `git push origin add-component-textinput`

## Questions to Research

- [ ] What are the official Pennsylvania brand colors?
- [ ] Does Keystone have a public GitHub repository?
- [ ] Are there spacing/typography tokens beyond colors?
- [ ] What's the official Pennsylvania state logo/seal usage?
- [ ] Are there specific content writing guidelines?

## Future Enhancements

- [ ] Add spacing tokens (padding, margin)
- [ ] Add typography tokens (font sizes, weights)
- [ ] Add icon library integration
- [ ] Add layout grid specifications
- [ ] Add responsive breakpoint tokens
- [ ] Validate contrast ratios programmatically
- [ ] Add screenshot generation for examples
- [ ] Add Figma integration (if Figma files exist)

---

**Next Steps**:
1. Visit https://components.pa.gov
2. Choose 3-5 most common components (Button, TextInput, Alert)
3. Follow "How to Add a Component" guide above
4. Test with MCP Inspector
5. Repeat until component library is complete

Good luck! 🚀
