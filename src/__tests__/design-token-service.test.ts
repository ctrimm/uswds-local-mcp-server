import { describe, it, expect } from '@jest/globals';
import { DesignTokenService } from '../services/design-token-service.js';

describe('DesignTokenService', () => {
  const service = new DesignTokenService();

  describe('getTokens', () => {
    it('should return all tokens when category is "all"', async () => {
      const result = await service.getTokens('all');

      expect(result.tokens).toHaveProperty('color');
      expect(result.tokens).toHaveProperty('spacing');
      expect(result.tokens).toHaveProperty('typography');
      expect(result.tokens).toHaveProperty('breakpoints');
      expect(result.categories).toBeDefined();
      expect(result.documentation).toBeDefined();
    });

    it('should return only color tokens when category is "color"', async () => {
      const result = await service.getTokens('color');

      expect(result.category).toBe('color');
      expect(result.tokens).toHaveProperty('primary');
      expect(result.tokens).toHaveProperty('secondary');
      expect(result.description).toBeDefined();
      expect(result.usage).toBeDefined();
    });

    it('should return only spacing tokens when category is "spacing"', async () => {
      const result = await service.getTokens('spacing');

      expect(result.category).toBe('spacing');
      expect(result.tokens).toHaveProperty('1');
      expect(result.tokens).toHaveProperty('2');
      expect(result.description).toBeDefined();
    });

    it('should return only typography tokens when category is "typography"', async () => {
      const result = await service.getTokens('typography');

      expect(result.category).toBe('typography');
      expect(result.tokens).toHaveProperty('sans');
      expect(result.tokens).toHaveProperty('base');
      expect(result.description).toBeDefined();
    });

    it('should return only breakpoints when category is "breakpoints"', async () => {
      const result = await service.getTokens('breakpoints');

      expect(result.category).toBe('breakpoints');
      expect(result.tokens).toHaveProperty('mobile');
      expect(result.tokens).toHaveProperty('tablet');
      expect(result.tokens).toHaveProperty('desktop');
      expect(result.description).toBeDefined();
    });

    it('should return error for invalid category', async () => {
      const result = await service.getTokens('invalid');

      expect(result).toHaveProperty('error');
      expect(result.error).toContain('not found');
      expect(result.availableCategories).toBeDefined();
    });

    it('should handle undefined category', async () => {
      const result = await service.getTokens(undefined as any);

      expect(result).toBeDefined();
      expect(result.tokens || result.error).toBeDefined();
    });

    it('should include usage examples for color tokens', async () => {
      const result = await service.getTokens('color');

      expect(result.usage).toBeDefined();
      expect(typeof result.usage).toBe('object');
    });

    it('should include usage examples for spacing tokens', async () => {
      const result = await service.getTokens('spacing');

      expect(result.usage).toBeDefined();
    });
  });

  describe('getTokenRecommendation', () => {
    it('should recommend token for hardcoded primary color', () => {
      const result = service.getTokenRecommendation('#005ea2');

      expect(result).toBe('primary');
    });

    it('should recommend token for hardcoded darker primary color', () => {
      const result = service.getTokenRecommendation('#1a4480');

      expect(result).toBe('primary-darker');
    });

    it('should recommend token for hardcoded secondary color', () => {
      const result = service.getTokenRecommendation('#d83933');

      expect(result).toBe('secondary');
    });

    it('should recommend token for 8px spacing', () => {
      const result = service.getTokenRecommendation('8px');

      expect(result).toBe('units-1 or spacing-1');
    });

    it('should recommend token for 16px spacing', () => {
      const result = service.getTokenRecommendation('16px');

      expect(result).toBe('units-2 or spacing-2');
    });

    it('should be case-insensitive', () => {
      const resultLower = service.getTokenRecommendation('#005ea2');
      const resultUpper = service.getTokenRecommendation('#005EA2');

      expect(resultLower).toBe('primary');
      expect(resultUpper).toBe('primary');
    });

    it('should return null for unknown values', () => {
      const result = service.getTokenRecommendation('#999999');

      expect(result).toBeNull();
    });

    it('should return null for empty string', () => {
      const result = service.getTokenRecommendation('');

      expect(result).toBeNull();
    });

    it('should handle spacing values', () => {
      const result4 = service.getTokenRecommendation('4px');
      const result24 = service.getTokenRecommendation('24px');
      const result32 = service.getTokenRecommendation('32px');

      expect(result4).toBe('units-05 or spacing-05');
      expect(result24).toBe('units-3 or spacing-3');
      expect(result32).toBe('units-4 or spacing-4');
    });
  });
});
