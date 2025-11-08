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
  });
});
