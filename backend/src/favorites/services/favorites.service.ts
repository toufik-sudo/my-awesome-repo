import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entity/favorite.entity';
import { ScopeContext } from '../../rbac/scope-context';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
  ) {}

  async findByUser(
    userId: number,
    scopeCtx?: ScopeContext,
    pagination?: { page?: number; limit?: number },
  ) {
    if (scopeCtx && scopeCtx.userId !== userId &&
        scopeCtx.userRole !== 'hyper_admin') {
      throw new ForbiddenException('Cannot view favorites for another user');
    }
    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.max(1, Math.min(100, pagination?.limit ?? 20));
    const [data, total] = await this.favoriteRepository.findAndCount({
      where: { userId },
      relations: ['property'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async isFavorited(userId: number, propertyId: string, scopeCtx?: ScopeContext) {
    if (scopeCtx && scopeCtx.userId !== userId &&
        scopeCtx.userRole !== 'hyper_admin') {
      throw new ForbiddenException('Cannot check favorites for another user');
    }
    const count = await this.favoriteRepository.count({
      where: { userId, propertyId },
    });
    return { favorited: count > 0 };
  }

  async toggle(userId: number, propertyId: string, scopeCtx?: ScopeContext) {
    if (scopeCtx && scopeCtx.userId !== userId) {
      throw new ForbiddenException('Cannot toggle favorites for another user');
    }
    const existing = await this.favoriteRepository.findOne({
      where: { userId, propertyId },
    });

    if (existing) {
      await this.favoriteRepository.remove(existing);
      return { favorited: false };
    }

    const favorite = this.favoriteRepository.create({
      userId,
      propertyId,
      user: { id: userId } as any,
      property: { id: propertyId } as any,
    });
    await this.favoriteRepository.save(favorite);
    return { favorited: true };
  }

  async remove(userId: number, propertyId: string, scopeCtx?: ScopeContext) {
    if (scopeCtx && scopeCtx.userId !== userId) {
      throw new ForbiddenException('Cannot remove favorites for another user');
    }
    await this.favoriteRepository.delete({ userId, propertyId });
    return { favorited: false };
  }

  async countByProperty(propertyId: string) {
    const count = await this.favoriteRepository.count({
      where: { propertyId },
    });
    return { count };
  }
}
