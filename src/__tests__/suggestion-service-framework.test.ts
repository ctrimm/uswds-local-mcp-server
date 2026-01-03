import { describe, it, expect, beforeEach } from '@jest/globals';
import { SuggestionService } from '../services/suggestion-service.js';

describe('SuggestionService Framework Parameter', () => {
  let suggestionService: SuggestionService;

  beforeEach(() => {
    // Initialize with default (React)
    suggestionService = new SuggestionService(true);
  });

  describe('suggestComponents', () => {
    it('should use React components when framework="react"', async () => {
      const result = await suggestionService.suggestComponents('I need a button', 'react');
      expect(result.mode).toBe('react-uswds');
    });

    it('should use vanilla components when framework="vanilla"', async () => {
      const result = await suggestionService.suggestComponents('I need a button', 'vanilla');
      expect(result.mode).toBe('vanilla-uswds');
      expect(result.message).toContain('Component suggestions work best with React-USWDS');
    });

    it('should use Tailwind when framework="tailwind"', async () => {
      const result = await suggestionService.suggestComponents('I need a button', 'tailwind');
      expect(result.mode).toBe('tailwind-uswds');
      expect(result.message).toContain('Tailwind USWDS suggestions are limited');
    });

    it('should use constructor setting when framework parameter is undefined', async () => {
      const result = await suggestionService.suggestComponents('I need a button');
      expect(result.mode).toBe('react-uswds'); // Constructor set to true
    });

    it('should override constructor setting with framework parameter', async () => {
      const result = await suggestionService.suggestComponents('I need a button', 'vanilla');
      expect(result.mode).toBe('vanilla-uswds'); // Parameter overrides constructor
    });
  });

  describe('framework parameter backward compatibility', () => {
    it('should work with vanilla-first SuggestionService', async () => {
      const vanillaService = new SuggestionService(false);

      const result = await vanillaService.suggestComponents('I need a button');
      expect(result.mode).toBe('vanilla-uswds');

      const reactResult = await vanillaService.suggestComponents('I need a button', 'react');
      expect(reactResult.mode).toBe('react-uswds');
    });
  });
});
