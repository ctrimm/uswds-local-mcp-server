# Keystone MCP Server - Data Population Guide

This guide explains how to populate the Keystone MCP server with real component data, design tokens, and examples from Pennsylvania's design system.

## Current Status

✅ **Complete**: Server structure, TypeScript types, 9 MCP tools, 19 components with real data, 56 color tokens
📝 **Needs Work**: Additional component variants, more validation rules

## Priority 1: Core Components (High Priority)

### Components Completed ✅

All components below have been added with real Keystone Storybook data, complete usage guidelines, props documentation, examples, accessibility requirements, and comprehensive validation rules:

#### Forms & Inputs
- [x] **Button** - Complete with all variants (primary, secondary, tertiary, icon-only, sizes)
- [x] **TextInput** - Complete with warning/error states
- [x] **Checkbox** - Complete with all variants
- [x] **Radio** - Complete with warning/error states
- [x] **Select** - Complete with warning/error states
- [x] **Textarea** - Complete with character count Stimulus controller
- [ ] **Toggle/Switch**
- [ ] **FileUpload**
- [ ] **DatePicker**

#### Feedback & Alerts
- [x] **Alert** - Complete with all 6 variants (success, informational, warning, error, emergency, default)
- [ ] **Toast/Notification**
- [ ] **ProgressBar**
- [ ] **Spinner/Loader**

#### Navigation
- [x] **Header/Navbar** - Complete with responsive behavior and Stimulus controllers
- [x] **Footer** - Complete with agency/statewide variants
- [x] **Breadcrumb** - Complete with desktop/mobile examples
- [x] **Link** - Complete with inline/standalone variants and sizes
- [ ] **Tabs**
- [ ] **Pagination**
- [ ] **Stepper**

#### Content
- [x] **Card** - Complete with all structural elements
- [x] **Table** - Complete with title and row headers
- [x] **Accordion** - Complete with Bootstrap collapse integration
- [x] **List Group** - Complete with icons, pretitles, descriptions
- [x] **Tag** - Complete with 5 color variants and dismissable functionality
- [x] **Icon** - Complete with Remix Icons integration
- [ ] **Modal**
- [ ] **Tooltip**

#### Foundational
- [x] **Typography** - Complete with full type scale (15 styles), 2 typefaces, responsive font ramp

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

### Color Tokens Completed ✅

**56 color tokens** have been documented in KEYSTONE_IMPLEMENTATION_GUIDE.md with exact hex values, usage guidelines, and WCAG compliance information:

#### Primary Brand Colors ✅
- [x] Pennsylvania Blue variants (Blue 10-90)
- [x] Pennsylvania Gold/Yellow variants (Gold 10-90)
- [x] All brand color shades

#### Semantic Colors ✅
- [x] Success (Green 10-90)
- [x] Error (Red 10-90)
- [x] Warning (Yellow 10-90)
- [x] Info (Blue 10-90)

#### Neutral Grays ✅
- [x] Gray scale (Gray 10-90)
- [x] White (#FFFFFF)
- [x] Black (#000000)

#### Interactive States ✅
- [x] Link colors documented in Link component
- [x] Focus states (Blue 70)
- [x] Disabled states (Gray variants)

### Additional Tokens Needed
- [ ] Spacing tokens (padding, margin scale)
- [ ] Typography tokens (font sizes, weights, line heights) - Partially complete in Typography component
- [ ] Shadow tokens (elevation system)
- [ ] Border radius tokens
- [ ] Breakpoint tokens (responsive design)

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

## Summary of Completed Work

### ✅ Completed (Session 1 & 2)
- **9 MCP Tools**: All tools implemented and functional
  1. `list_keystone_components` - List all available components
  2. `get_keystone_component` - Get detailed component information
  3. `validate_keystone_component` - Validate component code against standards
  4. `search_keystone_components` - Search components by criteria
  5. `get_color_palette` - Get color tokens
  6. `get_keystone_usage_examples` - Get implementation examples
  7. `get_accessibility_requirements` - Get WCAG requirements
  8. `get_component_variations` - Get component variants
  9. `fetch_keystone_documentation` - Fetch from official docs

- **19 Components**: All with real Keystone Storybook data
  - Complete usage guidelines (when to use, when not to use, best practices)
  - Props documentation with types and descriptions
  - Real code examples from Storybook
  - Comprehensive accessibility requirements
  - Detailed validation rules in `validateComponent()` method

- **56 Color Tokens**: Complete color palette with hex values, usage guidelines, WCAG compliance

- **Typography System**: Complete type scale with 15 styles, 2 typefaces, responsive font ramp

### 📋 Remaining Components (Priority Order)

#### High Priority (Common UI Patterns)
1. **Modal** - Dialog overlays for important interactions
2. **Tooltip** - Contextual help text
3. **Tabs** - Organize content into switchable panels
4. **Toggle/Switch** - Binary on/off controls

#### Medium Priority (Form & Interaction)
5. **Pagination** - Navigate through data sets
6. **FileUpload** - File selection and upload
7. **DatePicker** - Date selection interface
8. **Toast/Notification** - Temporary messages

#### Low Priority (Specialized Components)
9. **ProgressBar** - Show completion status
10. **Spinner/Loader** - Loading states
11. **Stepper** - Multi-step process navigation

### 🎯 Next Steps

**Option A - Add Remaining Components** (Similar to completed work):
1. Research component on https://components.pa.gov Storybook
2. Extract real code, props, and usage guidelines
3. Add to KEYSTONE_IMPLEMENTATION_GUIDE.md following established pattern
4. Add comprehensive validation rules
5. Test and commit

**Option B - Enhance Existing Components**:
1. Add more example variants for each component
2. Expand validation rules with edge cases
3. Add component relationship documentation
4. Document common patterns and recipes

**Option C - Add Additional Token Systems**:
1. Spacing tokens (padding/margin scale)
2. Typography tokens (enhance existing)
3. Shadow/elevation tokens
4. Border radius tokens
5. Responsive breakpoints

**Recommended**: Start with Option A - Add Modal and Tooltip components as they are the most commonly needed components from the remaining list.
