/**
 * Layout Service
 * Provides common layout patterns using USWDS Grid
 */

import { LAYOUT_PATTERNS } from '../data/layout-patterns.js';

export class LayoutService {
  private useReact: boolean;

  constructor(useReact: boolean = false) {
    this.useReact = useReact;
  }

  /**
   * Get all layout patterns
   */
  async getLayouts(): Promise<any> {
    const layouts = Object.entries(LAYOUT_PATTERNS).map(([key, pattern]) => ({
      key,
      name: pattern.name,
      description: pattern.description,
      useCase: pattern.useCase,
      responsive: pattern.responsive
    }));

    return {
      total: layouts.length,
      mode: this.useReact ? 'react' : 'html',
      layouts,
      gridDocs: 'https://designsystem.digital.gov/utilities/layout-grid/',
      note: 'All layouts are responsive and follow USWDS Grid system'
    };
  }

  /**
   * Get a specific layout pattern with code
   */
  async getLayout(layoutKey: string): Promise<any> {
    // Normalize key
    const normalizedKey = layoutKey.toLowerCase().replace(/\s+/g, '-');
    const pattern = LAYOUT_PATTERNS[normalizedKey];

    if (!pattern) {
      const available = Object.keys(LAYOUT_PATTERNS);
      return {
        error: `Layout pattern "${layoutKey}" not found`,
        suggestion: `Available layouts: ${available.join(', ')}`,
        hint: 'Use get_layout_patterns to browse all layouts'
      };
    }

    return {
      name: pattern.name,
      description: pattern.description,
      useCase: pattern.useCase,
      responsive: pattern.responsive,
      code: this.useReact ? pattern.code.react : pattern.code.html,
      mode: this.useReact ? 'react' : 'html',
      breakpoints: {
        mobile: '0px - 639px (grid-col-*)',
        tablet: '640px - 1023px (tablet:grid-col-*)',
        desktop: '1024px+ (desktop:grid-col-*)'
      },
      gridUtilities: {
        gap: 'grid-gap - Adds gutters between columns',
        offset: 'grid-offset-* - Offset columns',
        flex: 'flex-* utilities - For flexbox alignment',
        sticky: 'position-sticky - For sticky sidebars'
      },
      tips: [
        'Use GridContainer to center and constrain content width',
        'Grid system is 12 columns by default',
        'Use responsive props for different breakpoints',
        'Add grid-gap for consistent spacing between columns',
        'Combine with utility classes for margins and padding'
      ],
      resources: [
        { title: 'USWDS Grid', url: 'https://designsystem.digital.gov/utilities/layout-grid/' },
        { title: 'Responsive Design', url: 'https://designsystem.digital.gov/utilities/layout-grid/#responsive-classes' }
      ]
    };
  }

  /**
   * Suggest layouts based on use case
   */
  async suggestLayout(useCase: string): Promise<any> {
    const useCaseLower = useCase.toLowerCase();
    const suggestions: any[] = [];

    Object.entries(LAYOUT_PATTERNS).forEach(([key, pattern]) => {
      const relevance = pattern.useCase.filter(uc =>
        uc.toLowerCase().includes(useCaseLower) ||
        useCaseLower.includes(uc.toLowerCase())
      ).length;

      if (relevance > 0) {
        suggestions.push({
          key,
          name: pattern.name,
          description: pattern.description,
          relevance,
          matchedUseCases: pattern.useCase.filter(uc =>
            uc.toLowerCase().includes(useCaseLower) ||
            useCaseLower.includes(uc.toLowerCase())
          )
        });
      }
    });

    // Sort by relevance
    suggestions.sort((a, b) => b.relevance - a.relevance);

    if (suggestions.length === 0) {
      return {
        useCase,
        message: 'No exact matches found',
        recommendation: 'Browse all layouts with get_layout_patterns',
        commonPatterns: [
          'single-column - For focused content',
          'sidebar-content - For documentation',
          'card-grid - For lists and catalogs',
          'dashboard - For data displays'
        ]
      };
    }

    return {
      useCase,
      matches: suggestions.length,
      suggestions,
      hint: 'Use get_layout_patterns with the layout key to get code'
    };
  }
}
