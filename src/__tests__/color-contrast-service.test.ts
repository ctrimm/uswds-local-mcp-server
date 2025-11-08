import { describe, it, expect } from '@jest/globals';
import { ColorContrastService } from '../services/color-contrast-service.js';

describe('ColorContrastService', () => {
  const service = new ColorContrastService();

  describe('checkContrast', () => {
    it('should pass for high contrast black on white', async () => {
      const result = await service.checkContrast('#000000', '#ffffff');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
      expect(result.wcag.aa.largeText).toBe(true);
      expect(result.wcag.aaa.normalText).toBe(true);
      expect(result.wcag.aaa.largeText).toBe(true);
    });

    it('should fail for low contrast light gray on white', async () => {
      const result = await service.checkContrast('#f0f0f0', '#ffffff');

      expect(result.contrastRatio).toBeLessThan(4.5);
      expect(result.wcag.aa.normalText).toBe(false);
      expect(result.wcag.aaa.normalText).toBe(false);
    });

    it('should handle USWDS blue on white (#005ea2)', async () => {
      const result = await service.checkContrast('#005ea2', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(4.5);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should handle 3-digit hex colors', async () => {
      const result = await service.checkContrast('#000', '#fff');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should return error for invalid foreground color', async () => {
      const result = await service.checkContrast('invalid', '#ffffff');

      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid color format');
    });

    it('should return error for invalid background color', async () => {
      const result = await service.checkContrast('#000000', 'invalid');

      expect(result.error).toBeDefined();
      expect(result.error).toContain('Invalid color format');
    });

    it('should provide passes array for good contrast', async () => {
      const result = await service.checkContrast('#000000', '#ffffff');

      expect(result.passes).toBeDefined();
      expect(result.passes.length).toBeGreaterThan(0);
      expect(result.passes).toContain('WCAG AAA (normal text)');
    });

    it('should provide fails array for poor contrast', async () => {
      const result = await service.checkContrast('#f0f0f0', '#ffffff');

      expect(result.fails).toBeDefined();
      expect(result.fails.length).toBeGreaterThan(0);
    });

    it('should handle edge case of 4.5:1 ratio (AA threshold)', async () => {
      // #767676 on white is approximately 4.5:1
      const result = await service.checkContrast('#767676', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(4.4);
      expect(result.contrastRatio).toBeLessThan(4.7);
    });

    it('should handle same foreground and background', async () => {
      const result = await service.checkContrast('#ffffff', '#ffffff');

      expect(result.contrastRatio).toBe(1);
      expect(result.wcag.aa.normalText).toBe(false);
      expect(result.wcag.aa.largeText).toBe(false);
    });
  });

  describe('recommendations', () => {
    it('should provide recommendations for low contrast', async () => {
      const result = await service.checkContrast('#f0f0f0', '#ffffff');

      expect(result.recommendation).toBeDefined();
      expect(typeof result.recommendation).toBe('string');
    });

    it('should provide positive recommendation for high contrast', async () => {
      const result = await service.checkContrast('#000000', '#ffffff');

      expect(result.recommendation).toBeDefined();
      expect(result.recommendation).toContain('Excellent');
    });
  });
});
