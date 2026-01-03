/**
 * MCP Tool Handlers
 *
 * Executes tool calls and returns results.
 * Shared across Lambda and stdio transports.
 */

import { ComponentService } from '../../services/component-service.js';
import { DesignTokenService } from '../../services/design-token-service.js';
import { ValidationService } from '../../services/validation-service.js';
import { ColorContrastService } from '../../services/color-contrast-service.js';
import { IconService } from '../../services/icon-service.js';
import { LayoutService } from '../../services/layout-service.js';
import { SuggestionService } from '../../services/suggestion-service.js';
import { ComparisonService } from '../../services/comparison-service.js';
import { CodeGeneratorService } from '../../services/code-generator-service.js';
import { TailwindUSWDSService } from '../../services/tailwind-uswds-service.js';

export interface Services {
  componentService: ComponentService;
  designTokenService: DesignTokenService;
  validationService: ValidationService;
  colorContrastService: ColorContrastService;
  iconService: IconService;
  layoutService: LayoutService;
  suggestionService: SuggestionService;
  comparisonService: ComparisonService;
  codeGeneratorService: CodeGeneratorService;
  tailwindUSWDSService: TailwindUSWDSService;
}

/**
 * Execute a tool call and return the result
 */
export async function handleToolCall(
  toolName: string,
  args: any,
  services: Services
): Promise<any> {
  const {
    componentService,
    designTokenService,
    validationService,
    colorContrastService,
    iconService,
    layoutService,
    suggestionService,
    comparisonService,
    codeGeneratorService,
    tailwindUSWDSService,
  } = services;

  switch (toolName) {
    case 'list_components': {
      const framework = args?.framework as 'react' | 'vanilla' | 'tailwind' | undefined;
      const category = args?.category || 'all';

      return framework === 'tailwind'
        ? await tailwindUSWDSService.listComponents(category)
        : await componentService.listComponents(category, framework);
    }

    case 'get_component_info': {
      const framework = args?.framework as 'react' | 'vanilla' | 'tailwind' | undefined;
      const componentName = args?.component_name as string;
      const includeExamples = args?.include_examples !== false;

      return framework === 'tailwind'
        ? await tailwindUSWDSService.getComponentDocs(componentName)
        : await componentService.getComponentInfo(componentName, includeExamples, framework);
    }

    case 'get_design_tokens':
      return await designTokenService.getTokens(args?.category || 'all');

    case 'validate_uswds_code':
      return await validationService.validate(
        args?.code as string,
        args?.framework === 'react',
        true // checkAccessibility
      );

    case 'check_color_contrast':
      return await colorContrastService.checkContrast(
        args?.foreground as string,
        args?.background as string
      );

    case 'search_icons':
      return await iconService.getIcons(undefined, args?.query as string);

    case 'suggest_layout':
      return await layoutService.suggestLayout(
        args?.page_type as string,
        args?.framework as 'react' | 'vanilla' | 'tailwind' | undefined
      );

    case 'suggest_components':
      return await suggestionService.suggestComponents(
        args?.use_case as string,
        args?.framework as 'react' | 'vanilla' | 'tailwind' | undefined
      );

    case 'compare_components':
      const components = args?.components as string[];
      return await comparisonService.compareComponents(
        components?.[0] || '',
        components?.[1] || '',
        args?.framework as 'react' | 'vanilla' | 'tailwind' | undefined
      );

    case 'generate_component_code':
      return await codeGeneratorService.generateComponent(
        args?.component_name as string,
        {
          props: args?.props,
          framework: args?.framework as string,
        }
      );

    // Tailwind USWDS tools
    case 'get_tailwind_uswds_getting_started':
      return await tailwindUSWDSService.getGettingStarted();

    case 'get_tailwind_uswds_component':
      return await tailwindUSWDSService.getComponentDocs(args?.component_name as string);

    case 'get_tailwind_uswds_javascript':
      return await tailwindUSWDSService.getJavaScriptDocs();

    case 'get_tailwind_uswds_colors':
      return await tailwindUSWDSService.getColorsDocs();

    case 'get_tailwind_uswds_icons':
      return await tailwindUSWDSService.getIconsDocs();

    case 'get_tailwind_uswds_typography':
      return await tailwindUSWDSService.getTypographyDocs();

    case 'search_tailwind_uswds_docs':
      return await tailwindUSWDSService.searchDocs(args?.query as string);

    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
