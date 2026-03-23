import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import { RedisLockService } from './redis-lock.service';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constant';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: async (config: ConfigService) => {
        const client = new Redis({
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD', undefined),
          db: config.get<number>('REDIS_DB', 0),
          maxRetriesPerRequest: 3,
          retryStrategy: (times: number) => Math.min(times * 200, 5000),
          enableReadyCheck: true,
          lazyConnect: true, // connect manually
        });

        client.on('error', (err) => console.error('[Redis] Error:', err.message));
        await client.connect(); // attend la connexion avant d’injecter

        console.log('[Redis] Connected');
        return client;
      },
      inject: [ConfigService],
    },
    RedisCacheService,
    RedisLockService,
  ],
  exports: [REDIS_CLIENT, RedisCacheService, RedisLockService],
})
export class RedisModule { }
