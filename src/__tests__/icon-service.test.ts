/**
 * Tests for IconService
 */

import { IconService } from '../services/icon-service.js';

describe('IconService', () => {
  let service: IconService;

  beforeEach(() => {
    service = new IconService();
  });

  describe('getIcons', () => {
    it('should return all icons when no filters applied', async () => {
      const result = await service.getIcons();

      expect(result.total).toBeGreaterThan(0);
      expect(result.categories).toBeDefined();
      expect(result.icons).toBeDefined();
      expect(result.filters.category).toBe('all');
      expect(result.filters.search).toBeNull();
    });

    it('should include usage examples', async () => {
      const result = await service.getIcons();

      expect(result.usage).toBeDefined();
      expect(result.usage.react).toContain('Icon');
      expect(result.usage.html).toContain('svg');
    });

    it('should include resources', async () => {
      const result = await service.getIcons();

      expect(result.resources).toBeDefined();
      expect(result.resources).toBeInstanceOf(Array);
      expect(result.resources.length).toBeGreaterThan(0);
    });

    it('should filter icons by category', async () => {
      const result = await service.getIcons('navigation');

      expect(result.filters.category).toBe('navigation');
      expect(result.icons.navigation).toBeDefined();
    });

    it('should handle "all" category explicitly', async () => {
      const result = await service.getIcons('all');

      expect(result.filters.category).toBe('all');
      expect(result.total).toBeGreaterThan(0);
    });

    it('should search icons by name', async () => {
      const result = await service.getIcons(undefined, 'search');

      expect(result.filters.search).toBe('search');
      expect(result.total).toBeGreaterThan(0);
      expect(result.icons).toBeDefined();
    });

    it('should search icons by keyword', async () => {
      const result = await service.getIcons(undefined, 'menu');

      expect(result.filters.search).toBe('menu');
      expect(result.total).toBeGreaterThan(0);
    });

    it('should search case-insensitively', async () => {
      const resultLower = await service.getIcons(undefined, 'close');
      const resultUpper = await service.getIcons(undefined, 'CLOSE');

      expect(resultLower.total).toBe(resultUpper.total);
    });

    it('should combine category and search filters', async () => {
      const result = await service.getIcons('navigation', 'menu');

      expect(result.filters.category).toBe('navigation');
      expect(result.filters.search).toBe('menu');
    });

    it('should return empty result for non-matching search', async () => {
      const result = await service.getIcons(undefined, 'zzzznonexistent');

      expect(result.total).toBe(0);
      expect(Object.keys(result.icons).length).toBe(0);
    });

    it('should group icons by category', async () => {
      const result = await service.getIcons();

      Object.values(result.icons).forEach((category: any) => {
        expect(category.label).toBeDefined();
        expect(category.count).toBeGreaterThan(0);
        expect(category.icons).toBeInstanceOf(Array);
      });
    });

    it('should include icon details in results', async () => {
      const result = await service.getIcons();

      const firstCategory: any = Object.values(result.icons)[0];
      const firstIcon = firstCategory.icons[0];

      expect(firstIcon.name).toBeDefined();
      expect(firstIcon.usage).toBeDefined();
      expect(firstIcon.keywords).toBeDefined();
    });

    it('should exclude categories with no matching icons', async () => {
      const result = await service.getIcons('navigation', 'zzzznonexistent');

      expect(result.total).toBe(0);
      expect(result.icons.navigation).toBeUndefined();
    });
  });

  describe('getIconInfo', () => {
    it('should return error for non-existent icon', async () => {
      const result = await service.getIconInfo('nonexistent_icon');

      expect(result.error).toContain('not found');
      expect(result.availableIcons).toBeGreaterThan(0);
    });

    it('should return details for valid icon', async () => {
      const result = await service.getIconInfo('close');

      expect(result.name).toBe('close');
      expect(result.category).toBeDefined();
      expect(result.categoryLabel).toBeDefined();
      expect(result.usage).toBeDefined();
      expect(result.keywords).toBeDefined();
    });

    it('should include React examples', async () => {
      const result = await service.getIconInfo('close');

      expect(result.examples).toBeDefined();
      expect(result.examples.react).toBeDefined();
      expect(result.examples.react.basic).toContain('Icon');
      expect(result.examples.react.withSize).toContain('size');
      expect(result.examples.react.withLabel).toContain('aria-label');
      expect(result.examples.react.inButton).toContain('Button');
    });

    it('should include HTML examples', async () => {
      const result = await service.getIconInfo('close');

      expect(result.examples.html).toBeDefined();
      expect(result.examples.html.basic).toContain('svg');
      expect(result.examples.html.withSize).toContain('usa-icon--size');
    });

    it('should include accessibility guidelines', async () => {
      const result = await service.getIconInfo('close');

      expect(result.accessibility).toBeDefined();
      expect(result.accessibility.decorative).toBeDefined();
      expect(result.accessibility.meaningful).toBeDefined();
      expect(result.accessibility.inButton).toBeDefined();
      expect(result.accessibility.guidelines).toBeInstanceOf(Array);
      expect(result.accessibility.guidelines.length).toBeGreaterThan(0);
    });

    it('should include related icons from same category', async () => {
      const result = await service.getIconInfo('close');

      expect(result.relatedIcons).toBeDefined();
      expect(result.relatedIcons).toBeInstanceOf(Array);
    });

    it('should not include itself in related icons', async () => {
      const result = await service.getIconInfo('close');

      expect(result.relatedIcons).not.toContain('close');
    });

    it('should limit related icons to 5', async () => {
      const result = await service.getIconInfo('close');

      expect(result.relatedIcons.length).toBeLessThanOrEqual(5);
    });

    it('should suggest similar icons for misspelled names', async () => {
      const result = await service.getIconInfo('clos');

      expect(result.error).toBeDefined();
      expect(result.suggestion).toContain('Did you mean');
    });

    it('should handle icons with no similar matches', async () => {
      const result = await service.getIconInfo('zzzzzzz');

      expect(result.error).toBeDefined();
      expect(result.suggestion).toContain('Browse available icons');
    });

    it('should limit similar icon suggestions to 5', async () => {
      const result = await service.getIconInfo('a');

      if (result.suggestion && result.suggestion.includes('Did you mean')) {
        const suggestedIcons = result.suggestion.split(':')[1].split(',');
        expect(suggestedIcons.length).toBeLessThanOrEqual(5);
      }
    });

    it('should search similar icons case-insensitively', async () => {
      const resultLower = await service.getIconInfo('clos');
      const resultUpper = await service.getIconInfo('CLOS');

      if (resultLower.suggestion && resultUpper.suggestion) {
        expect(resultLower.suggestion).toBe(resultUpper.suggestion);
      }
    });

    it('should include icon name in examples', async () => {
      const result = await service.getIconInfo('search');

      expect(result.examples.react.basic).toContain('search');
      expect(result.examples.html.basic).toContain('search');
    });

    it('should include meaningful aria-label in accessibility examples', async () => {
      const result = await service.getIconInfo('search');

      expect(result.accessibility.meaningful).toContain('aria-label');
      expect(result.accessibility.meaningful).toContain(result.usage);
    });

    it('should handle icons from different categories', async () => {
      const navigationIcon = await service.getIconInfo('menu');
      const alertIcon = await service.getIconInfo('check');

      expect(navigationIcon.category).toBeDefined();
      expect(alertIcon.category).toBeDefined();
      expect(navigationIcon.category).not.toBe(alertIcon.category);
    });
  });

  describe('Icon Data Integration', () => {
    it('should have consistent icon structure', async () => {
      const result = await service.getIcons();

      Object.values(result.icons).forEach((category: any) => {
        category.icons.forEach((icon: any) => {
          expect(icon.name).toBeDefined();
          expect(typeof icon.name).toBe('string');
          expect(icon.usage).toBeDefined();
          expect(typeof icon.usage).toBe('string');
          expect(icon.keywords).toBeInstanceOf(Array);
        });
      });
    });

    it('should have valid category labels', async () => {
      const result = await service.getIcons();

      expect(result.categories).toBeDefined();
      expect(typeof result.categories).toBe('object');
      expect(Object.keys(result.categories).length).toBeGreaterThan(0);
    });
  });
});
