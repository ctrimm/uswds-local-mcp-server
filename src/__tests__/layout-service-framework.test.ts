import { describe, it, expect, beforeEach } from '@jest/globals';
import { LayoutService } from '../services/layout-service.js';

describe('LayoutService Framework Parameter', () => {
  let layoutService: LayoutService;

  beforeEach(() => {
    // Initialize with default (React)
    layoutService = new LayoutService(true);
  });

  describe('getLayouts', () => {
    it('should use React mode when framework="react"', async () => {
      const result = await layoutService.getLayouts('react');
      expect(result.mode).toBe('react');
    });

    it('should use HTML mode when framework="vanilla"', async () => {
      const result = await layoutService.getLayouts('vanilla');
      expect(result.mode).toBe('html');
    });

    it('should use Tailwind mode when framework="tailwind"', async () => {
      const result = await layoutService.getLayouts('tailwind');
      expect(result.mode).toBe('tailwind');
    });

    it('should use constructor setting when framework parameter is undefined', async () => {
      const result = await layoutService.getLayouts();
      expect(result.mode).toBe('react'); // Constructor set to true
    });

    it('should override constructor setting with framework parameter', async () => {
      const result = await layoutService.getLayouts('vanilla');
      expect(result.mode).toBe('html'); // Parameter overrides constructor
    });
  });

  describe('getLayout', () => {
    it('should return React code when framework="react"', async () => {
      const result = await layoutService.getLayout('single-column', 'react');
      expect(result.mode).toBe('react');
    });

    it('should return HTML code when framework="vanilla"', async () => {
      const result = await layoutService.getLayout('single-column', 'vanilla');
      expect(result.mode).toBe('html');
    });

    it('should return Tailwind mode when framework="tailwind"', async () => {
      const result = await layoutService.getLayout('single-column', 'tailwind');
      expect(result.mode).toBe('tailwind');
    });

    it('should use constructor setting when framework parameter is undefined', async () => {
      const result = await layoutService.getLayout('single-column');
      expect(result.mode).toBe('react'); // Constructor set to true
    });

    it('should override constructor setting with framework parameter', async () => {
      const result = await layoutService.getLayout('single-column', 'vanilla');
      expect(result.mode).toBe('html'); // Parameter overrides constructor
    });
  });

  describe('suggestLayout', () => {
    it('should suggest layouts with React mode when framework="react"', async () => {
      const result = await layoutService.suggestLayout('documentation', 'react');
      expect(result).toBeDefined();
    });

    it('should suggest layouts with vanilla mode when framework="vanilla"', async () => {
      const result = await layoutService.suggestLayout('documentation', 'vanilla');
      expect(result).toBeDefined();
    });

    it('should suggest layouts with Tailwind mode when framework="tailwind"', async () => {
      const result = await layoutService.suggestLayout('documentation', 'tailwind');
      expect(result).toBeDefined();
    });
  });

  describe('framework parameter backward compatibility', () => {
    it('should work with vanilla-first LayoutService', async () => {
      const vanillaService = new LayoutService(false);

      const result = await vanillaService.getLayouts();
      expect(result.mode).toBe('html');

      const reactResult = await vanillaService.getLayouts('react');
      expect(reactResult.mode).toBe('react');
    });
  });
});
