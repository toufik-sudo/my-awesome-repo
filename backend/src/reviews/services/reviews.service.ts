import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entity/review.entity';
import { ScopeContext } from '../../rbac/scope-context';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findByProperty(propertyId: string) {
    return this.reviewRepository.find({
      where: { propertyId, isPublic: true },
      relations: ['guest'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, _scopeCtx?: ScopeContext) {
    return this.reviewRepository.findOne({ where: { id }, relations: ['guest', 'property'] });
  }

  async create(createDto: Partial<Review>, _scopeCtx?: ScopeContext) {
    const review = this.reviewRepository.create({
      ...createDto,
      ...(createDto.propertyId && { property: { id: createDto.propertyId } as any }),
      ...(createDto.guestId && { guest: { id: createDto.guestId } as any }),
      ...(createDto.bookingId && { booking: { id: createDto.bookingId } as any }),
    });
    return this.reviewRepository.save(review);
  }
}
