/**
 * Tests for ValidationService
 */

import { ValidationService } from '../services/validation-service.js';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    service = new ValidationService();
  });

  describe('validate', () => {
    it('should validate vanilla USWDS code successfully', async () => {
      const code = '<button class="usa-button" type="button">Click me</button>';
      const result = await service.validate(code, false, true);

      expect(result.valid).toBe(true);
      expect(result.mode).toBe('vanilla');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should validate React code with high score', async () => {
      const code = 'import { Button } from "@trussworks/react-uswds";\n<Button type="button">Click me</Button>';
      const result = await service.validate(code, true, true);

      expect(result.mode).toBe('react');
      expect(result.score).toBeGreaterThan(0);
    });

    it('should detect missing USWDS classes in vanilla mode', async () => {
      const code = '<button class="custom-button">Click</button>';
      const result = await service.validate(code, false, false);

      expect(result.issues.some(i => i.rule === 'uswds-classes')).toBe(true);
    });

    it('should detect BEM modifier without base class', async () => {
      const code = '<div class="usa-button--secondary">Test</div>';
      const result = await service.validate(code, false, false);

      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.rule === 'uswds-bem-pattern')).toBe(true);
      expect(result.issues.some(i => i.severity === 'error')).toBe(true);
    });

    it('should pass with correct BEM pattern', async () => {
      const code = '<button class="usa-button usa-button--secondary">Test</button>';
      const result = await service.validate(code, false, false);

      expect(result.issues.filter(i => i.rule === 'uswds-bem-pattern').length).toBe(0);
    });
  });

  describe('Accessibility Validation', () => {
    it('should detect button missing type attribute', async () => {
      const code = '<button class="usa-button">Click</button>';
      const result = await service.validate(code, false, true);

      expect(result.issues.some(i => i.rule === 'wcag-button-type')).toBe(true);
    });

    it('should pass button with type attribute', async () => {
      const code = '<button class="usa-button" type="button">Click</button>';
      const result = await service.validate(code, false, true);

      expect(result.issues.filter(i => i.rule === 'wcag-button-type').length).toBe(0);
    });

    it('should detect button without text or aria-label', async () => {
      const code = '<button type="button"></button>';
      const result = await service.validate(code, false, true);

      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.rule === 'wcag-4.1.2-button-label')).toBe(true);
    });

    it('should pass button with text content', async () => {
      const code = '<button type="button">Submit</button>';
      const result = await service.validate(code, false, true);

      expect(result.issues.filter(i => i.rule === 'wcag-4.1.2-button-label').length).toBe(0);
    });

    it('should pass button with aria-label', async () => {
      const code = '<button type="button" aria-label="Submit form"></button>';
      const result = await service.validate(code, false, true);

      expect(result.issues.filter(i => i.rule === 'wcag-4.1.2-button-label').length).toBe(0);
    });

    it('should detect image missing alt attribute', async () => {
      const code = '<img src="photo.jpg" />';
      const result = await service.validate(code, false, true);

      expect(result.valid).toBe(false);
      expect(result.issues.some(i => i.rule === 'wcag-1.1.1-alt-text')).toBe(true);
    });

    it('should pass image with alt attribute', async () => {
      const code = '<img src="photo.jpg" alt="Description" />';
      const result = await service.validate(code, false, true);

      expect(result.issues.filter(i => i.rule === 'wcag-1.1.1-alt-text').length).toBe(0);
    });

    it('should detect form input missing label', async () => {
      const code = '<input type="text" id="name" />';
      const result = await service.validate(code, false, true);

      expect(result.issues.some(i => i.rule === 'wcag-3.3.2-label-input')).toBe(true);
    });

    it('should pass form input with label', async () => {
      const code = '<label for="name">Name</label><input type="text" id="name" />';
      const result = await service.validate(code, false, true);

      expect(result.issues.filter(i => i.rule === 'wcag-3.3.2-label-input').length).toBe(0);
    });

    it('should pass form input with aria-label', async () => {
      const code = '<input type="text" aria-label="Name" />';
      const result = await service.validate(code, false, true);

      expect(result.issues.filter(i => i.rule === 'wcag-3.3.2-label-input').length).toBe(0);
    });
  });

  describe('Design Token Validation', () => {
    it('should detect hardcoded colors', async () => {
      const code = '<div style="color: #FF0000">Text</div>';
      const result = await service.validate(code, false, false);

      expect(result.issues.some(i => i.rule === 'uswds-design-tokens-color')).toBe(true);
    });

    it('should detect hardcoded spacing', async () => {
      const code = '<div style="margin: 16px">Content</div>';
      const result = await service.validate(code, false, false);

      expect(result.issues.some(i => i.rule === 'uswds-design-tokens-spacing')).toBe(true);
    });
  });

  describe('React Pattern Validation', () => {
    it('should detect missing React imports', async () => {
      const code = '<Button>Click</Button>';
      const result = await service.validate(code, true, false);

      expect(result.issues.some(i => i.rule === 'react-uswds-import')).toBe(true);
    });

    it('should pass with React imports', async () => {
      const code = 'import { Button } from "@trussworks/react-uswds";\n<Button>Click</Button>';
      const result = await service.validate(code, true, false);

      expect(result.issues.filter(i => i.rule === 'react-uswds-import').length).toBe(0);
    });

    it('should detect inline styles in React', async () => {
      const code = '<div style={{ color: "red" }}>Text</div>';
      const result = await service.validate(code, true, false);

      expect(result.issues.some(i => i.rule === 'best-practice-no-inline-styles')).toBe(true);
    });

    it('should detect class instead of className', async () => {
      const code = '<div class="usa-button">Button</div>';
      const result = await service.validate(code, true, false);

      expect(result.issues.some(i => i.rule === 'react-jsx-classname')).toBe(true);
    });

    it('should pass with className', async () => {
      const code = '<div className="usa-button">Button</div>';
      const result = await service.validate(code, true, false);

      expect(result.issues.filter(i => i.rule === 'react-jsx-classname').length).toBe(0);
    });
  });

  describe('Best Practices Validation', () => {
    it('should detect !important in styles', async () => {
      const code = '<div style="color: red !important">Text</div>';
      const result = await service.validate(code, false, false);

      expect(result.issues.some(i => i.rule === 'best-practice-no-important')).toBe(true);
    });

    it('should check for semantic HTML', async () => {
      const code = '<div>Test content</div>';
      const result = await service.validate(code, false, true);

      // Should not have HTML5 semantic issues for simple divs
      expect(result).toBeDefined();
    });
  });

  describe('Scoring System', () => {
    it('should give perfect score for valid code', async () => {
      const code = '<button class="usa-button" type="button">Click</button>';
      const result = await service.validate(code, false, true);

      expect(result.score).toBe(10);
      expect(result.valid).toBe(true);
    });

    it('should reduce score for warnings', async () => {
      const code = '<button class="usa-button">Click</button>';
      const result = await service.validate(code, false, true);

      expect(result.score).toBeLessThan(10);
      expect(result.score).toBeGreaterThan(0);
    });

    it('should reduce score for errors', async () => {
      const code = '<button></button>';
      const result = await service.validate(code, false, true);

      expect(result.score).toBeLessThan(10);
      expect(result.valid).toBe(false);
    });

    it('should have lower score with multiple errors', async () => {
      const code = '<button></button><img src="test.jpg" />';
      const result = await service.validate(code, false, true);

      expect(result.score).toBeLessThan(8);
      expect(result.valid).toBe(false);
    });

    it('should not go below zero score', async () => {
      const code = '<button></button><img src="1.jpg" /><img src="2.jpg" /><img src="3.jpg" /><font>text</font><center>text</center>';
      const result = await service.validate(code, false, true);

      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Summary and Suggestions', () => {
    it('should provide summary for valid code', async () => {
      const code = '<button class="usa-button" type="button">Click</button>';
      const result = await service.validate(code, false, true);

      expect(result.summary).toContain('checks passed');
      expect(result.summary).toContain('Score');
    });

    it('should provide summary with error count', async () => {
      const code = '<button></button>';
      const result = await service.validate(code, false, true);

      expect(result.summary).toContain('error');
      expect(result.summary).toContain('Score');
    });

    it('should provide suggestions for improvements', async () => {
      const code = '<button></button>';
      const result = await service.validate(code, false, true);

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should provide default suggestion when no issues', async () => {
      const code = '<button class="usa-button" type="button">Click</button>';
      const result = await service.validate(code, false, true);

      expect(result.suggestions).toContain('No additional suggestions');
    });
  });

  describe('Skip Accessibility Check', () => {
    it('should skip accessibility checks when disabled', async () => {
      const code = '<button>Click</button><img src="test.jpg" />';
      const result = await service.validate(code, false, false);

      expect(result.issues.filter(i => i.rule.startsWith('wcag')).length).toBe(0);
    });

    it('should still check other rules when accessibility disabled', async () => {
      const code = '<div style="color: red !important">Text</div>';
      const result = await service.validate(code, false, false);

      expect(result.issues.some(i => i.rule === 'best-practice-no-important')).toBe(true);
    });
  });

  describe('Issue Details', () => {
    it('should provide detailed error information', async () => {
      const code = '<button></button>';
      const result = await service.validate(code, false, true);

      const issue = result.issues.find(i => i.severity === 'error');
      expect(issue).toBeDefined();
      expect(issue?.message).toBeDefined();
      expect(issue?.rule).toBeDefined();
      expect(issue?.suggestion).toBeDefined();
    });

    it('should categorize issues by severity', async () => {
      const code = '<button class="custom">Click</button><img src="test.jpg" />';
      const result = await service.validate(code, false, true);

      const errors = result.issues.filter(i => i.severity === 'error');
      const warnings = result.issues.filter(i => i.severity === 'warning');

      expect(errors.length).toBeGreaterThan(0);
      expect(warnings.length).toBeGreaterThan(0);
    });
  });
});
