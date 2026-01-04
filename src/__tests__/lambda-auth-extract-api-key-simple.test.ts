import { describe, it, expect } from '@jest/globals';
import { extractApiKey } from '../lambda/auth/extract-api-key.js';

describe('extractApiKey - simplified tests', () => {
  const createEvent = (headers: Record<string, string>) => ({
    headers,
    requestContext: {
      requestId: 'test',
      http: {
        method: 'POST',
        path: '/test',
        protocol: 'HTTP/1.1',
        sourceIp: '127.0.0.1',
        userAgent: 'test',
      },
    },
    body: null,
    isBase64Encoded: false,
    rawPath: '/test',
    rawQueryString: '',
    routeKey: '$default',
    version: '2.0',
  } as any);

  it('extracts Bearer token from Authorization header', () => {
    const event = createEvent({ 'Authorization': 'Bearer my-api-key' });
    expect(extractApiKey(event)).toBe('my-api-key');
  });

  it('extracts from x-api-key header', () => {
    const event = createEvent({ 'x-api-key': 'my-api-key' });
    expect(extractApiKey(event)).toBe('my-api-key');
  });

  it('returns null when no headers', () => {
    const event = createEvent({});
    expect(extractApiKey(event)).toBeNull();
  });

  it('prioritizes Authorization over x-api-key', () => {
    const event = createEvent({
      'Authorization': 'Bearer priority-key',
      'x-api-key': 'fallback-key',
    });
    expect(extractApiKey(event)).toBe('priority-key');
  });
});
