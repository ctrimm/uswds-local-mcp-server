/**
 * Code Generator Service (Modular Entry Point)
 *
 * This module provides a clean interface to the code generator.
 * The actual implementation is temporarily in the legacy service file.
 *
 * Future refactoring will break down the generator into:
 * - generators/react/ - React component generators
 * - generators/html/ - HTML component generators
 * - generators/tailwind/ - Tailwind component generators
 * - templates/ - Code templates
 * - utils/ - Shared utilities
 */

import { CodeGeneratorService as LegacyCodeGenerator } from '../code-generator-service.js';
import { GenerateOptions, FormSpec } from './types.js';

export class CodeGeneratorService {
  private legacy: LegacyCodeGenerator;

  constructor(useReact: boolean = false) {
    this.legacy = new LegacyCodeGenerator(useReact);
  }

  /**
   * Generate component code
   */
  async generateComponent(
    componentName: string,
    requirements: GenerateOptions = {}
  ) {
    return this.legacy.generateComponent(componentName, requirements);
  }

  /**
   * Generate a complete form
   */
  async generateForm(formSpec: FormSpec) {
    return this.legacy.generateForm(formSpec);
  }
}

// Re-export types
export type { GenerateOptions, FormSpec, FormField, GeneratedCode } from './types.js';
