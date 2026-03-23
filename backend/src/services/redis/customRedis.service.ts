import { Injectable, Inject } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class CustomRedisService {
  private client: Redis;

  constructor(
    @Inject(RedisService) private readonly redisService: RedisService,
  ) {
    this.client = this.redisService.getClient();
  }

  async get(key: string): Promise<string> {
    return this.client.get(key);
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }
}
