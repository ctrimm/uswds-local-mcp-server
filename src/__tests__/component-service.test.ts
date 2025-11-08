import { describe, it, expect, beforeEach } from '@jest/globals';
import { ComponentService } from '../services/component-service.js';

describe('ComponentService', () => {
  describe('React Mode', () => {
    let service: ComponentService;

    beforeEach(() => {
      service = new ComponentService(true);
    });

    describe('listComponents', () => {
      it('should list all React components when category is "all"', async () => {
        const result = await service.listComponents('all');

        expect(result.mode).toBe('react-uswds');
        expect(result.components).toBeDefined();
        expect(result.total).toBeGreaterThan(0);
        expect(result.categories).toBeDefined();
      });

      it('should filter by category', async () => {
        const formsResult = await service.listComponents('forms');

        expect(formsResult.category).toBe('forms');
        expect(formsResult.components).toBeDefined();
        expect(Array.isArray(formsResult.components)).toBe(true);
        expect(formsResult.total).toBeGreaterThan(0);
      });

      it('should include component total', async () => {
        const result = await service.listComponents('all');

        expect(result.total).toBeDefined();
        expect(typeof result.total).toBe('number');
      });
    });

    describe('getComponentInfo', () => {
      it('should return detailed info for Button component', async () => {
        const result = await service.getComponentInfo('Button', false);

        expect(result.mode).toBe('react-uswds');
        expect(result.name).toBe('Button');
        expect(result.description).toBeDefined();
        expect(result.category).toBeDefined();
        expect(result.importPath).toBe('@trussworks/react-uswds');
        expect(result.props).toBeDefined();
        expect(result.props.length).toBeGreaterThan(0);
      });

      it('should include examples when requested', async () => {
        const result = await service.getComponentInfo('Button', true);

        expect(result.examples).toBeDefined();
        expect(result.examples.length).toBeGreaterThan(0);
      });

      it('should return error for non-existent component', async () => {
        const result = await service.getComponentInfo('NonExistentComponent', false);

        expect(result.error).toBeDefined();
        expect(result.error).toContain('not found');
      });

      it('should include accessibility info', async () => {
        const result = await service.getComponentInfo('Button', false);

        expect(result.accessibility).toBeDefined();
        expect(result.accessibility.guidelines).toBeDefined();
      });

      it('should be case-sensitive for component names', async () => {
        const upperResult = await service.getComponentInfo('Button', false);
        const lowerResult = await service.getComponentInfo('button', false);

        expect(upperResult.name).toBe('Button');
        expect(lowerResult.error).toBeDefined();
      });
    });

    describe('searchDocs', () => {
      it('should find components by name', async () => {
        const result = await service.searchDocs('Button');

        expect(result.query).toBe('Button');
        expect(result.results).toBeDefined();
        expect(result.results.length).toBeGreaterThan(0);
      });

      it('should find components by description', async () => {
        const result = await service.searchDocs('form');

        expect(result.results).toBeDefined();
        expect(result.results.length).toBeGreaterThan(0);
      });

      it('should be case insensitive', async () => {
        const lowerResult = await service.searchDocs('button');
        const upperResult = await service.searchDocs('BUTTON');

        expect(lowerResult.results.length).toBeGreaterThan(0);
        expect(upperResult.results.length).toBeGreaterThan(0);
      });

      it('should return empty results for non-matching query', async () => {
        const result = await service.searchDocs('xyznonexistent123');

        expect(result.results).toBeDefined();
        expect(result.results.length).toBe(0);
      });
    });

    describe('getAccessibilityGuidance', () => {
      it('should provide accessibility guidance for Button', async () => {
        const result = await service.getAccessibilityGuidance('Button');

        expect(result.component).toBe('Button');
        expect(result.guidelines).toBeDefined();
        expect(result.guidelines.length).toBeGreaterThan(0);
      });

      it('should provide guidance for Alert component', async () => {
        const result = await service.getAccessibilityGuidance('Alert');

        expect(result.component).toBe('Alert');
        expect(result.guidelines).toBeDefined();
      });

      it('should provide generic guidance for non-existent component', async () => {
        const result = await service.getAccessibilityGuidance('NonExistent');

        expect(result.component).toBe('NonExistent');
        expect(result.guidelines).toBeDefined();
        expect(result.wcagLevel).toBe('AA');
        expect(result.resources).toBeDefined();
      });
    });

    describe('listPageTemplates', () => {
      it('should list all page templates when category is "all"', async () => {
        const result = await service.listPageTemplates('all');

        expect(result.mode).toBe('react-uswds');
        expect(result.templates).toBeDefined();
        expect(result.total).toBeGreaterThan(0);
        expect(result.categories).toBeDefined();
      });

      it('should filter templates by category', async () => {
        const result = await service.listPageTemplates('admin');

        if (result.templates) {
          expect(result.category).toBe('admin');
          expect(result.templates).toBeDefined();
          expect(Array.isArray(result.templates)).toBe(true);
        }
      });

      it('should include template details', async () => {
        const result = await service.listPageTemplates('all');

        expect(result.total).toBeDefined();
        expect(typeof result.total).toBe('number');

        // Check that at least one template has the required fields
        const hasTemplates = Object.values(result.templates).some((category: any) =>
          Array.isArray(category) && category.length > 0
        );

        if (hasTemplates) {
          const firstCategory: any = Object.values(result.templates).find((cat: any) =>
            Array.isArray(cat) && cat.length > 0
          );
          const firstTemplate = firstCategory[0];

          expect(firstTemplate.name).toBeDefined();
          expect(firstTemplate.description).toBeDefined();
          expect(firstTemplate.slug).toBeDefined();
        }
      });

      it('should return error in vanilla mode', async () => {
        const vanillaService = new ComponentService(false);
        const result = await vanillaService.listPageTemplates();

        expect(result.error).toBeDefined();
        expect(result.mode).toBe('vanilla-uswds');
        expect(result.availableInReactMode).toBe(true);
      });
    });

    describe('getPageTemplate', () => {
      it('should return template details by name', async () => {
        // Get list first to find a valid template
        const list = await service.listPageTemplates('all');
        const firstCategory: any = Object.values(list.templates).find((cat: any) =>
          Array.isArray(cat) && cat.length > 0
        );

        if (firstCategory && firstCategory.length > 0) {
          const templateName = firstCategory[0].name;
          const result = await service.getPageTemplate(templateName);

          expect(result.mode).toBe('react-uswds');
          expect(result.name).toBe(templateName);
          expect(result.description).toBeDefined();
          expect(result.code).toBeDefined();
          expect(result.componentsUsed).toBeDefined();
        }
      });

      it('should return template by slug', async () => {
        const list = await service.listPageTemplates('all');
        const firstCategory: any = Object.values(list.templates).find((cat: any) =>
          Array.isArray(cat) && cat.length > 0
        );

        if (firstCategory && firstCategory.length > 0) {
          const templateSlug = firstCategory[0].slug;
          const result = await service.getPageTemplate(templateSlug);

          expect(result.mode).toBe('react-uswds');
          expect(result.slug).toBe(templateSlug);
        }
      });

      it('should be case-insensitive for template lookup', async () => {
        const list = await service.listPageTemplates('all');
        const firstCategory: any = Object.values(list.templates).find((cat: any) =>
          Array.isArray(cat) && cat.length > 0
        );

        if (firstCategory && firstCategory.length > 0) {
          const templateName = firstCategory[0].name;
          const lowerResult = await service.getPageTemplate(templateName.toLowerCase());
          const upperResult = await service.getPageTemplate(templateName.toUpperCase());

          expect(lowerResult.error).toBeUndefined();
          expect(upperResult.error).toBeUndefined();
        }
      });

      it('should return error for non-existent template', async () => {
        const result = await service.getPageTemplate('NonExistentTemplate');

        expect(result.error).toBeDefined();
        expect(result.suggestion).toBeDefined();
      });

      it('should include documentation links', async () => {
        const list = await service.listPageTemplates('all');
        const firstCategory: any = Object.values(list.templates).find((cat: any) =>
          Array.isArray(cat) && cat.length > 0
        );

        if (firstCategory && firstCategory.length > 0) {
          const templateName = firstCategory[0].name;
          const result = await service.getPageTemplate(templateName);

          if (!result.error) {
            expect(result.documentation).toBeDefined();
            expect(result.documentation.officialDocs).toBeDefined();
            expect(result.documentation.repository).toBeDefined();
          }
        }
      });

      it('should return error in vanilla mode', async () => {
        const vanillaService = new ComponentService(false);
        const result = await vanillaService.getPageTemplate('any-template');

        expect(result.error).toBeDefined();
        expect(result.mode).toBe('vanilla-uswds');
      });
    });

    describe('Additional searchDocs tests', () => {
      it('should filter by component docType', async () => {
        const result = await service.searchDocs('button', 'component');

        expect(result.docType).toBe('component');
        expect(result.results).toBeDefined();
      });

      it('should filter by pattern docType', async () => {
        const result = await service.searchDocs('form', 'pattern');

        expect(result.docType).toBe('pattern');
        expect(result.results).toBeDefined();
      });

      it('should search all docTypes by default', async () => {
        const result = await service.searchDocs('form', 'all');

        expect(result.docType).toBe('all');
        expect(result.results).toBeDefined();
      });

      it('should handle empty query', async () => {
        const result = await service.searchDocs('');

        expect(result.results).toBeDefined();
        expect(Array.isArray(result.results)).toBe(true);
      });

      it('should handle special characters in query', async () => {
        const result = await service.searchDocs('form-input');

        expect(result.results).toBeDefined();
      });
    });
  });

  describe('Vanilla Mode', () => {
    let vanillaService: ComponentService;

    beforeEach(() => {
      vanillaService = new ComponentService(false);
    });

    it('should initialize in vanilla mode', () => {
      expect(vanillaService).toBeDefined();
    });

    it('should return error for page templates in vanilla mode', async () => {
      const result = await vanillaService.listPageTemplates();

      expect(result.error).toBeDefined();
      expect(result.mode).toBe('vanilla-uswds');
      expect(result.availableInReactMode).toBe(true);
    });

    it('should return error for specific page template in vanilla mode', async () => {
      const result = await vanillaService.getPageTemplate('authentication-page');

      expect(result.error).toBeDefined();
      expect(result.mode).toBe('vanilla-uswds');
    });
  });

  describe('Edge Cases', () => {
    let service: ComponentService;

    beforeEach(() => {
      service = new ComponentService(true);
    });

    it('should handle undefined category gracefully', async () => {
      const result = await service.listComponents(undefined as any);

      expect(result.mode).toBe('react-uswds');
      expect(result.components).toBeDefined();
    });

    it('should handle invalid category', async () => {
      const result = await service.listComponents('invalid-category');

      expect(result.mode).toBe('react-uswds');
      expect(result.total).toBe(0);
    });

    it('should handle component info without examples', async () => {
      const result = await service.getComponentInfo('Button', false);

      expect(result.name).toBe('Button');
      expect(result.description).toBeDefined();
    });

    it('should handle accessibility guidance for components', async () => {
      const result = await service.getAccessibilityGuidance('TextInput');

      expect(result.guidelines || result.error).toBeDefined();
    });
  });
});

