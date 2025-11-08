import { describe, it, expect } from '@jest/globals';
import { ColorContrastService } from '../services/color-contrast-service.js';

describe('ColorContrastService', () => {
  const service = new ColorContrastService();

  describe('checkContrast', () => {
    it('should pass for high contrast black on white', async () => {
      const result = await service.checkContrast('#000000', '#ffffff');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcagAA.normal).toBe(true);
      expect(result.wcagAA.large).toBe(true);
      expect(result.wcagAAA.normal).toBe(true);
      expect(result.wcagAAA.large).toBe(true);
    });

    it('should fail for low contrast light gray on white', async () => {
      const result = await service.checkContrast('#f0f0f0', '#ffffff');

      expect(result.contrastRatio).toBeLessThan(4.5);
      expect(result.wcagAA.normal).toBe(false);
      expect(result.wcagAAA.normal).toBe(false);
    });

    it('should handle USWDS blue on white (#005ea2)', async () => {
      const result = await service.checkContrast('#005ea2', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(4.5);
      expect(result.wcagAA.normal).toBe(true);
    });

    it('should handle hex colors without hash', async () => {
      const result = await service.checkContrast('000000', 'ffffff');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcagAA.normal).toBe(true);
    });

    it('should handle 3-digit hex colors', async () => {
      const result = await service.checkContrast('#000', '#fff');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcagAA.normal).toBe(true);
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

    it('should provide correct pass messages', async () => {
      const result = await service.checkContrast('#000000', '#ffffff');

      expect(result.wcagAA.message).toContain('PASS');
      expect(result.wcagAAA.message).toContain('PASS');
    });

    it('should provide correct fail messages', async () => {
      const result = await service.checkContrast('#f0f0f0', '#ffffff');

      expect(result.wcagAA.message).toContain('FAIL');
    });

    it('should handle edge case of 4.5:1 ratio (AA threshold)', async () => {
      // Find colors that produce approximately 4.5:1 ratio
      // #767676 on white is approximately 4.5:1
      const result = await service.checkContrast('#767676', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(4.4);
      expect(result.contrastRatio).toBeLessThan(4.7);
    });

    it('should handle same foreground and background', async () => {
      const result = await service.checkContrast('#ffffff', '#ffffff');

      expect(result.contrastRatio).toBe(1);
      expect(result.wcagAA.normal).toBe(false);
      expect(result.wcagAA.large).toBe(false);
    });
  });

  describe('getSuggestions', () => {
    it('should suggest darker colors when contrast is too low', async () => {
      const result = await service.checkContrast('#f0f0f0', '#ffffff');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should not suggest changes for passing contrast', async () => {
      const result = await service.checkContrast('#000000', '#ffffff');

      expect(result.suggestions).toBeDefined();
      expect(result.suggestions.length).toBe(0);
    });
  });
});
