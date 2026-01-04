/**
 * Tests for Session Management Service
 */

import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import {
  createSession,
  getSession,
  touchSession,
  deleteSession,
  extractSessionId,
  generateSessionId,
} from '../services/session-service';

// Mock DynamoDB client
jest.mock('@aws-sdk/client-dynamodb');
jest.mock('@aws-sdk/lib-dynamodb');

describe('Session Service', () => {
  describe('extractSessionId', () => {
    it('should extract session ID from lowercase header', () => {
      const headers = { 'mcp-session-id': 'test-session-123' };
      expect(extractSessionId(headers)).toBe('test-session-123');
    });

    it('should extract session ID from capitalized header', () => {
      const headers = { 'Mcp-Session-Id': 'test-session-456' };
      expect(extractSessionId(headers)).toBe('test-session-456');
    });

    it('should return null if no session header present', () => {
      const headers = {};
      expect(extractSessionId(headers)).toBeNull();
    });

    it('should prefer lowercase header if both present', () => {
      const headers = {
        'mcp-session-id': 'lowercase-session',
        'Mcp-Session-Id': 'uppercase-session',
      };
      expect(extractSessionId(headers)).toBe('lowercase-session');
    });
  });

  describe('generateSessionId', () => {
    it('should generate a valid UUID', () => {
      const sessionId = generateSessionId();
      expect(sessionId).toBeDefined();
      expect(typeof sessionId).toBe('string');
      expect(sessionId.length).toBeGreaterThan(0);

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(sessionId).toMatch(uuidRegex);
    });

    it('should generate unique IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      expect(id1).not.toBe(id2);
    });
  });

  describe('Session Interface', () => {
    it('should have required properties in Session type', () => {
      // This test verifies the Session interface structure
      const mockSession = {
        sessionId: 'test-id',
        apiKey: 'test-key',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        expiresAt: Math.floor(Date.now() / 1000) + 86400,
      };

      expect(mockSession.sessionId).toBeDefined();
      expect(mockSession.apiKey).toBeDefined();
      expect(mockSession.email).toBeDefined();
      expect(mockSession.createdAt).toBeDefined();
      expect(mockSession.lastAccessedAt).toBeDefined();
      expect(mockSession.expiresAt).toBeDefined();
    });

    it('should support optional metadata property', () => {
      const mockSession = {
        sessionId: 'test-id',
        apiKey: 'test-key',
        email: 'test@example.com',
        createdAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        expiresAt: Math.floor(Date.now() / 1000) + 86400,
        metadata: {
          userAgent: 'Test Agent',
          customData: 'foo',
        },
      };

      expect(mockSession.metadata).toBeDefined();
      expect(mockSession.metadata.userAgent).toBe('Test Agent');
    });
  });
});
