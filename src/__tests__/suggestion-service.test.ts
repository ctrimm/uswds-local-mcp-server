/**
 * Tests for SuggestionService
 */

import { SuggestionService } from '../services/suggestion-service.js';

describe('SuggestionService', () => {
  describe('Constructor and Mode', () => {
    it('should initialize with vanilla mode by default', () => {
      const service = new SuggestionService();
      expect(service).toBeDefined();
    });

    it('should initialize with React mode when specified', () => {
      const service = new SuggestionService(true);
      expect(service).toBeDefined();
    });
  });

  describe('suggestComponents - Vanilla Mode', () => {
    it('should return error in vanilla mode', async () => {
      const service = new SuggestionService(false);
      const result = await service.suggestComponents('form input');

      expect(result.error).toBeDefined();
      expect(result.mode).toBe('vanilla-uswds');
      expect(result.message).toContain('USE_REACT_COMPONENTS=true');
    });

    it('should provide general guidance in vanilla mode', async () => {
      const service = new SuggestionService(false);
      const result = await service.suggestComponents('button');

      expect(result.generalGuidance).toBeDefined();
      expect(typeof result.generalGuidance).toBe('string');
    });
  });

  describe('suggestComponents - React Mode', () => {
    let service: SuggestionService;

    beforeEach(() => {
      service = new SuggestionService(true);
    });

    it('should suggest components for form use case', async () => {
      const result = await service.suggestComponents('form with input fields');

      expect(result.useCase).toBe('form with input fields');
      expect(result.mode).toBe('react-uswds');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions).toBeInstanceOf(Array);
    });

    it('should suggest Button for button use case', async () => {
      const result = await service.suggestComponents('button');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
      expect(result.suggestions.some((s: any) => s.component === 'Button')).toBe(true);
    });

    it('should suggest Alert for notification use case', async () => {
      const result = await service.suggestComponents('show notification message');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.some((s: any) => s.component === 'Alert')).toBe(true);
    });

    it('should suggest Table for data display', async () => {
      const result = await service.suggestComponents('display tabular data');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.some((s: any) => s.component === 'Table')).toBe(true);
    });

    it('should suggest Header for navigation', async () => {
      const result = await service.suggestComponents('site navigation');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should include relevance scores', async () => {
      const result = await service.suggestComponents('form input');

      if (result.suggestions && result.suggestions.length > 0) {
        result.suggestions.forEach((s: any) => {
          expect(s.relevance).toBeDefined();
          expect(['high', 'medium', 'low']).toContain(s.relevance);
        });
      }
    });

    it('should include reasons for suggestions', async () => {
      const result = await service.suggestComponents('button');

      if (result.suggestions && result.suggestions.length > 0) {
        result.suggestions.forEach((s: any) => {
          expect(s.reason).toBeDefined();
          expect(typeof s.reason).toBe('string');
        });
      }
    });

    it('should include documentation hints', async () => {
      const result = await service.suggestComponents('button');

      if (result.suggestions && result.suggestions.length > 0) {
        result.suggestions.forEach((s: any) => {
          expect(s.documentation).toBeDefined();
          expect(s.documentation).toContain('get_component_info');
        });
      }
    });

    it('should include component categories', async () => {
      const result = await service.suggestComponents('form');

      if (result.suggestions && result.suggestions.length > 0) {
        result.suggestions.forEach((s: any) => {
          expect(s.category).toBeDefined();
        });
      }
    });

    it('should sort suggestions by relevance', async () => {
      const result = await service.suggestComponents('form input field');

      if (result.suggestions && result.suggestions.length > 1) {
        const relevanceMap = { high: 3, medium: 2, low: 1 };
        for (let i = 0; i < result.suggestions.length - 1; i++) {
          const currentScore = relevanceMap[result.suggestions[i].relevance as keyof typeof relevanceMap];
          const nextScore = relevanceMap[result.suggestions[i + 1].relevance as keyof typeof relevanceMap];
          expect(currentScore).toBeGreaterThanOrEqual(nextScore);
        }
      }
    });

    it('should limit suggestions to 5', async () => {
      const result = await service.suggestComponents('form');

      if (result.suggestions) {
        expect(result.suggestions.length).toBeLessThanOrEqual(5);
      }
    });

    it('should indicate when more options are available', async () => {
      const result = await service.suggestComponents('form');

      if (result.suggestions && result.suggestions.length === 5) {
        expect(result.additionalOptions).toBeDefined();
      }
    });

    it('should include next steps', async () => {
      const result = await service.suggestComponents('button');

      if (result.suggestions && result.suggestions.length > 0) {
        expect(result.nextSteps).toBeDefined();
        expect(result.nextSteps).toBeInstanceOf(Array);
        expect(result.nextSteps.length).toBeGreaterThan(0);
      }
    });

    it('should handle case-insensitive search', async () => {
      const resultLower = await service.suggestComponents('button');
      const resultUpper = await service.suggestComponents('BUTTON');

      expect(resultLower.suggestions.length).toBe(resultUpper.suggestions.length);
    });

    it('should handle multi-word use cases', async () => {
      const result = await service.suggestComponents('display error message to user');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should return helpful message when no matches found', async () => {
      const result = await service.suggestComponents('zzzznonexistent');

      expect(result.message).toContain('No specific components match');
      expect(result.suggestion).toBeDefined();
      expect(result.categories).toBeDefined();
      expect(result.hint).toBeDefined();
    });

    it('should suggest browsing by category when no matches', async () => {
      const result = await service.suggestComponents('zzzznonexistent');

      expect(result.categories).toBeDefined();
      expect(result.categories).toBeInstanceOf(Array);
      expect(result.categories.length).toBeGreaterThan(0);
    });

    it('should suggest card for card queries', async () => {
      const result = await service.suggestComponents('card');

      expect(result).toBeDefined();
      if (result.suggestions) {
        expect(result.suggestions.some((s: any) => s.component === 'Card')).toBe(true);
      } else {
        expect(result.message).toBeDefined();
      }
    });

    it('should suggest Accordion for accordion queries', async () => {
      const result = await service.suggestComponents('accordion');

      expect(result).toBeDefined();
      if (result.suggestions) {
        expect(result.suggestions.some((s: any) => s.component === 'Accordion')).toBe(true);
      } else {
        expect(result.message).toBeDefined();
      }
    });

    it('should suggest Modal for modal queries', async () => {
      const result = await service.suggestComponents('modal');

      expect(result).toBeDefined();
      if (result.suggestions) {
        expect(result.suggestions.some((s: any) => s.component === 'Modal')).toBe(true);
      } else {
        expect(result.message).toBeDefined();
      }
    });

    it('should match on description content', async () => {
      const result = await service.suggestComponents('text input');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should handle navigation-related queries', async () => {
      const result = await service.suggestComponents('menu navigation');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should handle layout-related queries', async () => {
      const result = await service.suggestComponents('page layout grid');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should provide component name in suggestions', async () => {
      const result = await service.suggestComponents('button');

      if (result.suggestions && result.suggestions.length > 0) {
        result.suggestions.forEach((s: any) => {
          expect(s.component).toBeDefined();
          expect(typeof s.component).toBe('string');
        });
      }
    });

    it('should handle pagination queries', async () => {
      const result = await service.suggestComponents('pagination');

      expect(result).toBeDefined();
      if (result.suggestions) {
        expect(result.suggestions.some((s: any) => s.component === 'Pagination')).toBe(true);
      } else {
        expect(result.message).toBeDefined();
      }
    });

    it('should handle breadcrumb queries', async () => {
      const result = await service.suggestComponents('breadcrumb trail');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.some((s: any) => s.component === 'Breadcrumb')).toBe(true);
    });

    it('should handle footer queries', async () => {
      const result = await service.suggestComponents('page footer');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.some((s: any) => s.component === 'Footer')).toBe(true);
    });

    it('should match partial keywords', async () => {
      const result = await service.suggestComponents('inp');

      expect(result.suggestions).toBeDefined();
      // Should match components related to "input"
    });

    it('should handle form validation queries', async () => {
      const result = await service.suggestComponents('form validation');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should include useCase in response', async () => {
      const useCase = 'my specific use case';
      const result = await service.suggestComponents(useCase);

      expect(result.useCase).toBe(useCase);
    });

    it('should handle checkbox queries', async () => {
      const result = await service.suggestComponents('checkbox');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.some((s: any) => s.component === 'Checkbox')).toBe(true);
    });

    it('should handle radio button queries', async () => {
      const result = await service.suggestComponents('radio selection');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.some((s: any) => s.component === 'Radio')).toBe(true);
    });

    it('should handle date picker queries', async () => {
      const result = await service.suggestComponents('date picker');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.some((s: any) => s.component === 'DatePicker')).toBe(true);
    });
  });
});
