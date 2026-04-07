import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entity/profile.entity';
import { RedisCacheService } from '../../infrastructure/redis';
import { ScopeContext } from '../../rbac/scope-context';

const CACHE_TTL = 600; // 10 min

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly cache: RedisCacheService,
  ) {}

  async findByUser(userId: number, _scopeCtx?: ScopeContext) {
    const cacheKey = this.cache.key('profile', 'user', String(userId));
    return this.cache.getOrSet(
      cacheKey,
      () => this.profileRepository.findOne({ where: { userId } }),
      CACHE_TTL,
    );
  }

  async update(userId: number, updateDto: Partial<Profile>, _scopeCtx?: ScopeContext) {
    await this.profileRepository.update({ userId }, updateDto);
    await this.cache.del(this.cache.key('profile', 'user', String(userId)));
    return this.findByUser(userId);
  }

  async createForUser(userId: number, data?: Partial<Profile>) {
    const profile = this.profileRepository.create({
      userId,
      user: { id: userId } as any,
      ...data,
    });
    const saved = await this.profileRepository.save(profile);
    await this.cache.del(this.cache.key('profile', 'user', String(userId)));
    return saved;
  }
}
