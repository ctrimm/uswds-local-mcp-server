/**
 * Suggestion Service
 * AI-assisted component recommendations based on use case
 */

import { REACT_COMPONENTS } from '../data/react-components.js';

interface ComponentSuggestion {
  component: string;
  relevance: 'high' | 'medium' | 'low';
  reason: string;
  example?: string;
}

export class SuggestionService {
  private useReact: boolean;

  constructor(useReact: boolean = false) {
    this.useReact = useReact;
  }

  /**
   * Suggest components based on use case description
   */
  async suggestComponents(useCase: string, framework?: 'react' | 'vanilla' | 'tailwind'): Promise<any> {
    // Determine which framework to use: parameter takes precedence over constructor setting
    const useReact = framework === 'react' || (framework === undefined && this.useReact);
    const useTailwind = framework === 'tailwind';
    const useVanilla = framework === 'vanilla' || (!useReact && !useTailwind);

    // Tailwind support is limited (no component database yet)
    if (useTailwind) {
      return {
        mode: 'tailwind-uswds',
        message: 'Tailwind USWDS suggestions are limited. Use search_tailwind_uswds_docs or get_tailwind_uswds_component for specific components.',
        generalGuidance: this.getGeneralGuidance(useCase),
        suggestedTools: [
          'search_tailwind_uswds_docs',
          'get_tailwind_uswds_component',
          'get_tailwind_uswds_getting_started'
        ]
      };
    }

    // Vanilla mode provides general guidance
    if (useVanilla) {
      return {
        error: 'Component suggestions work best with React mode',
        mode: 'vanilla-uswds',
        message: 'Component suggestions work best with React-USWDS. Set USE_REACT_COMPONENTS=true for detailed suggestions. For vanilla USWDS, see general guidance below.',
        generalGuidance: this.getGeneralGuidance(useCase),
        suggestedAction: 'Use list_components with framework="vanilla" to browse all available components'
      };
    }

    const suggestions: ComponentSuggestion[] = [];
    const useCaseLower = useCase.toLowerCase();

    // Keyword-based matching
    const keywords = this.extractKeywords(useCaseLower);

    // Analyze use case and suggest components
    Object.entries(REACT_COMPONENTS).forEach(([name, component]) => {
      const matches = this.calculateRelevance(
        useCaseLower,
        keywords,
        component.name,
        component.description,
        component.category
      );

      if (matches.score > 0) {
        suggestions.push({
          component: name,
          relevance: matches.score >= 3 ? 'high' : matches.score >= 2 ? 'medium' : 'low',
          reason: matches.reason,
          example: component.examples?.[0]?.code
        });
      }
    });

    // Sort by relevance
    suggestions.sort((a, b) => {
      const scoreMap = { high: 3, medium: 2, low: 1 };
      return scoreMap[b.relevance] - scoreMap[a.relevance];
    });

    // Limit results
    const topSuggestions = suggestions.slice(0, 5);

    if (topSuggestions.length === 0) {
      return {
        useCase,
        message: 'No specific components match your use case',
        suggestion: 'Try rephrasing or browse components by category',
        categories: ['forms', 'navigation', 'ui', 'layout'],
        hint: 'Use list_components to browse all available components'
      };
    }

    return {
      useCase,
      mode: 'react-uswds',
      suggestions: topSuggestions.map(s => ({
        component: s.component,
        relevance: s.relevance,
        reason: s.reason,
        documentation: `Use get_component_info with "${s.component}" for full details`,
        category: REACT_COMPONENTS[s.component].category
      })),
      additionalOptions: suggestions.length > 5
        ? `${suggestions.length - 5} more components may be relevant`
        : null,
      nextSteps: [
        'Use get_component_info to see props and examples',
        'Use generate_component_code to create working code',
        'Use compare_components to understand differences'
      ]
    };
  }

  /**
   * Extract keywords from use case
   */
  private extractKeywords(text: string): string[] {
    const stopWords = new Set(['a', 'an', 'the', 'to', 'for', 'of', 'in', 'on', 'with', 'is', 'are', 'be', 'i', 'need', 'want', 'how', 'show', 'display']);
    return text
      .split(/\s+/)
      .map(word => word.replace(/[^\w]/g, ''))
      .filter(word => word.length > 2 && !stopWords.has(word));
  }

  /**
   * Calculate relevance score for a component
   */
  private calculateRelevance(
    useCase: string,
    keywords: string[],
    componentName: string,
    description: string,
    category: string
  ): { score: number; reason: string } {
    let score = 0;
    const reasons: string[] = [];

    const componentLower = componentName.toLowerCase();
    const descriptionLower = description.toLowerCase();

    // Direct component name match
    if (useCase.includes(componentLower)) {
      score += 3;
      reasons.push(`Matches component name "${componentName}"`);
    }

    // Category-specific matching
    if (useCase.includes('form') || useCase.includes('input') || useCase.includes('submit')) {
      if (category === 'forms') {
        score += 2;
        reasons.push('Form-related component');
      }
    }

    if (useCase.includes('navigate') || useCase.includes('menu') || useCase.includes('link')) {
      if (category === 'navigation') {
        score += 2;
        reasons.push('Navigation component');
      }
    }

    if (useCase.includes('message') || useCase.includes('notify') || useCase.includes('alert')) {
      if (componentName === 'Alert' || componentName === 'SiteAlert' || componentName === 'Banner') {
        score += 3;
        reasons.push('Displays messages or notifications');
      }
    }

    if (useCase.includes('button') || useCase.includes('click') || useCase.includes('action')) {
      if (componentName === 'Button' || componentName === 'ButtonGroup') {
        score += 3;
        reasons.push('Interactive button component');
      }
    }

    // Keyword matches in description
    keywords.forEach(keyword => {
      if (descriptionLower.includes(keyword)) {
        score += 1;
        if (reasons.length < 3) {
          reasons.push(`Description mentions "${keyword}"`);
        }
      }
    });

    // Specific use case patterns
    if (useCase.includes('success') && componentName === 'Alert') {
      score += 2;
      reasons.push('Alert can show success messages');
    }

    if (useCase.includes('password') && componentName === 'TextInput') {
      score += 2;
      reasons.push('TextInput supports password type');
    }

    if (useCase.includes('dropdown') || useCase.includes('select') || useCase.includes('choose')) {
      if (componentName === 'Select' || componentName === 'ComboBox') {
        score += 3;
        reasons.push('Dropdown selection component');
      }
    }

    if (useCase.includes('date') || useCase.includes('calendar')) {
      if (componentName.includes('Date')) {
        score += 3;
        reasons.push('Date selection component');
      }
    }

    if (useCase.includes('file') || useCase.includes('upload')) {
      if (componentName === 'FileInput') {
        score += 3;
        reasons.push('File upload component');
      }
    }

    if (useCase.includes('card') || useCase.includes('preview')) {
      if (componentName === 'Card') {
        score += 2;
        reasons.push('Card component for content display');
      }
    }

    if (useCase.includes('table') || useCase.includes('data') || useCase.includes('list')) {
      if (componentName === 'Table') {
        score += 2;
        reasons.push('Table for structured data');
      }
    }

    return {
      score,
      reason: reasons.length > 0 ? reasons.join('; ') : 'General match'
    };
  }

  /**
   * General guidance for vanilla USWDS
   */
  private getGeneralGuidance(useCase: string): string {
    const useCaseLower = useCase.toLowerCase();

    if (useCaseLower.includes('form') || useCaseLower.includes('input')) {
      return 'For forms, use USWDS form components: text input, select, checkbox, radio, textarea. See https://designsystem.digital.gov/components/form/';
    }

    if (useCaseLower.includes('alert') || useCaseLower.includes('message')) {
      return 'For messages, use Alert component. See https://designsystem.digital.gov/components/alert/';
    }

    if (useCaseLower.includes('button')) {
      return 'For buttons, use Button component. See https://designsystem.digital.gov/components/button/';
    }

    if (useCaseLower.includes('navigate') || useCaseLower.includes('menu')) {
      return 'For navigation, consider Header, SideNav, or Breadcrumb. See https://designsystem.digital.gov/components/';
    }

    return 'Browse USWDS components at https://designsystem.digital.gov/components/';
  }
}
