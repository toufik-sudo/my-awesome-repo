import { Injectable } from '@nestjs/common';
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

  async findByUser(userId: number, _scopeCtx?: ScopeContext) {
    return this.favoriteRepository.find({
      where: { userId },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });
  }

  async isFavorited(userId: number, propertyId: string, _scopeCtx?: ScopeContext) {
    const count = await this.favoriteRepository.count({
      where: { userId, propertyId },
    });
    return { favorited: count > 0 };
  }

  async toggle(userId: number, propertyId: string, _scopeCtx?: ScopeContext) {
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

  async remove(userId: number, propertyId: string, _scopeCtx?: ScopeContext) {
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
