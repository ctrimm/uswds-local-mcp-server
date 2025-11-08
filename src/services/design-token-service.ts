export class DesignTokenService {
  async getTokens(category: string = 'all'): Promise<any> {
    const tokens: any = {
      color: {
        description: 'USWDS color design tokens',
        tokens: {
          // Primary colors
          'primary': { value: '#005ea2', description: 'Primary brand color', wcagContrast: { onWhite: '7.59:1' } },
          'primary-darker': { value: '#1a4480', description: 'Darker primary', wcagContrast: { onWhite: '11.37:1' } },
          'primary-vivid': { value: '#0050d8', description: 'Vivid primary', wcagContrast: { onWhite: '8.59:1' } },

          // Secondary colors
          'secondary': { value: '#d83933', description: 'Secondary brand color', wcagContrast: { onWhite: '4.75:1' } },
          'secondary-darker': { value: '#b50909', description: 'Darker secondary', wcagContrast: { onWhite: '6.77:1' } },
          'secondary-vivid': { value: '#e41d3d', description: 'Vivid secondary', wcagContrast: { onWhite: '4.85:1' } },

          // Accent colors
          'accent-warm': { value: '#fa9441', description: 'Warm accent color', wcagContrast: { onWhite: '2.93:1' } },
          'accent-cool': { value: '#00bde3', description: 'Cool accent color', wcagContrast: { onWhite: '2.65:1' } },

          // Base colors
          'base-darkest': { value: '#1b1b1b', description: 'Darkest base', wcagContrast: { onWhite: '16.56:1' } },
          'base-darker': { value: '#454545', description: 'Darker base', wcagContrast: { onWhite: '11.98:1' } },
          'base': { value: '#71767a', description: 'Base gray', wcagContrast: { onWhite: '5.74:1' } },
          'base-lighter': { value: '#a9aeb1', description: 'Lighter base', wcagContrast: { onWhite: '3.00:1' } },
          'base-lightest': { value: '#dfe1e2', description: 'Lightest base', wcagContrast: { onWhite: '1.46:1' } },

          // State colors
          'success': { value: '#00a91c', description: 'Success state', wcagContrast: { onWhite: '4.55:1' } },
          'warning': { value: '#ffbe2e', description: 'Warning state', wcagContrast: { onWhite: '1.79:1' } },
          'error': { value: '#d54309', description: 'Error state', wcagContrast: { onWhite: '5.21:1' } },
          'info': { value: '#00bde3', description: 'Info state', wcagContrast: { onWhite: '2.65:1' } },

          // Text colors
          'ink': { value: '#1b1b1b', description: 'Primary text color', wcagContrast: { onWhite: '16.56:1' } },
        },
        usage: {
          classes: 'Use utility classes like "bg-primary", "text-primary", "border-primary"',
          tokens: 'In CSS: use var(--color-primary)',
          accessibility: 'Ensure 4.5:1 contrast for normal text, 3:1 for large text (18pt+)'
        }
      },

      spacing: {
        description: 'USWDS spacing design tokens (units system)',
        tokens: {
          '05': { value: '4px', rem: '0.25rem', description: 'Extra small spacing' },
          '1': { value: '8px', rem: '0.5rem', description: 'Small spacing' },
          '105': { value: '12px', rem: '0.75rem', description: 'Medium-small spacing' },
          '2': { value: '16px', rem: '1rem', description: 'Base spacing unit' },
          '205': { value: '20px', rem: '1.25rem', description: 'Medium spacing' },
          '3': { value: '24px', rem: '1.5rem', description: 'Medium-large spacing' },
          '4': { value: '32px', rem: '2rem', description: 'Large spacing' },
          '5': { value: '40px', rem: '2.5rem', description: 'Extra large spacing' },
          '6': { value: '48px', rem: '3rem', description: 'XXL spacing' },
          '7': { value: '56px', rem: '3.5rem', description: 'XXXL spacing' },
          '8': { value: '64px', rem: '4rem', description: 'Huge spacing' },
          '9': { value: '72px', rem: '4.5rem', description: 'Extra huge spacing' },
        },
        usage: {
          classes: 'Use utility classes like "padding-2", "margin-top-3", "gap-205"',
          tokens: 'In CSS: use var(--spacing-2) or units(2)',
          recommendation: 'Use the units system for consistent spacing throughout your application'
        }
      },

      typography: {
        description: 'USWDS typography design tokens',
        tokens: {
          // Font families
          'sans': { value: '"Source Sans Pro Web", "Helvetica Neue", Helvetica, Roboto, Arial, sans-serif', description: 'Sans-serif family' },
          'serif': { value: '"Merriweather Web", Georgia, Cambria, "Times New Roman", Times, serif', description: 'Serif family' },
          'mono': { value: '"Roboto Mono Web", "Bitstream Vera Sans Mono", "Consolas", "Courier", monospace', description: 'Monospace family' },

          // Font sizes
          'micro': { value: '10px', description: 'Micro text' },
          'xs': { value: '12px', description: 'Extra small text' },
          'sm': { value: '13px', description: 'Small text' },
          'md': { value: '14px', description: 'Medium text' },
          'base': { value: '16px', description: 'Base body text' },
          'lg': { value: '18px', description: 'Large text' },
          'xl': { value: '20px', description: 'Extra large text' },
          '2xl': { value: '24px', description: 'Heading size' },
          '3xl': { value: '32px', description: 'Large heading' },
          '4xl': { value: '40px', description: 'Display heading' },

          // Font weights
          'light': { value: '300', description: 'Light weight' },
          'normal': { value: '400', description: 'Normal weight' },
          'semibold': { value: '600', description: 'Semibold weight' },
          'bold': { value: '700', description: 'Bold weight' },
        },
        usage: {
          classes: 'Use utility classes like "font-sans-lg", "font-serif-2xl", "text-bold"',
          tokens: 'In CSS: use var(--font-sans), var(--font-lg), var(--font-weight-bold)',
          accessibility: 'Maintain adequate line height (1.5 minimum) and readable font sizes (16px+ for body)'
        }
      },

      breakpoints: {
        description: 'USWDS responsive breakpoints',
        tokens: {
          'mobile': { value: '320px', description: 'Mobile devices' },
          'mobile-lg': { value: '480px', description: 'Large mobile devices' },
          'tablet': { value: '640px', description: 'Tablet devices' },
          'tablet-lg': { value: '880px', description: 'Large tablets' },
          'desktop': { value: '1024px', description: 'Desktop screens' },
          'desktop-lg': { value: '1200px', description: 'Large desktops' },
          'widescreen': { value: '1400px', description: 'Widescreen displays' },
        },
        usage: {
          classes: 'Use responsive utilities like "tablet:display-flex", "desktop:grid-col-6"',
          tokens: 'In CSS: use @media (min-width: $theme-desktop)',
          strategy: 'USWDS uses mobile-first approach - start with mobile and add breakpoints up'
        }
      }
    };

    if (category === 'all') {
      return {
        categories: Object.keys(tokens),
        tokens,
        documentation: 'https://designsystem.digital.gov/design-tokens/',
        usage: 'Design tokens ensure visual consistency and make theme changes easier'
      };
    }

    const categoryData = tokens[category];
    if (!categoryData) {
      return {
        error: `Category "${category}" not found`,
        availableCategories: Object.keys(tokens)
      };
    }

    return {
      category,
      ...categoryData,
      documentation: `https://designsystem.digital.gov/design-tokens/${category}/`
    };
  }

  getTokenRecommendation(value: string): string | null {
    // Help developers find the right token for a hard-coded value
    const valueMap: Record<string, string> = {
      // Colors
      '#005ea2': 'primary',
      '#1a4480': 'primary-darker',
      '#d83933': 'secondary',
      '#1b1b1b': 'base-darkest or ink',
      '#71767a': 'base',

      // Spacing
      '4px': 'units-05 or spacing-05',
      '8px': 'units-1 or spacing-1',
      '16px': 'units-2 or spacing-2',
      '24px': 'units-3 or spacing-3',
      '32px': 'units-4 or spacing-4',
    };

    return valueMap[value.toLowerCase()] || null;
  }
}
