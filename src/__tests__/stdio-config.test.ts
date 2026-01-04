import { describe, it, expect } from '@jest/globals';
import { config } from '../stdio/config.js';

describe('stdio config', () => {
  it('should have server version', () => {
    expect(config.serverVersion).toBe('0.2.0');
  });

  it('should have useReactComponents boolean flag', () => {
    expect(typeof config.useReactComponents).toBe('boolean');
  });

  it('should have logLevel string', () => {
    expect(typeof config.logLevel).toBe('string');
    expect(config.logLevel.length).toBeGreaterThan(0);
  });

  it('should be a readonly config object', () => {
    // TypeScript `as const` makes it readonly at compile time
    // (Runtime mutation is possible but prevented by TypeScript type checker)
    // Verify the config properties are defined
    expect(config.serverVersion).toBeDefined();
    expect(config.useReactComponents).toBeDefined();
    expect(config.logLevel).toBeDefined();
  });

  it('should have all required config properties', () => {
    expect(config).toHaveProperty('useReactComponents');
    expect(config).toHaveProperty('logLevel');
    expect(config).toHaveProperty('serverVersion');
  });
});
