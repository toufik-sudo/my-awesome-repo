import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entity/review.entity';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';

const PERM_KEY_FIND_BY_PROPERTY = 'backend.ReviewsController.findByProperty.GET';
const PERM_KEY_FIND_ONE = 'backend.ReviewsController.findOne.GET';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  async findByProperty(
    propertyId: string,
    scopeCtx?: ScopeContext,
    pagination?: { page?: number; limit?: number },
  ) {
    if (scopeCtx && ['hyper_manager', 'manager', 'guest'].includes(scopeCtx.userRole)) {
      const allowedIds = await this.scopeFilter.resolvePropertyIds(getScopedPerms(scopeCtx), PERM_KEY_FIND_BY_PROPERTY);
      if (allowedIds !== null && !allowedIds.includes(propertyId)) {
        throw new ForbiddenException('You do not have access to reviews for this property');
      }
    }
    const page = Math.max(1, pagination?.page ?? 1);
    const limit = Math.max(1, Math.min(100, pagination?.limit ?? 20));
    const [data, total] = await this.reviewRepository.findAndCount({
      where: { propertyId, isPublic: true },
      relations: ['guest'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, scopeCtx?: ScopeContext) {
    const review = await this.reviewRepository.findOne({ where: { id }, relations: ['guest', 'property'] });
    if (!review) return null;

    // Scope check: hyper_manager/manager/guest
    if (scopeCtx && ['hyper_manager', 'manager', 'guest'].includes(scopeCtx.userRole) && review.propertyId) {
      const allowedIds = await this.scopeFilter.resolvePropertyIds(getScopedPerms(scopeCtx), PERM_KEY_FIND_ONE);
      if (allowedIds !== null && !allowedIds.includes(review.propertyId)) {
        throw new ForbiddenException('You do not have access to this review');
      }
    }

    return review;
  }

  async create(createDto: Partial<Review>, scopeCtx?: ScopeContext) {
    // Only the guest themselves or hyper_admin can create reviews for others
    if (scopeCtx && createDto.guestId && scopeCtx.userId !== createDto.guestId &&
        scopeCtx.userRole !== 'hyper_admin') {
      throw new ForbiddenException('Cannot create review for another user');
    }
    const review = this.reviewRepository.create({
      ...createDto,
      ...(createDto.propertyId && { property: { id: createDto.propertyId } as any }),
      ...(createDto.guestId && { guest: { id: createDto.guestId } as any }),
      ...(createDto.bookingId && { booking: { id: createDto.bookingId } as any }),
    });
    return this.reviewRepository.save(review);
  }
}
