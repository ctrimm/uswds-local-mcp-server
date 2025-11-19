# Example Usage

This guide shows practical examples of using the USWDS MCP server with Claude or other AI assistants.

## Scenario 1: Building a Contact Form (React-USWDS)

### User Request:
"I need to create an accessible contact form with name, email, and message fields using React-USWDS"

### AI Assistant Workflow:

1. **List available form components:**
```
Tool: list_components
Input: {"category": "forms"}
```

2. **Get component details:**
```
Tool: get_component_info
Input: {"component_name": "TextInput"}

Tool: get_component_info
Input: {"component_name": "Textarea"}

Tool: get_component_info
Input: {"component_name": "Button"}
```

3. **Generate the code:**
```tsx
import { FormGroup, Label, TextInput, Textarea, Button } from '@trussworks/react-uswds'

export function ContactForm() {
  return (
    <form className="usa-form">
      <FormGroup>
        <Label htmlFor="name-input">Full Name</Label>
        <TextInput
          id="name-input"
          name="name"
          type="text"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email-input">Email Address</Label>
        <TextInput
          id="email-input"
          name="email"
          type="email"
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="message-input">Message</Label>
        <Textarea
          id="message-input"
          name="message"
          required
        />
      </FormGroup>

      <Button type="submit">Send Message</Button>
    </form>
  )
}
```

4. **Validate the code:**
```
Tool: validate_uswds_code
Input: {
  "code": "<above code>",
  "check_accessibility": true
}
```

5. **Check accessibility:**
```
Tool: get_accessibility_guidance
Input: {"component_or_pattern": "Form"}
```

## Scenario 2: Creating a Status Alert (Vanilla USWDS)

### User Request:
"Show me how to create a success alert in vanilla USWDS"

### AI Assistant Workflow:

1. **Get component info:**
```
Tool: get_component_info
Input: {"component_name": "Alert", "include_examples": true}
```

2. **Get color tokens:**
```
Tool: get_design_tokens
Input: {"category": "color"}
```

3. **Generate the code:**
```html
<div class="usa-alert usa-alert--success" role="region" aria-labelledby="success-heading">
  <div class="usa-alert__body">
    <h4 class="usa-alert__heading" id="success-heading">Success</h4>
    <p class="usa-alert__text">Your changes have been saved successfully.</p>
  </div>
</div>
```

4. **Validate:**
```
Tool: validate_uswds_code
Input: {
  "code": "<above HTML>",
  "check_accessibility": true
}
```

## Scenario 3: Fixing Accessibility Issues

### User Code (with issues):
```html
<button class="btn primary">Submit</button>
<input placeholder="Enter your name" />
<img src="logo.png" />
```

### AI Assistant Workflow:

1. **Validate the code:**
```
Tool: validate_uswds_code
Input: {
  "code": "<user's code>",
  "check_accessibility": true
}
```

**Response:**
```json
{
  "valid": false,
  "score": 3.5,
  "issues": [
    {
      "severity": "error",
      "message": "Button missing type attribute",
      "rule": "wcag-button-type"
    },
    {
      "severity": "warning",
      "message": "No USWDS classes (usa- prefix) found"
    },
    {
      "severity": "error",
      "message": "Input missing associated label",
      "rule": "wcag-3.3.2-label-input"
    },
    {
      "severity": "error",
      "message": "Image missing alt attribute",
      "rule": "wcag-1.1.1-alt-text"
    }
  ]
}
```

2. **Fix the issues:**
```html
<button type="submit" class="usa-button">Submit</button>

<label for="name-input" class="usa-label">Name</label>
<input
  id="name-input"
  name="name"
  type="text"
  class="usa-input"
  placeholder="Enter your name"
/>

<img src="logo.png" alt="Company Logo" />
```

3. **Validate again:**
```
Tool: validate_uswds_code
Input: {
  "code": "<fixed code>",
  "check_accessibility": true
}
```

**Response:**
```json
{
  "valid": true,
  "score": 10.0,
  "issues": [],
  "summary": "All checks passed (Score: 10.0/10)"
}
```

## Scenario 4: Responsive Layout with Design Tokens

### User Request:
"Create a responsive card grid using USWDS design tokens"

### AI Assistant Workflow:

1. **Get design tokens:**
```
Tool: get_design_tokens
Input: {"category": "spacing"}

Tool: get_design_tokens
Input: {"category": "breakpoints"}
```

2. **Get component info:**
```
Tool: get_component_info
Input: {"component_name": "Grid"}

Tool: get_component_info
Input: {"component_name": "Card"}
```

3. **Generate responsive grid:**
```tsx
import { Grid, Card, CardHeader, CardBody } from '@trussworks/react-uswds'

export function CardGrid() {
  return (
    <Grid row gap="lg" className="margin-y-3">
      <Grid tablet={{ col: 12 }} desktop={{ col: 4 }}>
        <Card>
          <CardHeader>
            <h3 className="usa-card__heading">Card 1</h3>
          </CardHeader>
          <CardBody>
            <p>Card content goes here</p>
          </CardBody>
        </Card>
      </Grid>

      <Grid tablet={{ col: 12 }} desktop={{ col: 4 }}>
        <Card>
          <CardHeader>
            <h3 className="usa-card__heading">Card 2</h3>
          </CardHeader>
          <CardBody>
            <p>Card content goes here</p>
          </CardBody>
        </Card>
      </Grid>

      <Grid tablet={{ col: 12 }} desktop={{ col: 4 }}>
        <Card>
          <CardHeader>
            <h3 className="usa-card__heading">Card 3</h3>
          </CardHeader>
          <CardBody>
            <p>Card content goes here</p>
          </CardBody>
        </Card>
      </Grid>
    </Grid>
  )
}
```

## Scenario 5: Finding the Right Design Token

### User Code:
```css
.my-element {
  color: #005ea2;
  padding: 16px;
  font-size: 18px;
}
```

### AI Assistant Workflow:

1. **Validate to find issues:**
```
Tool: validate_uswds_code
Input: {
  "code": "<CSS above>",
  "check_accessibility": false
}
```

2. **Get design tokens:**
```
Tool: get_design_tokens
Input: {"category": "color"}

Tool: get_design_tokens
Input: {"category": "spacing"}

Tool: get_design_tokens
Input: {"category": "typography"}
```

3. **Suggest improvements:**
```css
.my-element {
  color: var(--color-primary);  /* Instead of #005ea2 */
  padding: var(--spacing-2);    /* Instead of 16px */
  font-size: var(--font-lg);    /* Instead of 18px */
}
```

Or with utility classes:
```html
<div class="text-primary padding-2 font-sans-lg">
  Content
</div>
```

## Scenario 6: Multi-step Form Pattern

### User Request:
"Help me build a multi-step form with progress indicator"

### AI Assistant Workflow:

1. **Search documentation:**
```
Tool: search_docs
Input: {
  "query": "multi-step form",
  "doc_type": "patterns"
}
```

2. **Get step indicator component:**
```
Tool: get_component_info
Input: {"component_name": "StepIndicator"}
```

3. **Generate implementation:**
```tsx
import { StepIndicator, StepIndicatorStep } from '@trussworks/react-uswds'

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)

  return (
    <div>
      <StepIndicator
        headingLevel="h2"
        ofText="of"
        stepText="Step"
      >
        <StepIndicatorStep
          label="Personal Information"
          status={currentStep === 1 ? 'current' : currentStep > 1 ? 'complete' : 'incomplete'}
        />
        <StepIndicatorStep
          label="Contact Details"
          status={currentStep === 2 ? 'current' : currentStep > 2 ? 'complete' : 'incomplete'}
        />
        <StepIndicatorStep
          label="Review"
          status={currentStep === 3 ? 'current' : 'incomplete'}
        />
      </StepIndicator>

      {/* Form steps would go here */}
    </div>
  )
}
```

## Tips for Best Results

1. **Always validate after generating code**
   - Use `validate_uswds_code` to catch issues early

2. **Use design tokens**
   - Call `get_design_tokens` to find the right tokens for colors, spacing, etc.

3. **Check accessibility**
   - Enable `check_accessibility: true` in validation
   - Use `get_accessibility_guidance` for specific components

4. **Get examples**
   - Set `include_examples: true` when calling `get_component_info`

5. **Start with component list**
   - Use `list_components` to discover available options

6. **Toggle modes as needed**
   - Use React mode for React projects
   - Use vanilla mode for traditional HTML/CSS projects
