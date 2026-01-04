import { describe, it, expect } from '@jest/globals';
import { tools } from '../shared/tools/definitions.js';
import { handleToolCall, type Services } from '../shared/tools/handlers.js';

describe('shared/tools/definitions', () => {
  it('should export tools array', () => {
    expect(tools).toBeDefined();
    expect(Array.isArray(tools)).toBe(true);
  });

  it('should have all required MCP tool definitions', () => {
    expect(tools.length).toBeGreaterThan(0);

    const toolNames = tools.map(tool => tool.name);

    // Core USWDS tools
    expect(toolNames).toContain('list_components');
    expect(toolNames).toContain('get_component_info');
    expect(toolNames).toContain('get_design_tokens');
    expect(toolNames).toContain('validate_uswds_code');
    expect(toolNames).toContain('check_color_contrast');
    expect(toolNames).toContain('search_icons');
    expect(toolNames).toContain('suggest_layout');
    expect(toolNames).toContain('suggest_components');
    expect(toolNames).toContain('compare_components');
    expect(toolNames).toContain('generate_component_code');

    // Tailwind USWDS tools
    expect(toolNames).toContain('get_tailwind_uswds_getting_started');
    expect(toolNames).toContain('get_tailwind_uswds_component');
    expect(toolNames).toContain('get_tailwind_uswds_javascript');
    expect(toolNames).toContain('get_tailwind_uswds_colors');
    expect(toolNames).toContain('get_tailwind_uswds_icons');
    expect(toolNames).toContain('get_tailwind_uswds_typography');
    expect(toolNames).toContain('search_tailwind_uswds_docs');
  });

  it('should have valid tool schema structure', () => {
    tools.forEach(tool => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('inputSchema');

      expect(typeof tool.name).toBe('string');
      expect(typeof tool.description).toBe('string');
      expect(typeof tool.inputSchema).toBe('object');

      // Validate JSON Schema structure
      expect(tool.inputSchema).toHaveProperty('type');
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.inputSchema).toHaveProperty('properties');
    });
  });

  it('should have consistent naming convention', () => {
    tools.forEach(tool => {
      // Tool names should be snake_case
      expect(tool.name).toMatch(/^[a-z_]+$/);
    });
  });

  it('should have non-empty descriptions', () => {
    tools.forEach(tool => {
      expect(tool.description.length).toBeGreaterThan(10);
    });
  });
});

describe('shared/tools/handlers', () => {
  it('should export handleToolCall function', () => {
    expect(handleToolCall).toBeDefined();
    expect(typeof handleToolCall).toBe('function');
  });

  it('should export Services type', () => {
    // This is a TypeScript type check, validated at compile time
    // Runtime verification that the import works
    const mockServices: Services = {
      componentService: {} as any,
      designTokenService: {} as any,
      validationService: {} as any,
      colorContrastService: {} as any,
      iconService: {} as any,
      layoutService: {} as any,
      suggestionService: {} as any,
      comparisonService: {} as any,
      codeGeneratorService: {} as any,
      tailwindUSWDSService: {} as any,
    };

    expect(mockServices).toBeDefined();
  });

  it('should be the same implementation as lambda/tools/handlers', async () => {
    // Verify that shared tools re-export the lambda implementation
    const lambdaHandlers = await import('../lambda/tools/handlers.js');

    expect(handleToolCall).toBe(lambdaHandlers.handleToolCall);
  });
});

describe('shared/tools integration', () => {
  it('should allow both Lambda and stdio to use the same tool definitions', () => {
    // This test verifies that the shared tools work for both transports
    expect(tools).toBeDefined();
    expect(handleToolCall).toBeDefined();

    // Verify no duplication - shared modules should be the single source of truth
    const toolNames = tools.map(t => t.name);
    const uniqueNames = new Set(toolNames);
    expect(toolNames.length).toBe(uniqueNames.size);
  });
});
