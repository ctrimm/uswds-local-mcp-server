import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { InMemoryRateLimiter } from '../middleware/rate-limiter';

describe('InMemoryRateLimiter', () => {
  let limiter: InMemoryRateLimiter;

  beforeEach(() => {
    limiter = new InMemoryRateLimiter();
  });

  afterEach(() => {
    limiter.stopCleanup();
  });

  describe('check', () => {
    it('should allow first request', () => {
      const result = limiter.check('test-key');

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
      expect(result.resetIn).toBeGreaterThan(0);
    });

    it('should track requests per API key', () => {
      const result1 = limiter.check('key1');
      const result2 = limiter.check('key2');

      expect(result1.remaining).toBe(result2.remaining);
    });

    it('should decrement remaining count', () => {
      const result1 = limiter.check('test-key');
      const result2 = limiter.check('test-key');

      expect(result2.remaining).toBe(result1.remaining - 1);
    });

    it('should block after minute limit exceeded', () => {
      const apiKey = 'test-key';

      // Make 100 requests (the limit)
      for (let i = 0; i < 100; i++) {
        limiter.check(apiKey);
      }

      // 101st request should be blocked
      const result = limiter.check(apiKey);
      expect(result.allowed).toBe(false);
      expect(result.limitType).toBe('minute');
      expect(result.retryAfter).toBeGreaterThan(0);
    });

    it('should return different remaining counts for different keys', () => {
      limiter.check('key1');
      limiter.check('key1');
      limiter.check('key2');

      const usage1 = limiter.getUsage('key1');
      const usage2 = limiter.getUsage('key2');

      expect(usage1?.minute).toBe(2);
      expect(usage2?.minute).toBe(1);
    });
  });

  describe('reset', () => {
    it('should reset limits for a specific key', () => {
      limiter.check('test-key');
      limiter.check('test-key');

      limiter.reset('test-key');

      const usage = limiter.getUsage('test-key');
      expect(usage).toBeNull();
    });

    it('should not affect other keys', () => {
      limiter.check('key1');
      limiter.check('key2');

      limiter.reset('key1');

      const usage1 = limiter.getUsage('key1');
      const usage2 = limiter.getUsage('key2');

      expect(usage1).toBeNull();
      expect(usage2?.minute).toBe(1);
    });
  });

  describe('resetAll', () => {
    it('should reset all limits', () => {
      limiter.check('key1');
      limiter.check('key2');
      limiter.check('key3');

      limiter.resetAll();

      const stats = limiter.getStats();
      expect(stats.totalKeys).toBe(0);
    });
  });

  describe('getUsage', () => {
    it('should return null for unknown key', () => {
      const usage = limiter.getUsage('unknown-key');
      expect(usage).toBeNull();
    });

    it('should return current usage', () => {
      limiter.check('test-key');
      limiter.check('test-key');
      limiter.check('test-key');

      const usage = limiter.getUsage('test-key');
      expect(usage?.minute).toBe(3);
      expect(usage?.day).toBe(3);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      limiter.check('key1');
      limiter.check('key2');

      const stats = limiter.getStats();
      expect(stats.totalKeys).toBe(2);
      expect(stats.minuteLimit).toBe(100);
      expect(stats.dayLimit).toBe(10000);
    });
  });
});
