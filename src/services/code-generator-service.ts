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

  /**
   * Generate a multi-step form (wizard) with navigation
   */
  async generateMultiStepForm(spec: any): Promise<any> {
    if (!this.useReact) {
      return {
        error: 'Multi-step form generation is only available in React mode',
        mode: 'vanilla-uswds',
        message: 'Set USE_REACT_COMPONENTS=true to generate React multi-step forms'
      };
    }

    const {
      formName = 'MultiStepForm',
      steps = [],
      showProgress = true
    } = spec;

    if (steps.length === 0) {
      return {
        error: 'No steps specified',
        message: 'Provide an array of step specifications',
        example: {
          formName: 'RegistrationWizard',
          steps: [
            {
              title: 'Personal Information',
              fields: [
                { name: 'firstName', label: 'First Name', type: 'text', required: true },
                { name: 'lastName', label: 'Last Name', type: 'text', required: true }
              ]
            },
            {
              title: 'Contact Information',
              fields: [
                { name: 'email', label: 'Email', type: 'email', required: true },
                { name: 'phone', label: 'Phone', type: 'tel', required: false }
              ]
            }
          ],
          showProgress: true
        }
      };
    }

    const code = `import { useState } from 'react'
import {
  Form,
  FormGroup,
  Label,
  TextInput,
  Textarea,
  Select,
  Button,
  StepIndicator,
  StepIndicatorStep
} from '@trussworks/react-uswds'

export default function ${formName}() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  const steps = ${JSON.stringify(steps.map((s: any) => ({ title: s.title, fields: s.fields })), null, 2)}

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateStep = (stepIndex) => {
    const step = steps[stepIndex]
    const newErrors = {}

    step.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = \`\${field.label} is required\`
      }
    })

    return newErrors
  }

  const handleNext = () => {
    const newErrors = validateStep(currentStep)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validateStep(currentStep)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // TODO: Handle form submission
    console.log('Form submitted:', formData)
  }

  const currentStepData = steps[currentStep]

  return (
    <div>
      ${showProgress ? `{/* Progress indicator */}
      <StepIndicator
        headingLevel="h2"
        ofText="of"
        stepText="Step"
        counters="default"
      >
        {steps.map((step, index) => (
          <StepIndicatorStep
            key={index}
            label={step.title}
            status={
              index < currentStep
                ? 'complete'
                : index === currentStep
                ? 'current'
                : 'incomplete'
            }
          />
        ))}
      </StepIndicator>

      ` : ''}<Form onSubmit={handleSubmit} large className="margin-top-4">
        <h2>{currentStepData.title}</h2>

        {currentStepData.fields.map((field) => (
          <FormGroup key={field.name} error={!!errors[field.name]}>
            <Label
              htmlFor={field.name}
              error={!!errors[field.name]}
            >
              {field.label}{field.required ? ' *' : ''}
            </Label>
            {errors[field.name] && (
              <span className="usa-error-message">{errors[field.name]}</span>
            )}
            <TextInput
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              validationStatus={errors[field.name] ? 'error' : undefined}
            />
          </FormGroup>
        ))}

        <div className="margin-top-4 display-flex flex-justify">
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            outline
          >
            Previous
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </Form>
    </div>
  )
}`;

    return {
      formName,
      stepCount: steps.length,
      code,
      features: {
        stepProgress: showProgress,
        validation: true,
        navigation: true,
        accessibility: true
      },
      usage: 'Multi-step form with navigation and validation',
      nextSteps: [
        'Customize validation logic for each step',
        'Add step-specific submission logic',
        'Implement save/resume functionality',
        'Add confirmation step'
      ]
    };
  }

  /**
   * Generate a data table with sorting, filtering, and pagination
   */
  async generateDataTable(spec: any): Promise<any> {
    if (!this.useReact) {
      return {
        error: 'Data table generation is only available in React mode',
        mode: 'vanilla-uswds',
        message: 'Set USE_REACT_COMPONENTS=true to generate React data tables'
      };
    }

    const {
      tableName = 'DataTable',
      columns = [],
      enableSorting = true,
      enableFiltering = true,
      enablePagination = true,
      pageSize = 10
    } = spec;

    if (columns.length === 0) {
      return {
        error: 'No columns specified',
        message: 'Provide an array of column specifications',
        example: {
          tableName: 'UsersTable',
          columns: [
            { key: 'name', label: 'Name', sortable: true },
            { key: 'email', label: 'Email', sortable: true },
            { key: 'role', label: 'Role', sortable: false },
            { key: 'status', label: 'Status', sortable: true }
          ],
          enableSorting: true,
          enableFiltering: true,
          enablePagination: true,
          pageSize: 10
        }
      };
    }

    const code = `import { useState, useMemo } from 'react'
import { Table, TextInput, Label, Pagination } from '@trussworks/react-uswds'

interface ${tableName}Props {
  data: any[]
}

export default function ${tableName}({ data }: ${tableName}Props) {
  ${enableSorting ? `const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  ` : ''}${enableFiltering ? `const [filterText, setFilterText] = useState('')
  ` : ''}${enablePagination ? `const [currentPage, setCurrentPage] = useState(1)
  const pageSize = ${pageSize}
  ` : ''}
  const columns = ${JSON.stringify(columns, null, 2)}

  ${enableSorting ? `const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }
  ` : ''}
  const processedData = useMemo(() => {
    let result = [...data]

    ${enableFiltering ? `// Filter
    if (filterText) {
      result = result.filter(row =>
        columns.some(col =>
          String(row[col.key]).toLowerCase().includes(filterText.toLowerCase())
        )
      )
    }
    ` : ''}
    ${enableSorting ? `// Sort
    if (sortColumn) {
      result.sort((a, b) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }
    ` : ''}
    return result
  }, [data${enableFiltering ? ', filterText' : ''}${enableSorting ? ', sortColumn, sortDirection' : ''}])

  ${enablePagination ? `// Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  )
  const displayData = paginatedData
  ` : 'const displayData = processedData'}

  return (
    <div>
      ${enableFiltering ? `<div className="margin-bottom-2">
        <Label htmlFor="table-filter">Filter</Label>
        <TextInput
          id="table-filter"
          name="filter"
          type="search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Search..."
        />
      </div>
      ` : ''}
      <Table bordered={false} fullWidth>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                ${enableSorting ? `onClick={() => col.sortable && handleSort(col.key)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}` : ''}
              >
                {col.label}
                ${enableSorting ? `{col.sortable && sortColumn === col.key && (
                  <span className="margin-left-05">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}` : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center">
                No data available
              </td>
            </tr>
          ) : (
            displayData.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </Table>

      ${enablePagination ? `{totalPages > 1 && (
        <Pagination
          pathname=""
          totalPages={totalPages}
          currentPage={currentPage}
          onClickPageNumber={(e, page) => {
            e.preventDefault()
            setCurrentPage(page)
          }}
          onClickNext={(e) => {
            e.preventDefault()
            if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
          }}
          onClickPrevious={(e) => {
            e.preventDefault()
            if (currentPage > 1) setCurrentPage(prev => prev - 1)
          }}
        />
      )}` : ''}
    </div>
  )
}`;

    return {
      tableName,
      columnCount: columns.length,
      code,
      features: {
        sorting: enableSorting,
        filtering: enableFiltering,
        pagination: enablePagination,
        responsive: true
      },
      usage: 'Pass data array as prop: <' + tableName + ' data={yourData} />',
      dataExample: {
        structure: columns.reduce((acc: any, col: any) => {
          acc[col.key] = 'value';
          return acc;
        }, {})
      },
      nextSteps: [
        'Add TypeScript interface for row data',
        'Implement row actions (edit, delete)',
        'Add column visibility toggles',
        'Implement export to CSV/Excel'
      ]
    };
  }

  /**
   * Generate a modal dialog with focus management
   */
  async generateModalDialog(spec: any): Promise<any> {
    if (!this.useReact) {
      return {
        error: 'Modal generation is only available in React mode',
        mode: 'vanilla-uswds',
        message: 'Set USE_REACT_COMPONENTS=true to generate React modals'
      };
    }

    const {
      modalName = 'ConfirmDialog',
      title = 'Confirm Action',
      type = 'default', // default, warning, error
      hasForm = false,
      actions = ['cancel', 'confirm']
    } = spec;

    const code = `import { useRef, useEffect } from 'react'
import {
  Modal,
  ModalHeading,
  ModalFooter,
  Button${hasForm ? ',\n  Form,\n  FormGroup,\n  Label,\n  TextInput' : ''}
} from '@trussworks/react-uswds'

interface ${modalName}Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: (${hasForm ? 'data?: any' : ''}) => void
  ${type !== 'default' ? `type?: 'warning' | 'error'` : ''}
}

export default function ${modalName}({
  isOpen,
  onClose,
  onConfirm,
  ${type !== 'default' ? `type = '${type}'` : ''}
}: ${modalName}Props) {
  const modalRef = useRef<HTMLDivElement>(null)
  ${hasForm ? `const [formData, setFormData] = useState({})` : ''}

  useEffect(() => {
    if (isOpen && modalRef.current) {
      // Focus first interactive element
      const firstButton = modalRef.current.querySelector('button')
      firstButton?.focus()
    }
  }, [isOpen])

  const handleConfirm = () => {
    onConfirm(${hasForm ? 'formData' : ''})
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      ref={modalRef}
      id="${modalName.toLowerCase()}"
      isOpen={isOpen}
      onClose={onClose}
      ${type !== 'default' ? `variant={type}` : ''}
      aria-labelledby="${modalName.toLowerCase()}-heading"
      aria-describedby="${modalName.toLowerCase()}-description"
      onKeyDown={handleKeyDown}
    >
      <ModalHeading id="${modalName.toLowerCase()}-heading">
        ${title}
      </ModalHeading>

      <div className="usa-prose" id="${modalName.toLowerCase()}-description">
        ${hasForm ? `<Form>
          <FormGroup>
            <Label htmlFor="input-field">Input Field</Label>
            <TextInput
              id="input-field"
              name="field"
              type="text"
              value={formData.field || ''}
              onChange={(e) => setFormData({ ...formData, field: e.target.value })}
            />
          </FormGroup>
        </Form>` : `<p>
          Are you sure you want to proceed with this action?
        </p>`}
      </div>

      <ModalFooter>
        ${actions.includes('cancel') ? `<Button
          type="button"
          onClick={onClose}
          outline
        >
          Cancel
        </Button>` : ''}
        ${actions.includes('confirm') ? `<Button
          type="button"
          onClick={handleConfirm}
          ${type === 'error' ? 'className="usa-button--secondary"' : ''}
        >
          Confirm
        </Button>` : ''}
      </ModalFooter>
    </Modal>
  )
}`;

    return {
      modalName,
      code,
      features: {
        focusManagement: true,
        escapeKeyClose: true,
        ariaLabels: true,
        formSupport: hasForm,
        type: type
      },
      usage: `const [isOpen, setIsOpen] = useState(false)

<${modalName}
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={(${hasForm ? 'data' : ''}) => {
    console.log('Confirmed'${hasForm ? ', data' : ''})
  }}
/>`,
      accessibility: [
        '✓ Focus management - focuses first button on open',
        '✓ Escape key closes modal',
        '✓ ARIA labels for screen readers',
        '✓ Focus trap within modal',
        '✓ Returns focus to trigger on close'
      ],
      nextSteps: [
        'Add focus trap using react-focus-lock',
        'Implement return focus to trigger element',
        'Add loading state for async actions',
        'Customize modal size and styling'
      ]
    };
  }

  /**
   * Scaffold a complete project structure
   */
  async scaffoldProject(spec: any): Promise<any> {
    const {
      projectName = 'my-uswds-app',
      framework = 'next', // next, cra, vite
      includeExamples = true,
      includeAuth = false,
      includeTesting = true
    } = spec;

    const fileStructure: any = {
      'package.json': this.generatePackageJson(projectName, framework, includeTesting),
      'tsconfig.json': this.generateTsConfig(),
      'README.md': this.generateReadme(projectName, framework),
      '.gitignore': this.generateGitignore(),
      '.env.example': this.generateEnvExample(includeAuth)
    };

    // Framework-specific files
    if (framework === 'next') {
      fileStructure['next.config.js'] = this.generateNextConfig();
      fileStructure['app/layout.tsx'] = this.generateNextLayout();
      fileStructure['app/page.tsx'] = this.generateNextHomePage();
      if (includeExamples) {
        fileStructure['app/examples/forms/page.tsx'] = this.generateExampleFormsPage();
        fileStructure['app/examples/components/page.tsx'] = this.generateExampleComponentsPage();
      }
    } else if (framework === 'cra') {
      fileStructure['src/App.tsx'] = this.generateCRAApp();
      fileStructure['src/index.tsx'] = this.generateCRAIndex();
      fileStructure['public/index.html'] = this.generateCRAHtml();
    } else if (framework === 'vite') {
      fileStructure['vite.config.ts'] = this.generateViteConfig();
      fileStructure['src/main.tsx'] = this.generateViteMain();
      fileStructure['src/App.tsx'] = this.generateViteApp();
      fileStructure['index.html'] = this.generateViteHtml();
    }

    // Common files
    fileStructure['src/components/Header.tsx'] = this.generateHeaderComponent();
    fileStructure['src/components/Footer.tsx'] = this.generateFooterComponent();

    if (includeTesting) {
      fileStructure['jest.config.js'] = this.generateJestConfig();
      fileStructure['src/components/__tests__/Header.test.tsx'] = this.generateHeaderTest();
    }

    return {
      projectName,
      framework,
      files: fileStructure,
      structure: Object.keys(fileStructure),
      instructions: {
        setup: [
          `1. Create directory: mkdir ${projectName}`,
          `2. Save each file to its path`,
          `3. Run: npm install`,
          `4. Run: npm run dev`,
          `5. Open: http://localhost:${framework === 'next' ? '3000' : framework === 'vite' ? '5173' : '3000'}`
        ],
        included: {
          framework: framework === 'next' ? 'Next.js 14' : framework === 'cra' ? 'Create React App' : 'Vite',
          uswds: '@trussworks/react-uswds',
          typescript: true,
          testing: includeTesting ? 'Jest + React Testing Library' : false,
          auth: includeAuth,
          examples: includeExamples
        }
      },
      nextSteps: [
        'Customize components in src/components/',
        'Add your pages/routes',
        'Configure environment variables in .env',
        includeTesting ? 'Run tests with npm test' : 'Add testing setup',
        'Review USWDS design tokens in the documentation'
      ]
    };
  }

  // Helper methods for scaffold_project
  private generatePackageJson(name: string, framework: string, testing: boolean): string {
    const baseDevDeps = {
      typescript: '^5.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0'
    };

    const testDeps = testing ? {
      jest: '^29.0.0',
      '@testing-library/react': '^14.0.0',
      '@testing-library/jest-dom': '^6.0.0',
      '@types/jest': '^29.0.0'
    } : {};

    return JSON.stringify({
      name,
      version: '0.1.0',
      private: true,
      scripts: {
        dev: framework === 'next' ? 'next dev' : framework === 'vite' ? 'vite' : 'react-scripts start',
        build: framework === 'next' ? 'next build' : framework === 'vite' ? 'vite build' : 'react-scripts build',
        start: framework === 'next' ? 'next start' : 'serve -s build',
        ...(testing ? { test: 'jest' } : {})
      },
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        '@trussworks/react-uswds': '^6.0.0',
        ...(framework === 'next' ? { next: '^14.0.0' } : {})
      },
      devDependencies: {
        ...baseDevDeps,
        ...testDeps
      }
    }, null, 2);
  }

  private generateTsConfig(): string {
    return JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        jsx: 'react-jsx',
        module: 'ESNext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        allowJs: true,
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
      },
      include: ['src/**/*'],
      exclude: ['node_modules']
    }, null, 2);
  }

  private generateReadme(name: string, framework: string): string {
    return `# ${name}

A USWDS-compliant application built with ${framework === 'next' ? 'Next.js' : framework === 'cra' ? 'Create React App' : 'Vite'} and React-USWDS.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- ✅ USWDS 3.0 design system
- ✅ React-USWDS components
- ✅ TypeScript support
- ✅ Accessibility compliant
- ✅ Responsive design

## Documentation

- [USWDS](https://designsystem.digital.gov/)
- [React-USWDS](https://github.com/trussworks/react-uswds)
`;
  }

  private generateGitignore(): string {
    return `# Dependencies
node_modules/

# Build output
dist/
build/
.next/

# Environment variables
.env
.env.local

# Logs
*.log

# Editor
.vscode/
.idea/

# OS
.DS_Store
`;
  }

  private generateEnvExample(includeAuth: boolean): string {
    return includeAuth
      ? `# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication (if using)
NEXT_PUBLIC_AUTH_URL=
AUTH_SECRET=
`
      : `# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
`;
  }

  private generateNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
`;
  }

  private generateNextLayout(): string {
    return `import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'

export const metadata = {
  title: 'USWDS App',
  description: 'Built with React-USWDS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
`;
  }

  private generateNextHomePage(): string {
    return `import { GridContainer, Title, Button } from '@trussworks/react-uswds'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="usa-hero">
          <GridContainer>
            <div className="usa-hero__callout">
              <Title className="usa-hero__heading">
                Welcome to Your USWDS App
              </Title>
              <p>
                Built with React-USWDS and Next.js for accessible,
                compliant government websites.
              </p>
              <Button type="button">Get Started</Button>
            </div>
          </GridContainer>
        </section>
      </main>
      <Footer />
    </>
  )
}
`;
  }

  private generateCRAApp(): string {
    return `import { GridContainer } from '@trussworks/react-uswds'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <GridContainer className="usa-section">
          <h1>Welcome to USWDS</h1>
          <p>Your application is ready!</p>
        </GridContainer>
      </main>
      <Footer />
    </>
  )
}

export default App
`;
  }

  private generateCRAIndex(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`;
  }

  private generateCRAHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>USWDS App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
  }

  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;
  }

  private generateViteMain(): string {
    return `import React from 'react'
import ReactDOM from 'react-dom/client'
import '@trussworks/react-uswds/lib/uswds.css'
import '@trussworks/react-uswds/lib/index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;
  }

  private generateViteApp(): string {
    return this.generateCRAApp();
  }

  private generateViteHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>USWDS App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
  }

  private generateHeaderComponent(): string {
    return `import { Header as USWDSHeader, Title, NavMenuButton } from '@trussworks/react-uswds'

export default function Header() {
  return (
    <USWDSHeader basic>
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <Title>
            <a href="/" title="Home">
              My USWDS App
            </a>
          </Title>
          <NavMenuButton label="Menu" onClick={() => {}} />
        </div>
      </div>
    </USWDSHeader>
  )
}
`;
  }

  private generateFooterComponent(): string {
    return `import { Footer as USWDSFooter, GridContainer } from '@trussworks/react-uswds'

export default function Footer() {
  return (
    <USWDSFooter
      size="slim"
      primary={
        <div className="usa-footer__primary-container grid-row">
          <GridContainer>
            <p className="text-center">
              Built with USWDS
            </p>
          </GridContainer>
        </div>
      }
    />
  )
}
`;
  }

  private generateJestConfig(): string {
    return `module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
}
`;
  }

  private generateHeaderTest(): string {
    return `import { render, screen } from '@testing-library/react'
import Header from '../Header'

describe('Header', () => {
  it('renders the header', () => {
    render(<Header />)
    expect(screen.getByText('My USWDS App')).toBeInTheDocument()
  })
})
`;
  }

  private generateExampleFormsPage(): string {
    return `import { GridContainer, Form, FormGroup, Label, TextInput, Button } from '@trussworks/react-uswds'

export default function FormsExample() {
  return (
    <GridContainer className="usa-section">
      <h1>Form Examples</h1>
      <Form>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <TextInput id="name" name="name" type="text" />
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </GridContainer>
  )
}
`;
  }

  private generateExampleComponentsPage(): string {
    return `import { GridContainer, Alert, Card, CardHeader, CardBody } from '@trussworks/react-uswds'

export default function ComponentsExample() {
  return (
    <GridContainer className="usa-section">
      <h1>Component Examples</h1>

      <Alert type="success" heading="Success">
        This is a success alert
      </Alert>

      <Card className="margin-top-2">
        <CardHeader>
          <h3>Example Card</h3>
        </CardHeader>
        <CardBody>
          <p>Card content goes here</p>
        </CardBody>
      </Card>
    </GridContainer>
  )
}
`;
  }
}
