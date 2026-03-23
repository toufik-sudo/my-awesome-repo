import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constant';

/**
 * Distributed locking using Redis SET NX EX pattern.
 * Prevents duplicate expensive operations across multiple instances.
 */
@Injectable()
export class RedisLockService {
  private readonly logger = new Logger(RedisLockService.name);

  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  /**
   * Acquire a distributed lock.
   * @returns lock token if acquired, null otherwise
   */
  async acquire(lockKey: string, ttlSeconds = 30): Promise<string | null> {
    const token = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const key = `lock:${lockKey}`;
    const result = await this.redis.set(key, token, 'EX', ttlSeconds, 'NX');
    if (result === 'OK') {
      this.logger.debug(`Lock acquired: ${lockKey}`);
      return token;
    }
    return null;
  }

  /** Release a lock only if we own it (compare token) */
  async release(lockKey: string, token: string): Promise<boolean> {
    const key = `lock:${lockKey}`;
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    const result = await this.redis.eval(script, 1, key, token);
    const released = result === 1;
    if (released) this.logger.debug(`Lock released: ${lockKey}`);
    return released;
  }

  /**
   * Execute a callback with a distributed lock.
   * If lock cannot be acquired, returns null.
   */
  async withLock<T>(
    lockKey: string,
    callback: () => Promise<T>,
    ttlSeconds = 30,
  ): Promise<T | null> {
    const token = await this.acquire(lockKey, ttlSeconds);
    if (!token) {
      this.logger.warn(`Could not acquire lock: ${lockKey}`);
      return null;
    }
    try {
      return await callback();
    } finally {
      await this.release(lockKey, token);
    }
  }
}
