/**
 * Tests for LayoutService
 */

import { LayoutService } from '../services/layout-service.js';

describe('LayoutService', () => {
  describe('Constructor and Mode', () => {
    it('should initialize with HTML mode by default', () => {
      const service = new LayoutService();
      expect(service).toBeDefined();
    });

    it('should initialize with React mode when specified', () => {
      const service = new LayoutService(true);
      expect(service).toBeDefined();
    });
  });

  describe('getLayouts', () => {
    it('should return all layout patterns in HTML mode', async () => {
      const service = new LayoutService(false);
      const result = await service.getLayouts();

      expect(result.total).toBeGreaterThan(0);
      expect(result.mode).toBe('html');
      expect(result.layouts).toBeDefined();
      expect(result.layouts).toBeInstanceOf(Array);
    });

    it('should return all layout patterns in React mode', async () => {
      const service = new LayoutService(true);
      const result = await service.getLayouts();

      expect(result.total).toBeGreaterThan(0);
      expect(result.mode).toBe('react');
      expect(result.layouts).toBeDefined();
    });

    it('should include layout details', async () => {
      const service = new LayoutService();
      const result = await service.getLayouts();

      expect(result.layouts.length).toBeGreaterThan(0);

      const firstLayout = result.layouts[0];
      expect(firstLayout.key).toBeDefined();
      expect(firstLayout.name).toBeDefined();
      expect(firstLayout.description).toBeDefined();
      expect(firstLayout.useCase).toBeDefined();
      expect(firstLayout.responsive).toBeDefined();
    });

    it('should include grid documentation link', async () => {
      const service = new LayoutService();
      const result = await service.getLayouts();

      expect(result.gridDocs).toBeDefined();
      expect(result.gridDocs).toContain('designsystem.digital.gov');
    });

    it('should include informative note', async () => {
      const service = new LayoutService();
      const result = await service.getLayouts();

      expect(result.note).toBeDefined();
      expect(result.note).toContain('responsive');
    });

    it('should list multiple layout patterns', async () => {
      const service = new LayoutService();
      const result = await service.getLayouts();

      expect(result.layouts.length).toBeGreaterThanOrEqual(3);
    });

    it('should have consistent layout structure', async () => {
      const service = new LayoutService();
      const result = await service.getLayouts();

      result.layouts.forEach((layout: any) => {
        expect(layout.key).toBeDefined();
        expect(layout.name).toBeDefined();
        expect(layout.description).toBeDefined();
        expect(layout.useCase).toBeInstanceOf(Array);
        expect(typeof layout.responsive).toBe('boolean');
      });
    });
  });

  describe('getLayout', () => {
    it('should return layout pattern with HTML code', async () => {
      const service = new LayoutService(false);
      const result = await service.getLayout('single-column');

      expect(result.name).toBeDefined();
      expect(result.description).toBeDefined();
      expect(result.code).toBeDefined();
      expect(result.mode).toBe('html');
    });

    it('should return layout pattern with React code', async () => {
      const service = new LayoutService(true);
      const result = await service.getLayout('single-column');

      expect(result.name).toBeDefined();
      expect(result.code).toBeDefined();
      expect(result.mode).toBe('react');
      expect(result.code).toContain('Grid');
    });

    it('should include use case information', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('single-column');

      expect(result.useCase).toBeDefined();
      expect(result.useCase).toBeInstanceOf(Array);
    });

    it('should include responsive information', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('single-column');

      expect(result.responsive).toBeDefined();
      expect(typeof result.responsive).toBe('boolean');
    });

    it('should include breakpoint information', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('single-column');

      expect(result.breakpoints).toBeDefined();
      expect(result.breakpoints.mobile).toBeDefined();
      expect(result.breakpoints.tablet).toBeDefined();
      expect(result.breakpoints.desktop).toBeDefined();
    });

    it('should include grid utilities documentation', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('single-column');

      expect(result.gridUtilities).toBeDefined();
      expect(result.gridUtilities.gap).toBeDefined();
      expect(result.gridUtilities.offset).toBeDefined();
      expect(result.gridUtilities.flex).toBeDefined();
      expect(result.gridUtilities.sticky).toBeDefined();
    });

    it('should include helpful tips', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('single-column');

      expect(result.tips).toBeDefined();
      expect(result.tips).toBeInstanceOf(Array);
      expect(result.tips.length).toBeGreaterThan(0);
    });

    it('should include resource links', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('single-column');

      expect(result.resources).toBeDefined();
      expect(result.resources).toBeInstanceOf(Array);
      expect(result.resources.length).toBeGreaterThan(0);

      const firstResource = result.resources[0];
      expect(firstResource.title).toBeDefined();
      expect(firstResource.url).toBeDefined();
    });

    it('should return error for non-existent layout', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('nonexistent-layout');

      expect(result.error).toContain('not found');
      expect(result.suggestion).toBeDefined();
      expect(result.hint).toBeDefined();
    });

    it('should suggest available layouts on error', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('invalid');

      expect(result.error).toBeDefined();
      expect(result.suggestion).toContain('Available layouts');
    });

    it('should normalize layout key with spaces', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('single column');

      if (!result.error) {
        expect(result.name).toBeDefined();
        expect(result.code).toBeDefined();
      }
    });

    it('should normalize layout key with mixed case', async () => {
      const service = new LayoutService();
      const result = await service.getLayout('SINGLE-COLUMN');

      if (!result.error) {
        expect(result.name).toBeDefined();
        expect(result.code).toBeDefined();
      }
    });

    it('should handle different layout patterns', async () => {
      const service = new LayoutService();

      const layouts = await service.getLayouts();
      const firstLayoutKey = layouts.layouts[0].key;
      const result = await service.getLayout(firstLayoutKey);

      expect(result.name).toBeDefined();
      expect(result.code).toBeDefined();
      expect(result.error).toBeUndefined();
    });
  });

  describe('suggestLayout', () => {
    it('should suggest layouts based on use case', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('dashboard');

      if (result.matches > 0) {
        expect(result.suggestions).toBeDefined();
        expect(result.suggestions).toBeInstanceOf(Array);
        expect(result.suggestions.length).toBeGreaterThan(0);
      }
    });

    it('should include relevance score for suggestions', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('content');

      if (result.matches > 0) {
        const firstSuggestion = result.suggestions[0];
        expect(firstSuggestion.relevance).toBeDefined();
        expect(typeof firstSuggestion.relevance).toBe('number');
      }
    });

    it('should sort suggestions by relevance', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('content');

      if (result.matches > 1) {
        for (let i = 0; i < result.suggestions.length - 1; i++) {
          expect(result.suggestions[i].relevance).toBeGreaterThanOrEqual(
            result.suggestions[i + 1].relevance
          );
        }
      }
    });

    it('should include matched use cases', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('dashboard');

      if (result.matches > 0) {
        const firstSuggestion = result.suggestions[0];
        expect(firstSuggestion.matchedUseCases).toBeDefined();
        expect(firstSuggestion.matchedUseCases).toBeInstanceOf(Array);
      }
    });

    it('should search case-insensitively', async () => {
      const service = new LayoutService();
      const resultLower = await service.suggestLayout('content');
      const resultUpper = await service.suggestLayout('CONTENT');

      expect(resultLower.matches).toBe(resultUpper.matches);
    });

    it('should handle partial use case matches', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('form');

      expect(result.useCase).toBe('form');
      expect(result.matches).toBeDefined();
    });

    it('should return helpful message when no matches found', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('zzzznonexistent');

      expect(result.message).toContain('No exact matches');
      expect(result.recommendation).toBeDefined();
      expect(result.commonPatterns).toBeDefined();
      expect(result.commonPatterns).toBeInstanceOf(Array);
    });

    it('should suggest common patterns when no matches', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('zzzznonexistent');

      expect(result.commonPatterns).toBeDefined();
      expect(result.commonPatterns.length).toBeGreaterThan(0);
    });

    it('should include layout key in suggestions', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('documentation');

      if (result.matches > 0) {
        const firstSuggestion = result.suggestions[0];
        expect(firstSuggestion.key).toBeDefined();
        expect(firstSuggestion.name).toBeDefined();
        expect(firstSuggestion.description).toBeDefined();
      }
    });

    it('should include hint for getting layout code', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('content');

      if (result.matches > 0) {
        expect(result.hint).toBeDefined();
        expect(result.hint).toContain('get_layout_patterns');
      }
    });

    it('should find multiple relevant layouts', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('content');

      if (result.matches > 0) {
        expect(result.suggestions.length).toBeGreaterThanOrEqual(1);
      }
    });

    it('should match on substring in use case', async () => {
      const service = new LayoutService();
      const result = await service.suggestLayout('admin');

      // Should match layouts with use cases containing "admin" or "administration"
      expect(result.useCase).toBe('admin');
      expect(result.matches).toBeDefined();
    });
  });

  describe('Mode Consistency', () => {
    it('should consistently return HTML code in HTML mode', async () => {
      const service = new LayoutService(false);
      const layouts = await service.getLayouts();

      for (const layout of layouts.layouts.slice(0, 3)) {
        const detail = await service.getLayout(layout.key);
        if (!detail.error) {
          expect(detail.mode).toBe('html');
          expect(detail.code).toBeDefined();
        }
      }
    });

    it('should consistently return React code in React mode', async () => {
      const service = new LayoutService(true);
      const layouts = await service.getLayouts();

      for (const layout of layouts.layouts.slice(0, 3)) {
        const detail = await service.getLayout(layout.key);
        if (!detail.error) {
          expect(detail.mode).toBe('react');
          expect(detail.code).toBeDefined();
        }
      }
    });
  });
});
