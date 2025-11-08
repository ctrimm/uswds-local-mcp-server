import { describe, it, expect, beforeEach } from '@jest/globals';
import { ComponentService } from '../services/component-service.js';

describe('ComponentService', () => {
  describe('React Mode', () => {
    let service: ComponentService;

    beforeEach(() => {
      service = new ComponentService(true);
    });

    describe('listComponents', () => {
      it('should list all React components when category is "all"', async () => {
        const result = await service.listComponents('all');

        expect(result.mode).toBe('react-uswds');
        expect(result.components).toBeDefined();
        expect(result.total).toBeGreaterThan(0);
        expect(result.categories).toBeDefined();
      });

      it('should filter by category', async () => {
        const formsResult = await service.listComponents('forms');

        expect(formsResult.category).toBe('forms');
        expect(formsResult.components).toBeDefined();
        expect(Array.isArray(formsResult.components)).toBe(true);
        expect(formsResult.total).toBeGreaterThan(0);
      });

      it('should include component total', async () => {
        const result = await service.listComponents('all');

        expect(result.total).toBeDefined();
        expect(typeof result.total).toBe('number');
      });
    });

    describe('getComponentInfo', () => {
      it('should return detailed info for Button component', async () => {
        const result = await service.getComponentInfo('Button', false);

        expect(result.mode).toBe('react-uswds');
        expect(result.name).toBe('Button');
        expect(result.description).toBeDefined();
        expect(result.category).toBeDefined();
        expect(result.importPath).toBe('@trussworks/react-uswds');
        expect(result.props).toBeDefined();
        expect(result.props.length).toBeGreaterThan(0);
      });

      it('should include examples when requested', async () => {
        const result = await service.getComponentInfo('Button', true);

        expect(result.examples).toBeDefined();
        expect(result.examples.length).toBeGreaterThan(0);
      });

      it('should return error for non-existent component', async () => {
        const result = await service.getComponentInfo('NonExistentComponent', false);

        expect(result.error).toBeDefined();
        expect(result.error).toContain('not found');
      });

      it('should include accessibility info', async () => {
        const result = await service.getComponentInfo('Button', false);

        expect(result.accessibility).toBeDefined();
        expect(result.accessibility.guidelines).toBeDefined();
      });

      it('should be case-sensitive for component names', async () => {
        const upperResult = await service.getComponentInfo('Button', false);
        const lowerResult = await service.getComponentInfo('button', false);

        expect(upperResult.name).toBe('Button');
        expect(lowerResult.error).toBeDefined();
      });
    });

    describe('searchDocs', () => {
      it('should find components by name', async () => {
        const result = await service.searchDocs('Button');

        expect(result.query).toBe('Button');
        expect(result.results).toBeDefined();
        expect(result.results.length).toBeGreaterThan(0);
      });

      it('should find components by description', async () => {
        const result = await service.searchDocs('form');

        expect(result.results).toBeDefined();
        expect(result.results.length).toBeGreaterThan(0);
      });

      it('should be case insensitive', async () => {
        const lowerResult = await service.searchDocs('button');
        const upperResult = await service.searchDocs('BUTTON');

        expect(lowerResult.results.length).toBeGreaterThan(0);
        expect(upperResult.results.length).toBeGreaterThan(0);
      });

      it('should return empty results for non-matching query', async () => {
        const result = await service.searchDocs('xyznonexistent123');

        expect(result.results).toBeDefined();
        expect(result.results.length).toBe(0);
      });
    });

    describe('getAccessibilityGuidance', () => {
      it('should provide accessibility guidance for Button', async () => {
        const result = await service.getAccessibilityGuidance('Button');

        expect(result.component).toBe('Button');
        expect(result.guidelines).toBeDefined();
        expect(result.guidelines.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Vanilla Mode', () => {
    let service: ComponentService;

    beforeEach(() => {
      service = new ComponentService(false);
    });

    it('should indicate vanilla mode', async () => {
      const result = await service.listComponents('all');

      expect(result.mode).toBe('vanilla-uswds');
    });

    it('should provide vanilla USWDS information', async () => {
      const result = await service.getComponentInfo('Button', false);

      expect(result.mode).toBe('vanilla-uswds');
      expect(result).toBeDefined();
    });
  });
});
