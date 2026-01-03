import { describe, it, expect, beforeEach } from '@jest/globals';
import { ComponentService } from '../services/component-service.js';

describe('ComponentService Framework Parameter', () => {
  let componentService: ComponentService;

  beforeEach(() => {
    // Initialize with default (React)
    componentService = new ComponentService(true);
  });

  describe('listComponents', () => {
    it('should use React components when framework="react"', async () => {
      const result = await componentService.listComponents('all', 'react');
      expect(result.mode).toBe('react-uswds');
    });

    it('should use vanilla components when framework="vanilla"', async () => {
      const result = await componentService.listComponents('all', 'vanilla');
      expect(result.mode).toBe('vanilla-uswds');
    });

    it('should use constructor setting when framework parameter is undefined', async () => {
      const result = await componentService.listComponents('all');
      expect(result.mode).toBe('react-uswds'); // Constructor set to true
    });

    it('should override constructor setting with framework parameter', async () => {
      const result = await componentService.listComponents('all', 'vanilla');
      expect(result.mode).toBe('vanilla-uswds'); // Parameter overrides constructor
    });
  });

  describe('getComponentInfo', () => {
    it('should use React component when framework="react"', async () => {
      const result = await componentService.getComponentInfo('Button', true, 'react');
      expect(result.mode).toBe('react-uswds');
    });

    it('should use vanilla component when framework="vanilla"', async () => {
      const result = await componentService.getComponentInfo('Button', true, 'vanilla');
      expect(result.mode).toBe('vanilla-uswds');
    });

    it('should use constructor setting when framework parameter is undefined', async () => {
      const result = await componentService.getComponentInfo('Button', true);
      expect(result.mode).toBe('react-uswds'); // Constructor set to true
    });

    it('should override constructor setting with framework parameter', async () => {
      const result = await componentService.getComponentInfo('Button', true, 'vanilla');
      expect(result.mode).toBe('vanilla-uswds'); // Parameter overrides constructor
    });
  });

  describe('framework parameter backward compatibility', () => {
    it('should work with vanilla-first ComponentService', async () => {
      const vanillaService = new ComponentService(false);

      const result = await vanillaService.listComponents('all');
      expect(result.mode).toBe('vanilla-uswds');

      const reactResult = await vanillaService.listComponents('all', 'react');
      expect(reactResult.mode).toBe('react-uswds');
    });
  });
});
