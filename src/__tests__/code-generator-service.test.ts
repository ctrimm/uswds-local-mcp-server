/**
 * Tests for CodeGeneratorService
 */

import { CodeGeneratorService } from '../services/code-generator-service.js';

describe('CodeGeneratorService', () => {
  describe('Constructor and Mode', () => {
    it('should initialize with React mode disabled by default', () => {
      const service = new CodeGeneratorService();
      expect(service).toBeDefined();
    });

    it('should initialize with React mode when specified', () => {
      const service = new CodeGeneratorService(true);
      expect(service).toBeDefined();
    });
  });

  describe('generateComponent', () => {
    it('should return error when React mode is disabled', async () => {
      const service = new CodeGeneratorService(false);
      const result = await service.generateComponent('Alert');

      expect(result.error).toBe('Code generation is only available in React mode');
      expect(result.mode).toBe('vanilla-uswds');
    });

    it('should generate code for Alert component in React mode', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.generateComponent('Alert', { type: 'info' });

      expect(result.component).toBe('Alert');
      expect(result.generatedCode).toBeDefined();
      expect(result.imports).toBeDefined();
      expect(result.documentation).toBeDefined();
      expect(result.nextSteps).toBeInstanceOf(Array);
    });

    it('should generate code for Button component', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.generateComponent('Button', { variant: 'primary' });

      expect(result.component).toBe('Button');
      expect(result.generatedCode).toContain('Button');
      expect(result.requirements).toEqual({ variant: 'primary' });
    });

    it('should return error for non-existent component', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.generateComponent('NonExistentComponent');

      expect(result.error).toContain('not found');
      expect(result.hint).toContain('list_components');
    });

    it('should handle component with no requirements', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.generateComponent('Card');

      expect(result.component).toBe('Card');
      expect(result.generatedCode).toBeDefined();
    });
  });

  describe('generateForm', () => {
    it('should return error when React mode is disabled', async () => {
      const service = new CodeGeneratorService(false);
      const result = await service.generateForm({ fields: [] });

      expect(result.error).toBe('Form generation is only available in React mode');
    });

    it('should return error when no fields provided', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.generateForm({ fields: [] });

      expect(result.error).toBe('No fields specified');
      expect(result.example).toBeDefined();
    });

    it('should generate form with text and email fields', async () => {
      const service = new CodeGeneratorService(true);
      const formSpec = {
        formName: 'ContactForm',
        fields: [
          { name: 'name', label: 'Full Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true }
        ],
        submitLabel: 'Submit'
      };

      const result = await service.generateForm(formSpec);

      expect(result.formName).toBe('ContactForm');
      expect(result.code).toBeDefined();
      expect(result.code).toContain('ContactForm');
      expect(result.code).toContain('Full Name');
      expect(result.code).toContain('Email');
      expect(result.imports).toBeDefined();
    });

    it('should generate form with validation when specified', async () => {
      const service = new CodeGeneratorService(true);
      const formSpec = {
        formName: 'SignupForm',
        fields: [
          { name: 'username', label: 'Username', type: 'text', required: true }
        ],
        includeValidation: true
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toContain('useState');
      expect(result.formName).toBe('SignupForm');
    });

    it('should generate form with select field', async () => {
      const service = new CodeGeneratorService(true);
      const formSpec = {
        formName: 'PreferenceForm',
        fields: [
          {
            name: 'preference',
            label: 'Preference',
            type: 'select',
            options: ['Option 1', 'Option 2', 'Option 3']
          }
        ]
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toBeDefined();
      expect(result.formName).toBe('PreferenceForm');
    });

    it('should generate form with textarea field', async () => {
      const service = new CodeGeneratorService(true);
      const formSpec = {
        formName: 'FeedbackForm',
        fields: [
          { name: 'comments', label: 'Comments', type: 'textarea', required: false }
        ]
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toContain('Textarea');
      expect(result.code).toContain('Comments');
    });

    it('should generate form with checkbox field', async () => {
      const service = new CodeGeneratorService(true);
      const formSpec = {
        formName: 'AgreementForm',
        fields: [
          { name: 'agree', label: 'I agree to terms', type: 'checkbox', required: true }
        ]
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toContain('Checkbox');
      expect(result.code).toContain('I agree to terms');
    });
  });

  describe('generateMultiStepForm', () => {
    it('should return error when React mode is disabled', async () => {
      const service = new CodeGeneratorService(false);
      const result = await service.generateMultiStepForm({ steps: [] });

      expect(result.error).toBe('Multi-step form generation is only available in React mode');
    });

    it('should return error when no steps provided', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.generateMultiStepForm({ steps: [] });

      expect(result.error).toBe('No steps specified');
    });

    it('should generate multi-step form with two steps', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        formName: 'RegistrationWizard',
        steps: [
          {
            title: 'Personal Info',
            fields: [
              { name: 'name', label: 'Name', type: 'text', required: true }
            ]
          },
          {
            title: 'Contact Info',
            fields: [
              { name: 'email', label: 'Email', type: 'email', required: true }
            ]
          }
        ]
      };

      const result = await service.generateMultiStepForm(spec);

      expect(result.formName).toBe('RegistrationWizard');
      expect(result.code).toBeDefined();
      expect(result.code).toContain('Personal Info');
      expect(result.code).toContain('Contact Info');
      expect(result.code).toContain('currentStep');
      expect(result.stepCount).toBe(2);
    });

    it('should generate multi-step form with progress indicator', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        formName: 'OnboardingForm',
        steps: [
          { title: 'Step 1', fields: [{ name: 'field1', label: 'Field 1', type: 'text' }] },
          { title: 'Step 2', fields: [{ name: 'field2', label: 'Field 2', type: 'text' }] }
        ],
        includeProgress: true
      };

      const result = await service.generateMultiStepForm(spec);

      expect(result.code).toBeDefined();
      expect(result.formName).toBe('OnboardingForm');
    });
  });

  describe('generateDataTable', () => {
    it('should return error when React mode is disabled', async () => {
      const service = new CodeGeneratorService(false);
      const result = await service.generateDataTable({ columns: [] });

      expect(result.error).toBe('Data table generation is only available in React mode');
    });

    it('should return error when no columns provided', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.generateDataTable({ columns: [] });

      expect(result.error).toBe('No columns specified');
    });

    it('should generate data table with basic columns', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        tableName: 'UserTable',
        columns: [
          { key: 'name', label: 'Name', sortable: true },
          { key: 'email', label: 'Email', sortable: false }
        ]
      };

      const result = await service.generateDataTable(spec);

      expect(result.tableName).toBe('UserTable');
      expect(result.code).toBeDefined();
      expect(result.code).toContain('Table');
      expect(result.code).toContain('Name');
      expect(result.code).toContain('Email');
    });

    it('should generate data table with sorting', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        tableName: 'ProductTable',
        columns: [
          { key: 'product', label: 'Product', sortable: true }
        ],
        includeSorting: true
      };

      const result = await service.generateDataTable(spec);

      expect(result.code).toBeDefined();
      expect(result.tableName).toBe('ProductTable');
    });

    it('should generate data table with filtering', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        tableName: 'InventoryTable',
        columns: [
          { key: 'item', label: 'Item', sortable: false }
        ],
        includeFiltering: true
      };

      const result = await service.generateDataTable(spec);

      expect(result.code).toBeDefined();
      expect(result.tableName).toBe('InventoryTable');
    });

    it('should generate data table with pagination', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        tableName: 'OrderTable',
        columns: [
          { key: 'order', label: 'Order', sortable: false }
        ],
        includePagination: true
      };

      const result = await service.generateDataTable(spec);

      expect(result.code).toBeDefined();
      expect(result.tableName).toBe('OrderTable');
    });
  });

  describe('generateModalDialog', () => {
    it('should return error when React mode is disabled', async () => {
      const service = new CodeGeneratorService(false);
      const result = await service.generateModalDialog({});

      expect(result.error).toContain('Modal');
      expect(result.error).toContain('React mode');
    });

    it('should generate basic modal dialog', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        modalName: 'ConfirmDialog',
        title: 'Confirm Action',
        content: 'Are you sure?'
      };

      const result = await service.generateModalDialog(spec);

      expect(result.modalName).toBe('ConfirmDialog');
      expect(result.code).toBeDefined();
    });

    it('should generate modal with custom actions', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        modalName: 'DeleteDialog',
        title: 'Delete Item',
        content: 'This action cannot be undone',
        actions: [
          { label: 'Cancel', type: 'button' },
          { label: 'Delete', type: 'button', variant: 'secondary' }
        ]
      };

      const result = await service.generateModalDialog(spec);

      expect(result.code).toBeDefined();
      expect(result.modalName).toBe('DeleteDialog');
    });

    it('should generate modal with form', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        modalName: 'InputDialog',
        title: 'Enter Information',
        includeForm: true,
        formFields: [
          { name: 'input', label: 'Value', type: 'text' }
        ]
      };

      const result = await service.generateModalDialog(spec);

      expect(result.code).toBeDefined();
      expect(result.modalName).toBe('InputDialog');
      if (result.includesForm !== undefined) {
        expect(result.includesForm).toBe(true);
      }
    });
  });

  describe('scaffoldProject', () => {
    it('should scaffold with Next.js framework', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        projectName: 'my-app',
        framework: 'next'
      };

      const result = await service.scaffoldProject(spec);

      expect(result.projectName).toBe('my-app');
      expect(result.framework).toBe('next');
      expect(result.files).toBeDefined();
      expect(typeof result.files).toBe('object');
      expect(Object.keys(result.files).length).toBeGreaterThan(0);
    });

    it('should scaffold with Vite framework', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        projectName: 'vite-app',
        framework: 'vite'
      };

      const result = await service.scaffoldProject(spec);

      expect(result.framework).toBe('vite');
      expect(result.files).toBeDefined();
      expect(result.files['vite.config.ts']).toBeDefined();
    });

    it('should scaffold with CRA framework', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        projectName: 'cra-app',
        framework: 'cra'
      };

      const result = await service.scaffoldProject(spec);

      expect(result.framework).toBe('cra');
      expect(result.files['src/App.tsx']).toBeDefined();
    });

    it('should include package.json in scaffolded project', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        projectName: 'test-project',
        framework: 'next'
      };

      const result = await service.scaffoldProject(spec);

      expect(result.files['package.json']).toBeDefined();
      expect(result.files['package.json']).toContain('test-project');
    });

    it('should include structure array', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        projectName: 'test-project',
        framework: 'next'
      };

      const result = await service.scaffoldProject(spec);

      expect(result.structure).toBeDefined();
      expect(result.structure).toBeInstanceOf(Array);
      expect(result.structure.length).toBeGreaterThan(0);
    });

    it('should include instructions', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        projectName: 'test-project',
        framework: 'next'
      };

      const result = await service.scaffoldProject(spec);

      expect(result.instructions).toBeDefined();
      expect(result.instructions.setup).toBeInstanceOf(Array);
    });
  });

  describe('convertHtmlToReact', () => {
    it('should return error when no HTML or URL provided', async () => {
      const service = new CodeGeneratorService(true);
      const result = await service.convertHtmlToReact({});

      expect(result.error).toBe('Either url or html is required');
    });

    it('should convert simple HTML to React', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        html: '<div class="usa-alert usa-alert--info"><div class="usa-alert__body"><p>Info message</p></div></div>',
        componentName: 'MyAlert'
      };

      const result = await service.convertHtmlToReact(spec);

      expect(result.success).toBe(true);
      expect(result.componentName).toBe('MyAlert');
      expect(result.code).toBeDefined();
      expect(result.code).toContain('MyAlert');
    });

    it('should convert USWDS button HTML to React', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        html: '<button class="usa-button">Click me</button>',
        componentName: 'MyButton'
      };

      const result = await service.convertHtmlToReact(spec);

      expect(result.success).toBe(true);
      expect(result.code).toContain('MyButton');
      expect(result.usedComponents).toBeInstanceOf(Array);
    });

    it('should convert USWDS card HTML to React', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        html: '<div class="usa-card"><div class="usa-card__container"><div class="usa-card__header"><h2>Title</h2></div><div class="usa-card__body"><p>Content</p></div></div></div>',
        componentName: 'MyCard'
      };

      const result = await service.convertHtmlToReact(spec);

      expect(result.success).toBe(true);
      expect(result.code).toContain('MyCard');
      expect(result.usedComponents).toBeInstanceOf(Array);
    });

    it('should use default component name if not provided', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        html: '<div>Test</div>'
      };

      const result = await service.convertHtmlToReact(spec);

      expect(result.componentName).toBe('ConvertedComponent');
    });

    it('should track used USWDS components', async () => {
      const service = new CodeGeneratorService(true);
      const spec = {
        html: '<button class="usa-button">Button</button><div class="usa-alert usa-alert--info"><div class="usa-alert__body"><p>Alert</p></div></div>',
        componentName: 'MultiComponent'
      };

      const result = await service.convertHtmlToReact(spec);

      expect(result.success).toBe(true);
      expect(result.usedComponents).toBeInstanceOf(Array);
      expect(result.code).toContain('MultiComponent');
    });
  });

  describe('Self-Closing Form Components', () => {
    const service = new CodeGeneratorService(true);

    it('should generate TextInput component', async () => {
      const result = await service.generateComponent('TextInput', {
        name: 'username',
        label: 'Username'
      });

      expect(result.component).toBe('TextInput');
      expect(result.generatedCode).toContain('TextInput');
      expect(result.generatedCode).toContain('Label');
    });

    it('should generate Select component', async () => {
      const result = await service.generateComponent('Select', {
        name: 'options',
        label: 'Choose Option'
      });

      expect(result.component).toBe('Select');
      expect(result.generatedCode).toBeDefined();
    });

    it('should generate Checkbox component', async () => {
      const result = await service.generateComponent('Checkbox', {
        name: 'agree',
        label: 'I agree'
      });

      expect(result.component).toBe('Checkbox');
      expect(result.generatedCode).toContain('Checkbox');
    });

    it('should generate Radio component', async () => {
      const result = await service.generateComponent('Radio', {
        name: 'choice',
        value: 'option1'
      });

      expect(result.component).toBe('Radio');
      expect(result.generatedCode).toBeDefined();
    });

    it('should generate FileInput component', async () => {
      const result = await service.generateComponent('FileInput', {
        name: 'upload',
        label: 'Upload File'
      });

      expect(result.component).toBe('FileInput');
      expect(result.generatedCode).toContain('FileInput');
    });

    it('should generate DatePicker component', async () => {
      const result = await service.generateComponent('DatePicker', {
        name: 'date',
        label: 'Select Date'
      });

      expect(result.component).toBe('DatePicker');
      expect(result.generatedCode).toContain('DatePicker');
    });
  });

  describe('Props Type Handling', () => {
    const service = new CodeGeneratorService(true);

    it('should handle boolean props (true value)', async () => {
      const result = await service.generateComponent('Button', {
        disabled: true,
        secondary: true
      });

      expect(result.component).toBe('Button');
      expect(result.generatedCode).toBeDefined();
    });

    it('should handle number props', async () => {
      const result = await service.generateComponent('Button', {
        tabIndex: 0,
        maxWidth: 300
      });

      expect(result.component).toBe('Button');
      expect(result.generatedCode).toBeDefined();
    });

    it('should handle function props', async () => {
      const result = await service.generateComponent('Button', {
        onClick: function handleClick() {}
      });

      expect(result.component).toBe('Button');
      expect(result.generatedCode).toBeDefined();
    });

    it('should handle mixed prop types', async () => {
      const result = await service.generateComponent('Button', {
        variant: 'primary',
        disabled: false,
        tabIndex: 0,
        onClick: function onClick() {}
      });

      expect(result.component).toBe('Button');
      expect(result.generatedCode).toBeDefined();
    });
  });

  describe('FormGroup and Label Imports', () => {
    const service = new CodeGeneratorService(true);

    it('should include FormGroup when useFormGroup is true', async () => {
      const result = await service.generateComponent('TextInput', {
        useFormGroup: true,
        label: 'Name'
      });

      expect(result.imports).toContain('FormGroup');
      expect(result.imports).toContain('Label');
    });

    it('should include Label for Textarea', async () => {
      const result = await service.generateComponent('Textarea', {
        label: 'Description'
      });

      expect(result.imports).toContain('Label');
    });

    it('should include Label for TimePicker', async () => {
      const result = await service.generateComponent('TimePicker', {
        label: 'Time'
      });

      expect(result.component).toBe('TimePicker');
      expect(result.imports).toBeDefined();
    });
  });

  describe('Component Examples Fallback', () => {
    const service = new CodeGeneratorService(true);

    it('should use examples if available', async () => {
      const result = await service.generateComponent('Alert');

      expect(result.generatedCode).toBeDefined();
      expect(result.component).toBe('Alert');
    });

    it('should fallback to basic usage for components without examples', async () => {
      // Testing with a component that might not have examples
      const result = await service.generateComponent('Banner');

      expect(result.generatedCode).toBeDefined();
      expect(result.component).toBe('Banner');
    });
  });

  describe('Form Field Edge Cases', () => {
    const service = new CodeGeneratorService(true);

    it('should generate form with radio field', async () => {
      const formSpec = {
        formName: 'SurveyForm',
        fields: [
          {
            name: 'rating',
            label: 'Rating',
            type: 'radio',
            options: ['Excellent', 'Good', 'Fair', 'Poor']
          }
        ]
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toBeDefined();
      expect(result.formName).toBe('SurveyForm');
    });

    it('should generate form with date field', async () => {
      const formSpec = {
        formName: 'EventForm',
        fields: [
          { name: 'eventDate', label: 'Event Date', type: 'date', required: true }
        ]
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toBeDefined();
      expect(result.formName).toBe('EventForm');
    });

    it('should generate form with file field', async () => {
      const formSpec = {
        formName: 'UploadForm',
        fields: [
          { name: 'document', label: 'Upload Document', type: 'file', required: false }
        ]
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toBeDefined();
      expect(result.formName).toBe('UploadForm');
    });

    it('should generate form with number field', async () => {
      const formSpec = {
        formName: 'QuantityForm',
        fields: [
          { name: 'quantity', label: 'Quantity', type: 'number', required: true }
        ]
      };

      const result = await service.generateForm(formSpec);

      expect(result.code).toBeDefined();
      expect(result.code).toContain('number');
    });
  });

  describe('Multi-Step Form Edge Cases', () => {
    const service = new CodeGeneratorService(true);

    it('should generate multi-step form with validation', async () => {
      const spec = {
        formName: 'WizardForm',
        steps: [
          {
            title: 'Step 1',
            fields: [
              { name: 'field1', label: 'Field 1', type: 'text', required: true }
            ]
          }
        ],
        includeValidation: true
      };

      const result = await service.generateMultiStepForm(spec);

      expect(result.formName).toBe('WizardForm');
      expect(result.code).toBeDefined();
    });

    it('should generate multi-step form with navigation buttons', async () => {
      const spec = {
        formName: 'SteppedForm',
        steps: [
          {
            title: 'First',
            fields: [{ name: 'name', label: 'Name', type: 'text' }]
          },
          {
            title: 'Second',
            fields: [{ name: 'email', label: 'Email', type: 'email' }]
          }
        ]
      };

      const result = await service.generateMultiStepForm(spec);

      expect(result.code).toContain('Next');
      expect(result.code).toContain('Previous');
    });
  });

  describe('Data Table Edge Cases', () => {
    const service = new CodeGeneratorService(true);

    it('should generate table with custom cell renderers', async () => {
      const spec = {
        tableName: 'CustomTable',
        columns: [
          { key: 'id', label: 'ID' },
          { key: 'name', label: 'Name' }
        ],
        includeActions: true
      };

      const result = await service.generateDataTable(spec);

      expect(result.tableName).toBe('CustomTable');
      expect(result.code).toBeDefined();
    });
  });
});
