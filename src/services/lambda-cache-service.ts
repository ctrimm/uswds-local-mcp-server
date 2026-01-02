/**
 * Lambda Cache Service
 *
 * Multi-layer caching for AWS Lambda:
 * - L1: In-memory cache (fastest, per-container)
 * - L2: /tmp directory cache (persists across warm starts, up to 10GB)
 *
 * Benefits:
 * - Survives warm starts (Lambda containers reused for 15-45 min)
 * - Reduces cold start impact
 * - No external dependencies (S3, ElastiCache, etc.)
 */

import fs from 'fs/promises';
import path from 'path';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class LambdaCacheService {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private tmpDir = '/tmp/mcp-cache';
  private defaultTTL = 3600000; // 1 hour in milliseconds

  constructor(private ttl: number = 3600000) {
    this.defaultTTL = ttl;
  }

  /**
   * Get cached value (checks L1 memory, then L2 /tmp)
   */
  async get<T>(key: string): Promise<T | null> {
    // L1: Check memory cache first
    const memoryCached = this.memoryCache.get(key);
    if (memoryCached && this.isValid(memoryCached.timestamp)) {
      console.log(`[Cache] L1 HIT: ${key}`);
      return memoryCached.data as T;
    }

    // L2: Check /tmp directory
    try {
      const tmpCached = await this.getFromTmp<T>(key);
      if (tmpCached && this.isValid(tmpCached.timestamp)) {
        console.log(`[Cache] L2 HIT: ${key}`);
        // Populate L1 cache
        this.memoryCache.set(key, tmpCached);
        return tmpCached.data;
      }
    } catch (err) {
      // /tmp read failed, continue
      console.log(`[Cache] L2 MISS: ${key}`);
    }

    console.log(`[Cache] MISS: ${key}`);
    return null;
  }

  /**
   * Set cached value (writes to both L1 and L2)
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
    };

    // L1: Write to memory
    this.memoryCache.set(key, entry);

    // L2: Write to /tmp (async, don't block)
    this.setToTmp(key, entry).catch(err => {
      console.error(`[Cache] Failed to write to /tmp: ${key}`, err);
    });

    console.log(`[Cache] SET: ${key}`);
  }

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    // L1: Remove from memory
    this.memoryCache.delete(key);

    // L2: Remove from /tmp
    try {
      const filePath = this.getFilePath(key);
      await fs.unlink(filePath);
      console.log(`[Cache] DELETE: ${key}`);
    } catch (err) {
      // File doesn't exist, ignore
    }
  }

  /**
   * Clear all cached values
   */
  async clear(): Promise<void> {
    // L1: Clear memory
    this.memoryCache.clear();

    // L2: Clear /tmp directory
    try {
      const files = await fs.readdir(this.tmpDir);
      await Promise.all(
        files.map(file => fs.unlink(path.join(this.tmpDir, file)))
      );
      console.log(`[Cache] CLEARED all cache`);
    } catch (err) {
      // Directory doesn't exist or is empty
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memoryKeys: this.memoryCache.size,
      ttl: this.defaultTTL,
    };
  }

  // Private methods

  private isValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.defaultTTL;
  }

  private getFilePath(key: string): string {
    // Sanitize key for filesystem
    const sanitized = key.replace(/[^a-zA-Z0-9-_]/g, '_');
    return path.join(this.tmpDir, `${sanitized}.json`);
  }

  private async ensureTmpDir(): Promise<void> {
    try {
      await fs.mkdir(this.tmpDir, { recursive: true });
    } catch (err) {
      // Directory exists or can't be created
    }
  }

  private async getFromTmp<T>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const filePath = this.getFilePath(key);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as CacheEntry<T>;
    } catch (err) {
      return null;
    }
  }

  private async setToTmp<T>(key: string, entry: CacheEntry<T>): Promise<void> {
    await this.ensureTmpDir();
    const filePath = this.getFilePath(key);
    await fs.writeFile(filePath, JSON.stringify(entry));
  }
}

/**
 * Global singleton cache instance
 * Persists across Lambda invocations in the same container
 */
export const globalCache = new LambdaCacheService(3600000); // 1 hour TTL
