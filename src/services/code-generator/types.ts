/**
 * Code Generator Types
 */

export interface GenerateOptions {
  props?: any;
  framework?: string;
  [key: string]: any;
}

export interface GeneratedCode {
  component: string;
  description: string;
  generatedCode: string;
  requirements: GenerateOptions;
  imports: string[];
  usage: string;
  nextSteps: string[];
  documentation?: string;
  error?: string;
  message?: string;
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

export interface FormSpec {
  formName?: string;
  fields: FormField[];
  submitLabel?: string;
  includeValidation?: boolean;
}
