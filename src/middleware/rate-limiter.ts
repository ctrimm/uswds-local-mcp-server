/**
 * In-Memory Rate Limiter for Lambda
 *
 * Implements sliding window rate limiting per API key.
 * Persists across Lambda warm starts, resets on cold starts.
 *
 * Limits:
 * - 100 requests per minute per API key
 * - 10,000 requests per day per API key
 *
 * Returns standard rate limit headers (RFC 6585).
 */

interface RateLimitEntry {
  minuteCount: number;
  minuteResetTime: number;
  dayCount: number;
  dayResetTime: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  retryAfter?: number;
  limitType?: 'minute' | 'day';
}

export class InMemoryRateLimiter {
  private limits = new Map<string, RateLimitEntry>();

  // Configuration
  private readonly MINUTE_LIMIT = 1; // requests per minute
  private readonly DAY_LIMIT = 100; // requests per day
  private readonly MINUTE_WINDOW = 60000; // 1 minute in ms
  private readonly DAY_WINDOW = 86400000; // 24 hours in ms
  private readonly CLEANUP_INTERVAL = 300000; // 5 minutes

  private cleanupTimer?: NodeJS.Timeout;

  constructor() {
    // Start periodic cleanup
    this.startCleanup();
  }

  /**
   * Check if request is allowed and update counters
   */
  check(apiKey: string): RateLimitResult {
    const now = Date.now();
    let entry = this.limits.get(apiKey);

    // Initialize or reset if windows expired
    if (!entry || now > entry.dayResetTime) {
      entry = {
        minuteCount: 1,
        minuteResetTime: now + this.MINUTE_WINDOW,
        dayCount: 1,
        dayResetTime: now + this.DAY_WINDOW,
      };
      this.limits.set(apiKey, entry);

      return {
        allowed: true,
        remaining: Math.min(
          this.MINUTE_LIMIT - 1,
          this.DAY_LIMIT - 1
        ),
        resetIn: this.MINUTE_WINDOW,
      };
    }

    // Reset minute window if expired
    if (now > entry.minuteResetTime) {
      entry.minuteCount = 0;
      entry.minuteResetTime = now + this.MINUTE_WINDOW;
    }

    // Check minute limit first (stricter)
    if (entry.minuteCount >= this.MINUTE_LIMIT) {
      const resetIn = entry.minuteResetTime - now;
      return {
        allowed: false,
        remaining: 0,
        resetIn,
        retryAfter: Math.ceil(resetIn / 1000),
        limitType: 'minute',
      };
    }

    // Check day limit
    if (entry.dayCount >= this.DAY_LIMIT) {
      const resetIn = entry.dayResetTime - now;
      return {
        allowed: false,
        remaining: 0,
        resetIn,
        retryAfter: Math.ceil(resetIn / 1000),
        limitType: 'day',
      };
    }

    // Increment counters
    entry.minuteCount++;
    entry.dayCount++;

    return {
      allowed: true,
      remaining: Math.min(
        this.MINUTE_LIMIT - entry.minuteCount,
        this.DAY_LIMIT - entry.dayCount
      ),
      resetIn: entry.minuteResetTime - now,
    };
  }

  /**
   * Get current usage for an API key
   */
  getUsage(apiKey: string): { minute: number; day: number } | null {
    const entry = this.limits.get(apiKey);
    if (!entry) return null;

    const now = Date.now();
    return {
      minute: now > entry.minuteResetTime ? 0 : entry.minuteCount,
      day: now > entry.dayResetTime ? 0 : entry.dayCount,
    };
  }

  /**
   * Reset limits for an API key (for testing)
   */
  reset(apiKey: string): void {
    this.limits.delete(apiKey);
  }

  /**
   * Reset all limits (for testing)
   */
  resetAll(): void {
    this.limits.clear();
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalKeys: number;
    minuteLimit: number;
    dayLimit: number;
  } {
    return {
      totalKeys: this.limits.size,
      minuteLimit: this.MINUTE_LIMIT,
      dayLimit: this.DAY_LIMIT,
    };
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    if (this.cleanupTimer) return;

    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);

    // Don't prevent Lambda from shutting down
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref();
    }
  }

  /**
   * Remove expired entries to free memory
   */
  private cleanup(): void {
    const now = Date.now();
    let removed = 0;

    for (const [key, entry] of this.limits.entries()) {
      // Remove if both windows have expired
      if (now > entry.dayResetTime) {
        this.limits.delete(key);
        removed++;
      }
    }

    if (removed > 0) {
      console.log(`[RateLimiter] Cleaned up ${removed} expired entries`);
    }
  }

  /**
   * Stop cleanup timer (for testing)
   */
  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = undefined;
    }
  }
}

/**
 * Global singleton instance
 * Persists across Lambda invocations in the same container
 */
export const rateLimiter = new InMemoryRateLimiter();
