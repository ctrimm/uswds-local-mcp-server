import { describe, it, expect, beforeEach } from '@jest/globals';
import { ComparisonService } from '../services/comparison-service.js';

describe('ComparisonService Framework Parameter', () => {
  let comparisonService: ComparisonService;

  beforeEach(() => {
    // Initialize with default (React)
    comparisonService = new ComparisonService(true);
  });

  describe('compareComponents', () => {
    it('should use React components when framework="react"', async () => {
      const result = await comparisonService.compareComponents('Button', 'ButtonGroup', 'react');
      expect(result.components).toBeDefined();
      expect(result.components.Button).toBeDefined();
      expect(result.components.ButtonGroup).toBeDefined();
    });

    it('should return error for vanilla when framework="vanilla"', async () => {
      const result = await comparisonService.compareComponents('Button', 'ButtonGroup', 'vanilla');
      expect(result.mode).toBe('vanilla-uswds');
      expect(result.message).toContain('Component comparison is only available in React mode');
    });

    it('should return error for Tailwind when framework="tailwind"', async () => {
      const result = await comparisonService.compareComponents('Button', 'ButtonGroup', 'tailwind');
      expect(result.mode).toBe('tailwind-uswds');
      expect(result.message).toContain('Component comparison is not yet available for Tailwind USWDS');
    });

    it('should use constructor setting when framework parameter is undefined', async () => {
      const result = await comparisonService.compareComponents('Button', 'ButtonGroup');
      expect(result.components).toBeDefined(); // Constructor set to true, so React mode
    });

    it('should override constructor setting with framework parameter', async () => {
      const result = await comparisonService.compareComponents('Button', 'ButtonGroup', 'vanilla');
      expect(result.mode).toBe('vanilla-uswds'); // Parameter overrides constructor
    });
  });

  describe('framework parameter backward compatibility', () => {
    it('should work with vanilla-first ComparisonService', async () => {
      const vanillaService = new ComparisonService(false);

      const result = await vanillaService.compareComponents('Button', 'ButtonGroup');
      expect(result.mode).toBe('vanilla-uswds');

      const reactResult = await vanillaService.compareComponents('Button', 'ButtonGroup', 'react');
      expect(reactResult.components).toBeDefined();
    });
  });
});
