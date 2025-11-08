/**
 * Code Generator Service
 * Generate working component code and forms based on requirements
 */

import { REACT_COMPONENTS } from '../data/react-components.js';

interface GenerateOptions {
  [key: string]: any;
}

export class CodeGeneratorService {
  private useReact: boolean;

  constructor(useReact: boolean = false) {
    this.useReact = useReact;
  }

  /**
   * Generate component code based on requirements
   */
  async generateComponent(
    componentName: string,
    requirements: GenerateOptions = {}
  ): Promise<any> {
    if (!this.useReact) {
      return {
        error: 'Code generation is only available in React mode',
        mode: 'vanilla-uswds',
        message: 'Set USE_REACT_COMPONENTS=true to generate React code'
      };
    }

    const component = REACT_COMPONENTS[componentName];

    if (!component) {
      return {
        error: `Component "${componentName}" not found`,
        message: 'Check the component name spelling',
        hint: 'Use list_components to see available components'
      };
    }

    // Generate code based on component type and requirements
    const code = this.buildComponentCode(componentName, component, requirements);

    return {
      component: componentName,
      description: component.description,
      generatedCode: code,
      requirements,
      imports: this.getImports(componentName, requirements),
      usage: `Copy this code into your React component file`,
      nextSteps: [
        'Copy the code to your project',
        'Adjust props as needed',
        'Add event handlers for interactive elements',
        'Test accessibility with screen readers'
      ],
      documentation: component.url
    };
  }

  /**
   * Generate a complete form based on field specifications
   */
  async generateForm(formSpec: any): Promise<any> {
    if (!this.useReact) {
      return {
        error: 'Form generation is only available in React mode',
        mode: 'vanilla-uswds',
        message: 'Set USE_REACT_COMPONENTS=true to generate React forms'
      };
    }

    const {
      formName = 'MyForm',
      fields = [],
      submitLabel = 'Submit',
      includeValidation = true
    } = formSpec;

    if (fields.length === 0) {
      return {
        error: 'No fields specified',
        message: 'Provide an array of field specifications',
        example: {
          formName: 'ContactForm',
          fields: [
            { name: 'name', label: 'Full Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'message', label: 'Message', type: 'textarea', required: false }
          ],
          submitLabel: 'Send Message'
        }
      };
    }

    const imports = this.getFormImports(fields);
    const code = this.buildFormCode(formName, fields, submitLabel, includeValidation);

    return {
      formName,
      fieldCount: fields.length,
      imports,
      code,
      features: {
        validation: includeValidation,
        accessibility: true,
        responsive: true
      },
      usage: 'Copy this code into your React component file',
      nextSteps: [
        'Customize the handleSubmit function',
        'Add form validation logic',
        'Style with additional CSS if needed',
        'Test with keyboard navigation'
      ]
    };
  }

  /**
   * Build component code
   */
  private buildComponentCode(
    name: string,
    component: any,
    requirements: GenerateOptions
  ): string {
    // Start with basic example or build from scratch
    if (requirements && Object.keys(requirements).length > 0) {
      return this.buildCustomCode(name, component, requirements);
    }

    // Return basic example
    if (component.examples && component.examples.length > 0) {
      return component.examples[0].code;
    }

    // Fallback: generate basic usage
    return this.generateBasicUsage(name, component);
  }

  /**
   * Build custom code based on requirements
   */
  private buildCustomCode(
    name: string,
    component: any,
    requirements: GenerateOptions
  ): string {
    const props = this.buildPropsString(component, requirements);
    const children = requirements.children || requirements.label || requirements.text || `${name} Content`;

    // Handle self-closing components
    if (name === 'TextInput' || name === 'Select' || name === 'Checkbox' ||
        name === 'Radio' || name === 'FileInput' || name === 'DatePicker') {
      return `import { ${name}, Label } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <div>
      <Label htmlFor="${requirements.id || 'input-id'}">${requirements.label || 'Label'}</Label>
      <${name}${props} />
    </div>
  )
}`;
    }

    // Regular components with children
    return `import { ${name} } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <${name}${props}>
      ${children}
    </${name}>
  )
}`;
  }

  /**
   * Build props string from requirements
   */
  private buildPropsString(component: any, requirements: GenerateOptions): string {
    const propStrings: string[] = [];

    Object.entries(requirements).forEach(([key, value]) => {
      // Skip special keys
      if (key === 'children' || key === 'label' || key === 'text') return;

      // Find prop in component definition
      const propDef = component.props.find((p: any) => p.name === key);
      if (!propDef) return;

      // Format value based on type
      if (typeof value === 'boolean') {
        if (value) {
          propStrings.push(key);
        }
      } else if (typeof value === 'string') {
        propStrings.push(`${key}="${value}"`);
      } else if (typeof value === 'number') {
        propStrings.push(`${key}={${value}}`);
      } else if (typeof value === 'function') {
        propStrings.push(`${key}={${value.name || 'handleEvent'}}`);
      }
    });

    return propStrings.length > 0 ? '\n      ' + propStrings.join('\n      ') : '';
  }

  /**
   * Generate basic usage
   */
  private generateBasicUsage(name: string, component: any): string {
    return `import { ${name} } from '@trussworks/react-uswds'

export default function Example() {
  return (
    <${name}>
      ${name} content
    </${name}>
  )
}`;
  }

  /**
   * Get imports for component
   */
  private getImports(componentName: string, requirements: GenerateOptions): string {
    const imports = [componentName];

    // Add Label if it's a form input
    if (['TextInput', 'Textarea', 'Select', 'Checkbox', 'Radio', 'FileInput', 'DatePicker', 'TimePicker'].includes(componentName)) {
      imports.push('Label');
    }

    // Add FormGroup if specified
    if (requirements.useFormGroup) {
      imports.push('FormGroup');
    }

    return `import { ${imports.join(', ')} } from '@trussworks/react-uswds'`;
  }

  /**
   * Get form imports based on fields
   */
  private getFormImports(fields: any[]): string {
    const components = new Set(['Form', 'FormGroup', 'Label', 'Button']);

    fields.forEach(field => {
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'tel':
        case 'number':
          components.add('TextInput');
          break;
        case 'textarea':
          components.add('Textarea');
          break;
        case 'select':
        case 'dropdown':
          components.add('Select');
          break;
        case 'checkbox':
          components.add('Checkbox');
          break;
        case 'radio':
          components.add('Radio');
          break;
        case 'date':
          components.add('DatePicker');
          break;
        case 'file':
          components.add('FileInput');
          break;
      }
    });

    return `import { ${Array.from(components).sort().join(', ')} } from '@trussworks/react-uswds'`;
  }

  /**
   * Build form code
   */
  private buildFormCode(
    formName: string,
    fields: any[],
    submitLabel: string,
    includeValidation: boolean
  ): string {
    const fieldCode = fields.map(field => this.generateFieldCode(field, includeValidation)).join('\n\n        ');

    return `import { Form, FormGroup, Label, TextInput, Textarea, Select, Button } from '@trussworks/react-uswds'
${includeValidation ? `import { useState } from 'react'` : ''}

export default function ${formName}() {
  ${includeValidation ? `const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    ${fields.filter(f => f.required).map(f =>
      `if (!formData.${f.name}) newErrors.${f.name} = '${f.label} is required'`
    ).join('\n    ')}
    return newErrors
  }

  ` : ''}const handleSubmit = (event) => {
    event.preventDefault()
    ${includeValidation ? `
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    ` : ''}
    // TODO: Handle form submission
    console.log('Form submitted'${includeValidation ? ', formData' : ''})
  }

  return (
    <Form onSubmit={handleSubmit} large>
      ${fieldCode}

      <Button type="submit">${submitLabel}</Button>
    </Form>
  )
}`;
  }

  /**
   * Generate code for a single field
   */
  private generateFieldCode(field: any, includeValidation: boolean): string {
    const {
      name,
      label,
      type = 'text',
      required = false,
      placeholder = '',
      options = []
    } = field;

    const errorCode = includeValidation && required
      ? `{errors.${name} && <span className="usa-error-message">{errors.${name}}</span>}`
      : '';

    const commonProps = `
        id="${name}"
        name="${name}"${required ? '\n        required' : ''}${includeValidation ? `
        value={formData.${name} || ''}
        onChange={handleChange}` : ''}${placeholder ? `
        placeholder="${placeholder}"` : ''}${includeValidation && required && `
        validationStatus={errors.${name} ? 'error' : undefined}`}`;

    switch (type) {
      case 'textarea':
        return `<FormGroup${includeValidation && required ? ' error={!!errors.' + name + '}' : ''}>
        <Label htmlFor="${name}"${includeValidation && required ? ' error={!!errors.' + name + '}' : ''}>${label}${required ? ' *' : ''}</Label>
        ${errorCode}
        <Textarea${commonProps}
        />
      </FormGroup>`;

      case 'select':
      case 'dropdown':
        return `<FormGroup${includeValidation && required ? ' error={!!errors.' + name + '}' : ''}>
        <Label htmlFor="${name}"${includeValidation && required ? ' error={!!errors.' + name + '}' : ''}>${label}${required ? ' *' : ''}</Label>
        ${errorCode}
        <Select${commonProps}>
          <option value="">- Select -</option>
          ${options.map((opt: any) =>
            typeof opt === 'string'
              ? `<option value="${opt}">${opt}</option>`
              : `<option value="${opt.value}">${opt.label}</option>`
          ).join('\n          ')}
        </Select>
      </FormGroup>`;

      case 'checkbox':
        return `<FormGroup>
        <Checkbox
          id="${name}"
          name="${name}"
          label="${label}"${required ? '\n          required' : ''}${includeValidation ? `
          checked={formData.${name} || false}
          onChange={(e) => setFormData(prev => ({ ...prev, ${name}: e.target.checked }))}` : ''}
        />
      </FormGroup>`;

      default:
        // text, email, password, tel, number, etc.
        return `<FormGroup${includeValidation && required ? ' error={!!errors.' + name + '}' : ''}>
        <Label htmlFor="${name}"${includeValidation && required ? ' error={!!errors.' + name + '}' : ''}>${label}${required ? ' *' : ''}</Label>
        ${errorCode}
        <TextInput${commonProps}
          type="${type}"
        />
      </FormGroup>`;
    }
  }
}
