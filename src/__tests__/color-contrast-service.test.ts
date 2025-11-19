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

    it('should recommend for ratio between 3.0 and 4.5', async () => {
      // #949494 on white is approximately 3.5:1
      const result = await service.checkContrast('#949494', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(3.0);
      expect(result.contrastRatio).toBeLessThan(4.5);
      expect(result.recommendation).toBeDefined();
    });
  });

  describe('Color Format Support', () => {
    it('should support RGB format', async () => {
      const result = await service.checkContrast('rgb(0, 0, 0)', 'rgb(255, 255, 255)');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should support RGB with spaces', async () => {
      const result = await service.checkContrast('rgb( 0 , 0 , 0 )', 'rgb( 255 , 255 , 255 )');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should support named color "white"', async () => {
      const result = await service.checkContrast('#000000', 'white');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should support named color "black"', async () => {
      const result = await service.checkContrast('black', 'white');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should support named color "red"', async () => {
      const result = await service.checkContrast('red', 'white');

      expect(result.contrastRatio).toBeGreaterThan(1);
      expect(result.wcag).toBeDefined();
    });

    it('should support mixed color formats', async () => {
      const result = await service.checkContrast('rgb(0, 0, 0)', '#ffffff');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should handle RGB values at upper bounds', async () => {
      const result = await service.checkContrast('rgb(255, 255, 255)', '#000000');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });
  });

  describe('WCAG Pass/Fail Edge Cases', () => {
    it('should pass AAA large text but fail AAA normal text', async () => {
      // #6a6a6a on white is approximately 5.5:1 (passes AA all, AAA large, fails AAA normal)
      const result = await service.checkContrast('#6a6a6a', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(4.5);
      expect(result.contrastRatio).toBeLessThan(7);
      expect(result.wcag.aa.normalText).toBe(true);
      expect(result.wcag.aa.largeText).toBe(true);
      expect(result.wcag.aaa.normalText).toBe(false);
      expect(result.wcag.aaa.largeText).toBe(true);
    });

    it('should pass AA large text but fail AA normal text', async () => {
      // #8f8f8f on white is approximately 3.5:1 (passes AA large, fails AA normal)
      const result = await service.checkContrast('#8f8f8f', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(3.0);
      expect(result.contrastRatio).toBeLessThan(4.5);
      expect(result.wcag.aa.normalText).toBe(false);
      expect(result.wcag.aa.largeText).toBe(true);
      expect(result.wcag.aaa.normalText).toBe(false);
      expect(result.wcag.aaa.largeText).toBe(false);
    });

    it('should fail all WCAG levels', async () => {
      const result = await service.checkContrast('#fefefe', '#ffffff');

      expect(result.wcag.aa.normalText).toBe(false);
      expect(result.wcag.aa.largeText).toBe(false);
      expect(result.wcag.aaa.normalText).toBe(false);
      expect(result.wcag.aaa.largeText).toBe(false);
      expect(result.fails.length).toBeGreaterThan(0);
    });

    it('should handle exact 7:1 ratio (AAA threshold)', async () => {
      // Testing boundary condition for AAA normal text
      const result = await service.checkContrast('#595959', '#ffffff');

      expect(result.wcag).toBeDefined();
      expect(result.passes).toBeDefined();
    });

    it('should handle near 3:1 ratio (AA large text threshold)', async () => {
      // #949494 on white is approximately 3.5:1
      const result = await service.checkContrast('#949494', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(3.0);
      expect(result.contrastRatio).toBeLessThan(4.0);
      expect(result.wcag.aa.largeText).toBe(true);
    });
  });

  describe('Additional Edge Cases', () => {
    it('should handle uppercase hex colors', async () => {
      const result = await service.checkContrast('#FFFFFF', '#000000');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should handle mixed case hex colors', async () => {
      const result = await service.checkContrast('#FfFfFf', '#000000');

      expect(result.contrastRatio).toBeCloseTo(21, 1);
      expect(result.wcag.aa.normalText).toBe(true);
    });

    it('should handle colors without # prefix gracefully', async () => {
      const result = await service.checkContrast('000000', 'ffffff');

      // Should either parse correctly or return error
      expect(result).toBeDefined();
    });

    it('should handle very similar colors', async () => {
      const result = await service.checkContrast('#000000', '#000001');

      expect(result.contrastRatio).toBeCloseTo(1, 1);
      expect(result.wcag.aa.normalText).toBe(false);
    });

    it('should handle mid-range gray tones', async () => {
      const result = await service.checkContrast('#777777', '#ffffff');

      expect(result.contrastRatio).toBeGreaterThan(3.5);
      expect(result.contrastRatio).toBeLessThan(5);
    });

    it('should provide detailed passes array when multiple criteria pass', async () => {
      const result = await service.checkContrast('#000000', '#ffffff');

      expect(result.passes).toContain('WCAG AA (normal text)');
      expect(result.passes).toContain('WCAG AA (large text)');
      expect(result.passes).toContain('WCAG AAA (normal text)');
      expect(result.passes).toContain('WCAG AAA (large text)');
      expect(result.passes.length).toBe(4);
    });

    it('should provide detailed fails array when multiple criteria fail', async () => {
      const result = await service.checkContrast('#e0e0e0', '#ffffff');

      expect(result.fails.length).toBeGreaterThan(0);
      expect(result.wcag.aa.normalText).toBe(false);
    });
  });
});
