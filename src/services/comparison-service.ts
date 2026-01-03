/**
 * Comparison Service
 * Compare components side-by-side to understand differences
 */

import { REACT_COMPONENTS } from '../data/react-components.js';

export class ComparisonService {
  private useReact: boolean;

  constructor(useReact: boolean = false) {
    this.useReact = useReact;
  }

  /**
   * Compare two components
   */
  async compareComponents(component1: string, component2: string, framework?: 'react' | 'vanilla' | 'tailwind'): Promise<any> {
    // Determine which framework to use: parameter takes precedence over constructor setting
    const useReact = framework === 'react' || (framework === undefined && this.useReact);
    const useTailwind = framework === 'tailwind';
    const useVanilla = framework === 'vanilla' || (!useReact && !useTailwind);

    if (useTailwind) {
      return {
        mode: 'tailwind-uswds',
        message: 'Component comparison is not yet available for Tailwind USWDS',
        suggestion: 'Use get_tailwind_uswds_component to view individual components'
      };
    }

    if (useVanilla) {
      return {
        mode: 'vanilla-uswds',
        message: 'Component comparison is only available in React mode',
        suggestion: 'Use framework="react" to compare React components'
      };
    }

    const comp1 = REACT_COMPONENTS[component1];
    const comp2 = REACT_COMPONENTS[component2];

    if (!comp1 && !comp2) {
      return {
        error: 'Neither component found',
        message: `"${component1}" and "${component2}" are not valid component names`,
        hint: 'Use list_components to see available components'
      };
    }

    if (!comp1) {
      return {
        error: `Component "${component1}" not found`,
        message: 'Check the component name spelling',
        suggestion: this.findSimilarComponents(component1)
      };
    }

    if (!comp2) {
      return {
        error: `Component "${component2}" not found`,
        message: 'Check the component name spelling',
        suggestion: this.findSimilarComponents(component2)
      };
    }

    // Build comparison
    const comparison = {
      components: {
        [component1]: {
          name: comp1.name,
          category: comp1.category,
          description: comp1.description,
          url: comp1.url
        },
        [component2]: {
          name: comp2.name,
          category: comp2.category,
          description: comp2.description,
          url: comp2.url
        }
      },
      similarities: this.findSimilarities(comp1, comp2, component1, component2),
      differences: this.findDifferences(comp1, comp2, component1, component2),
      props: {
        [component1]: {
          count: comp1.props.length,
          unique: this.getUniqueProps(comp1.props, comp2.props),
          shared: this.getSharedProps(comp1.props, comp2.props)
        },
        [component2]: {
          count: comp2.props.length,
          unique: this.getUniqueProps(comp2.props, comp1.props),
          shared: this.getSharedProps(comp2.props, comp1.props)
        }
      },
      whenToUse: this.getUsageGuidance(comp1, comp2, component1, component2),
      recommendation: this.getRecommendation(comp1, comp2, component1, component2)
    };

    return comparison;
  }

  /**
   * Find similar components for suggestions
   */
  private findSimilarComponents(name: string): string {
    const nameLower = name.toLowerCase();
    const similar = Object.keys(REACT_COMPONENTS).filter(key =>
      key.toLowerCase().includes(nameLower) ||
      nameLower.includes(key.toLowerCase())
    );

    return similar.length > 0
      ? `Did you mean: ${similar.join(', ')}?`
      : 'No similar components found';
  }

  /**
   * Find similarities between two components
   */
  private findSimilarities(comp1: any, comp2: any, name1: string, name2: string): string[] {
    const similarities: string[] = [];

    if (comp1.category === comp2.category) {
      similarities.push(`Both are ${comp1.category} components`);
    }

    const sharedProps = this.getSharedProps(comp1.props, comp2.props);
    if (sharedProps.length > 0) {
      similarities.push(`Share ${sharedProps.length} common props: ${sharedProps.slice(0, 3).join(', ')}${sharedProps.length > 3 ? ', ...' : ''}`);
    }

    // Check for common patterns in descriptions
    const desc1Lower = comp1.description.toLowerCase();
    const desc2Lower = comp2.description.toLowerCase();

    if ((desc1Lower.includes('form') && desc2Lower.includes('form')) ||
        (desc1Lower.includes('input') && desc2Lower.includes('input'))) {
      similarities.push('Both are form input components');
    }

    if ((desc1Lower.includes('alert') && desc2Lower.includes('alert')) ||
        (desc1Lower.includes('message') && desc2Lower.includes('message'))) {
      similarities.push('Both display messages or alerts');
    }

    if ((desc1Lower.includes('navigat') && desc2Lower.includes('navigat'))) {
      similarities.push('Both are navigation components');
    }

    if (similarities.length === 0) {
      similarities.push('Limited similarities - these are distinct components');
    }

    return similarities;
  }

  /**
   * Find differences between two components
   */
  private findDifferences(comp1: any, comp2: any, name1: string, name2: string): any {
    return {
      category: comp1.category !== comp2.category
        ? `${name1} is ${comp1.category}, ${name2} is ${comp2.category}`
        : null,
      propCount: `${name1} has ${comp1.props.length} props, ${name2} has ${comp2.props.length} props`,
      accessibility: this.compareAccessibility(comp1, comp2, name1, name2),
      examples: `${name1} has ${comp1.examples.length} examples, ${name2} has ${comp2.examples.length} examples`,
      specializations: this.findSpecializations(comp1, comp2, name1, name2)
    };
  }

  /**
   * Compare accessibility features
   */
  private compareAccessibility(comp1: any, comp2: any, name1: string, name2: string): string {
    const aria1 = comp1.accessibility?.ariaAttributes?.length || 0;
    const aria2 = comp2.accessibility?.ariaAttributes?.length || 0;

    if (aria1 > aria2) {
      return `${name1} has more ARIA attributes (${aria1} vs ${aria2})`;
    } else if (aria2 > aria1) {
      return `${name2} has more ARIA attributes (${aria2} vs ${aria1})`;
    }

    return 'Both have similar accessibility requirements';
  }

  /**
   * Find unique specializations
   */
  private findSpecializations(comp1: any, comp2: any, name1: string, name2: string): string[] {
    const specs: string[] = [];

    // Check for specific prop types that indicate specialization
    const hasDateProps1 = comp1.props.some((p: any) => p.name.toLowerCase().includes('date'));
    const hasDateProps2 = comp2.props.some((p: any) => p.name.toLowerCase().includes('date'));

    if (hasDateProps1 && !hasDateProps2) {
      specs.push(`${name1} is specialized for date handling`);
    } else if (hasDateProps2 && !hasDateProps1) {
      specs.push(`${name2} is specialized for date handling`);
    }

    const hasFileProps1 = comp1.props.some((p: any) => p.name.toLowerCase().includes('file'));
    const hasFileProps2 = comp2.props.some((p: any) => p.name.toLowerCase().includes('file'));

    if (hasFileProps1 && !hasFileProps2) {
      specs.push(`${name1} is specialized for file handling`);
    } else if (hasFileProps2 && !hasFileProps1) {
      specs.push(`${name2} is specialized for file handling`);
    }

    return specs.length > 0 ? specs : ['No major specializations detected'];
  }

  /**
   * Get unique props
   */
  private getUniqueProps(props1: any[], props2: any[]): string[] {
    const names2 = new Set(props2.map(p => p.name));
    return props1
      .filter(p => !names2.has(p.name))
      .map(p => p.name)
      .slice(0, 5); // Limit to 5
  }

  /**
   * Get shared props
   */
  private getSharedProps(props1: any[], props2: any[]): string[] {
    const names2 = new Set(props2.map(p => p.name));
    return props1
      .filter(p => names2.has(p.name))
      .map(p => p.name);
  }

  /**
   * Get usage guidance
   */
  private getUsageGuidance(comp1: any, comp2: any, name1: string, name2: string): any {
    const guidance: any = {};

    // Provide context-specific guidance
    if (name1 === 'Alert' && name2 === 'SiteAlert') {
      guidance[name1] = 'Use for contextual messages within page content';
      guidance[name2] = 'Use for site-wide announcements at the top of the page';
    } else if (name1 === 'Select' && name2 === 'ComboBox') {
      guidance[name1] = 'Use for standard dropdown selections with predefined options';
      guidance[name2] = 'Use when users need to search/filter a large list of options';
    } else if (name1 === 'TextInput' && name2 === 'Textarea') {
      guidance[name1] = 'Use for single-line text input';
      guidance[name2] = 'Use for multi-line text input';
    } else if (name1 === 'Button' && name2 === 'ButtonGroup') {
      guidance[name1] = 'Use for single actions';
      guidance[name2] = 'Use for multiple related actions';
    } else if (name1.includes('Date') && name2.includes('Date')) {
      guidance[name1] = REACT_COMPONENTS[name1].description;
      guidance[name2] = REACT_COMPONENTS[name2].description;
    } else {
      guidance[name1] = comp1.description;
      guidance[name2] = comp2.description;
    }

    return guidance;
  }

  /**
   * Get recommendation
   */
  private getRecommendation(comp1: any, comp2: any, name1: string, name2: string): string {
    if (comp1.category !== comp2.category) {
      return `These components serve different purposes. Choose based on your use case: ${name1} for ${comp1.category}, ${name2} for ${comp2.category}.`;
    }

    // Specific recommendations for common comparisons
    if ((name1 === 'Alert' && name2 === 'SiteAlert') || (name1 === 'SiteAlert' && name2 === 'Alert')) {
      return 'Use Alert for inline messages within content. Use SiteAlert for important site-wide announcements.';
    }

    if ((name1 === 'Select' && name2 === 'ComboBox') || (name1 === 'ComboBox' && name2 === 'Select')) {
      return 'Use Select for short lists. Use ComboBox for long lists that need search functionality.';
    }

    if ((name1 === 'TextInput' && name2 === 'Textarea') || (name1 === 'Textarea' && name2 === 'TextInput')) {
      return 'Use TextInput for single-line inputs. Use Textarea for multi-line content.';
    }

    return `Both are ${comp1.category} components. Review the props and examples to determine which fits your needs better.`;
  }
}
