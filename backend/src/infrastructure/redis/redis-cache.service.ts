import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constant';


/**
 * Redis key naming strategy:
 *   {domain}:{entity}:{id}            → single entity cache
 *   {domain}:{entity}:list:{hash}     → list/search cache
 *   {domain}:{entity}:user:{userId}   → user-scoped cache
 *
 * Examples:
 *   app:property:uuid-123
 *   app:property:list:abc123hash
 *   app:profile:user:42
 *   app:search:properties:hashOfFilters
 */
@Injectable()
export class RedisCacheService {
  private readonly logger = new Logger(RedisCacheService.name);
  private readonly prefix = 'app';

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /** Build a namespaced key */
  key(...parts: string[]): string {
    return [this.prefix, ...parts].join(':');
  }

  /** Get a cached value, parsed from JSON */
  async get<T = any>(key: string): Promise<T | null> {
    const raw = await this.redis.get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as unknown as T;
    }
  }

  /** Set a value with optional TTL (seconds). Default 5 minutes. */
  async set(key: string, value: any, ttlSeconds = 300): Promise<void> {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    await this.redis.set(key, serialized, 'EX', ttlSeconds);
  }

  /** Delete a specific key */
  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  /** Delete all keys matching a pattern (use sparingly) */
  async invalidatePattern(pattern: string): Promise<number> {
    let cursor = '0';
    let deleted = 0;
    do {
      const [nextCursor, keys] = await this.redis.scan(
        cursor, 'MATCH', pattern, 'COUNT', 100,
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await this.redis.del(...keys);
        deleted += keys.length;
      }
    } while (cursor !== '0');

    if (deleted > 0) {
      this.logger.debug(`Invalidated ${deleted} keys matching ${pattern}`);
    }
    return deleted;
  }

  /**
   * Cache-aside pattern: get from cache or execute factory, then cache result.
   */
  async getOrSet<T>(key: string, factory: () => Promise<T>, ttlSeconds = 300): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      this.logger.debug(`Cache HIT: ${key}`);
      return cached;
    }
    this.logger.debug(`Cache MISS: ${key}`);
    const result = await factory();
    if (result !== null && result !== undefined) {
      await this.set(key, result, ttlSeconds);
    }
    return result;
  }

  /** Hash a filter/query object into a short key suffix */
  hashFilters(filters: Record<string, any>): string {
    const sorted = Object.keys(filters).sort().reduce((acc, k) => {
      if (filters[k] !== undefined && filters[k] !== null) acc[k] = filters[k];
      return acc;
    }, {} as Record<string, any>);
    // Simple hash using base36 of string code sum
    const str = JSON.stringify(sorted);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
  }
}
