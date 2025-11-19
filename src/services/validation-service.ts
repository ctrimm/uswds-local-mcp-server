interface ValidationIssue {
  line?: number;
  column?: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
  rule: string;
  suggestion?: string;
}

interface ValidationResult {
  valid: boolean;
  mode: 'react' | 'vanilla';
  score: number;
  issues: ValidationIssue[];
  summary: string;
  suggestions: string[];
}

export class ValidationService {
  async validate(
    code: string,
    isReact: boolean,
    checkAccessibility: boolean
  ): Promise<ValidationResult> {
    const issues: ValidationIssue[] = [];
    const suggestions: string[] = [];

    // 1. Check for USWDS class usage
    if (!isReact) {
      this.validateUSWDSClasses(code, issues, suggestions);
    }

    // 2. Check for accessibility
    if (checkAccessibility) {
      this.validateAccessibility(code, isReact, issues, suggestions);
    }

    // 3. Check for design token usage (both React and vanilla)
    this.validateDesignTokens(code, issues, suggestions);

    // 4. React-specific checks
    if (isReact) {
      this.validateReactPatterns(code, issues, suggestions);
    }

    // 5. General best practices
    this.validateBestPractices(code, isReact, issues, suggestions);

    // Calculate score (10 = perfect, 0 = many issues)
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const score = Math.max(0, 10 - errorCount * 2 - warningCount * 0.5);

    const valid = errorCount === 0;
    const summary = valid
      ? `All ${issues.length === 0 ? 'checks passed' : 'critical checks passed'} (Score: ${score.toFixed(1)}/10)`
      : `Found ${errorCount} error(s) and ${warningCount} warning(s) (Score: ${score.toFixed(1)}/10)`;

    return {
      valid,
      mode: isReact ? 'react' : 'vanilla',
      score: parseFloat(score.toFixed(1)),
      issues,
      summary,
      suggestions: suggestions.length > 0 ? suggestions : ['No additional suggestions']
    };
  }

  private validateUSWDSClasses(code: string, issues: ValidationIssue[], suggestions: string[]): void {
    // Check for usa- prefix
    const hasUSWDSClass = /class="[^"]*usa-/.test(code) || /className="[^"]*usa-/.test(code);

    if (!hasUSWDSClass && code.includes('class')) {
      issues.push({
        severity: 'warning',
        message: 'No USWDS classes (usa- prefix) found',
        rule: 'uswds-classes',
        suggestion: 'Use USWDS utility classes like usa-button, usa-input, etc.'
      });
    }

    // Check for BEM modifiers without base class
    const modifierPattern = /class="[^"]*usa-\w+--\w+/g;
    const matches = code.match(modifierPattern);
    if (matches) {
      matches.forEach(match => {
        const modifier = match.match(/usa-(\w+)--/);
        if (modifier) {
          const baseClass = `usa-${modifier[1]}`;
          if (!match.includes(baseClass + ' ') && !match.includes(baseClass + '"')) {
            issues.push({
              severity: 'error',
              message: `BEM modifier used without base class: ${baseClass}`,
              rule: 'uswds-bem-pattern',
              suggestion: `Include the base class: class="${baseClass} ${match.match(/usa-\w+--\w+/)![0]}"`
            });
          }
        }
      });
    }
  }

  private validateAccessibility(
    code: string,
    isReact: boolean,
    issues: ValidationIssue[],
    suggestions: string[]
  ): void {
    // Check buttons
    if (/<button/i.test(code)) {
      if (!/<button[^>]+type=/i.test(code)) {
        issues.push({
          severity: 'warning',
          message: 'Button missing type attribute',
          rule: 'wcag-button-type',
          suggestion: 'Add type="button", type="submit", or type="reset"'
        });
      }

      // Check for button text or aria-label
      const buttonMatches = code.match(/<button[^>]*>([^<]*)<\/button>/gi);
      if (buttonMatches) {
        buttonMatches.forEach(btn => {
          const hasText = /<button[^>]*>(.+)<\/button>/.test(btn) && !/<button[^>]*>\s*<\/button>/.test(btn);
          const hasAriaLabel = /aria-label=/i.test(btn);

          if (!hasText && !hasAriaLabel) {
            issues.push({
              severity: 'error',
              message: 'Button must have text content or aria-label',
              rule: 'wcag-4.1.2-button-label',
              suggestion: 'Add descriptive text or aria-label attribute'
            });
          }
        });
      }
    }

    // Check images
    if (/<img/i.test(code) && !/<img[^>]+alt=/i.test(code)) {
      issues.push({
        severity: 'error',
        message: 'Image missing alt attribute',
        rule: 'wcag-1.1.1-alt-text',
        suggestion: 'Add alt="" for decorative images or descriptive alt text for informative images'
      });
    }

    // Check form inputs
    if (/<input/i.test(code)) {
      const inputMatches = code.match(/<input[^>]*>/gi);
      if (inputMatches) {
        inputMatches.forEach(input => {
          const hasId = /id=/i.test(input);
          const hasAriaLabel = /aria-label/i.test(input);
          const hasAriaLabelledby = /aria-labelledby/i.test(input);

          if (hasId) {
            const idMatch = input.match(/id="([^"]*)"/i);
            if (idMatch) {
              const id = idMatch[1];
              const hasMatchingLabel = new RegExp(`<label[^>]+for="${id}"|htmlFor="${id}"`).test(code);

              if (!hasMatchingLabel && !hasAriaLabel && !hasAriaLabelledby) {
                issues.push({
                  severity: 'error',
                  message: `Input with id="${id}" missing associated label`,
                  rule: 'wcag-3.3.2-label-input',
                  suggestion: isReact
                    ? `Add <Label htmlFor="${id}">Label text</Label>`
                    : `Add <label for="${id}">Label text</label>`
                });
              }
            }
          }
        });
      }
    }

    // Check for color contrast (basic check for hard-coded colors)
    if (/#[0-9a-f]{3,6}/i.test(code)) {
      suggestions.push('Consider using USWDS design tokens instead of hard-coded hex colors for better accessibility');
    }

    // Check for semantic HTML
    const hasSemanticElements = /<(header|nav|main|article|section|aside|footer)/i.test(code);
    const hasManyDivs = (code.match(/<div/gi) || []).length > 3;

    if (hasManyDivs && !hasSemanticElements) {
      issues.push({
        severity: 'info',
        message: 'Consider using semantic HTML5 elements',
        rule: 'html5-semantics',
        suggestion: 'Use <header>, <nav>, <main>, <article>, <section>, <footer> instead of <div> where appropriate'
      });
    }
  }

  private validateDesignTokens(code: string, issues: ValidationIssue[], suggestions: string[]): void {
    // Check for hard-coded colors
    const hexColors = code.match(/#[0-9a-f]{3,6}/gi);
    if (hexColors && hexColors.length > 0) {
      issues.push({
        severity: 'warning',
        message: `Found ${hexColors.length} hard-coded hex color(s)`,
        rule: 'uswds-design-tokens-color',
        suggestion: 'Use USWDS color tokens like "primary", "secondary", "base" instead of hex values'
      });
    }

    // Check for hard-coded pixel values in common properties
    const pxValues = code.match(/(?:padding|margin|gap|font-size):\s*\d+px/gi);
    if (pxValues && pxValues.length > 0) {
      issues.push({
        severity: 'info',
        message: `Found hard-coded pixel values in spacing/sizing`,
        rule: 'uswds-design-tokens-spacing',
        suggestion: 'Consider using USWDS spacing tokens (units-1, units-2, etc.) for consistency'
      });
    }
  }

  private validateReactPatterns(code: string, issues: ValidationIssue[], suggestions: string[]): void {
    // Check for proper React-USWDS imports
    const hasImport = /import\s+{[^}]+}\s+from\s+['"]@trussworks\/react-uswds['"]/i.test(code);
    const hasUSWDSComponents = /(Button|Alert|TextInput|Label|FormGroup|Grid|Header|Footer|Card)/i.test(code);

    if (hasUSWDSComponents && !hasImport) {
      issues.push({
        severity: 'warning',
        message: 'Using USWDS component names without import',
        rule: 'react-uswds-import',
        suggestion: 'Add: import { ComponentName } from \'@trussworks/react-uswds\''
      });
    }

    // Check for className vs class
    if (/class=/i.test(code) && !/className=/i.test(code)) {
      issues.push({
        severity: 'error',
        message: 'Use className instead of class in React/JSX',
        rule: 'react-jsx-classname',
        suggestion: 'Replace class= with className='
      });
    }

    // Check for htmlFor vs for
    if (/<label[^>]+for=/i.test(code) && !/<label[^>]+htmlFor=/i.test(code)) {
      issues.push({
        severity: 'error',
        message: 'Use htmlFor instead of for in React/JSX labels',
        rule: 'react-jsx-htmlfor',
        suggestion: 'Replace for= with htmlFor='
      });
    }
  }

  private validateBestPractices(
    code: string,
    isReact: boolean,
    issues: ValidationIssue[],
    suggestions: string[]
  ): void {
    // Check for inline styles
    if (/style=/i.test(code)) {
      issues.push({
        severity: 'info',
        message: 'Inline styles detected',
        rule: 'best-practice-no-inline-styles',
        suggestion: 'Use USWDS utility classes instead of inline styles when possible'
      });
    }

    // Check for !important
    if (/!important/i.test(code)) {
      issues.push({
        severity: 'info',
        message: 'Using !important may indicate specificity issues',
        rule: 'best-practice-no-important',
        suggestion: 'Avoid !important; use proper class specificity instead'
      });
    }

    // Suggest responsive utilities
    if (code.includes('display:') || code.includes('grid') || code.includes('flex')) {
      suggestions.push('Consider using USWDS responsive utilities like "tablet:display-flex" or "desktop:grid-col-6"');
    }
  }
}
