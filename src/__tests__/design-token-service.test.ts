import { describe, it, expect } from '@jest/globals';
import { DesignTokenService } from '../services/design-token-service.js';

describe('DesignTokenService', () => {
  const service = new DesignTokenService();

  describe('getTokens', () => {
    it('should return all tokens when category is "all"', async () => {
      const result = await service.getTokens('all');

      expect(result).toHaveProperty('colors');
      expect(result).toHaveProperty('spacing');
      expect(result).toHaveProperty('typography');
      expect(result).toHaveProperty('breakpoints');
    });

    it('should return only colors when category is "colors"', async () => {
      const result = await service.getTokens('colors');

      expect(result).toHaveProperty('primary');
      expect(result).toHaveProperty('secondary');
      expect(result).toHaveProperty('accent');
      expect(result).not.toHaveProperty('spacing');
    });

    it('should return only spacing when category is "spacing"', async () => {
      const result = await service.getTokens('spacing');

      expect(result).toHaveProperty('1');
      expect(result).toHaveProperty('2');
      expect(result).not.toHaveProperty('primary');
    });

    it('should return only typography when category is "typography"', async () => {
      const result = await service.getTokens('typography');

      expect(result).toHaveProperty('fontFamily');
      expect(result).toHaveProperty('fontSize');
      expect(result).toHaveProperty('fontWeight');
      expect(result).toHaveProperty('lineHeight');
      expect(result).not.toHaveProperty('primary');
    });

    it('should return only breakpoints when category is "breakpoints"', async () => {
      const result = await service.getTokens('breakpoints');

      expect(result).toHaveProperty('mobile');
      expect(result).toHaveProperty('tablet');
      expect(result).toHaveProperty('desktop');
      expect(result).not.toHaveProperty('primary');
    });

    it('should return error for invalid category', async () => {
      const result = await service.getTokens('invalid');

      expect(result).toHaveProperty('error');
      expect(result.error).toContain('Invalid category');
    });
  });
});
