import { describe, it, expect, beforeEach } from '@jest/globals';
import { TailwindUSWDSService } from '../services/tailwind-uswds-service.js';

describe('TailwindUSWDSService Framework Support', () => {
  let tailwindService: TailwindUSWDSService;

  beforeEach(() => {
    tailwindService = new TailwindUSWDSService();
  });

  describe('listComponents', () => {
    it('should list all Tailwind USWDS components', async () => {
      const result = await tailwindService.listComponents();

      expect(result).toBeDefined();
      expect(result.source).toBe('uswds-tailwind');
      expect(result.type).toBe('component-list');
      expect(Array.isArray(result.components)).toBe(true);
    }, 15000); // Longer timeout for network request

    it('should ignore category parameter for now', async () => {
      // Tailwind USWDS doesn't have categories yet
      const allResult = await tailwindService.listComponents('all');
      const formsResult = await tailwindService.listComponents('forms');

      // Both should return the same list (no filtering)
      expect(allResult.source).toBe('uswds-tailwind');
      expect(formsResult.source).toBe('uswds-tailwind');
    }, 15000);
  });

  describe('getComponentDocs', () => {
    it('should get specific component documentation', async () => {
      const result = await tailwindService.getComponentDocs('button');

      expect(result).toBeDefined();
      expect(result.source).toBe('uswds-tailwind');
      expect(result.type).toBe('component');
      expect(result.componentName).toBe('button');
    }, 15000);

    it('should list all components when no name provided', async () => {
      const result = await tailwindService.getComponentDocs();

      expect(result).toBeDefined();
      expect(result.source).toBe('uswds-tailwind');
      expect(result.type).toBe('component-list');
      expect(Array.isArray(result.components)).toBe(true);
    }, 15000);
  });
});
