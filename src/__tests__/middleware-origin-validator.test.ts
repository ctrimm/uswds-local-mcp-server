/**
 * Tests for Origin Header Validation Middleware
 */

import { validateOrigin } from '../middleware/origin-validator';

describe('Origin Validator', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('Production Mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should allow requests without Origin header (server-to-server)', () => {
      const result = validateOrigin({});
      expect(result.valid).toBe(true);
    });

    it('should allow production domains', () => {
      const validOrigins = [
        'https://uswdsmcp.com',
        'https://www.uswdsmcp.com',
        'https://api.uswdsmcp.com',
      ];

      validOrigins.forEach(origin => {
        const result = validateOrigin({ origin });
        expect(result.valid).toBe(true);
      });
    });

    it('should allow stage subdomains', () => {
      const validStageOrigins = [
        'https://dev-api.uswdsmcp.com',
        'https://staging-api.uswdsmcp.com',
        'https://test-api.uswdsmcp.com',
      ];

      validStageOrigins.forEach(origin => {
        const result = validateOrigin({ origin });
        expect(result.valid).toBe(true);
      });
    });

    it('should reject invalid origins', () => {
      const invalidOrigins = [
        'https://evil.com',
        'https://uswdsmcp.com.evil.com',
        'http://api.uswdsmcp.com', // HTTP not HTTPS
        'https://api.fake-uswdsmcp.com',
      ];

      invalidOrigins.forEach(origin => {
        const result = validateOrigin({ origin });
        expect(result.valid).toBe(false);
        expect(result.error).toContain('not allowed');
      });
    });

    it('should reject malformed origins', () => {
      const malformed = 'not-a-url';
      const result = validateOrigin({ origin: malformed });
      expect(result.valid).toBe(false);
    });
  });

  describe('Development Mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should allow localhost origins', () => {
      const localhostOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000',
      ];

      localhostOrigins.forEach(origin => {
        const result = validateOrigin({ origin });
        expect(result.valid).toBe(true);
      });
    });

    it('should allow any origin in development mode', () => {
      const result = validateOrigin({ origin: 'https://any-random-domain.com' });
      expect(result.valid).toBe(true);
    });
  });

  describe('Header Case Insensitivity', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should handle lowercase "origin" header', () => {
      const result = validateOrigin({ origin: 'https://api.uswdsmcp.com' });
      expect(result.valid).toBe(true);
    });

    it('should handle capitalized "Origin" header', () => {
      const result = validateOrigin({ Origin: 'https://api.uswdsmcp.com' });
      expect(result.valid).toBe(true);
    });
  });
});
