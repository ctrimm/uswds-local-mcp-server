/**
 * Tests for Streamable HTTP Transport
 */

import { describe, it, expect } from '@jest/globals';
import {
  formatSSE,
  acceptsSSE,
  getResponseFormat,
  getSSEHeaders,
  getJSONHeaders,
} from '../lambda/streaming';

describe('Streamable HTTP Transport', () => {
  describe('formatSSE', () => {
    it('should format simple SSE message', () => {
      const message = {
        data: { foo: 'bar' },
      };

      const result = formatSSE(message);
      expect(result).toContain('data: {"foo":"bar"}');
      expect(result).toMatch(/\n\n$/); // Ends with double newline
    });

    it('should include event type when provided', () => {
      const message = {
        event: 'message',
        data: 'test',
      };

      const result = formatSSE(message);
      expect(result).toContain('event: message');
      expect(result).toContain('data: test');
    });

    it('should include ID when provided', () => {
      const message = {
        id: '123',
        data: 'test',
      };

      const result = formatSSE(message);
      expect(result).toContain('id: 123');
      expect(result).toContain('data: test');
    });

    it('should handle multi-line data', () => {
      const message = {
        data: 'line1\nline2\nline3',
      };

      const result = formatSSE(message);
      expect(result).toContain('data: line1');
      expect(result).toContain('data: line2');
      expect(result).toContain('data: line3');
    });

    it('should handle object data by JSON stringifying', () => {
      const message = {
        data: {
          jsonrpc: '2.0',
          id: 1,
          result: { tools: [] },
        },
      };

      const result = formatSSE(message);
      const expectedData = JSON.stringify(message.data);
      expect(result).toContain(`data: ${expectedData}`);
    });
  });

  describe('acceptsSSE', () => {
    it('should return true for text/event-stream accept header', () => {
      const headers = { accept: 'text/event-stream' };
      expect(acceptsSSE(headers)).toBe(true);
    });

    it('should return true for capitalized Accept header', () => {
      const headers = { Accept: 'text/event-stream' };
      expect(acceptsSSE(headers)).toBe(true);
    });

    it('should return true when text/event-stream is in list', () => {
      const headers = { accept: 'application/json, text/event-stream, */*' };
      expect(acceptsSSE(headers)).toBe(true);
    });

    it('should return false for application/json only', () => {
      const headers = { accept: 'application/json' };
      expect(acceptsSSE(headers)).toBe(false);
    });

    it('should return false when no accept header', () => {
      const headers = {};
      expect(acceptsSSE(headers)).toBe(false);
    });
  });

  describe('getResponseFormat', () => {
    it('should return "sse" for SSE accept header', () => {
      const headers = { accept: 'text/event-stream' };
      expect(getResponseFormat(headers)).toBe('sse');
    });

    it('should return "json" for JSON accept header', () => {
      const headers = { accept: 'application/json' };
      expect(getResponseFormat(headers)).toBe('json');
    });

    it('should return "json" when no accept header', () => {
      const headers = {};
      expect(getResponseFormat(headers)).toBe('json');
    });
  });

  describe('getSSEHeaders', () => {
    it('should return correct SSE headers', () => {
      const headers = getSSEHeaders();
      expect(headers['Content-Type']).toBe('text/event-stream');
      expect(headers['Cache-Control']).toBe('no-cache');
      expect(headers['Connection']).toBe('keep-alive');
      expect(headers['X-Accel-Buffering']).toBe('no');
    });
  });

  describe('getJSONHeaders', () => {
    it('should return correct JSON headers', () => {
      const headers = getJSONHeaders();
      expect(headers['Content-Type']).toBe('application/json');
    });
  });
});
