import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../../reviews/entity/review.entity';
import { Property } from '../../properties/entity/property.entity';
import { SupportChatService } from '../../support-chat/services/support-chat.service';
import { EventsGateway } from '../../infrastructure/websocket/events.gateway';

const NEGATIVE_RATING_THRESHOLD = 3;

@Injectable()
export class NegativeReviewService {
  private readonly logger = new Logger(NegativeReviewService.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Property)
    private readonly propertyRepo: Repository<Property>,
    private readonly supportChatService: SupportChatService,
    private readonly wsGateway: EventsGateway,
  ) {}

  /** Called after a review is created to check if it's negative */
  async handleNewReview(review: Review) {
    if (review.overallRating > NEGATIVE_RATING_THRESHOLD) return;

    this.logger.warn(`Negative review detected: ${review.id} (rating: ${review.overallRating})`);

    const property = await this.propertyRepo.findOne({
      where: { id: review.propertyId },
      relations: ['host'],
    });

    if (!property) return;

    // Notify the property host
    const hostId = property.hostId;
    if (hostId) {
      this.wsGateway.emitNotification(hostId, {
        id: `neg-review-${review.id}`,
        type: 'warning',
        title: '⚠️ Negative Review Received',
        message: `A guest left a ${review.overallRating}-star review on "${property.title}"`,
        actionUrl: `/support/review/${review.id}`,
      });
    }

    // Notify all hyper-admins (broadcast to admin room)
    this.wsGateway.emitToRoom('support:admins', 'review:negative', {
      reviewId: review.id,
      propertyId: review.propertyId,
      propertyTitle: property.title,
      rating: review.overallRating,
      guestId: review.guestId,
      comment: review.comment?.substring(0, 100),
    });

    // Auto-create a support thread for resolution
    try {
      await this.supportChatService.createThread(
        review.guestId,
        'guest',
        {
          subject: `Review Issue: ${property.title} (${review.overallRating}★)`,
          category: 'negative_review',
          content: `A negative review (${review.overallRating}/5) was left for "${property.title}". Review comment: "${review.comment}". This thread was auto-created for resolution.`,
          propertyId: review.propertyId,
          bookingId: review.bookingId,
          reviewId: review.id,
        },
      );
    } catch (e) {
      this.logger.error('Failed to create support thread for negative review', e);
    }
  }
}
